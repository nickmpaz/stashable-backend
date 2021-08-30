import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Book, Author, Category]),
    CacheModule.register(),
    AuthModule,
  ],
  providers: [BooksService],
  controllers: [BooksController],
  exports: [TypeOrmModule],
})
export class BooksModule {}
