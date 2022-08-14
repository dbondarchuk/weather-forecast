import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';

@Controller('')
export class AppController {
  @Get('')
  getUi(@Req() request: Request, @Res() response: Response): void {
    console.log(__dirname);
    response.sendFile(join(__dirname, '../../ui/build/index.html'));
  }
}
