import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { actionList, reactionList } from './entities/action-reaction.list';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('onAction')
  onAction(@Body() body: any): any {
    console.log(body);
    return body;
  }

  @Post('onReaction')
  onReaction(@Body() body: any): any {
    console.log(body);
    return body;
  }

  @Post('onError')
  onError(@Body() body: any): any {
    console.log(body + 'error');
    return body;
  }
}
