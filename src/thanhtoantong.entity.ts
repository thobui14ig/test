import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'thanhtoantong' })
export class ThanhToanTongEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tienphatsinh', default: 0 })
  tienPhatSinh: number;

  @Column({ name: 'tienthu', default: 0 })
  tienThu: number;

  @Column({ name: 'luotkham_id', nullable: true })
  luotKhamId: number;

  @Column({ name: 'benhnhan_id' })
  benhNhanId: number;
}
