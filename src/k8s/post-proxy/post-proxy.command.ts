export class PostProxyCommand {
  constructor(
    readonly path: string,
    readonly manifest: Record<any, any>,
  ) {}
}
