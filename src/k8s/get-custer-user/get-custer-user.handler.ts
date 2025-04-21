import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetClusterUserQuery } from './get-custer-user.query';
import { KubeConfig, User } from '@kubernetes/client-node';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetKubeConfigQuery } from '../get-kube-config/get-kube-config.query';

@QueryHandler(GetClusterUserQuery)
export class GetClusterUserHandler
  implements IQueryHandler<GetClusterUserQuery>
{
  @Inject() private readonly queryBus: QueryBus;

  async execute({}: GetClusterUserQuery): Promise<User> {
    const kc = await this.queryBus.execute<GetKubeConfigQuery, KubeConfig>(
      new GetKubeConfigQuery(),
    );

    const user = kc.getCurrentUser();
    if (!user) throw new NotFoundException('Missing user configuration');
    return user;
  }
}
