import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

@Injectable()
export class BooksService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  findOne(id: number): Promise<Book> {
    return this.booksRepository.findOne(id);
  }

  async search(query: string): Promise<Book[]> {
    const cachedItems: Book[] = await this.cacheManager.get(query);
    if (cachedItems) {
      return cachedItems;
    }

    const config = this.configService.get<Configuration>('config');
    const result = await lastValueFrom(
      this.httpService.get(config.googleBooks.apiEndpointSearch, {
        params: { q: query, key: config.googleBooks.apiKey },
      }),
    );

    const rawItems = result.data.items;

    const items: Book[] = await Promise.all(
      rawItems.map(async (rawItem) => {
        let authors = [];
        const rawAuthors = rawItem['volumeInfo']['authors'];
        if (rawAuthors !== undefined) {
          authors = await Promise.all(
            rawAuthors.map(async (rawAuthor) => {
              let author = await this.authorsRepository.findOne({
                name: rawAuthor,
              });
              if (author === undefined) {
                const newAuthor = new Author();
                newAuthor.name = rawAuthor;
                author = await this.authorsRepository.save(newAuthor);
              }
              return author;
            }),
          );
        }
        let categories = [];
        const rawCategories = rawItem['volumeInfo']['categories'];
        if (rawCategories !== undefined) {
          categories = await Promise.all(
            rawCategories.map(async (rawCategory) => {
              let category = await this.categoriesRepository.findOne({
                name: rawCategory,
              });
              if (category === undefined) {
                const newCategory = new Category();
                newCategory.name = rawCategory;
                category = await this.categoriesRepository.save(newCategory);
              }
              return category;
            }),
          );
        }
        const externalId = rawItem['id'];
        const isbn10Identifier = rawItem['volumeInfo'][
          'industryIdentifiers'
        ].find((identifier) => identifier.type === 'ISBN_10');
        const isbn10 = isbn10Identifier ? isbn10Identifier.identifier : null;
        const isbn13Identifier = rawItem['volumeInfo'][
          'industryIdentifiers'
        ].find((identifier) => identifier.type === 'ISBN_13');
        const isbn13 = isbn13Identifier ? isbn13Identifier.identifier : null;
        const { title, description, pageCount, publisher, publishedDate } =
          rawItem['volumeInfo'];
        const thumbnail = rawItem.volumeInfo?.imageLinks?.thumbnail;
        let book = await this.booksRepository.findOne({ externalId });
        if (book === undefined) {
          const newBook = new Book();
          newBook.externalId = externalId;
          newBook.isbn10 = isbn10;
          newBook.isbn13 = isbn13;
          newBook.title = title;
          newBook.description = description;
          newBook.pageCount = pageCount;
          newBook.thumbnail = thumbnail;
          newBook.publisher = publisher;
          newBook.publishedDate = publishedDate;
          newBook.authors = authors;
          newBook.categories = categories;
          book = await this.booksRepository.save(newBook);
        }
        return book;
      }),
    );

    await this.cacheManager.set(query, items, { ttl: 60 * 60 * 24 * 30 });

    return items;
  }
}
