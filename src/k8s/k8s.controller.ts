import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { K8sProxyCommand, RequestMethod } from './k8s-proxy/k8s-proxy.command';

@Controller('k8s')
export class K8sController {
  @Inject() private readonly commandBus: CommandBus;

  // @Get()
  // async proxyGet(@Body('path') path: string) {
  //   return this.commandBus.execute<K8sProxyCommand, string>(
  //     new K8sProxyCommand('GET', path, {}),
  //   );
  // }

  @Post()
  async proxyPost(
    @Body('manifest') manifest: Record<any, any>,
    @Body('path') path: string,
    @Body('method') method: RequestMethod,
  ) {
    console.log({ path, method });
    return this.commandBus.execute<K8sProxyCommand, string>(
      new K8sProxyCommand(method, path, manifest),
    );
  }

  // @Put()
  // async proxyPut(
  //   @Body('manifest') manifest: Record<any, any>,
  //   @Body('path') path: string,
  // ) {
  //   return this.commandBus.execute<K8sProxyCommand, string>(
  //     new K8sProxyCommand('PUT', path, manifest),
  //   );
  // }

  // @Patch()
  // async proxyPatch(
  //   @Body('manifest') manifest: Record<any, any>,
  //   @Body('path') path: string,
  // ) {
  //   return this.commandBus.execute<K8sProxyCommand, string>(
  //     new K8sProxyCommand('PATCH', path, manifest),
  //   );
  // }

  // @Delete()
  // async proxyDelete(@Param('path') path: string) {
  //   console.log({ path });

  //   return null;
  //   new K8sProxyCommand('DELETE', path, {});
  // }
}
