import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ContaRepository } from "../../backoffice/conta/domain/interfaces/conta.repository";
import { ClienteRepository } from "../../marketplace/conta/domain/interfaces/cliente.repository";
import { AuthDto } from "../dto/auth.dto";
import { JwtPayload } from "../types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly contaRepository: ContaRepository,
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async validarUsuario(input: AuthDto): Promise<JwtPayload> {
    const where = input.email
      ? { email: input.email }
      : { telefone: input.telefone };
    const [conta] = await this.contaRepository.findAll(where);

    if (!conta) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(input.senha, conta.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    return { sub: conta.id, role: "proprietario", name: conta.name };
  }

  emitirToken(payload: JwtPayload): { accessToken: string } {
    return { accessToken: this.jwtService.sign(payload) };
  }
}
