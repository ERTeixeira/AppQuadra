import { Injectable, UnauthorizedException } from '@nestjs/common';

type OtpEntry = {
  codigo: string;
  expiresAt: Date;
};

const OTP_TTL_MINUTES = 5;

@Injectable()
export class OtpService {
  // Em produção, substituir por Redis com TTL
  private readonly store = new Map<string, OtpEntry>();

  gerar(telefone: string): string {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    this.store.set(telefone, { codigo, expiresAt });

    // TODO: integrar com provedor de SMS (ex: Twilio, AWS SNS)
    // smsService.enviar(telefone, `Seu código AppQuadra: ${codigo}`);

    return codigo; // retornado apenas para desenvolvimento
  }

  verificar(telefone: string, codigo: string): void {
    const entry = this.store.get(telefone);

    if (!entry) {
      throw new UnauthorizedException('Nenhum OTP solicitado para este número');
    }

    if (new Date() > entry.expiresAt) {
      this.store.delete(telefone);
      throw new UnauthorizedException('OTP expirado');
    }

    if (entry.codigo !== codigo) {
      throw new UnauthorizedException('Código inválido');
    }

    this.store.delete(telefone);
  }
}
