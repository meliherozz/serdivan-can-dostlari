const { createStrapi } = require('@strapi/strapi');

const applicationUid = 'api::adoption-application.adoption-application';
const animalUid = 'api::animal.animal';
const apiUrl = process.env.STRAPI_PUBLIC_URL || 'http://localhost:1337';

const stamp = Date.now().toString(36);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function createAnimal(app, slug, name) {
  const draft = await app.documents(animalUid).create({
    data: {
      name,
      slug,
      species: 'dog',
      gender: 'female',
      ageGroup: 'young',
      size: 'medium',
      shortDescription: 'Workflow smoke test animal.',
      description: 'Fictional workflow smoke test animal.',
      personality: 'Calm test record.',
      vaccinated: true,
      neutered: false,
      microchipped: false,
      adoptionStatus: 'available',
      featured: false,
      arrivalDate: '2026-08-19',
    },
  });

  await app.documents(animalUid).publish({ documentId: draft.documentId });
  return draft;
}

async function createApplication(app, animalDocumentId, suffix) {
  return app.documents(applicationUid).create({
    data: {
      animal: {
        documentId: animalDocumentId,
        status: 'draft',
      },
      referenceCode: `WF-${stamp}-${suffix}`,
      fullName: `Workflow Test ${suffix}`,
      phone: '0555 200 20 20',
      email: `workflow-${stamp}-${suffix}@example.invalid`,
      city: 'Sakarya',
      district: 'Serdivan',
      housingType: 'apartment',
      hasGarden: false,
      hasOtherPets: false,
      otherPetsDescription: '',
      previousPetExperience: 'Workflow smoke test experience.',
      reasonForAdoption: 'Workflow smoke test reason with sufficient length.',
      consentAccepted: true,
      applicationStatus: 'new',
    },
  });
}

async function getApplication(app, documentId) {
  return app.documents(applicationUid).findOne({
    documentId,
    populate: {
      animal: {
        fields: ['documentId', 'name', 'adoptionStatus'],
      },
    },
  });
}

async function getAnimalVersions(app, animalDocumentId) {
  return app.db.query(animalUid).findMany({
    where: { documentId: animalDocumentId },
    orderBy: { id: 'asc' },
  });
}

async function updateApplication(app, documentId, applicationStatus) {
  return app.documents(applicationUid).update({
    documentId,
    data: { applicationStatus },
  });
}

async function expectUpdateFailure(app, documentId, applicationStatus, label) {
  try {
    await updateApplication(app, documentId, applicationStatus);
  } catch (error) {
    return error.message;
  }

  throw new Error(`${label} should have failed.`);
}

async function expectAnimalStatus(app, animalDocumentId, expected, label) {
  const versions = await getAnimalVersions(app, animalDocumentId);
  assert(versions.length > 0, `${label}: animal versions missing`);
  assert(
    versions.every((animal) => animal.adoptionStatus === expected),
    `${label}: expected all animal versions to be ${expected}, got ${versions
      .map((animal) => `${animal.id}:${animal.adoptionStatus}`)
      .join(', ')}`
  );
}

async function submitPublicApplication(slug, suffix) {
  const response = await fetch(`${apiUrl}/api/adoption-applications/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      animalSlug: slug,
      fullName: `Public Workflow ${suffix}`,
      phone: '0555 300 30 30',
      email: `public-workflow-${stamp}-${suffix}@example.invalid`,
      city: 'Sakarya',
      district: 'Serdivan',
      housingType: 'apartment',
      hasGarden: false,
      hasOtherPets: false,
      otherPetsDescription: '',
      previousPetExperience: 'Public workflow smoke test experience.',
      reasonForAdoption: 'Public workflow smoke test reason with enough characters.',
      consentAccepted: true,
      website: '',
      applicationStatus: 'approved',
      internalNotes: 'client should not set this',
      referenceCode: 'client-should-not-set-this',
    }),
  });

  const text = await response.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  return { status: response.status, body };
}

async function main() {
  const app = await createStrapi({ appDir: process.cwd(), distDir: './dist' }).load();

  try {
    const primaryAnimal = await createAnimal(app, `workflow-primary-${stamp}`, `Workflow Primary ${stamp}`);
    const [applicationA, applicationB, applicationC] = await Promise.all([
      createApplication(app, primaryAnimal.documentId, 'A'),
      createApplication(app, primaryAnimal.documentId, 'B'),
      createApplication(app, primaryAnimal.documentId, 'C'),
    ]);

    await expectAnimalStatus(app, primaryAnimal.documentId, 'available', 'initial');

    await updateApplication(app, applicationA.documentId, 'reviewing');
    await expectAnimalStatus(app, primaryAnimal.documentId, 'available', 'after reviewing');

    await updateApplication(app, applicationA.documentId, 'contacted');
    await expectAnimalStatus(app, primaryAnimal.documentId, 'available', 'after contacted');

    await updateApplication(app, applicationA.documentId, 'approved');
    await expectAnimalStatus(app, primaryAnimal.documentId, 'adopted', 'after approved');

    const [approvedA, cancelledB, cancelledC] = await Promise.all([
      getApplication(app, applicationA.documentId),
      getApplication(app, applicationB.documentId),
      getApplication(app, applicationC.documentId),
    ]);

    assert(approvedA.applicationStatus === 'approved', 'A should be approved');
    assert(cancelledB.applicationStatus === 'cancelled', 'B should be cancelled');
    assert(cancelledC.applicationStatus === 'cancelled', 'C should be cancelled');
    assert(cancelledB.internalNotes?.includes('System: Another adoption application'), 'B should have system note');
    assert(cancelledC.internalNotes?.includes('System: Another adoption application'), 'C should have system note');

    const invalidBApproved = await expectUpdateFailure(app, applicationB.documentId, 'approved', 'B cancelled -> approved');
    const invalidAReviewing = await expectUpdateFailure(app, applicationA.documentId, 'reviewing', 'A approved -> reviewing');

    const adoptedPublicSubmit = await submitPublicApplication(primaryAnimal.slug, 'adopted');
    assert(adoptedPublicSubmit.status === 400, `Expected adopted public submit 400, got ${adoptedPublicSubmit.status}`);

    const directAnimal = await createAnimal(app, `workflow-direct-${stamp}`, `Workflow Direct ${stamp}`);
    const directApplication = await createApplication(app, directAnimal.documentId, 'DIRECT');
    const invalidDirectApproved = await expectUpdateFailure(
      app,
      directApplication.documentId,
      'approved',
      'new -> approved'
    );
    await expectAnimalStatus(app, directAnimal.documentId, 'available', 'after invalid direct approved');

    const rejectedAnimal = await createAnimal(app, `workflow-rejected-${stamp}`, `Workflow Rejected ${stamp}`);
    const rejectedApplication = await createApplication(app, rejectedAnimal.documentId, 'REJECTED');
    await updateApplication(app, rejectedApplication.documentId, 'rejected');
    await expectAnimalStatus(app, rejectedAnimal.documentId, 'available', 'after rejected');

    const cancelledAnimal = await createAnimal(app, `workflow-cancelled-${stamp}`, `Workflow Cancelled ${stamp}`);
    const cancelledApplication = await createApplication(app, cancelledAnimal.documentId, 'CANCELLED');
    await updateApplication(app, cancelledApplication.documentId, 'cancelled');
    await expectAnimalStatus(app, cancelledAnimal.documentId, 'available', 'after cancelled');

    const normalPublicAnimal = await createAnimal(app, `workflow-public-${stamp}`, `Workflow Public ${stamp}`);
    const normalPublicSubmit = await submitPublicApplication(normalPublicAnimal.slug, 'normal');
    assert(normalPublicSubmit.status === 200, `Expected normal public submit 200, got ${normalPublicSubmit.status}`);
    assert(normalPublicSubmit.body.success === true, 'Normal public submit should succeed');
    assert(/^SRD-\d{4}-[A-F0-9]{6}$/.test(normalPublicSubmit.body.referenceCode), 'Public submit should return server reference code');

    console.log(
      JSON.stringify(
        {
          primaryAnimal: primaryAnimal.slug,
          applications: {
            A: approvedA.applicationStatus,
            B: cancelledB.applicationStatus,
            C: cancelledC.applicationStatus,
          },
          invalidTransitions: {
            cancelledToApproved: invalidBApproved,
            approvedToReviewing: invalidAReviewing,
            newToApproved: invalidDirectApproved,
          },
          publicSubmit: {
            adoptedAnimalStatus: adoptedPublicSubmit.status,
            normalStatus: normalPublicSubmit.status,
            normalReferenceCode: normalPublicSubmit.body.referenceCode,
          },
          rejectedDoesNotChangeAnimal: true,
          cancelledDoesNotChangeAnimal: true,
        },
        null,
        2
      )
    );
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
