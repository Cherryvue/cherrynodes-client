import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetClusterQuery } from './get-cluster.query';
import { Cluster, KubeConfig } from '@kubernetes/client-node';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetKubeConfigQuery } from '../get-kube-config/get-kube-config.query';

@QueryHandler(GetClusterQuery)
export class GetClusterHandler implements IQueryHandler<GetClusterQuery> {
  @Inject() private readonly queryBus: QueryBus;

  async execute({}: GetClusterQuery): Promise<Cluster> {
    const kc = await this.queryBus.execute<GetKubeConfigQuery, KubeConfig>(
      new GetKubeConfigQuery(),
    );

    const cluster = kc.getCurrentCluster();
    if (!cluster) throw new NotFoundException('Missing cluster configuration');
    return cluster;
  }
}
