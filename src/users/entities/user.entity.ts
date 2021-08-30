import { LibraryItem } from 'src/library/entities/library-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sub: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => LibraryItem, (libraryItem) => libraryItem.user)
  libraryItems: LibraryItem[];
}
