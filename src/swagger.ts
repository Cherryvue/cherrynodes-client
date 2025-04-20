import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  constructor(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Cherrynodes Cliend')
      .setDescription('Cherrynodes CLient Documentation')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
  }
}
