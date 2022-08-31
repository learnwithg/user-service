import { PrismaClientService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClientService) {}
}
