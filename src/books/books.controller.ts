import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FirebaseGuard } from 'src/auth/firebase.guard';
import { BooksService } from './books.service';

@Controller('books')
@UseGuards(FirebaseGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post('/search')
  async search(@Body() body: { query: string }) {
    const { query } = body;
    return this.booksService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }
}
