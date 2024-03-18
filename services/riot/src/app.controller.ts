import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  onAction(): string {
    return this.appService.getHello();
  }

  @Post()
  onReaction(): string {
    return this.appService.getHello();
  }
}
