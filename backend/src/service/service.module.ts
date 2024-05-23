import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Service from './entities/service.entity';
import Area from './entities/area.entity';
import Scope from './entities/scope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Area, Scope])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
