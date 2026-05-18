import { Module } from '@nestjs/common';
import { MarketplaceContaModule } from './conta/conta.module';

@Module({
  imports: [MarketplaceContaModule],
  exports: [MarketplaceContaModule],
})
export class MarketplaceModule {}
