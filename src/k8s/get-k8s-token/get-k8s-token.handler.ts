import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { KubeConfig } from '@kubernetes/client-node';
import axios from 'axios';
import { Agent } from 'https';
import { GetK8sTokenQuery } from './get-k8s-token.query';
import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetHttpsAgentQuery } from '../get-https-agent/get-https-agent.query';
import { GetClusterServerQuery } from '../get-cluster-server/get-cluster-server.query';

@QueryHandler(GetK8sTokenQuery)
export class GetK8sTokenHandler implements IQueryHandler<GetK8sTokenQuery> {
  @Inject() private readonly queryBus: QueryBus;

  async execute(command: GetK8sTokenQuery): Promise<string> {
    const { namespace, serviceAccountName } = command;

    const server = await this.queryBus.execute<GetClusterServerQuery, string>(
      new GetClusterServerQuery(),
    );
    const httpsAgent = await this.queryBus.execute<GetHttpsAgentQuery, Agent>(
      new GetHttpsAgentQuery(),
    );

    const tokenRequest = {
      apiVersion: 'authentication.k8s.io/v1',
      kind: 'TokenRequest',
      spec: {
        audiences: ['https://kubernetes.default.svc'],
        expirationSeconds: 360,
      },
    };

    const url = `${server}/api/v1/namespaces/${namespace}/serviceaccounts/${serviceAccountName}/token`;

    const kc = new KubeConfig();
    const user = kc.getCurrentUser();
    if (!user) throw new NotFoundException('Missing user configuration');

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
      throw new InternalServerErrorException(
        `Something went wrong while getting the token: ${error.message}`,
      );
    }
  }
}

// ! Legacy

// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
// import { GetK8sTokenCommand } from './get-k8s-token.command';
// import { exec } from 'child_process';
// import { promisify } from 'util';
// import { InternalServerErrorException } from '@nestjs/common';

// const execAsync = promisify(exec);

// @QueryHandler(GetK8sTokenCommand)
// export class GetK8sTokenHandler implements IQueryHandler<GetK8sTokenCommand> {
//   async execute({
//     namespace,
//     serviceAccountName,
//   }: GetK8sTokenCommand): Promise<string> {
//     try {
//       const { stdout: token } = await execAsync(
//         `kubectl create token ${serviceAccountName} -n ${namespace} --duration=3600s`,
//       );

//       if (!token)
//         throw new Error('Something went wrong while generating new token');

//       return token.trim();
//     } catch (e) {
//       throw new InternalServerErrorException(
//         `Could not get token: ${e.message}`,
//       );
//     }
//   }
// }
