import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Add methods to handle user-related logic
  findAll() {
    // Logic to find all users
  }

  findOne(id: string) {
    // Logic to find a user by ID
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password, role, status } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        role,
        status,
        password: hashedPassword,
      },
    });

    if (typeof newUser.id !== 'string') {
      throw new Error('User ID must be a string');
    }

    if (newUser.role === UserRole.TEACHER) {
      await this.prisma.teachers.create({
        data: {
          name,
          userId: newUser.id,
        } ,
      });
    }

    if (newUser.role === UserRole.STUDENT) {
      await this.prisma.students.create({
        data: {
          name,
          userId: newUser.id,
        },
      });
    }

    if (newUser.role === UserRole.PARENT) {
      await this.prisma.parents.create({
        data: {
          name,
          userId: newUser.id,
        } ,
      });
    }

    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, name, password, role, status } = updateUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        status,
        password: hashedPassword,
        teacher: {
          updateMany: {
            where: { userId: id },
            data: {
              name,
            },
          }
        },
        student: {
          updateMany: {
            where: { userId: id },
            data: {
              name,
            },
          }
        },
        parent: {
          updateMany: {
            where: { userId: id },
            data: {
              name,
              // phone,
              // address,
              // bloodType,
            },
          }
        },
      },
      include: {
        teacher: true,
        student: true,
        parent: true,
      }
    });
  }

  remove(id: string) {
    // Logic to remove a user
  }
}
