import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [LoginModule, LogoutModule, ConfigModule],
})
export class CliModule {}
