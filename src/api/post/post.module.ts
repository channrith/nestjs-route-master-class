import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ECHO_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('MICROSERVICE_HOST', 'localhost'),
            port: parseInt(config.get('MICROSERVICE_PORT', '3001'), 10),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
