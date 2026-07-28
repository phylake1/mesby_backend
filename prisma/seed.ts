import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('degistir-bu-sifreyi', 10);

    await prisma.admin.upsert({
        where: { email: 'admin@mesbyinsaat.com' },
        update: {},
        create: {
            email: 'admin@mesbyinsaat.com',
            password: hashedPassword,
        },
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());