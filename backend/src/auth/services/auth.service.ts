import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ContaRepository } from '../../backoffice/conta/domain/interfaces/conta.repository';
import { ClienteRepository } from '../../marketplace/conta/domain/interfaces/cliente.repository';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly contaRepository: ContaRepository,
    private readonly clienteRepository: ClienteRepository,
  ) {}

  // Backoffice: valida email + senha + cnpj
  async validarProprietario(email: string, senha: string, cnpj: string): Promise<JwtPayload> {
    const conta = await this.contaRepository.findByEmail(email);

    if (!conta || conta.cnpj !== cnpj) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, conta.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return { sub: conta.id, role: 'proprietario', name: conta.name };
  }

  // Marketplace: valida telefone + OTP (chamado após OtpService.verificar)
  async validarCliente(telefone: string): Promise<JwtPayload> {
    const cliente = await this.clienteRepository.findByTelefone(telefone);

    if (!cliente) {
      throw new UnauthorizedException('Telefone não cadastrado');
    }

    return { sub: cliente.id, role: 'cliente', name: cliente.name };
  }

  emitirToken(payload: JwtPayload): { accessToken: string } {
    return { accessToken: this.jwtService.sign(payload) };
  }
}
