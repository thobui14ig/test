import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThanhToanTongNoluotEntity } from './thanhtoantong-noluot.entity';
import { ThanhToanTongEntity } from './thanhtoantong.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThanhToanTongNoluotEntity, ThanhToanTongEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '103.79.143.150',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'ttt',
      entities: [ThanhToanTongNoluotEntity, ThanhToanTongEntity],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
