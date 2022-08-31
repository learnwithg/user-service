import { PrismaClientModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
