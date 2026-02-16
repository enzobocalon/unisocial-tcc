import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { join } from 'node:path';
import { UploadService } from './upload.service';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  constructor(private readonly uploadService: UploadService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const filePath = join(__dirname, '..', '..', '..', req.originalUrl);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      const url = req.originalUrl.split('/').pop();
      await this.uploadService.deleteByUrl(url);
      return res.sendStatus(404);
    }
    next();
  }
}
