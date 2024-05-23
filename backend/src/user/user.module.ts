import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeController } from './me.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserSettings } from './entities/user-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSettings])],
  controllers: [MeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
