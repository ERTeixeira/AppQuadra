import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BackofficeContaModule } from '../backoffice/conta/conta.module';
import { ContaRepository } from '../backoffice/conta/domain/interfaces/conta.repository';
import { MarketplaceContaModule } from '../marketplace/conta/conta.module';
import { ClienteRepository } from '../marketplace/conta/domain/interfaces/cliente.repository';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { OtpService } from './services/otp.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '8h' },
    }),
    BackofficeContaModule,
    MarketplaceContaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    JwtStrategy,
    {
      provide: ContaRepository,
      useExisting: 'IContaRepository',
    },
    {
      provide: ClienteRepository,
      useExisting: 'IClienteRepository',
    },
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
