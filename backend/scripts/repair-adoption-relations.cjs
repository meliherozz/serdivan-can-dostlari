const { createStrapi } = require('@strapi/strapi');

async function main() {
  const app = await createStrapi({ appDir: process.cwd(), distDir: './dist' }).load();

  try {
    const applicationUid = 'api::adoption-application.adoption-application';
    const animalUid = 'api::animal.animal';
    const applications = await app.db.query(applicationUid).findMany({
      populate: { animal: true },
    });

    const repaired = [];

    for (const application of applications) {
      if (!application.animal?.documentId) continue;

      let draftAnimal = await app.documents(animalUid).findOne({
        documentId: application.animal.documentId,
        status: 'draft',
      });

      if (!draftAnimal) {
        draftAnimal = await app.documents(animalUid).update({
          documentId: application.animal.documentId,
          status: 'draft',
          data: {
            name: application.animal.name,
            slug: application.animal.slug,
            species: application.animal.species,
            gender: application.animal.gender,
            ageGroup: application.animal.ageGroup,
            size: application.animal.size,
            shortDescription: application.animal.shortDescription ?? undefined,
            description: application.animal.description ?? undefined,
            personality: application.animal.personality ?? undefined,
            vaccinated: application.animal.vaccinated,
            neutered: application.animal.neutered,
            microchipped: application.animal.microchipped,
            adoptionStatus: application.animal.adoptionStatus,
            featured: application.animal.featured,
            arrivalDate: application.animal.arrivalDate,
          },
        });
      }

      await app.documents(applicationUid).update({
        documentId: application.documentId,
        data: {
          animal: {
            documentId: draftAnimal.documentId,
            status: 'draft',
          },
        },
      });

      repaired.push({
        referenceCode: application.referenceCode,
        animal: draftAnimal.name,
        animalId: draftAnimal.id,
      });
    }

    console.log(JSON.stringify({ repaired }, null, 2));
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
