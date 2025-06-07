import { Inject, Injectable } from '@nestjs/common';
import { Login } from './login.question';
import axios from 'axios';
import * as os from 'os';
import { ConfigService } from '../config/config.service';
import { MACHINE_AUTH_URL } from '../consts';

type LoginRequest = Login & {
  hostname: string;
  platform: string;
};

@Injectable()
export class LoginService {
  @Inject() private readonly config: ConfigService;

  async login(_loginData: Login): Promise<void> {
    const login: LoginRequest = {
      ip: '',
      ..._loginData,
      hostname: os.hostname(),
      platform: os.platform(),
    };

    try {
      const authResponse = await axios.post<{ machineId: string }>(
        `${MACHINE_AUTH_URL}/connect`,
        login,
      );

      const machineId = authResponse.data.machineId;
      await this.config.upsert({ ...login, machineId });
      console.log('Machine connected');
    } catch (error) {
      console.error('Authorization error: ', error.message);
    }
  }
}
