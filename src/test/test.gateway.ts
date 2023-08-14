import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@WebSocketGateway()
export class TestGateway {
  constructor(private readonly testService: TestService) {}

  @SubscribeMessage('createTest')
  create(@MessageBody() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto);
  }

  @SubscribeMessage('findAllTest')
  findAll() {
    return this.testService.findAll();
  }

  @SubscribeMessage('findOneTest')
  findOne(@MessageBody() id: number) {
    return this.testService.findOne(id);
  }

  @SubscribeMessage('updateTest')
  update(@MessageBody() updateTestDto: UpdateTestDto) {
    return this.testService.update(updateTestDto.id, updateTestDto);
  }

  @SubscribeMessage('removeTest')
  remove(@MessageBody() id: number) {
    return this.testService.remove(id);
  }
}
