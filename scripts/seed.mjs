import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config'; 

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@dorm.com';
  const adminPassword = 'adminpassword123'; // Must be at least 8 chars
  
  // Wipe existing ones
  await prisma.account.deleteMany({ where: {} });
  await prisma.user.deleteMany({ where: {} });

  // Create admin user
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'System Admin',
      role: 'ADMIN',
      emailVerified: true
    }
  });

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create account
  await prisma.account.create({
    data: {
      userId: user.id,
      accountId: adminEmail,
      providerId: 'credential',
      password: hashedPassword
    }
  });

  console.log("✅ Admin user created securely!");
  console.log("Email:", adminEmail);
  console.log("Password:", adminPassword);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
