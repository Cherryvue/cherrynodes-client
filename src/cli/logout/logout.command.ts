import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { Inject, Logger } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { Logout } from './logout.question';

@Command({ name: 'logout' })
export class LogoutCommand extends CommandRunner {
  @Inject() private readonly logoutService: LogoutService;
  @Inject() private readonly inquirerService: InquirerService;

  constructor() {
    super();
  }

  async run(_: string[], _options: Logout): Promise<void> {
    try {
      const { logout } = await this.inquirerService.ask('logout', _options);
      if (!logout) {
        console.log('Logout aborted');
        return;
      }
      await this.logoutService.logout();
    } catch (error) {
      console.log(error);
      const logger = new Logger();
      logger.error('Something went wrong');
    }
  }
}
