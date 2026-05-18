import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Result } from "@quadra/shared";
import { AuthDto } from "../dto/auth.dto";
import { SolicitarOtpDto } from "../dto/solicitar-otp.dto";
import { VerificarOtpDto } from "../dto/verificar-otp.dto";
import { AuthService } from "../services/auth.service";
import { OtpService } from "../services/otp.service";

@ApiTags("Auth")
@Controller("v1/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Login do proprietário (email/telefone + senha)" })
  @ApiOkResponse({ description: "Token JWT retornado." })
  async login(@Body() input: AuthDto) {
    const payload = await this.authService.validarUsuario(input);
    return this.authService.emitirToken(payload);
  }

  @Post("solicitar-otp")
  @ApiOperation({ summary: "Solicitar OTP via SMS para o cliente" })
  @ApiCreatedResponse({ description: "OTP enviado." })
  solicitarOtp(@Body() dto: SolicitarOtpDto) {
    const codigo = this.otpService.gerar(dto.telefone);
    // Em desenvolvimento, retorna o código para facilitar testes
    return {
      message: "OTP enviado",
      ...(process.env.NODE_ENV !== "production" && { codigo }),
    };
  }

  @Post("verificar-otp")
  @ApiOperation({ summary: "Verificar OTP e obter token JWT do cliente" })
  @ApiOkResponse({ description: "Token JWT retornado." })
  async verificarOtp(@Body() input: VerificarOtpDto) {
    this.otpService.verificar(input.telefone, input.codigo);
    return Result.ok();
  }
}
