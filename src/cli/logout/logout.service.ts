import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '../config/config.service';
import { MACHINE_AUTH_URL } from '../consts';

@Injectable()
export class LogoutService {
  @Inject() private readonly config: ConfigService;

  async logout(): Promise<void> {
    try {
      const machineId = await this.config.readByKey<string>('machineId');
      if (!machineId) throw Error('Could not logout this machine');

      const response = await axios.delete<{ success: boolean }>(
        `${MACHINE_AUTH_URL}/logout/${machineId}`,
      );
      if (response.data.success) await this.config.removeConfig();
    } catch (error) {
      console.error('Authorization error', error);
    }
  }
}
