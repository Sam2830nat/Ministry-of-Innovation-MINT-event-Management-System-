import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      console.error('PrismaService.onModuleInit error:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (err) {
      console.error('PrismaService.onModuleDestroy error:', err);
      throw err;
    }
  }
}
