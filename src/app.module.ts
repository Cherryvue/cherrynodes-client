import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env.schema';
import { AppController } from './app.controller';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { K8sModule } from './k8s/k8s.module';

@Module({
  controllers: [AppController],
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
      validationSchema: envSchema,
    }),
    AuthModule,
    StorageModule,
    K8sModule,
  ],
})
export class AppModule {}
