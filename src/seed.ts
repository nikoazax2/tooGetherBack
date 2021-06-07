import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RoleService } from './roles/role.service';

async function bootstrap() {
  NestFactory.createApplicationContext(AppModule)
    .then((appContext) => {
      const roleService = appContext.get(RoleService);
      roleService.seed();
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
