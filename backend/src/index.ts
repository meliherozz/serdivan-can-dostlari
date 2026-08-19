import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { ValidationError } = errors;

type DocumentServiceContext = {
  uid: string;
  action: string;
  params: {
    documentId?: string;
    data?: Record<string, unknown>;
  };
};

type ApplicationStatus = 'new' | 'reviewing' | 'contacted' | 'approved' | 'rejected' | 'cancelled';

type WorkflowApplication = {
  id: number;
  documentId: string;
  referenceCode?: string;
  applicationStatus: ApplicationStatus;
  internalNotes?: string | null;
  animal?: {
    id: number;
    documentId?: string;
    name?: string;
    adoptionStatus?: string;
  } | null;
};

type WorkflowAnimal = {
  id: number;
  documentId: string;
  adoptionStatus: 'available' | 'reserved' | 'adopted' | 'unavailable';
};

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  new: ['reviewing', 'rejected', 'cancelled'],
  reviewing: ['contacted', 'rejected', 'cancelled'],
  contacted: ['approved', 'rejected', 'cancelled'],
  approved: [],
  rejected: [],
  cancelled: [],
};

const openApplicationStatuses: ApplicationStatus[] = ['new', 'reviewing', 'contacted'];
const automaticCancellationNote = 'System: Another adoption application for this animal was approved.';

type BreedSeed = {
  name: string;
  species: 'dog' | 'cat' | 'other';
};

type AnimalSeed = {
  name: string;
  slug: string;
  species: 'dog' | 'cat' | 'other';
  gender: 'male' | 'female' | 'unknown';
  ageGroup: 'baby' | 'young' | 'adult' | 'senior';
  size: 'small' | 'medium' | 'large';
  breedName: string;
  shortDescription: string;
  description: string;
  personality: string;
  vaccinated: boolean;
  neutered: boolean;
  microchipped: boolean;
  adoptionStatus: 'available' | 'reserved' | 'adopted' | 'unavailable';
  featured: boolean;
  arrivalDate: string;
};

const breedSeeds: BreedSeed[] = [
  { name: 'Anadolu Çoban Köpeği', species: 'dog' },
  { name: 'Golden Retriever', species: 'dog' },
  { name: 'Melez Köpek', species: 'dog' },
  { name: 'Tekir', species: 'cat' },
  { name: 'Sarman', species: 'cat' },
  { name: 'Melez Kedi', species: 'cat' },
];

const animalSeeds: AnimalSeed[] = [
  {
    name: 'Pamuk',
    slug: 'pamuk',
    species: 'dog',
    gender: 'female',
    ageGroup: 'young',
    size: 'medium',
    breedName: 'Melez Köpek',
    shortDescription: 'Demo kayıt: insanlarla sakin iletişim kuran genç bir köpek.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Sakin, uyumlu ve yürüyüşleri seven.',
    vaccinated: true,
    neutered: false,
    microchipped: true,
    adoptionStatus: 'available',
    featured: true,
    arrivalDate: '2026-04-12',
  },
  {
    name: 'Tarçın',
    slug: 'tarcin',
    species: 'dog',
    gender: 'male',
    ageGroup: 'adult',
    size: 'large',
    breedName: 'Anadolu Çoban Köpeği',
    shortDescription: 'Demo kayıt: güçlü ve dengeli karakterli yetişkin köpek.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Koruyucu, dikkatli ve güven veren.',
    vaccinated: true,
    neutered: true,
    microchipped: true,
    adoptionStatus: 'available',
    featured: true,
    arrivalDate: '2026-03-08',
  },
  {
    name: 'Boncuk',
    slug: 'boncuk',
    species: 'dog',
    gender: 'female',
    ageGroup: 'baby',
    size: 'small',
    breedName: 'Melez Köpek',
    shortDescription: 'Demo kayıt: enerjik ve oyuncu yavru köpek.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Oyuncu, meraklı ve hareketli.',
    vaccinated: false,
    neutered: false,
    microchipped: false,
    adoptionStatus: 'available',
    featured: false,
    arrivalDate: '2026-06-01',
  },
  {
    name: 'Maya',
    slug: 'maya',
    species: 'dog',
    gender: 'female',
    ageGroup: 'young',
    size: 'medium',
    breedName: 'Golden Retriever',
    shortDescription: 'Demo kayıt: sosyal ve insan odaklı genç köpek.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Sosyal, neşeli ve kolay adapte olur.',
    vaccinated: true,
    neutered: false,
    microchipped: true,
    adoptionStatus: 'reserved',
    featured: false,
    arrivalDate: '2026-05-14',
  },
  {
    name: 'Zeytin',
    slug: 'zeytin',
    species: 'dog',
    gender: 'male',
    ageGroup: 'senior',
    size: 'medium',
    breedName: 'Melez Köpek',
    shortDescription: 'Demo kayıt: sakin tempolu, olgun karakterli köpek.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Uysal, sabırlı ve sakin ortamları sever.',
    vaccinated: true,
    neutered: true,
    microchipped: true,
    adoptionStatus: 'available',
    featured: false,
    arrivalDate: '2026-01-23',
  },
  {
    name: 'Duman',
    slug: 'duman',
    species: 'cat',
    gender: 'male',
    ageGroup: 'adult',
    size: 'small',
    breedName: 'Tekir',
    shortDescription: 'Demo kayıt: kendi alanını seven yetişkin kedi.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Sakin, gözlemci ve düzenli rutinleri sever.',
    vaccinated: true,
    neutered: true,
    microchipped: false,
    adoptionStatus: 'available',
    featured: true,
    arrivalDate: '2026-02-10',
  },
  {
    name: 'Luna',
    slug: 'luna',
    species: 'cat',
    gender: 'female',
    ageGroup: 'young',
    size: 'small',
    breedName: 'Melez Kedi',
    shortDescription: 'Demo kayıt: sevecen ve meraklı genç kedi.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Sevecen, oyuncu ve insanlara yakın.',
    vaccinated: true,
    neutered: false,
    microchipped: false,
    adoptionStatus: 'available',
    featured: true,
    arrivalDate: '2026-05-30',
  },
  {
    name: 'Fındık',
    slug: 'findik',
    species: 'cat',
    gender: 'unknown',
    ageGroup: 'baby',
    size: 'small',
    breedName: 'Sarman',
    shortDescription: 'Demo kayıt: yeni ortamlara alışma sürecinde yavru kedi.',
    description: 'Bu kayıt MVP demosu için oluşturulmuştur. Gerçek belediye kaydı değildir.',
    personality: 'Meraklı, temkinli ve oyunla sosyalleşiyor.',
    vaccinated: false,
    neutered: false,
    microchipped: false,
    adoptionStatus: 'available',
    featured: false,
    arrivalDate: '2026-07-04',
  },
];

const faqSeeds = [
  ['Hayvan sahiplenmek ücretli mi?', 'Demo cevap: Sahiplendirme sürecinin koşulları belediye tarafından netleştirildiğinde bu alana eklenecektir.'],
  ['Başvurudan sonra süreç nasıl ilerliyor?', 'Demo cevap: Başvurunuz ilgili birim tarafından değerlendirilir ve uygun görülürse sizinle iletişime geçilir.'],
  ['Bakımevini ziyaret edebilir miyim?', 'Demo cevap: Ziyaret gün ve saatleri belediye tarafından onaylandıktan sonra yayınlanacaktır.'],
  ['Aynı anda birden fazla hayvan için başvurabilir miyim?', 'Demo cevap: Her hayvan için ayrı başvuru yapılması önerilir.'],
  ['Başvurumun sonucunu nereden öğrenebilirim?', 'Demo cevap: Referans numaranızla belediye iletişim kanalları üzerinden bilgi almanız planlanmaktadır.'],
  ['Bu bilgiler gerçek belediye kaydı mı?', 'Demo cevap: Hayır, bu platformdaki başlangıç verileri yalnızca geliştirme demosu için kurgusaldır.'],
];

const isApplicationStatus = (value: unknown): value is ApplicationStatus =>
  typeof value === 'string' && value in allowedTransitions;

const appendSystemNote = (internalNotes?: string | null): string => {
  const current = internalNotes?.trim();
  if (!current) return automaticCancellationNote;
  if (current.includes(automaticCancellationNote)) return current;
  return `${current}\n\n${automaticCancellationNote}`;
};

const getWorkflowApplication = async (
  strapi: Core.Strapi,
  documentId?: string
): Promise<WorkflowApplication | null> => {
  if (!documentId) return null;

  return (await strapi.documents('api::adoption-application.adoption-application').findOne({
    documentId,
    populate: {
      animal: {
        fields: ['documentId', 'name', 'adoptionStatus'],
      },
    },
  })) as WorkflowApplication | null;
};

const getAnimalVersions = async (strapi: Core.Strapi, animalDocumentId: string): Promise<WorkflowAnimal[]> =>
  (await strapi.db.query('api::animal.animal').findMany({
    where: { documentId: animalDocumentId },
  })) as WorkflowAnimal[];

const acquireAnimalWorkflowLock = async (strapi: Core.Strapi, animalDocumentId: string): Promise<void> => {
  await strapi.db.connection.raw('SELECT pg_advisory_lock(hashtext(?))', [`adoption-workflow:${animalDocumentId}`]);
};

const releaseAnimalWorkflowLock = async (strapi: Core.Strapi, animalDocumentId: string): Promise<void> => {
  await strapi.db.connection.raw('SELECT pg_advisory_unlock(hashtext(?))', [`adoption-workflow:${animalDocumentId}`]);
};

const validateApplicationTransition = async (
  strapi: Core.Strapi,
  application: WorkflowApplication,
  nextStatus: ApplicationStatus
) => {
  const currentStatus = application.applicationStatus;

  if (currentStatus === nextStatus) return;

  if (!allowedTransitions[currentStatus]?.includes(nextStatus)) {
    throw new ValidationError(`Application cannot transition from '${currentStatus}' to '${nextStatus}'.`);
  }

  if (nextStatus !== 'approved') return;

  const animalDocumentId = application.animal?.documentId;
  if (!animalDocumentId) {
    throw new ValidationError('Application cannot be approved because the related animal is missing.');
  }

  const animalVersions = await getAnimalVersions(strapi, animalDocumentId);
  if (animalVersions.some((animal) => animal.adoptionStatus === 'adopted')) {
    throw new ValidationError('Application cannot be approved because the related animal is already adopted.');
  }

  const sameAnimalApplications = (await strapi.db.query('api::adoption-application.adoption-application').findMany({
    populate: { animal: true },
  })) as WorkflowApplication[];

  const alreadyApproved = sameAnimalApplications.some(
    (candidate) =>
      candidate.documentId !== application.documentId &&
      candidate.applicationStatus === 'approved' &&
      candidate.animal?.documentId === animalDocumentId
  );

  if (alreadyApproved) {
    throw new ValidationError('Application cannot be approved because another application for this animal is already approved.');
  }
};

const adoptAnimalForApprovedApplication = async (
  strapi: Core.Strapi,
  applicationDocumentId?: string
) => {
  const application = await getWorkflowApplication(strapi, applicationDocumentId);
  const animal = application?.animal;

  if (application?.applicationStatus !== 'approved' || !animal?.documentId) return;

  await strapi.db.query('api::animal.animal').updateMany({
    where: { documentId: animal.documentId },
    data: { adoptionStatus: 'adopted' },
  });

  const sameAnimalApplications = (await strapi.db.query('api::adoption-application.adoption-application').findMany({
    populate: { animal: true },
  })) as WorkflowApplication[];

  const applicationsToCancel = sameAnimalApplications.filter(
    (candidate) =>
      candidate.documentId !== application.documentId &&
      candidate.animal?.documentId === animal.documentId &&
      openApplicationStatuses.includes(candidate.applicationStatus)
  );

  for (const candidate of applicationsToCancel) {
    await strapi.documents('api::adoption-application.adoption-application').update({
      documentId: candidate.documentId,
      data: {
        applicationStatus: 'cancelled',
        internalNotes: appendSystemNote(candidate.internalNotes),
      },
    });
  }
};

const registerAdoptionWorkflowAutomation = (strapi: Core.Strapi) => {
  strapi.documents.use(async (context, next) => {
    const ctx = context as DocumentServiceContext;

    if (
      ctx.uid !== 'api::adoption-application.adoption-application' ||
      !['update', 'create'].includes(ctx.action)
    ) {
      return next();
    }

    const requestedStatus = ctx.params.data?.applicationStatus;

    if (ctx.action === 'create') {
      if (requestedStatus !== undefined && requestedStatus !== 'new') {
        throw new ValidationError(`New applications must start with 'new', not '${String(requestedStatus)}'.`);
      }

      const result = await next();
      const resultRecord = result as { documentId?: string; applicationStatus?: string } | null;

      if (resultRecord?.applicationStatus === 'approved') {
        await adoptAnimalForApprovedApplication(strapi, resultRecord.documentId);
      }

      return result;
    }

    if (!isApplicationStatus(requestedStatus)) {
      return next();
    }

    const application = await getWorkflowApplication(strapi, ctx.params.documentId);
    if (!application) return next();

    const animalDocumentId = application.animal?.documentId;
    const needsApprovalLock = requestedStatus === 'approved' && !!animalDocumentId;

    if (needsApprovalLock) {
      await acquireAnimalWorkflowLock(strapi, animalDocumentId);
    }

    try {
      await validateApplicationTransition(strapi, application, requestedStatus);

      const result = await next();
      const resultRecord = result as { documentId?: string; applicationStatus?: string } | null;
      const nextStatus = resultRecord?.applicationStatus ?? requestedStatus;

      if (nextStatus === 'approved') {
        await adoptAnimalForApprovedApplication(strapi, resultRecord?.documentId ?? application.documentId);
      }

      return result;
    } finally {
      if (needsApprovalLock && animalDocumentId) {
        await releaseAnimalWorkflowLock(strapi, animalDocumentId);
      }
    }
  });
};

const enablePublicPermissions = async (strapi: Core.Strapi) => {
  try {
    const role = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!role) return;

    const publicActions = [
      'api::animal.animal.find',
      'api::animal.animal.findOne',
      'api::breed.breed.find',
      'api::breed.breed.findOne',
      'api::faq.faq.find',
      'api::faq.faq.findOne',
      'api::shelter-info.shelter-info.find',
    ];

    for (const action of publicActions) {
      const permission = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: { action, role: role.id },
      });

      if (permission) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: permission.id },
          data: { enabled: true },
        });
      } else {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: { action, role: role.id, enabled: true, policy: '' },
        });
      }
    }
  } catch (error) {
    strapi.log.warn(`Public permission bootstrap skipped: ${error instanceof Error ? error.message : 'unknown error'}`);
  }
};

const ensureAnimalDraftVersion = async (strapi: Core.Strapi, animal: AnimalSeed & { documentId: string }) => {
  const draft = await strapi.documents('api::animal.animal').findOne({
    documentId: animal.documentId,
    status: 'draft',
  });

  if (draft) return;

  await strapi.documents('api::animal.animal').update({
    documentId: animal.documentId,
    status: 'draft',
    data: {
      name: animal.name,
      slug: animal.slug,
      species: animal.species,
      gender: animal.gender,
      ageGroup: animal.ageGroup,
      size: animal.size,
      shortDescription: animal.shortDescription,
      description: animal.description,
      personality: animal.personality,
      vaccinated: animal.vaccinated,
      neutered: animal.neutered,
      microchipped: animal.microchipped,
      adoptionStatus: animal.adoptionStatus,
      featured: animal.featured,
      arrivalDate: animal.arrivalDate,
    },
  });
};

const seedDemoData = async (strapi: Core.Strapi) => {
  const breeds = new Map<string, { id: number }>();

  for (const seed of breedSeeds) {
    const existing = await strapi.db.query('api::breed.breed').findOne({ where: { name: seed.name } });
    const breed = existing ?? (await strapi.db.query('api::breed.breed').create({ data: seed }));
    breeds.set(seed.name, { id: breed.id });
  }

  for (const seed of animalSeeds) {
    const existing = await strapi.db.query('api::animal.animal').findOne({ where: { slug: seed.slug } });
    if (existing?.documentId) {
      await ensureAnimalDraftVersion(strapi, { ...seed, documentId: existing.documentId });
      continue;
    }

    const breed = breeds.get(seed.breedName);
    const draftAnimal = await strapi.documents('api::animal.animal').create({
      data: {
        ...seed,
        breed: breed?.id,
      },
    });

    await strapi.documents('api::animal.animal').publish({
      documentId: draftAnimal.documentId,
    });
  }

  for (const [index, faq] of faqSeeds.entries()) {
    const existing = await strapi.db.query('api::faq.faq').findOne({ where: { question: faq[0] } });
    if (!existing) {
      await strapi.db.query('api::faq.faq').create({
        data: { question: faq[0], answer: faq[1], order: index + 1, published: true },
      });
    }
  }

  const shelterInfo = await strapi.db.query('api::shelter-info.shelter-info').findOne({ where: {} });
  if (!shelterInfo) {
    await strapi.db.query('api::shelter-info.shelter-info').create({
      data: {
        name: 'Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi',
        description: 'Demo açıklama: Bakımevi tanıtım metni belediye tarafından onaylandıktan sonra güncellenecektir.',
        address: 'Demo placeholder: Resmi adres belediye tarafından sağlandığında eklenecektir.',
        phone: 'Demo placeholder',
        email: 'demo-placeholder@example.invalid',
        workingHours: 'Demo placeholder: Ziyaret saatleri onay bekliyor.',
      },
    });
  }
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    registerAdoptionWorkflowAutomation(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePublicPermissions(strapi);

    if (process.env.NODE_ENV !== 'production' && process.env.SEED_DEMO_DATA === 'true') {
      await seedDemoData(strapi);
    }
  },
};
