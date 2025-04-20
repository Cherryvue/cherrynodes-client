import { Module } from '@nestjs/common';
import { LognHandler } from './login/login.handler';

const commandHandlers = [LognHandler];

@Module({ providers: [...commandHandlers] })
export class AuthModule {}
