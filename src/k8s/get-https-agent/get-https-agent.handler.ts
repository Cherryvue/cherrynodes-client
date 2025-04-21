import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetHttpsAgentQuery } from './get-https-agent.query';
import { Agent } from 'https';
import { GetClusterUserQuery } from '../get-custer-user/get-custer-user.query';
import { Inject } from '@nestjs/common';
import { Cluster, User } from '@kubernetes/client-node';
import { GetClusterQuery } from '../get-cluster/get-cluster.query';

@QueryHandler(GetHttpsAgentQuery)
export class GetHttpsAgentHandler implements IQueryHandler<GetHttpsAgentQuery> {
  @Inject() private readonly queryBus: QueryBus;

  async execute({}: GetHttpsAgentQuery): Promise<Agent> {
    const user = await this.queryBus.execute<GetClusterUserQuery, User>(
      new GetClusterUserQuery(),
    );
    const cluster = await this.queryBus.execute<GetClusterQuery, Cluster>(
      new GetClusterQuery(),
    );

    return new Agent({
      cert: user.certData ? Buffer.from(user.certData, 'base64') : undefined,
      key: user.keyData ? Buffer.from(user.keyData, 'base64') : undefined,
      ca: cluster.caData ? Buffer.from(cluster.caData, 'base64') : undefined,
      rejectUnauthorized: true,
    });
  }
}
