import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  "@root": __dirname.concat("../"),
  "@database": __dirname.concat("/database"),
  "@modules": __dirname.concat("/modules"),
  "@shared": __dirname.concat("/shared"),
  "@utils": __dirname.concat("/utils"),
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ["https://nowted-showcase.vercel.app", "*"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.init();
  await app.listen(process.env["PORT"]! ?? 4000);
}
bootstrap();
