import { Module } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { PostModule } from './api/post/post.module';

@Module({
  imports: [UserModule, PostModule],
})
export class AppModule {}
