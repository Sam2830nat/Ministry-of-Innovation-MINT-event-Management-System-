import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool?: Pool;

  constructor() {
    // Create a pg Pool using DATABASE_URL; adapter-pg requires a Pool
    const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING || '';
    const pool = new Pool(connectionString ? { connectionString } : undefined);
    const adapter = new PrismaPg(pool);
    super({ adapter, log: ['warn', 'error'] });
    this.pool = pool;
  }
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
    try {
      if (this.pool) await this.pool.end();
    } catch (err) {
      console.error('Error closing pg pool in PrismaService:', err);
    }
  }
}
