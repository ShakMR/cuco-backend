import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ConfigModule.forRoot(), ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: string;

  constructor(configService: ConfigService) {
    AppModule.port = configService.get('HTTP_PORT');
  }
}
