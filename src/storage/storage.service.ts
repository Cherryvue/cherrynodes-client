import { Inject, Injectable } from '@nestjs/common';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import * as CryptoJS from 'crypto-js';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export type SecureData = {
  accessToken: string;
  refreshToken: string;
  machineId: string;
};

@Injectable()
export class StorageService {
  readonly #secretKey: string;
  // readonly #storageDir = '/var/lib/cherrynodes-client/';
  readonly #storageDir = './cherrynodes-client/';
  readonly #filePath = path.join(
    process.cwd(),
    this.#storageDir,
    'cherrynodes.storage.json',
  );

  @Inject() private readonly config: ConfigService;

  constructor() {
    if (!existsSync(this.#storageDir))
      mkdirSync(this.#storageDir, { recursive: true });

    this.#load();
  }

  #encrypt(data: SecureData): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.#secretKey,
    ).toString();
  }

  #decrypt(cipherText: string): SecureData {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.#secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as SecureData;
  }

  #save(data: SecureData) {
    const encrypted = this.#encrypt(data);
    writeFileSync(this.#filePath, encrypted, { mode: 0o600 });
  }

  #load(): SecureData | null {
    if (!existsSync(this.#filePath)) {
      writeFileSync(this.#filePath, '', { encoding: 'utf-8' });
      return null;
    }

    try {
      const encrypted = readFileSync(this.#filePath, 'utf-8');
      return this.#decrypt(encrypted);
    } catch {
      return null;
    }
  }

  get<K extends keyof SecureData>(key: K): SecureData[K] | null {
    const data = this.#load();
    return data ? data[key] : null;
  }

  set<K extends keyof SecureData>(key: K, value: SecureData[K]) {
    const current = this.#load() || ({} as SecureData);
    const updated: SecureData = { ...current, [key]: value };
    this.#save(updated);
  }
}
