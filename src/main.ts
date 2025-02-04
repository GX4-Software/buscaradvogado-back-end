import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { EnvService } from "./commons/env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);

  app.enableCors({
    origin: [envService.get("CLIENT_URL")],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Buscar Advogado")
    .setVersion("1.0")
    .setDescription("API para buscar advogados")
    .addBearerAuth()
    .addTag("buscar-advogado")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory, {
    jsonDocumentUrl: "swagger/json",
  });

  app.use(
    "/reference",
    apiReference({
      spec: {
        url: "/swagger/json",
      },
    })
  );

  app.use(helmet());


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  await app.listen(envService.get("PORT"));
}
bootstrap();