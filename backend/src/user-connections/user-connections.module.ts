import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import UserConnection from './entities/user-connection.entity';

@Module({
  imports: [UserConnection],
  controllers: [OauthController],
  providers: [OauthService],
})
export class UserConnectionsModule {}
