import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClusterServerQuery } from './get-cluster-server.query';
import { KubeConfig } from '@kubernetes/client-node';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetClusterServerQuery)
export class GetClusterServerHandler
  implements IQueryHandler<GetClusterServerQuery>
{
  async execute({}: GetClusterServerQuery): Promise<string> {
    const kc = new KubeConfig();
    kc.loadFromDefault();

    const cluster = kc.getCurrentCluster();
    if (!cluster) throw new NotFoundException('Missing cluster configuration');

    return cluster.server;
  }
}
