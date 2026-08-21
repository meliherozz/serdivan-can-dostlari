import type {
  AdoptionApplicationInput,
  AdoptionStatus,
  Animal,
  Breed,
  FAQ,
  MediaAsset,
  ShelterInfo,
} from '@/types/domain';
import { getStrapiMediaUrl } from './media';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

type QueryValue = string | number | boolean | undefined | null;

type AnimalFilters = {
  species?: string;
  gender?: string;
  ageGroup?: string;
  size?: string;
  featured?: boolean;
  adoptionStatus?: string;
};

export type AnimalStats = {
  total: number;
  adopted: number;
  available: number;
  reserved: number;
  unavailable: number;
};

const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const unwrap = (value: unknown): Record<string, unknown> => {
  const item = record(value);
  const attributes = record(item.attributes);
  return Object.keys(attributes).length > 0 ? { ...attributes, id: item.id, documentId: item.documentId } : item;
};

const unwrapData = (value: unknown): unknown => {
  const item = record(value);
  return 'data' in item ? item.data : value;
};

const asString = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);
const asBoolean = (value: unknown): boolean => value === true;
const asNumber = (value: unknown): number => (typeof value === 'number' ? value : Number(value));

const sanitizePublicText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;

  const stripped = value
    .replace(/^Demo kayıt:\s*/i, '')
    .replace(/Bu kayıt MVP demosu için oluşturulmuştur\.\s*/gi, '')
    .replace(/Bu kayıt MVP demosu için hazırlanmıştır\.\s*/gi, '')
    .replace(/Gerçek belediye kaydı değildir\.\s*/gi, '')
    .trim();

  if (!stripped) return null;

  const blocked = ['mvp', 'strapi', 'placeholder', 'media library', 'demo'];
  return blocked.some((term) => stripped.toLocaleLowerCase('tr').includes(term)) ? null : stripped;
};

const sanitizeFAQText = (value: unknown): string => {
  if (typeof value !== 'string') return '';

  return value
    .replace(/^Demo kayıt:\s*/i, '')
    .replace(/Bu kayıt MVP demosu için oluşturulmuştur\.\s*/gi, '')
    .replace(/Bu kayıt MVP demosu için hazırlanmıştır\.\s*/gi, '')
    .replace(/Gerçek belediye kaydı değildir\.\s*/gi, '')
    .replace(/\bMVP\b/gi, 'platform')
    .replace(/\bStrapi\b/gi, 'belediye içerik sistemi')
    .replace(/\bdemo\b/gi, 'bilgilendirme')
    .trim();
};

const sanitizePublicContact = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const stripped = value.trim();
  if (!stripped) return null;

  const blocked = ['demo', 'placeholder', 'example.invalid'];
  return blocked.some((term) => stripped.toLocaleLowerCase('tr').includes(term)) ? null : stripped;
};

const toMedia = (value: unknown): MediaAsset | null => {
  const data = unwrapData(value);
  if (!data) return null;
  const media = unwrap(data);
  const url = getStrapiMediaUrl(asString(media.url));
  if (!url) return null;
  return {
    url,
    alternativeText: typeof media.alternativeText === 'string' ? media.alternativeText : null,
  };
};

const toMediaList = (value: unknown): MediaAsset[] => {
  const data = unwrapData(value);
  if (!Array.isArray(data)) return [];
  return data.map(toMedia).filter((asset): asset is MediaAsset => asset !== null);
};

const toBreed = (value: unknown): Breed | null => {
  const data = unwrapData(value);
  if (!data) return null;
  const breed = unwrap(data);
  return {
    id: asNumber(breed.id),
    name: asString(breed.name),
    species: asString(breed.species, 'other') as Breed['species'],
  };
};

const toAnimal = (value: unknown): Animal => {
  const item = unwrap(value);
  return {
    id: asNumber(item.id),
    documentId: typeof item.documentId === 'string' ? item.documentId : undefined,
    name: asString(item.name),
    slug: asString(item.slug),
    species: asString(item.species, 'other') as Animal['species'],
    gender: asString(item.gender, 'unknown') as Animal['gender'],
    ageGroup: asString(item.ageGroup, 'adult') as Animal['ageGroup'],
    size: asString(item.size, 'medium') as Animal['size'],
    estimatedBirthDate: typeof item.estimatedBirthDate === 'string' ? item.estimatedBirthDate : null,
    shortDescription: sanitizePublicText(item.shortDescription),
    description: sanitizePublicText(item.description),
    personality: sanitizePublicText(item.personality),
    vaccinated: asBoolean(item.vaccinated),
    neutered: asBoolean(item.neutered),
    microchipped: asBoolean(item.microchipped),
    adoptionStatus: asString(item.adoptionStatus, 'unavailable') as Animal['adoptionStatus'],
    featured: asBoolean(item.featured),
    arrivalDate: typeof item.arrivalDate === 'string' ? item.arrivalDate : null,
    breed: toBreed(item.breed),
    featuredImage: toMedia(item.featuredImage),
    images: toMediaList(item.images),
  };
};

const toFAQ = (value: unknown): FAQ => {
  const item = unwrap(value);
  return {
    id: asNumber(item.id),
    question: asString(item.question),
    answer: sanitizeFAQText(item.answer),
    order: asNumber(item.order),
    published: item.published !== false,
  };
};

const toShelterInfo = (value: unknown): ShelterInfo => {
  const item = unwrap(unwrapData(value));
  return {
    name: asString(item.name, 'Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi'),
    description: sanitizePublicText(item.description),
    address: sanitizePublicText(item.address),
    phone: sanitizePublicContact(item.phone),
    email: sanitizePublicContact(item.email),
    workingHours: sanitizePublicText(item.workingHours),
    latitude: typeof item.latitude === 'number' ? item.latitude : null,
    longitude: typeof item.longitude === 'number' ? item.longitude : null,
    heroImage: toMedia(item.heroImage),
    gallery: toMediaList(item.gallery),
  };
};

const buildUrl = (path: string, params: Record<string, QueryValue> = {}): string => {
  const url = new URL(`/api/${path}`, STRAPI_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
};

const getJson = async (path: string, params: Record<string, QueryValue> = {}): Promise<unknown> => {
  const response = await fetch(buildUrl(path, params), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('İçerik alınamadı.');
  }

  return response.json();
};

export const getAnimals = async (filters: AnimalFilters = {}): Promise<Animal[]> => {
  const params: Record<string, QueryValue> = {
    status: 'published',
    'populate[breed]': true,
    'populate[featuredImage]': true,
    'populate[images]': true,
    sort: 'featured:desc,arrivalDate:desc',
  };

  if (!filters.adoptionStatus) {
    params['filters[adoptionStatus][$ne]'] = 'unavailable';
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      params[`filters[${key}][$eq]`] = value;
    }
  }

  const json = record(await getJson('animals', params));
  const data = Array.isArray(json.data) ? json.data : [];
  return data.map(toAnimal);
};

export const getAnimalBySlug = async (slug: string): Promise<Animal | null> => {
  const json = record(
    await getJson('animals', {
      status: 'published',
      'filters[slug][$eq]': slug,
      'populate[breed]': true,
      'populate[featuredImage]': true,
      'populate[images]': true,
    }),
  );
  const data = Array.isArray(json.data) ? json.data : [];
  return data[0] ? toAnimal(data[0]) : null;
};

export const getFeaturedAnimals = async (): Promise<Animal[]> => getAnimals({ featured: true });

export const getAnimalStats = async (): Promise<AnimalStats> => {
  const json = record(
    await getJson('animals', {
      status: 'published',
      'pagination[pageSize]': 100,
      'fields[0]': 'adoptionStatus',
    }),
  );
  const data = Array.isArray(json.data) ? json.data : [];
  const statuses = data.map((item) => asString(unwrap(item).adoptionStatus, 'unavailable') as AdoptionStatus);

  return {
    total: statuses.length,
    adopted: statuses.filter((status) => status === 'adopted').length,
    available: statuses.filter((status) => status === 'available').length,
    reserved: statuses.filter((status) => status === 'reserved').length,
    unavailable: statuses.filter((status) => status === 'unavailable').length,
  };
};

export const getFAQs = async (): Promise<FAQ[]> => {
  const json = record(await getJson('faqs', { 'filters[published][$eq]': true, sort: 'order:asc' }));
  const data = Array.isArray(json.data) ? json.data : [];
  return data.map(toFAQ).filter((faq) => faq.question && faq.answer);
};

export const getShelterInfo = async (): Promise<ShelterInfo> => {
  const json = await getJson('shelter-info', {
    'populate[heroImage]': true,
    'populate[gallery]': true,
  });
  return toShelterInfo(json);
};

export const submitAdoptionApplication = async (
  input: AdoptionApplicationInput,
): Promise<{ success: true; referenceCode: string } | { success: false; message: string }> => {
  const response = await fetch(buildUrl('adoption-applications/submit'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const body = record(await response.json().catch(() => ({})));

  if (!response.ok) {
    return {
      success: false,
      message: asString(body.error && record(body.error).message, 'Başvuru gönderilemedi. Lütfen bilgileri kontrol ediniz.'),
    };
  }

  return {
    success: true,
    referenceCode: asString(body.referenceCode),
  };
};
