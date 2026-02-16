import * as fs from 'node:fs';
import * as path from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaRepository } from 'src/shared/database/repositories/medias.repositories';
import { UsersRepository } from 'src/shared/database/repositories/user.repositories';
import { PostRepository } from 'src/shared/database/repositories/posts.repositories';
import { ReplyRepository } from 'src/shared/database/repositories/replies.repositories';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from 'src/config/env';
import { UrlRequestDTO } from './dto/url-request-dto';
import { validateUploadRequest } from 'src/shared/utils/validateUploadRequest';

@Injectable()
export class UploadService {
  private s3: S3Client;

  constructor(
    private readonly mediaRepo: MediaRepository,
    private readonly usersRepo: UsersRepository,
    private readonly postRepo: PostRepository,
    private readonly replyRepo: ReplyRepository,
  ) {
    this.s3 = new S3Client({
      region: env.awsRegion,
      credentials: {
        accessKeyId: env.awsAccessKey,
        secretAccessKey: env.awsSecretAccessKey,
      },
    });
  }

  async generatePresignedUrls(files: UrlRequestDTO[]) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('Nenhum arquivo informado');
      }

      const results = [];
      for (const file of files) {
        validateUploadRequest(file);
        const key = `${Date.now()}-${file.name}`; // evita conflito de nomes

        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          ContentType: file.type,
        });

        const uploadUrl = await getSignedUrl(this.s3, command, {
          expiresIn: 3600,
        });

        results.push({
          filename: file.name,
          uploadUrl,
          type: file.type,
          fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        });
      }

      return results;
    } catch (e) {
      console.error('Erro ao gerar urls aws', e);
      throw e;
    }
  }

  async uploadFile(files: Express.Multer.File[], userId: string) {
    const isUserValid = await this.usersRepo.findUnique({
      where: { id: userId },
    });

    if (!isUserValid) {
      for (const file of files) {
        this.deleteFromDisk(file.filename);
      }
      throw new BadRequestException('Usuário ou tipo inválido.');
    }
    return files.map((file) => {
      return {
        filename: file.originalname,
        url: file.filename,
        type: file.mimetype.split('/')[1],
      };
    });
  }

  async deleteFile(id: string, userId: string, overrideOwnership = false) {
    const file = await this.mediaRepo.findUnique({
      where: {
        id: id,
      },
    });
    if (!file || (!overrideOwnership && file.userId !== userId)) {
      throw new NotFoundException('Mídia não encontrada.');
    }
    await this.deleteFromDisk(file.url);
    await this.mediaRepo.delete({
      where: {
        id,
      },
    });

    const stillHasMedia = await this.mediaRepo.findMany({
      where: {
        ...(file.postId
          ? {
              postId: file.postId,
            }
          : {
              replyId: file.replyId,
            }),
      },
    });

    if (stillHasMedia.length === 0) {
      if (file.postId) {
        await this.postRepo.update({
          where: {
            id: file.postId,
          },
          data: {
            hasMedia: false,
          },
        });
      } else if (file.replyId) {
        await this.replyRepo.update({
          where: {
            id: file.replyId,
          },
          data: {
            hasMedia: false,
          },
        });
      }
    }

    return null;
  }

  async deleteByUrl(url: string) {
    const parsedUrl = url.replaceAll('%20', ' ');
    const file = await this.mediaRepo.findFirst({
      where: {
        url: parsedUrl,
      },
    });
    if (file) {
      await this.deleteFile(file.id, file.userId);
    }
    return null;
  }

  async deleteFromDisk(name: string) {
    if (name?.includes('amazonaws')) {
      try {
        const key = name.split('.com/')[1];
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
          }),
        );
      } catch (e) {
        console.error('Error deleting file from S3:', e);
      }

      return;
    }

    const currentDir = path.resolve(`${__dirname}/../../../public/uploads`);
    if (fs.existsSync(`${currentDir}/../../public/uploads/${name}`)) {
      fs.unlinkSync(`${currentDir}/../../public/uploads/${name}`);
    }
  }
}
