import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario ADMIN por defecto
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@consultorio.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@consultorio.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Crear pacientes de prueba
  const paciente1 = await prisma.paciente.upsert({
    where: { dni: '12345678' },
    update: {},
    create: {
      nombre: 'Juan Pérez',
      dni: '12345678',
      telefono: '1122334455',
    },
  });

  const paciente2 = await prisma.paciente.upsert({
    where: { dni: '87654321' },
    update: {},
    create: {
      nombre: 'Ana Gómez',
      dni: '87654321',
      telefono: '1199887766',
    },
  });

  console.log({ admin, paciente1, paciente2 });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
