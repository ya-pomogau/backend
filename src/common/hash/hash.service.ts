import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  private static _saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    HashService._saltRounds = configService.get<number>(`password.saltRounds`);
  }

  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, HashService._saltRounds);
  }

  static async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
