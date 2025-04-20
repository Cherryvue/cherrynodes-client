export class GetK8sTokenQuery {
  constructor(
    readonly serviceAccountName: string,
    readonly namespace: string,
  ) {}
}
