import { Module } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { LogoutQuestions } from './logout.question';
import { LogoutCommand } from './logout.command';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [LogoutService, LogoutQuestions, LogoutCommand],
  imports: [AuthModule],
})
export class LogoutModule {}
