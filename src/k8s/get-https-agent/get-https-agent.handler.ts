import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHttpsAgentQuery } from './get-https-agent.query';
import { KubeConfig } from '@kubernetes/client-node';
import { NotFoundException } from '@nestjs/common';
import { Agent } from 'https';

@QueryHandler(GetHttpsAgentQuery)
export class GetHttpsAgentHandler implements IQueryHandler<GetHttpsAgentQuery> {
  async execute({}: GetHttpsAgentQuery): Promise<Agent> {
    const kc = new KubeConfig();
    kc.loadFromDefault();

    const cluster = kc.getCurrentCluster();
    if (!cluster) throw new NotFoundException('Missing cluster configuration');

    const user = kc.getCurrentUser();
    if (!user) throw new NotFoundException('Missing user configuration');

    return new Agent({
      cert: user.certData ? Buffer.from(user.certData, 'base64') : undefined,
      key: user.keyData ? Buffer.from(user.keyData, 'base64') : undefined,
      ca: cluster.caData ? Buffer.from(cluster.caData, 'base64') : undefined,
      rejectUnauthorized: true,
    });
  }
}
