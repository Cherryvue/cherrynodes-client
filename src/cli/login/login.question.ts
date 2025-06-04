import { Question, QuestionSet } from 'nest-commander';

export type Login = {
  serviceAccountLogin: string;
  serviceAccountSecret: string;
  master: boolean;
  ip?: string;
};

@QuestionSet({ name: 'login' })
export class LoginInfoQuestions {
  @Question({
    type: 'input',
    name: 'serviceAccountLogin',
    message: 'Service account login:',
  })
  serviceAccountLogin(
    serviceAccountLogin: Login['serviceAccountLogin'],
  ): string {
    return serviceAccountLogin;
  }

  @Question({
    type: 'input',
    name: 'serviceAccountSecret',
    message: 'Service account secret:',
  })
  serviceAccountSecret(
    serviceAccountSecret: Login['serviceAccountSecret'],
  ): string {
    return serviceAccountSecret;
  }

  @Question({
    type: 'checkbox',
    name: 'master',
    default: true,
    message: 'Treat this node as master',
  })
  isMaster(master: Login['master']): boolean {
    return master;
  }

  @Question({
    type: 'input',
    name: 'ip',
    message: 'Pass public IP address',
    when: (answers) => answers.isMaster === true,
  })
  publicIp(ip: Login['ip']): string {
    return ip;
  }
}
