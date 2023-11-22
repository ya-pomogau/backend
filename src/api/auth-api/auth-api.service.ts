import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class AuthApiService {
  constructor(@Inject() private readonly usersRepo: Users) {
  }
}
