import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    // Configurações consistentes com o Google Authenticator
    authenticator.options = {
      step: 30, // duração do token (em segundos)
      window: 2, // tolerância de tempo (anterior/próximo)
      digits: 6, // número de dígitos
    };
  }

  async register(email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException({ message: 'E-mail já está em uso.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    return this.userService.create({ email, password: hashed });
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Senha inválida');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      mfaEnabled: user.mfaEnabled,
    };
  }

  async generateMfaSetup(userId: string, email: string) {
    const secret = authenticator.generateSecret();

    const otpauth = authenticator.keyuri(email, 'MFA Teste App', secret);
    const qrCode = await qrcode.toDataURL(otpauth);

    await this.userService.updateSecret(userId, secret);

    return {
      secret,
      otpauth,
      qrCode,
    };
  }

  async verifyMfa(userId: string, code: string): Promise<{ message: string }> {
    const user = await this.userService.findById(userId);
    if (!user?.mfaSecret) {
      throw new UnauthorizedException('MFA não configurado.');
    }

    const cleanSecret = user.mfaSecret.trim();

    const isValid = authenticator.check(code, cleanSecret);

    if (!isValid) {
      throw new UnauthorizedException('Código MFA inválido ou expirado.');
    }

    await this.userService.enableMfa(userId, cleanSecret);

    return { message: 'MFA ativado com sucesso' };
  }
}
