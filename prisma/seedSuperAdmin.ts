import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createSuperAdmin() {
    try {
        const email = 'doantan@gmail.com';
        const password = 'doantan';

        const hashedPassword = await bcrypt.hash(password, 10);

        const superAdmin = await prisma.admin.create({
            data: {
                email: email,
                hashedPassword: hashedPassword,
                role: 'SUPERADMIN',
                image: null,
            },
        });

        console.log('Super admin created:', superAdmin);
    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();