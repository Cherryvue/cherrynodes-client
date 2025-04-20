import { CliModule } from '@app/cli/cli.module';
import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(CliModule, new Logger());
}
void bootstrap();
