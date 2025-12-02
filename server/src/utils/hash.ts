import { createHmac } from 'crypto';

export const hashSHA256 = (text: string, secret: string): string => {
  return createHmac('sha256', secret).update(text).digest('hex');
};
