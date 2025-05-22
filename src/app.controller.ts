import { Controller, Get, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from './auth/login/login.command';

@Controller()
export class AppController {
  @Inject() private readonly commandBus: CommandBus;

  @Get('login')
  async login() {
    await this.commandBus.execute<LoginCommand, void>(new LoginCommand());
  }

  @Get('test')
  async test() {
    console.log('test elo');
    return 'elo';
  }
}
