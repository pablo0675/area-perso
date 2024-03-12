import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeController } from './me.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserSettings } from './entities/user-setting.entity';
import { UserToken } from './entities/user-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSettings, UserToken])],
  controllers: [MeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
