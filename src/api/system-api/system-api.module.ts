import { Module } from '@nestjs/common';
import { BlogModule } from '../../core/blog/blog.module';
import { SystemApiController } from './system-api.controller';

@Module({
  imports: [BlogModule],
  controllers: [SystemApiController],
  providers: [],
})
export class SystemApiModule {}
