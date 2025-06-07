import { Module } from '@nestjs/common';
import { K8sController } from './k8s.controller';
import { GetK8sTokenHandler } from './get-k8s-token/get-k8s-token.handler';
import { GetHttpsAgentHandler } from './get-https-agent/get-https-agent.handler';
import { k8sProxyHandler } from './k8s-proxy/k8s-proxy.handler';
import { GetClusterUserHandler } from './get-custer-user/get-custer-user.handler';
import { GetCubeConfigHandler } from './get-kube-config/get-kube-config.handler';
import { GetClusterHandler } from './get-cluster/get-cluster.handler';
import { AuthModule } from '@app/auth/auth.module';

const commandHandlers = [k8sProxyHandler];
const queryHandlers = [
  GetK8sTokenHandler,
  GetHttpsAgentHandler,
  GetClusterHandler,
  GetClusterUserHandler,
  GetCubeConfigHandler,
];

@Module({
  controllers: [K8sController],
  providers: [...commandHandlers, ...queryHandlers],
  imports: [AuthModule],
})
export class K8sModule {}
