import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateLibraryItemDto } from './dto/create-library-item.dto';
import { UpdateLibraryItemDto } from './dto/update-library-item.dto';
import { LibraryItem } from './entities/library-item.entity';

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(LibraryItem)
    private libraryItemsRepository: Repository<LibraryItem>,
  ) {}

  async create(createLibraryDto: CreateLibraryItemDto, user: User) {
    const { bookId } = createLibraryDto;
    const book = await this.booksRepository.findOne(bookId);

    let libraryItem = await this.libraryItemsRepository.findOne({ user, book });
    if (libraryItem) {
      return;
    }
    libraryItem = new LibraryItem();
    libraryItem.user = user;
    libraryItem.book = book;
    return this.libraryItemsRepository.save(libraryItem);
  }

  findAll(user: User) {
    return this.libraryItemsRepository.find({ user });
  }

  // todo DTO
  async findOne(user: User, bookId: number) {
    this.logger.log({ user });
    const book = await this.booksRepository.findOne(bookId);
    let libraryItem = await this.libraryItemsRepository.findOne({ user, book });
    return libraryItem;
  }

  async update(id: number, updateLibraryDto: UpdateLibraryItemDto) {
    const libraryItem = await this.libraryItemsRepository.findOne(id);
    libraryItem.status = updateLibraryDto.status;
    libraryItem.isOwned = updateLibraryDto.isOwned;
    libraryItem.rating = updateLibraryDto.rating;
    libraryItem.review = updateLibraryDto.review;
    return this.libraryItemsRepository.save(libraryItem);
  }

  remove(id: number) {
    return this.libraryItemsRepository.delete(id);
  }
}
