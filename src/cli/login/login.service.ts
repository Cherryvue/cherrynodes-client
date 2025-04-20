import { Injectable } from '@nestjs/common';
import { Login } from './login.question';
import axios from 'axios';

@Injectable()
export class LoginService {
  private serverUrl = 'http://localhost:4041';
  private machineId = 'bb7905b7-fded-43d8-a4d2-9d40cb9425de';

  async login(loginData: Login): Promise<void> {
    const login = {
      ...loginData,
      machineId: this.machineId,
    };

    console.log({ login });

    try {
      const authResponse = await axios.post<{ token: string }>(
        `${this.serverUrl}/auth-machine/connect`,
        login,
      );

      const token = authResponse.data.token;
      console.log('Uzyskano token autentykacyjny:');
      console.log({ token });
    } catch (error) {
      console.error('Błąd podczas autoryzacji:', error as any);
    }

    //   try {
    //     const response = await axios.post<{ token: string }>(
    //       'http://api.cherry-nodes.com/auth-machine/login',
    //       {
    //         ...loginData,
    //         ip: '192.168.1.33',
    //         mac: 'ELO:ELO:ELO:ELO',
    //         Headers: { Authorization: `Bearer ${123}` },
    //       },
    //     );
    //     return response.data.token;
    //   } catch (e) {
    //     console.error(e);
    //     return null;
    //   }
  }
}
