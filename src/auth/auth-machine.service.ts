import { ConfigService } from '@app/config/config.service';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMachineService {
  @Inject() private readonly config: ConfigService;

  async verifyToken(authorizationHeader: string): Promise<void> {
    if (!authorizationHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Invalid authorization header');

    const serviceAccountSecret = await this.config.readByKey(
      'serviceAccountSecret',
    );
    const machineId = await this.config.readByKey('machineId');
    if (!machineId || !serviceAccountSecret) throw new UnauthorizedException();

    console.log({ machineId, serviceAccountSecret });

    try {
      const token = authorizationHeader.split(' ')[1];
      console.log({ token });
      const payload = jwt.verify(token, serviceAccountSecret) as jwt.JwtPayload;
      console.log({ payload });

      if (!payload?.sub)
        throw new UnauthorizedException('Token does not contain sub');

      if (payload.sub !== machineId) throw new ForbiddenException();
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async signToken(machineId: string): Promise<string> {
    const serviceAccountSecret = await this.config.readByKey(
      'serviceAccountSecret',
    );
    if (!serviceAccountSecret) throw new UnauthorizedException();

    return jwt.sign(
      {
        sub: machineId,
      },
      serviceAccountSecret,
      {
        expiresIn: '1h',
        algorithm: 'HS256',
      },
    );
  }
}
