import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MeController } from './me.controller';
import { UserService } from './user.service';
import { userSchema } from './entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [MeController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
