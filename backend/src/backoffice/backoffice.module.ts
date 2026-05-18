import { Module } from '@nestjs/common';
import { BackofficeContaModule } from './conta/conta.module';

@Module({
  imports: [BackofficeContaModule],
  exports: [BackofficeContaModule],
})
export class BackofficeModule {}
