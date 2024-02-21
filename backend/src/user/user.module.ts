import { Module } from '@nestjs/common';
import { MeModule } from './me.module';

@Module({
  imports: [MeModule],
})
export class UserModule {}
