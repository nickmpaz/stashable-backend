import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryItem } from './entities/library-item.entity';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryItem]), BooksModule],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [TypeOrmModule],
})
export class LibraryModule {}
