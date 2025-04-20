import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@CommandHandler(LoginCommand)
export class LognHandler implements ICommandHandler<LoginCommand> {
  @Inject() private readonly config: ConfigService;

  private serverUrl = 'http://localhost:4041';
  private serviceAccountId = process.env.CLIENT_ID;
  private serviceAccountSecret = process.env.CLIENT_SECRET;
  private userEmail = 'm.zupa@cherryvue.com';

  async execute({}: LoginCommand): Promise<void> {
    try {
      const authResponse = await axios.post<{ accessToken: string }>(
        `${this.serverUrl}/auth-machine/connect`,
        {
          serviceAccountId: this.serviceAccountId,
          serviceAccountSecret: this.serviceAccountSecret,
          userEmail: this.userEmail,
          ip: '192.168.1.34',
        },
      );

      const accessToken = authResponse.data.accessToken;
      console.log('Uzyskano token autentykacyjny:');
      console.log({ accessToken });
    } catch (error) {
      console.error('Błąd podczas autoryzacji:', error);
    }
  }
}
