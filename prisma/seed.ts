import { PrismaClient } from '@prisma/client';
import { rolesAndPermissions } from './data/roles_and_permissions';

const prismaClient = new PrismaClient();

export async function seed() {
  await prismaClient.$transaction(async (prisma: PrismaClient) => {
    await prisma.rolesAndPermissionsConfig.createMany({
      data: rolesAndPermissions,
    });
  });

  return 'Done! ';
}

seed()
  .then((result) => console.log(result))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => await prismaClient.$disconnect());
