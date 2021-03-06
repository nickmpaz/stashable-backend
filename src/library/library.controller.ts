import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryItemDto } from './dto/create-library-item.dto';
import { UpdateLibraryItemDto } from './dto/update-library-item.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { FirebaseGuard } from 'src/auth/firebase.guard';

@Controller('library')
@UseGuards(FirebaseGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  create(
    @AuthUser()
    user: User,
    @Body()
    createLibraryDto: CreateLibraryItemDto,
  ) {
    return this.libraryService.create(createLibraryDto, user);
  }

  @Get()
  findAll(@AuthUser() user: User) {
    return this.libraryService.findAll(user);
  }

  @Get(':id')
  findOne(
    @AuthUser()
    user: User,
    @Param('id') id: string,
  ) {
    return this.libraryService.findOne(user, +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLibraryDto: UpdateLibraryItemDto,
  ) {
    return this.libraryService.update(+id, updateLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(+id);
  }
}
