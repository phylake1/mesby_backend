import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = process.env.SEED_ADMIN_EMAIL ?? 'mesbyinsaat@gmail.com';
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!password) {
        throw new Error(
            'SEED_ADMIN_PASSWORD env değişkeni tanımlı değil. Seed işlemi güvenlik nedeniyle iptal edildi.',
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: { email, password: hashedPassword },
    });

    console.log(`Admin kullanıcısı hazır: ${email}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());