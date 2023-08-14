import { Test, TestingModule } from '@nestjs/testing';
import { TestGateway } from './test.gateway';
import { TestService } from './test.service';

describe('TestGateway', () => {
  let gateway: TestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestGateway, TestService],
    }).compile();

    gateway = module.get<TestGateway>(TestGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
