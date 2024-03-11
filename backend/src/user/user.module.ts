import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeController } from './me.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import UserSettings from './entities/user.setting';
import { UserToken } from './entities/user.token';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSettings, UserToken])],
  controllers: [MeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
