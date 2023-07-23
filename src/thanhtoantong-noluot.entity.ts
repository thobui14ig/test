import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'thanhtoantong_noluot' })
export class ThanhToanTongNoluotEntity {
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

  @Column({ name: 'no', default: 0 })
  no: number;

  @Column({ name: 'thanhtoantong_id', nullable: true, default: null })
  thanhToanTongId: number;
}
