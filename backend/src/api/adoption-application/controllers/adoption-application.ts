import crypto from 'crypto';
import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';

type RequestContext = {
  ip?: string;
  request: { body?: unknown };
  badRequest: (message: string, details?: unknown) => unknown;
  tooManyRequests?: (message: string) => unknown;
  send: (body: unknown) => unknown;
  status?: number;
};

type ApplicationPayload = {
  animalSlug: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  housingType: 'apartment' | 'house' | 'other';
  hasGarden: boolean;
  hasOtherPets: boolean;
  otherPetsDescription?: string;
  previousPetExperience?: string;
  reasonForAdoption: string;
  consentAccepted: boolean;
};

type AnimalRecord = {
  id: number;
  documentId?: string;
  adoptionStatus?: 'available' | 'reserved' | 'adopted' | 'unavailable';
  name?: string;
  slug?: string;
  species?: 'dog' | 'cat' | 'other';
  gender?: 'male' | 'female' | 'unknown';
  ageGroup?: 'baby' | 'young' | 'adult' | 'senior';
  size?: 'small' | 'medium' | 'large';
  estimatedBirthDate?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  personality?: string | null;
  vaccinated?: boolean;
  neutered?: boolean;
  microchipped?: boolean;
  featured?: boolean;
  arrivalDate?: string | null;
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const housingTypes = new Set(['apartment', 'house', 'other']);

const asRecord = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const cleanText = (value: unknown, maxLength: number): string => {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
};

const cleanLongText = (value: unknown, maxLength: number): string => {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().slice(0, maxLength);
};

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value: string): boolean => /^\+?[0-9\s()\-]{10,24}$/.test(value);

const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }

  if (current.count >= 5) return false;
  current.count += 1;
  return true;
};

const generateReferenceCode = (): string => {
  const year = new Date().getFullYear();
  return `SRD-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

const ensureAnimalDraftVersion = async (strapi: Core.Strapi, animal: AnimalRecord): Promise<void> => {
  if (!animal.documentId) return;

  const draft = await strapi.documents('api::animal.animal').findOne({
    documentId: animal.documentId,
    status: 'draft',
  });

  if (draft) return;

  const draftData = {
    name: animal.name,
    slug: animal.slug,
    species: animal.species,
    gender: animal.gender,
    ageGroup: animal.ageGroup,
    size: animal.size,
    shortDescription: animal.shortDescription ?? undefined,
    description: animal.description ?? undefined,
    personality: animal.personality ?? undefined,
    vaccinated: animal.vaccinated,
    neutered: animal.neutered,
    microchipped: animal.microchipped,
    adoptionStatus: animal.adoptionStatus,
    featured: animal.featured,
    estimatedBirthDate: animal.estimatedBirthDate ?? undefined,
    arrivalDate: animal.arrivalDate ?? undefined,
  };

  await strapi.documents('api::animal.animal').update({
    documentId: animal.documentId,
    status: 'draft',
    data: draftData,
  });
};

const parsePayload = (body: Record<string, unknown>): { payload?: ApplicationPayload; errors: Record<string, string> } => {
  const payload = {
    animalSlug: cleanText(body.animalSlug, 120),
    fullName: cleanText(body.fullName, 120),
    phone: cleanText(body.phone, 24),
    email: cleanText(body.email, 160).toLowerCase(),
    city: cleanText(body.city, 80),
    district: cleanText(body.district, 80),
    housingType: cleanText(body.housingType, 20),
    hasGarden: body.hasGarden === true,
    hasOtherPets: body.hasOtherPets === true,
    otherPetsDescription: cleanLongText(body.otherPetsDescription, 500),
    previousPetExperience: cleanLongText(body.previousPetExperience, 700),
    reasonForAdoption: cleanLongText(body.reasonForAdoption, 1000),
    consentAccepted: body.consentAccepted === true,
  };

  const errors: Record<string, string> = {};

  if (!payload.animalSlug) errors.animalSlug = 'Hayvan bilgisi eksik.';
  if (payload.fullName.length < 3) errors.fullName = 'Ad soyad en az 3 karakter olmalıdır.';
  if (!isPhone(payload.phone)) errors.phone = 'Geçerli bir telefon numarası giriniz.';
  if (!isEmail(payload.email)) errors.email = 'Geçerli bir e-posta adresi giriniz.';
  if (payload.city.length < 2) errors.city = 'İl bilgisi zorunludur.';
  if (payload.district.length < 2) errors.district = 'İlçe bilgisi zorunludur.';
  if (!housingTypes.has(payload.housingType)) errors.housingType = 'Konut tipi seçiniz.';
  if (payload.reasonForAdoption.length < 20) errors.reasonForAdoption = 'Sahiplenme nedeni en az 20 karakter olmalıdır.';
  if (!payload.consentAccepted) errors.consentAccepted = 'Bilgilendirme onayı zorunludur.';

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return { payload: payload as ApplicationPayload, errors };
};

export default factories.createCoreController('api::adoption-application.adoption-application', ({ strapi }) => ({
  async submit(ctx) {
    const appCtx = ctx as unknown as RequestContext;
    const body = asRecord(appCtx.request.body);

    if (cleanText(body.website, 120)) {
      return appCtx.badRequest('Başvuru doğrulanamadı.');
    }

    const rateLimitKey = appCtx.ip ?? 'unknown';
    if (!checkRateLimit(rateLimitKey)) {
      appCtx.status = 429;
      if (appCtx.tooManyRequests) return appCtx.tooManyRequests('Çok fazla başvuru denemesi yapıldı. Lütfen daha sonra tekrar deneyiniz.');
      return appCtx.send({ success: false, message: 'Çok fazla başvuru denemesi yapıldı. Lütfen daha sonra tekrar deneyiniz.' });
    }

    const { payload, errors } = parsePayload(body);
    if (!payload) {
      return appCtx.badRequest('Başvuru bilgilerini kontrol ediniz.', { errors });
    }

    const animal = (await strapi.db.query('api::animal.animal').findOne({
      where: { slug: payload.animalSlug },
    })) as AnimalRecord | null;

    if (!animal?.documentId) {
      return appCtx.badRequest('Başvuru yapılacak hayvan bulunamadı.');
    }

    if (animal.adoptionStatus !== 'available') {
      return appCtx.badRequest('Bu hayvan için şu anda yeni başvuru alınamıyor.');
    }

    await ensureAnimalDraftVersion(strapi, animal);

    let referenceCode = generateReferenceCode();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const existing = await strapi.db.query('api::adoption-application.adoption-application').findOne({
        where: { referenceCode },
      });
      if (!existing) break;
      referenceCode = generateReferenceCode();
    }

    const createdApplication = await strapi.documents('api::adoption-application.adoption-application').create({
      data: {
        animal: {
          documentId: animal.documentId,
          status: 'draft',
        } as unknown as string,
        referenceCode,
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        city: payload.city,
        district: payload.district,
        housingType: payload.housingType,
        hasGarden: payload.hasGarden,
        hasOtherPets: payload.hasOtherPets,
        otherPetsDescription: payload.otherPetsDescription,
        previousPetExperience: payload.previousPetExperience,
        reasonForAdoption: payload.reasonForAdoption,
        consentAccepted: payload.consentAccepted,
        applicationStatus: 'new',
      },
      populate: {
        animal: {
          fields: ['documentId', 'slug', 'name'],
        },
      },
    });

    const createdApplicationRecord = createdApplication as unknown as { applicationStatus?: string; animal?: unknown };

    if (createdApplicationRecord.applicationStatus !== 'new' || !createdApplicationRecord.animal) {
      strapi.log.error(
        `Adoption application persistence check failed for ${referenceCode}: applicationStatus=${createdApplicationRecord.applicationStatus}, animal=${JSON.stringify(
          createdApplicationRecord.animal
        )}`
      );
      return appCtx.badRequest('Başvuru kaydedildi ancak doğrulama tamamlanamadı. Lütfen daha sonra tekrar deneyiniz.');
    }

    return appCtx.send({ success: true, referenceCode });
  },
}));
