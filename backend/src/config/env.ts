import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
  validateSync,
} from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  dbURL: string;

  @IsString()
  @IsNotEmpty()
  @NotEquals('unsecure_jwt_secret')
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  redisHost: string;

  @IsNumber()
  @IsNotEmpty()
  redisPort: number;

  @IsString()
  @IsOptional()
  redisUsername?: string;

  @IsString()
  @IsOptional()
  redisPassword?: string;

  @IsNumber()
  @IsOptional()
  redisDB?: number;

  @IsString()
  @IsNotEmpty()
  refreshSecret: string;

  @IsString()
  @IsNotEmpty()
  smtpHost: string;

  @IsNumber()
  @IsNotEmpty()
  smtpPort: number;

  @IsString()
  @IsNotEmpty()
  smtpKey: string;

  @IsString()
  @IsNotEmpty()
  smtpUser: string;

  @IsString()
  @IsNotEmpty()
  emailSecret: string;

  @IsString()
  @IsNotEmpty()
  awsAccessKey: string;

  @IsString()
  @IsNotEmpty()
  awsSecretAccessKey: string;

  @IsString()
  @IsNotEmpty()
  awsRegion: string;

  @IsString()
  @IsNotEmpty()
  awsBucketName: string;
}

export const env: Env = plainToInstance(Env, {
  dbURL: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  emailSecret: process.env.EMAIL_SECRET,
  redisHost: process.env.REDIS_HOST,
  redisPort: parseInt(process.env.REDIS_PORT),
  redisUsername: process.env.REDIS_USERNAME || undefined,
  redisPassword: process.env.REDIS_PASSWORD || undefined,
  redisDB: parseInt(process.env.REDIS_DB) || 0,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT),
  smtpKey: process.env.SMTP_KEY,
  smtpUser: process.env.SMTP_USER,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  awsBucketName: process.env.AWS_BUCKET_NAME,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
