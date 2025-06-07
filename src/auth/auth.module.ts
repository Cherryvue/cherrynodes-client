import { Module } from '@nestjs/common';
import { AuthMachineService } from './auth-machine.service';
import { ConfigModule } from '@app/config/config.module';

@Module({
  providers: [AuthMachineService],
  exports: [AuthMachineService],
  imports: [ConfigModule],
})
export class AuthModule {}
