import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "../auth/auth.module";
import { MainAdminController } from './main-admin.controller';
import { MainAdmin } from './main-admin.model';
import { MainAdminService } from './main-admin.service';

@Module({
  controllers: [MainAdminController],
  providers: [MainAdminService],
  imports: [
    SequelizeModule.forFeature([MainAdmin]),
    forwardRef(() => AuthModule),
  ],
  exports: [
    MainAdminService,
  ]
})
export class MainAdminModule { }