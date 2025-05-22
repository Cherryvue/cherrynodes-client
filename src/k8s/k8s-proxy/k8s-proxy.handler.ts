import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { K8sProxyCommand } from './k8s-proxy.command';
import { Inject } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { GetK8sTokenQuery } from '../get-k8s-token/get-k8s-token.query';
import { GetHttpsAgentQuery } from '../get-https-agent/get-https-agent.query';
import { Agent } from 'https';
import { Cluster } from '@kubernetes/client-node';
import { GetClusterQuery } from '../get-cluster/get-cluster.query';

@CommandHandler(K8sProxyCommand)
export class k8sProxyHandler implements ICommandHandler<K8sProxyCommand> {
  @Inject() private readonly queryBus: QueryBus;

  async execute({ method, path, manifest }: K8sProxyCommand): Promise<any> {
    const cluster = await this.queryBus.execute<GetClusterQuery, Cluster>(
      new GetClusterQuery(),
    );
    const httpsAgent = await this.queryBus.execute<GetHttpsAgentQuery, Agent>(
      new GetHttpsAgentQuery(),
    );
    const k8sToken = await this.queryBus.execute<GetK8sTokenQuery, string>(
      new GetK8sTokenQuery('my-deployment-sa', 'default'),
    );
    const url = `${cluster.server}${path}`;

    const reguestOptions: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${k8sToken}`,
      },
      httpsAgent,
    };

    let response;
    switch (method) {
      case 'GET':
        response = axios.get<unknown>(url, reguestOptions);
        break;

      case 'POST':
        response = axios.post<unknown>(url, manifest, reguestOptions);
        break;

      case 'PUT':
        response = axios.put<unknown>(url, manifest, reguestOptions);
        break;

      case 'PATCH':
        response = axios.patch<unknown>(url, manifest, reguestOptions);
        break;

      case 'DELETE':
        response = axios.delete<unknown>(url, reguestOptions);
        break;

      default:
        response = axios.get<unknown>(url, reguestOptions);
        break;
    }

    try {
      const result = await response;
      console.log('Applied', { result: result.data });
      return result.data;
    } catch (e: any) {
      if (e instanceof AxiosError) return e.response.data;
      return e.message;
    }
  }
}
