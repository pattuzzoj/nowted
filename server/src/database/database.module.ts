import { Module } from "@nestjs/common";
import { db } from "drizzle.config";

@Module({
  providers: [
    {
      provide: "DATABASE",
      useValue: db
    }
  ],
  exports: [
    "DATABASE"
  ]
})
export class DatabaseModule {}