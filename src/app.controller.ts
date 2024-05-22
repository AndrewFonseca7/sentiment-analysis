import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Response } from 'express';

@ApiTags('/')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Return static html',
    description: 'Return a static html file where you can test the API',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a static html file',
  })
  serveStaticHtml(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
