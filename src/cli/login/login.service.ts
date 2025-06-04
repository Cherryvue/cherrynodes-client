import { Injectable } from '@nestjs/common';
import { Login } from './login.question';
import axios from 'axios';
import * as os from 'os';
import * as path from 'path';
import { writeFile } from 'fs/promises';

type LoginRequest = Login & {
  hostname: string;
  platform: string;
};

@Injectable()
export class LoginService {
  #serverUrl = 'https://api.cherry-nodes.com';

  readonly #configPath = path.join(
    os.homedir(),
    '.config',
    'cherrynodes',
    'auth.json',
  );

  async login(_loginData: Login): Promise<void> {
    const login: LoginRequest = {
      ..._loginData,
      hostname: os.hostname(),
      platform: os.platform(),
    };
    console.log({ login });

    const dir = path.dirname(this.#configPath);
    await this.#ensureDirectoryExists(dir);

    try {
      const authResponse = await axios.post<{ machineId: string }>(
        `${this.#serverUrl}/auth-machine/connect`,
        login,
      );

      const machineId = authResponse.data.machineId;
      console.log('machineId: ', machineId);

      await writeFile(
        this.#configPath,
        JSON.stringify({ ...login, machineId }, null, 2),
        {
          encoding: 'utf-8',
        },
      );
    } catch (error) {
      console.error('Authorization error', error);
    }
  }

  async #ensureDirectoryExists(dir: string): Promise<void> {
    const fs = await import('fs/promises');
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (e) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }
}
