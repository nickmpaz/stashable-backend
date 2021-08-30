import { LibraryItem } from 'src/library/entities/library-item.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Author } from './author.entity';
import { Category } from './category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: string;

  @Column({ nullable: true })
  isbn10: string;

  @Column({ nullable: true })
  isbn13: string;

  @Column()
  title: string;

  @Column('longtext', { nullable: true })
  description: string;

  @Column({ nullable: true })
  pageCount: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  publishedDate: string;

  @ManyToMany(() => Author, (author) => author.books, { eager: true })
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => Category, (category) => category.books, { eager: true })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => LibraryItem, (libraryItem) => libraryItem.book)
  libraryItems: LibraryItem[];
}
