import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { Cluster, User } from '@kubernetes/client-node';
import axios from 'axios';
import { Agent } from 'https';
import { GetK8sTokenQuery } from './get-k8s-token.query';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { GetHttpsAgentQuery } from '../get-https-agent/get-https-agent.query';
import { GetClusterUserQuery } from '../get-custer-user/get-custer-user.query';
import { GetClusterQuery } from '../get-cluster/get-cluster.query';

@QueryHandler(GetK8sTokenQuery)
export class GetK8sTokenHandler implements IQueryHandler<GetK8sTokenQuery> {
  @Inject() private readonly queryBus: QueryBus;

  async execute(command: GetK8sTokenQuery): Promise<string> {
    const { namespace, serviceAccountName } = command;

    const cluster = await this.queryBus.execute<GetClusterQuery, Cluster>(
      new GetClusterQuery(),
    );
    const user = await this.queryBus.execute<GetClusterUserQuery, User>(
      new GetClusterUserQuery(),
    );
    const httpsAgent = await this.queryBus.execute<GetHttpsAgentQuery, Agent>(
      new GetHttpsAgentQuery(),
    );

    const tokenRequest = {
      apiVersion: 'authentication.k8s.io/v1',
      kind: 'TokenRequest',
      spec: {
        audiences: ['https://kubernetes.default.svc'],
        expirationSeconds: 3600,
      },
    };

    const url = `${cluster.server}/api/v1/namespaces/${namespace}/serviceaccounts/${serviceAccountName}/token`;
    try {
      const response = await axios.post<{ status: { token: string } }>(
        url,
        tokenRequest,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          httpsAgent,
        },
      );

      return response.data.status.token;
    } catch (error) {
      console.log('GetK8sTokenHandler error', error);
      throw new InternalServerErrorException(
        `Something went wrong while getting the token: ${error.message}`,
      );
    }
  }
}
