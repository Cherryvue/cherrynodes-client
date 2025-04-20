import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { Inject, Logger } from '@nestjs/common';
import { Login } from './login.question';
import { LoginService } from './login.service';

@Command({ name: 'login' })
export class LoginCommand extends CommandRunner {
  @Inject() private readonly loginService: LoginService;
  @Inject() private readonly inquirerService: InquirerService;

  constructor() {
    super();
  }

  async run(_: string[], _options: Login): Promise<void> {
    try {
      const loginData = await this.inquirerService.ask('login', _options);
      console.log({ loginData });

      await this.loginService.login(loginData);
    } catch (error) {
      console.log(error);
      const logger = new Logger();
      logger.error('Something went wrong');
    }
  }
}
