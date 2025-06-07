import { Module } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { LogoutQuestions } from './logout.question';
import { LogoutCommand } from './logout.command';

@Module({ providers: [LogoutService, LogoutQuestions, LogoutCommand] })
export class LogoutModule {}
