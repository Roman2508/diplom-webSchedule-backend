import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: { department: true },
      select: { department: { id: true } },
    });
  }

  findById(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: { department: true },
      select: { department: { id: true } },
    });
  }

  async create(dto: CreateUserDto) {
    const salt = await genSalt(10);

    const newUser = this.repository.create({
      department: dto.department ? { id: dto.department } : null,
      password: await hash(dto.password, salt),
      email: dto.email,
      fullName: dto.fullName,
      access: dto.access,
    });

    const user = await this.repository.save(newUser);

    const { password: pass, ...result } = user;

    return result;
  }

  async findAll() {
    return this.repository.find({
      relations: { department: true },
      select: { department: { id: true } },
    });
  }

  async update(id: number, dto: CreateUserDto) {
    const oldUserData = await this.repository.findOne({ where: { id } });

    if (!oldUserData) throw new NotFoundException('Користувача не знайдено');

    if (dto.password) {
      const salt = await genSalt(10);

      const userData = {
        ...oldUserData,
        ...dto,
        department: dto.department ? { id: dto.department } : oldUserData.department,
        password: await hash(dto.password, salt),
      };

      return this.repository.save(userData);
    } else {
      const userData = {
        ...oldUserData,
        ...dto,
        department: dto.department ? { id: dto.department } : oldUserData.department,
      };

      return this.repository.save(userData);
    }
  }

  async remove(id: number) {
    const res = await this.repository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException('Групу не знайдено');
    }

    return id;
  }
}
