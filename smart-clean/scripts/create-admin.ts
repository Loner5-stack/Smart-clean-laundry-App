import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@smartclean.com";
  const password = "password123";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists with email: ${email}`);
    
    // Ensure they have the ADMIN role
    if (existingAdmin.role !== 'ADMIN') {
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });
      console.log('Updated existing user role to ADMIN.');
    }
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new Admin user
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: email,
      password: hashedPassword,
      role: "ADMIN",
      phone: "+1234567890",
      address: "Admin Headquarters",
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}`);
  console.log('You can now log into the frontend dashboard.');
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
