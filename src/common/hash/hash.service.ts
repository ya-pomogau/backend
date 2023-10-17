import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, configuration().saltRounds);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
