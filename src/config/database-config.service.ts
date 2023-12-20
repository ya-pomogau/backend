import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { DatabaseConfiguration } from '../common/types/system.types';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  private _getMongoUrlString(): string {
    const { username, password, port, name, host } =
      this.configService.get<DatabaseConfiguration>('database');
    const authUriPart = `${username}:${password}@`;
    const isAuthDB = !!username && !!password;
    return `mongodb://${isAuthDB ? authUriPart : ''}${host}:${port}/${name}`;
  }

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this._getMongoUrlString(),
    };
  }
}
