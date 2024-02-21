import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AboutModule } from './about/about.module';

@Module({
  imports: [AuthModule, UserModule, AboutModule],
  controllers: [AppController, AuthController, AboutController],
  providers: [AppService, UserService, AboutService],
})
export class AppModule {}
