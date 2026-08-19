const { createStrapi } = require('@strapi/strapi');

const referenceCode = process.argv[2];

if (!referenceCode) {
  console.error('Usage: node scripts/test-application-workflow.cjs <referenceCode>');
  process.exit(1);
}

const applicationUid = 'api::adoption-application.adoption-application';
const animalUid = 'api::animal.animal';

async function getApplication(app) {
  const application = await app.db.query(applicationUid).findOne({
    where: { referenceCode },
    populate: { animal: true },
  });

  if (!application) {
    throw new Error(`Application not found: ${referenceCode}`);
  }

  return application;
}

async function getAnimalVersions(app, animalDocumentId) {
  const versions = await app.db.query(animalUid).findMany({
    where: { documentId: animalDocumentId },
    orderBy: { id: 'asc' },
  });

  return versions.map((animal) => ({
    id: animal.id,
    documentId: animal.documentId,
    name: animal.name,
    adoptionStatus: animal.adoptionStatus,
    publishedAt: animal.publishedAt,
  }));
}

async function snapshot(app, label) {
  const application = await getApplication(app);
  const animalDocumentId = application.animal?.documentId;

  return {
    label,
    applicationStatus: application.applicationStatus,
    animal: application.animal
      ? {
          name: application.animal.name,
          documentId: application.animal.documentId,
          adoptionStatus: application.animal.adoptionStatus,
        }
      : null,
    animalVersions: animalDocumentId ? await getAnimalVersions(app, animalDocumentId) : [],
  };
}

async function main() {
  const app = await createStrapi({ appDir: process.cwd(), distDir: './dist' }).load();

  try {
    const initial = await getApplication(app);
    const snapshots = [await snapshot(app, 'initial')];

    for (const applicationStatus of ['reviewing', 'contacted', 'approved']) {
      await app.documents(applicationUid).update({
        documentId: initial.documentId,
        data: { applicationStatus },
      });
      snapshots.push(await snapshot(app, applicationStatus));
    }

    console.log(JSON.stringify({ referenceCode, snapshots }, null, 2));
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
