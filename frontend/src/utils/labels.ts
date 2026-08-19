import type { AdoptionStatus, AgeGroup, AnimalSize, Gender, HousingType, Species } from '@/types/domain';

export const speciesLabels: Record<Species, string> = {
  dog: 'Köpek',
  cat: 'Kedi',
  other: 'Diğer',
};

export const genderLabels: Record<Gender, string> = {
  male: 'Erkek',
  female: 'Dişi',
  unknown: 'Bilinmiyor',
};

export const ageLabels: Record<AgeGroup, string> = {
  baby: 'Yavru',
  young: 'Genç',
  adult: 'Yetişkin',
  senior: 'Yaşlı',
};

export const sizeLabels: Record<AnimalSize, string> = {
  small: 'Küçük',
  medium: 'Orta',
  large: 'Büyük',
};

export const statusLabels: Record<AdoptionStatus, string> = {
  available: 'Sahiplendirilebilir',
  reserved: 'Rezerve',
  adopted: 'Sahiplendirildi',
  unavailable: 'Uygun değil',
};

export const housingLabels: Record<HousingType, string> = {
  apartment: 'Apartman',
  house: 'Müstakil ev',
  other: 'Diğer',
};
