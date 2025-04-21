import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetKubeConfigQuery } from './get-kube-config.query';
import { KubeConfig } from '@kubernetes/client-node';

@QueryHandler(GetKubeConfigQuery)
export class GetCubeConfigHandler implements IQueryHandler<GetKubeConfigQuery> {
  #kc: KubeConfig;

  constructor() {
    this.#load();
  }

  async execute({}: GetKubeConfigQuery): Promise<KubeConfig> {
    if (this.#kc) return this.#kc;
    return this.#load();
  }

  #load() {
    this.#kc = new KubeConfig();
    this.#kc.loadFromDefault();
    return this.#kc;
  }
}
