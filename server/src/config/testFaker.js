import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding started...');

  // ===============================
  // 1. USERS
  // ===============================
  const users = [];

  for (let i = 0; i < 20; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      passwordHash: faker.internet.password(),
      role: 'USER',
      provider: 'EMAIL',
      isActive: true,
    });
  }

  const createdUsers = await prisma.user.createMany({
    data: users,
  });

  const allUsers = await prisma.user.findMany();

  // ===============================
  // 2. BARBERS
  // ===============================
  const barbers = [];

  for (let i = 0; i < 10; i++) {
    barbers.push({
      userId: allUsers[i].id, // link user as barber
      bio: faker.lorem.sentence(),
      specialty: faker.person.jobType(),
      status: 'APPROVED',
    });
  }

  await prisma.barber.createMany({
    data: barbers,
  });

  const allBarbers = await prisma.barber.findMany();

  // ===============================
  // 3. SERVICES
  // ===============================
  const services = [];

  const serviceNames = ['Hair Cut', 'Beard Trim', 'Hair Color', 'Facial', 'Head Massage'];

  for (let i = 0; i < 15; i++) {
    services.push({
      barberId: faker.helpers.arrayElement(allBarbers).id,
      name: faker.helpers.arrayElement(serviceNames),
      price: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
      durationMinutes: faker.number.int({ min: 15, max: 90 }), // minutes
    });
  }

  await prisma.service.createMany({
    data: services,
  });

  const allServices = await prisma.service.findMany();

  // ===============================
  // 4. BOOKINGS
  // ===============================
  const bookings = [];

  for (let i = 0; i < 30; i++) {
    const randomUser = faker.helpers.arrayElement(allUsers);
    const randomBarber = faker.helpers.arrayElement(allBarbers);
    const randomService = faker.helpers.arrayElement(allServices);

    bookings.push({
      userId: randomUser.id,
      barberId: randomBarber.id,
      serviceId: randomService.id,
      bookedAt: faker.date.future(),
      status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED', 'COMPLETED']),
      bookingType: 'ONLINE',
    });
  }

  await prisma.booking.createMany({
    data: bookings,
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
