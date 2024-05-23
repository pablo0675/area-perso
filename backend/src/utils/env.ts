import { configDotenv } from 'dotenv';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

configDotenv();
const algorithm = 'aes-256-cbc';

export function encrypt(text: string) {
  const hash = getFromEnv('HASH_KEY');
  if (!hash) throw new Error('HASH_KEY not found');
  const key = Buffer.from(hash.toString(), 'utf-8').slice(0, 32);

  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

export function decrypt(text: string) {
  const hash = getFromEnv('HASH_KEY');
  if (!hash) throw new Error('HASH_KEY not found');
  const key = Buffer.from(hash.toString(), 'utf-8').slice(0, 32);

  const iv = Buffer.from(text.slice(0, 32), 'hex');

  const encryptedText = text.slice(32);
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function getFromEnv<T>(
  key: string,
  throwIfNotFound: boolean = true,
): T | undefined {
  const value = process.env[key] as unknown as T | undefined;
  if (value === undefined && throwIfNotFound)
    throw new Error(`Environment variable ${key} not found`);
  return value;
}
