import { createTransport } from 'nodemailer';
import { env } from 'src/config/env';

export const transport = createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  auth: {
    user: env.smtpUser,
    pass: env.smtpKey,
  },
});
