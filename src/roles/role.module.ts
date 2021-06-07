import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
