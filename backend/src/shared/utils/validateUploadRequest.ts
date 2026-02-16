import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import {
  MediaSource,
  UrlRequestDTO,
} from 'src/modules/upload/dto/url-request-dto';

const BLOCKED_EXTENSIONS = [
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.com',
  '.msi',
  '.dll',
  '.scr',
  '.vbs',
  '.ps1',
];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
  'video/x-matroska', // .mkv
];

export function validateUploadRequest(dto: UrlRequestDTO) {
  const ext = dto.name ? path.extname(dto.name).toLowerCase() : '';
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    throw new BadRequestException(`Extensão "${ext}" não é permitida.`);
  }

  switch (dto.source) {
    case MediaSource.DOC:
      // DOC aceita qualquer arquivo (exceto extensões maliciosas)
      break;

    case MediaSource.IMAGE_ONLY:
      if (!ALLOWED_IMAGE_TYPES.includes(dto.type)) {
        throw new BadRequestException(
          `Apenas imagens são permitidas para este envio.`,
        );
      }
      break;

    case MediaSource.DEFAULT:
      // DEFAULT aceita apenas imagens e vídeos
      if (
        !ALLOWED_IMAGE_TYPES.includes(dto.type) &&
        !ALLOWED_VIDEO_TYPES.includes(dto.type)
      ) {
        throw new BadRequestException(
          `Apenas imagens e vídeos são permitidos para este envio.`,
        );
      }
      break;

    default:
      throw new BadRequestException('Arquivo inválido.');
  }
  return true;
}
