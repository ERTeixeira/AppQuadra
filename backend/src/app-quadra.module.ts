import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BackofficeModule } from './backoffice/backoffice.module';
import { DatabaseModule } from './common/database/database.module';
import { HttpModule } from './common/http/http.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    // Global/Common Modules
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HttpModule,

    // Auth
    AuthModule,

    // Bounded Contexts
    BackofficeModule,
    MarketplaceModule,
  ],
})
export class AppQuadraModule {}
