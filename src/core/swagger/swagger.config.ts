import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static applyDocument(app: INestApplication) {
    const document = SwaggerModule.createDocument(
      app,
      this.createDocumentBuilder().build(),
    );

    SwaggerModule.setup('doc', app, document);
  }

  private static createDocumentBuilder(): DocumentBuilder {
    return new DocumentBuilder()
      .setTitle('soul report backend API')
      .setVersion('0.0.1');
  }
}
