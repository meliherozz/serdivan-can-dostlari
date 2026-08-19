export type Species = 'dog' | 'cat' | 'other';
export type Gender = 'male' | 'female' | 'unknown';
export type AgeGroup = 'baby' | 'young' | 'adult' | 'senior';
export type AnimalSize = 'small' | 'medium' | 'large';
export type AdoptionStatus = 'available' | 'reserved' | 'adopted' | 'unavailable';
export type HousingType = 'apartment' | 'house' | 'other';

export type MediaAsset = {
  url: string;
  alternativeText?: string | null;
};

export type Breed = {
  id: number;
  name: string;
  species: Species;
};

export type Animal = {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  species: Species;
  gender: Gender;
  ageGroup: AgeGroup;
  size: AnimalSize;
  estimatedBirthDate?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  personality?: string | null;
  vaccinated: boolean;
  neutered: boolean;
  microchipped: boolean;
  adoptionStatus: AdoptionStatus;
  featured: boolean;
  arrivalDate?: string | null;
  breed?: Breed | null;
  featuredImage?: MediaAsset | null;
  images?: MediaAsset[];
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export type ShelterInfo = {
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  workingHours?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  heroImage?: MediaAsset | null;
  gallery?: MediaAsset[];
};

export type AdoptionApplicationInput = {
  animalSlug: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  housingType: HousingType;
  hasGarden: boolean;
  hasOtherPets: boolean;
  otherPetsDescription: string;
  previousPetExperience: string;
  reasonForAdoption: string;
  consentAccepted: boolean;
  website: string;
};
