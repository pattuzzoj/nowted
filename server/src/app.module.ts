import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { BlockNonBrowser } from './shared/middlewares/blockNonBrowser.middleware';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    AuthModule,
    SyncModule,
    ScheduleModule.forRoot()
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(BlockNonBrowser)
    .forRoutes("*")
  }
}