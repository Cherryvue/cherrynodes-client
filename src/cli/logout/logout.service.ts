import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '../config/config.service';
import { MACHINE_AUTH_URL } from '../consts';
import { AuthMachineService } from '@app/auth/auth-machine.service';

@Injectable()
export class LogoutService {
  @Inject() private readonly config: ConfigService;
  @Inject() private readonly authMachineService: AuthMachineService;

  async logout(): Promise<void> {
    try {
      const machineId = await this.config.readByKey<string>('machineId');
      if (!machineId) throw Error('Could not logout this machine');

      const token = await this.authMachineService.signToken(machineId);

      const response = await axios.delete<{ success: boolean }>(
        `${MACHINE_AUTH_URL}/logout/${machineId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) await this.config.removeConfig();
    } catch (error) {
      console.error('Authorization error', error);
    }
  }
}
