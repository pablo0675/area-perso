import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DATABASE_CONFIG } from './database';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AboutModule } from './about/about.module';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';
import { WorkflowModule } from './workflow/workflow.module';
import { ServiceModule } from './service/service.module';
import { UserConnectionsService } from './user-connections/user-connections.service';
import { UserConnectionsController } from './user-connections/user-connections.controller';
import { UserConnectionsModule } from './user-connections/user-connections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DATABASE_CONFIG),
    AuthModule,
    UserModule,
    AboutModule,
    WorkflowModule,
    ServiceModule,
    UserConnectionsModule,
  ],
  controllers: [WorkflowController, UserConnectionsController],
  providers: [WorkflowService, UserConnectionsService],
})
export class AppModule {}
