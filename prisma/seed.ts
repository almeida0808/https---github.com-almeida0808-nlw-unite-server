import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "691047af-0f64-44c0-bf91-574ad7db854e",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "Um evento para desenvolvedores ",
    },
  });
}

seed().then(() => {
  console.log("Database seeded");
  prisma.$disconnect();
});
