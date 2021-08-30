import { PartialType } from '@nestjs/mapped-types';
import { LibraryItemStatus } from '../types';
import { CreateLibraryItemDto } from './create-library-item.dto';

export class UpdateLibraryItemDto extends PartialType(CreateLibraryItemDto) {
  status: LibraryItemStatus;
  isOwned: boolean;
  rating: number;
  review: string;
}
