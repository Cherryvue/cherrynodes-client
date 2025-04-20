import { Module } from '@nestjs/common';
import { LoginCommand } from './login/login.command';
import { LoginInfoQuestions } from './login/login.question';
import { LoginService } from './login/login.service';

@Module({
  providers: [LoginCommand, LoginInfoQuestions, LoginService],
})
export class CliModule {}
