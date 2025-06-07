import {
  Body,
  Controller,
  Inject,
  Post,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { K8sProxyCommand, RequestMethod } from './k8s-proxy/k8s-proxy.command';
import { AuthMachineService } from '@app/auth/auth-machine.service';

@Controller('k8s')
export class K8sController {
  @Inject() private readonly commandBus: CommandBus;
  @Inject() private readonly authMachineService: AuthMachineService;

  @Post()
  async proxyPost(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body('manifest') manifest: Record<any, any>,
    @Body('path') path: string,
    @Body('method') method: RequestMethod,
    @Headers('authorization') authorizationHeader: string,
  ) {
    if (!path || !method)
      throw new BadRequestException('"path" and "method" should be defined');
    await this.authMachineService.verifyToken(authorizationHeader);

    return this.commandBus.execute<K8sProxyCommand, string>(
      new K8sProxyCommand(method, path, manifest),
    );
  }
}
