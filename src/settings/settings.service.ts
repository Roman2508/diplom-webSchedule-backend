import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateColorDto } from './dto/update-color.dto';
import { SettingsEntity } from './entities/setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private repository: Repository<SettingsEntity>,
  ) {}

  find(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateSettingDto) {
    return this.repository.update({ id }, dto);
  }

  async updateColor(id: number, dto: UpdateColorDto) {
    // dto must be like this object {
    //   ["Лекції"]: "#aabbcc",
    //   ["Практичні"]: "#aabbcc",
    //   ["Лабораторні"]: "#aabbcc",
    //   ["Семінари"]: "#aabbcc",
    //   ["Екзамени"]: "#aabbcc",
    // }
    //
    //
    //
    // const lessonType = dto.type.charAt(0).toUpperCase() + dto.type.slice(1);
    // const key = `colors${lessonType}`;
    // const settings = await this.repository.findOne({ where: { id } });
    // if (!settings) throw new NotFoundException('Не знайдено');
    // return this.repository.save({ ...settings, colors: { ...settings.colors, [key]: dto.color } });
  }
}
