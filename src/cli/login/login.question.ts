import { Question, QuestionSet } from 'nest-commander';

export type Login = {
  userEmail: string;
  serviceAccountLogin: string;
  serviceAccountSecret: string;
};

@QuestionSet({ name: 'login' })
export class LoginInfoQuestions {
  @Question({
    type: 'input',
    name: 'userEmail',
    message: 'User email:',
  })
  parseUserEmail(userEmail: Login['userEmail']): string {
    return userEmail;
  }

  @Question({
    type: 'input',
    name: 'serviceAccountLogin',
    message: 'Service account login:',
  })
  parseServiceAccountLogin(
    serviceAccountLogin: Login['serviceAccountLogin'],
  ): string {
    return serviceAccountLogin;
  }

  @Question({
    type: 'input',
    name: 'serviceAccountSecret',
    message: 'Service account secret:',
  })
  parseServiceAccountSecret(
    serviceAccountSecret: Login['serviceAccountSecret'],
  ): string {
    return serviceAccountSecret;
  }
}
