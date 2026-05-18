import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginBackofficeDto } from '../dto/login-backoffice.dto';
import { SolicitarOtpDto } from '../dto/solicitar-otp.dto';
import { VerificarOtpDto } from '../dto/verificar-otp.dto';
import { AuthService } from '../services/auth.service';
import { OtpService } from '../services/otp.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('backoffice/login')
  @ApiOperation({ summary: 'Login do proprietário (email + senha + cnpj)' })
  @ApiOkResponse({ description: 'Token JWT retornado.' })
  async loginBackoffice(@Body() dto: LoginBackofficeDto) {
    const payload = await this.authService.validarProprietario(dto.email, dto.senha, dto.cnpj);
    return this.authService.emitirToken(payload);
  }

  @Post('marketplace/solicitar-otp')
  @ApiOperation({ summary: 'Solicitar OTP via SMS para o cliente' })
  @ApiCreatedResponse({ description: 'OTP enviado.' })
  solicitarOtp(@Body() dto: SolicitarOtpDto) {
    const codigo = this.otpService.gerar(dto.telefone);
    // Em desenvolvimento, retorna o código para facilitar testes
    return { message: 'OTP enviado', ...(process.env.NODE_ENV !== 'production' && { codigo }) };
  }

  @Post('marketplace/verificar-otp')
  @ApiOperation({ summary: 'Verificar OTP e obter token JWT do cliente' })
  @ApiOkResponse({ description: 'Token JWT retornado.' })
  async verificarOtp(@Body() dto: VerificarOtpDto) {
    this.otpService.verificar(dto.telefone, dto.codigo);
    const payload = await this.authService.validarCliente(dto.telefone);
    return this.authService.emitirToken(payload);
  }
}
