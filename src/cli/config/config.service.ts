import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as path from 'path';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';

export class Config {
  serviceAccountLogin: string;
  serviceAccountSecret: string;
  master: boolean;
  ip: string;
  hostname: string;
  platform: string;
  machineId: string;
}

@Injectable()
export class ConfigService {
  readonly #configPath = path.join(
    os.homedir(),
    '.config',
    'cherrynodes',
    'auth.json',
  );

  async read(): Promise<Config> {
    try {
      await this.#ensureDirectoryExists();
      const config = await readFile(this.#configPath, {
        encoding: 'utf-8',
      });
      return JSON.parse(config);
    } catch (e) {
      console.error(e);
    }
  }

  async readByKey<T>(key: keyof Config): Promise<T> {
    const config = await this.read();
    return config?.[key] as T;
  }

  async upsert(config: Config) {
    await this.#ensureDirectoryExists();
    await writeFile(this.#configPath, JSON.stringify(config, null, 2), {
      encoding: 'utf-8',
    });
  }

  async removeConfig() {
    try {
      await this.#ensureDirectoryExists();
      await unlink(this.#configPath);
    } catch (e) {
      console.error(e);
      if (e.code !== 'ENOENT') throw e;
    }
  }

  async #ensureDirectoryExists(): Promise<void> {
    try {
      const dir = path.dirname(this.#configPath);
      await mkdir(dir, { recursive: true });
    } catch (e) {
      console.error(e);
      if (e.code !== 'EEXIST') throw e;
    }
  }
}
