const { createStrapi } = require('@strapi/strapi');

const referenceCode = process.argv[2];

if (!referenceCode) {
  console.error('Usage: node scripts/verify-content-manager-response.cjs <referenceCode>');
  process.exit(1);
}

async function main() {
  const app = await createStrapi({ appDir: process.cwd(), distDir: './dist' }).load();

  try {
    const uid = 'api::adoption-application.adoption-application';
    const application = await app.db.query(uid).findOne({
      where: { referenceCode },
      populate: { animal: true },
    });

    if (!application) {
      throw new Error(`Application not found: ${referenceCode}`);
    }

    const document = await app.documents(uid).findOne({
      documentId: application.documentId,
      status: 'draft',
      populate: {
        animal: {
          fields: ['documentId', 'name', 'slug', 'publishedAt'],
        },
      },
    });

    const formatted = await app
      .plugin('content-manager')
      .service('document-metadata')
      .formatDocumentWithMetadata(uid, document);

    console.log(JSON.stringify(formatted, null, 2));
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
