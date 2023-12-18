import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private _getMongoUrlString(): string {
    const dbUser = this.configService.get<string>('database.username');
    const dbPass = this.configService.get<string>('database.password');
    const dbHost = this.configService.get<string>('database.host');
    const dbName = this.configService.get<string>('database.name');
    const authUriPart = `${dbUser}:${dbPass}@`;
    const isAuthDB =
      !!this.configService.get<string>(`database.username`) &&
      !!this.configService.get<string>(`database.password`);
    return `mongodb://${isAuthDB ? authUriPart : ''}${dbHost}/${dbName};`;
  }

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this._getMongoUrlString(),
    };
  }
}
