import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { ChatsService } from './chats.service';
import { ApiOperation } from '@nestjs/swagger';
@Injectable()
export class CronService {
  constructor(private readonly chatsService: ChatsService) {
    this.setupCronJobs();
  }
  @ApiOperation({ summary: 'Настроить задачи Cron' })
  private setupCronJobs() {
    // Запустить задачу каждый день в полночь (00:00)
    cron.schedule('0 0 * * *', async () => {
      console.log('Running daily chat cleanup task...');
      await this.chatsService.deleteExpiredChats();
    });
  }
}
