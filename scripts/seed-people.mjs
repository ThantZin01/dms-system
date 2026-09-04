import { PrismaClient } from '@prisma/client';
import 'dotenv/config'; 

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding dummy people...");
  
  await prisma.person.createMany({
    data: [
      {
        fullName: "John Doe",
        contactNumber: "09123456789",
        roomNumber: "101",
        isActive: true,
      },
      {
        fullName: "Jane Smith",
        contactNumber: "09876543210",
        roomNumber: "102",
        isActive: true,
      },
      {
        fullName: "Michael Johnson",
        contactNumber: "09444555666",
        roomNumber: "103",
        isActive: true,
      }
    ],
    skipDuplicates: true
  });

  console.log("✅ Added 3 dummy people successfully!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
