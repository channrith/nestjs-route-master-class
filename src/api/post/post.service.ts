import { Injectable, NotFoundException } from '@nestjs/common';

export interface Post {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class PostService {
  private posts: Post[] = [
    { id: 1, title: 'First Post', content: 'Hello world!' },
    { id: 2, title: 'Second Post', content: 'NestJS is awesome.' },
  ];
  private nextId = 3;

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  create(post: Omit<Post, 'id'>): Post {
    const newPost: Post = {
      id: this.nextId++,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, updates: Partial<Omit<Post, 'id'>>): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts[index] = { ...this.posts[index], ...updates };
    return this.posts[index];
  }

  remove(id: number): void {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts.splice(index, 1);
  }
}
