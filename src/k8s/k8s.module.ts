import { Module } from '@nestjs/common';
import { K8sController } from './k8s.controller';
import { PostProxyHandler } from './post-proxy/post-proxy.handler';
import { GetK8sTokenHandler } from './get-k8s-token/get-k8s-token.handler';
import { GetHttpsAgentHandler } from './get-https-agent/get-https-agent.handler';
import { GetClusterServerHandler } from './get-cluster-server/get-cluster-server.handler';

const commandHandlers = [PostProxyHandler];
const queryHandlers = [
  GetK8sTokenHandler,
  GetHttpsAgentHandler,
  GetClusterServerHandler,
];

@Module({
  controllers: [K8sController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class K8sModule {}
