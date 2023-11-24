import { Module } from '@nestjs/common';
import { PoliticsService } from './politics.service';
import { PoliticsController } from './politics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Politic } from './entities/politic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Politic])],
  controllers: [PoliticsController],
  providers: [PoliticsService],
})
export class PoliticsModule {}
