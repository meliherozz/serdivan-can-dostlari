const { createStrapi } = require('@strapi/strapi');

const referenceCode = process.argv[2];

if (!referenceCode) {
  console.error('Usage: node scripts/verify-application.cjs <referenceCode>');
  process.exit(1);
}

async function main() {
  const app = await createStrapi({ appDir: process.cwd(), distDir: './dist' }).load();

  try {
  const application = await app.db.query('api::adoption-application.adoption-application').findOne({
    where: { referenceCode },
    populate: { animal: true },
  });

    console.log(JSON.stringify(application, null, 2));
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
