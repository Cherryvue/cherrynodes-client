import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PostProxyCommand } from './post-proxy/post-proxy.command';

@Controller('k8s')
export class K8sController {
  @Inject() private readonly commandBus: CommandBus;

  @Get()
  async proxyGet(@Body('path') path: string) {
    console.log({ path });
  }

  @Post()
  async proxyPost(
    @Body('manifest') manifest: Record<any, any>,
    @Body('path') path: string,
  ) {
    return this.commandBus.execute<PostProxyCommand, string>(
      new PostProxyCommand(path, manifest),
    );
  }

  @Put()
  async proxyPut(
    @Body('manifest') manifest: Record<any, any>,
    @Body('path') path: string,
  ) {
    console.log({ path, manifest });
  }

  @Patch()
  async proxyPatch(
    @Body('manifest') manifest: Record<any, any>,
    @Body('path') path: string,
  ) {
    console.log({ path, manifest });
  }

  @Delete()
  async proxyDelete(@Body('path') path: string) {
    console.log({ path });
  }
}
