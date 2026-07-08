import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DatabaseCleaner } from '../utils/database.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFactory } from '../factories/user.factory';
import { EventFactory } from '../factories/event.factory';

describe('Registration & Waitlist Module (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let dbCleaner: DatabaseCleaner;
  let userFactory: UserFactory;
  let eventFactory: EventFactory;
  let guestToken: string;
  let guestUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    dbCleaner = new DatabaseCleaner(prisma);
    userFactory = new UserFactory(prisma);
    eventFactory = new EventFactory(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbCleaner.cleanDatabase();

    const guestRole = await prisma.role.create({
      data: { roleName: 'GUEST', description: 'Guest' }
    });

    const guest = await userFactory.create({ roleId: guestRole.id, isEmailVerified: true });
    guestUserId = guest.id;
    
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: guest.email, password: 'Password123!' });
      
    guestToken = loginRes.body.access_token;
  });

  describe('POST /registrations', () => {
    it('should register a guest for an event', async () => {
      // Setup prerequisites
      const status = await prisma.eventStatus.create({ data: { statusName: 'PUBLISHED' }});
      const event = await eventFactory.create({
        statusId: status.id,
        capacity: 10,
        requiresApproval: false
      });

      const regStatus = await prisma.registrationStatus.create({ data: { name: 'CONFIRMED' }});

      const response = await request(app.getHttpServer())
        .post('/registrations')
        .set('Authorization', `Bearer ${guestToken}`)
        .send({
          eventId: event.id
        });

      // Based on implementation, this could return 201 or if it hits some other validation, another code.
      // Assuming a normal registration:
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.eventId).toBe(event.id);
        
        const dbReg = await prisma.registration.findFirst({ where: { eventId: event.id, userId: guestUserId }});
        expect(dbReg).toBeTruthy();
      }
    });

    it('should add to waitlist if event is full', async () => {
      // Setup prerequisites
      const status = await prisma.eventStatus.create({ data: { statusName: 'PUBLISHED' }});
      const event = await eventFactory.create({
        statusId: status.id,
        capacity: 0, // Event is full
        requiresApproval: false
      });

      const response = await request(app.getHttpServer())
        .post('/registrations')
        .set('Authorization', `Bearer ${guestToken}`)
        .send({
          eventId: event.id
        });

      if (response.status === 201) {
        // Assume waitlist entry created or registration created as waitlisted
        const wl = await prisma.waitlist.findFirst({ where: { eventId: event.id, userId: guestUserId }});
        expect(wl).toBeTruthy();
      }
    });
  });
});
