import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { CreateMainAdminDto } from 'src/main-admin/dto/create-main-admin.dto';
import { MainAdmin } from 'src/main-admin/main-admin.model';
import { MainAdminService } from 'src/main-admin/main-admin.service';

@Injectable()
export class AuthService {

  constructor(private mainAdminService: MainAdminService,
    private jwtService: JwtService) { }

  async login(mainAdminDto: CreateMainAdminDto) {
    const mainAdmin = await this.validateUser(mainAdminDto)
    return this.generateToken(mainAdmin)
  }

  private async generateToken(mainAdmin: MainAdmin) {
    const payload = { email: mainAdmin.username, id: mainAdmin.id}
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(mainAdminDto: CreateMainAdminDto) {
    const mainAdmin = await this.mainAdminService.authorization({username: mainAdminDto.username, password: mainAdminDto.password});
    const passwordEquals = await bcrypt.compare(mainAdminDto.password, mainAdmin.password);
    if (mainAdmin && passwordEquals) {
      return mainAdmin;
    }
    throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
  }
}