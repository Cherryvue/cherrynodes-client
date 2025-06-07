import { Question, QuestionSet } from 'nest-commander';

export type Logout = {
  logout: boolean;
};

@QuestionSet({ name: 'logout' })
export class LogoutQuestions {
  @Question({
    type: 'confirm',
    name: 'logout',
    default: false,
    message: 'Are you sure you wont to logout this machine?',
  })
  logout(logout: Logout['logout']): boolean {
    return logout;
  }
}
