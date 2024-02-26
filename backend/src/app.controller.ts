import { exit } from '@nestjs/cli/actions';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {
    try {
      this.connectToDatabase().then(() => console.log('Connected to MongoDB'));
    } catch (error) {
      console.error('Error connecting to MongoDB', error.message);
      exit();
    }
  }
  private async connectToDatabase() {
    try {
      const mongoUri = this.configService.get<string>('MONGO_URI');
      if (mongoUri === undefined) {
        throw new Error('MONGO_URI is undefined');
      }
      await mongoose.connect(mongoUri, {});
    } catch (error) {
      return error;
    }
  }
}
