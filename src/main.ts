import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SpelunkerModule } from 'nestjs-spelunker';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix(AppModule.apiPrefix);
  app.useGlobalFilters(AppModule.exceptionFilter);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Cuco API')
    .setDescription('API serving accounting items')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  if (process.env.NODE_ENV === 'development') {
    void generateDependencyGraph(app);
  }

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(AppModule.port || 3000);
}

bootstrap();

async function generateDependencyGraph(app: INestApplication) {
  // Module dependencies graph
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  const mermaidEdges = edges
    .map(({ from, to }) => `  ${from.module.name}-->${to.module.name}`)
    // filter out modules from the chart if you need
    .filter(
      (edge) =>
        !edge.includes('FilteredModule') && !edge.includes('OtherExample'),
    )
    .sort();
  // write into file
  fs.writeFileSync(
    'deps.mermaid',
    `graph LR
${mermaidEdges.join('\n')}`,
  );
}
