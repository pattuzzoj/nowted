import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import PendingRepository from './pending.repository';

@Module({
  providers: [PendingRepository],
  imports: [DatabaseModule],
  exports: [PendingRepository],
})
export default class PendingModule {}
