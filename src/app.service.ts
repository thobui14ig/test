import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThanhToanTongEntity } from './thanhtoantong.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { ThanhToanTongNoluotEntity } from './thanhtoantong-noluot.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(ThanhToanTongEntity)
    private thanhToanTongService: Repository<ThanhToanTongEntity>,
    @InjectRepository(ThanhToanTongNoluotEntity)
    private thanhToanTongNoLuotService: Repository<ThanhToanTongNoluotEntity>,
    private connection: DataSource,
  ) {}

  async handle() {
    await this.createThanhToanTongNoLuot();
    await this.run();
  }

  async run() {
    //b1
    const data1 = await this.thanhToanTongNoLuotService
      .createQueryBuilder()
      .where('no < 0')
      .getOne();
    //b2
    const data2 = await this.thanhToanTongNoLuotService
      .createQueryBuilder('nl')
      .where('nl.no > 0')
      .andWhere('nl.luotKhamId is null')
      .getOne();

    if (data1 && data2) {
      const thanhtoantong = await this.thanhToanTongService.findOne({
        where: {
          id: data2.thanhToanTongId,
        },
      });

      thanhtoantong.luotKhamId = data1.luotKhamId;
      //b3
      await this.thanhToanTongService.save(thanhtoantong);

      const no = data2.no + data1.no;
      //neu con no tien khach hang
      if (no > 0) {
        //chi
        await this.thanhToanTongService.save({
          benhNhanId: thanhtoantong.benhNhanId,
          luotKhamId: data1.luotKhamId,
          tienPhatSinh: 0,
          tienThu: -no,
        });
        //thu
        await this.thanhToanTongService.save({
          benhNhanId: thanhtoantong.benhNhanId,
          tienPhatSinh: 0,
          tienThu: no,
        });
        await this.tinhLaiNoLuot(thanhtoantong.benhNhanId);
        await this.run();
      } else {
        //b4
        await this.tinhLaiNoLuot(thanhtoantong.benhNhanId);
        await this.run();
      }
    }
  }

  async tinhLaiNoLuot(benhNhanId) {
    await this.deleteThanhToanTongNoLuotByBenhNhan(benhNhanId);

    const thanhToanTongWithBenhNhans = await this.thanhToanTongService.find({
      where: {
        benhNhanId: benhNhanId,
      },
    });

    await this.handlecreateThanhToanTongNoLuot(thanhToanTongWithBenhNhans);
  }

  async createThanhToanTongNoLuot() {
    const thanhtoantongs = await this.thanhToanTongService.find();
    await this.handlecreateThanhToanTongNoLuot(thanhtoantongs);
  }

  async handlecreateThanhToanTongNoLuot(thanhtoantongs) {
    for (const thanhtoantong of thanhtoantongs) {
      const { benhNhanId, luotKhamId, tienPhatSinh, tienThu, id } =
        thanhtoantong;

      if (!luotKhamId) {
        const input: any = {
          benhNhanId,
          luotKhamId: undefined,
          tienThu,
          tienPhatSinh,
          thanhToanTongId: thanhtoantong.id,
          no: tienThu - tienPhatSinh,
        };

        await this.thanhToanTongNoLuotService.save(input);
        continue;
      }

      const tttNoluot = await this.thanhToanTongNoLuotService.findOne({
        where: {
          benhNhanId,
          luotKhamId: luotKhamId ?? IsNull(),
        },
      });

      if (!tttNoluot) {
        const input: any = {
          benhNhanId,
          luotKhamId: luotKhamId ?? undefined,
          tienThu,
          tienPhatSinh,
          no: tienThu - tienPhatSinh,
        };

        await this.thanhToanTongNoLuotService.save(input);
        continue;
      }

      tttNoluot.tienPhatSinh = tttNoluot.tienPhatSinh + tienPhatSinh;
      tttNoluot.tienThu = tttNoluot.tienThu + tienThu;
      tttNoluot.no = tttNoluot.no + tienThu + tienPhatSinh;
      await this.thanhToanTongNoLuotService.save(tttNoluot);
    }
  }

  deleteThanhToanTongNoLuotByBenhNhan(benhNhanId) {
    return this.thanhToanTongNoLuotService.delete({ benhNhanId });
  }
}
