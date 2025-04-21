export type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export class K8sProxyCommand {
  constructor(
    readonly method: RequestMethod,
    readonly path: string,
    readonly manifest: Record<any, any>,
  ) {}
}
