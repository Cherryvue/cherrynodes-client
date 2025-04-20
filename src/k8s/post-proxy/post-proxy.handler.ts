import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { PostProxyCommand } from './post-proxy.command';
import { Inject } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { GetK8sTokenQuery } from '../get-k8s-token/get-k8s-token.query';
import { GetHttpsAgentQuery } from '../get-https-agent/get-https-agent.query';
import { Agent } from 'https';
import { GetClusterServerQuery } from '../get-cluster-server/get-cluster-server.query';

@CommandHandler(PostProxyCommand)
export class PostProxyHandler implements ICommandHandler<PostProxyCommand> {
  @Inject() private readonly queryBus: QueryBus;

  async execute({ path, manifest }: PostProxyCommand): Promise<any> {
    const server = await this.queryBus.execute<GetClusterServerQuery, string>(
      new GetClusterServerQuery(),
    );
    const httpsAgent = await this.queryBus.execute<GetHttpsAgentQuery, Agent>(
      new GetHttpsAgentQuery(),
    );
    const k8sToken = await this.queryBus.execute<GetK8sTokenQuery, string>(
      new GetK8sTokenQuery('my-deployment-sa', 'default'),
    );

    try {
      const response = await axios.post<unknown>(`${server}${path}`, manifest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${k8sToken}`,
        },
        httpsAgent,
      });

      console.log('Deployment utworzony:', { r: response.data });
      return response.data;
    } catch (e: any) {
      if (e instanceof AxiosError) return e.response.data;

      console.log({ e });

      return e.message;
    }
  }
}
