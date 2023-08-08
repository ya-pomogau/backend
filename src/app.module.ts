import { Module } from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { MainAdminModule } from "./main-admin/main-admin.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./config/database-config.factory";
import configuration from "./config/configuration";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),
    MainAdminModule,
    AuthModule,
  ]
})
export class AppModule { }