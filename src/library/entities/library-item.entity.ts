import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LibraryItemStatus } from '../types';

@Entity()
export class LibraryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LibraryItemStatus, nullable: true })
  status: LibraryItemStatus;

  @Column({ nullable: true })
  isOwned: boolean;

  @Column({ nullable: true })
  rating: number;

  @Column({ type: 'longtext', nullable: true })
  review: string;

  @ManyToOne(() => User, (user) => user.libraryItems)
  user: User;

  @ManyToOne(() => Book, (book) => book.libraryItems, { eager: true })
  book: Book;
}
