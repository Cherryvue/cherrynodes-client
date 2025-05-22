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
    console.log({ cluster });
    const user = await this.queryBus.execute<GetClusterUserQuery, User>(
      new GetClusterUserQuery(),
    );
    console.log({ user });
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

    console.log({ tokenRequest });

    const url = `${cluster.server}/api/v1/namespaces/${namespace}/serviceaccounts/${serviceAccountName}/token`;
    console.log({ url });

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

      console.log({ response });

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
