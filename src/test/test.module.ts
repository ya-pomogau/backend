import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestGateway } from './test.gateway';

@Module({
  providers: [TestGateway, TestService]
})
export class TestModule {}
