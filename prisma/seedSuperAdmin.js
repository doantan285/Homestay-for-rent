const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function createSuperAdmin() {
    try {
        const email = 'doantan@gmail.com';
        const password = 'doanbatan';

        const hashedPassword = await bcrypt.hash(password, 10);

        const superAdmin = await prisma.admin.create({
            data: {
                email: email,
                name: 'Đoàn Tần',
                hashedPassword: hashedPassword,
                role: 'SUPERADMIN',
                image: null,
                phoneNumber: null,
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
