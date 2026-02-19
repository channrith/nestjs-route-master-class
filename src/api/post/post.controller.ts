import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Inject,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { PostService } from './post.service';
import type { Post as PostEntity } from './post.service';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(
    private readonly postService: PostService,
    @Inject('ECHO_SERVICE') private readonly echoClient: ClientProxy,
  ) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    const posts = this.postService.findAll();
    await firstValueFrom(
      this.echoClient.send('echo', { count: posts.length, source: 'findAll' }).pipe(
        timeout(3000),
        catchError((err) => {
          this.logger.warn('Echo microservice unavailable', err?.message ?? err);
          return of(null);
        }),
      ),
    ).catch(() => {
      // Microservice down or timeout; still return posts
    });
    return posts;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): PostEntity {
    return this.postService.findOne(id);
  }

  @Post()
  create(@Body() createPostDto: Omit<PostEntity, 'id'>): PostEntity {
    return this.postService.create(createPostDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: Partial<Omit<PostEntity, 'id'>>,
  ): PostEntity {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    return this.postService.remove(id);
  }
}
