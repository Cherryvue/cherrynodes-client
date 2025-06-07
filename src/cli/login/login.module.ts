import { Module } from '@nestjs/common';
import { LoginCommand } from './login.command';
import { LoginInfoQuestions } from './login.question';
import { LoginService } from './login.service';

@Module({ providers: [LoginCommand, LoginInfoQuestions, LoginService] })
export class LoginModule {}
