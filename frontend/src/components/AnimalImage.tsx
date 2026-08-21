import type { Animal } from '@/types/domain';
import { speciesLabels } from '@/utils/labels';

type Props = {
  animal: Animal;
  large?: boolean;
};

export const getPrimaryAnimalImage = (animal: Animal) => animal.featuredImage ?? animal.images?.[0] ?? null;

export function AnimalImage({ animal, large = false }: Props) {
  const image = getPrimaryAnimalImage(animal);
  const minHeight = large ? 'min-h-80' : 'min-h-56';

  if (image?.url) {
    return (
      <div
        role="img"
        aria-label={image.alternativeText || `${animal.name} fotoğrafı`}
        className={`image-zoom h-full w-full bg-stone-100 bg-cover bg-center ${minHeight}`}
        style={{ backgroundImage: `url(${image.url})` }}
      />
    );
  }

  return (
    <div
      className={`image-zoom relative flex h-full w-full flex-col justify-end overflow-hidden bg-[var(--color-primary-soft)] p-6 text-left ${minHeight}`}
      role="img"
      aria-label={`${animal.name} görsel alanı`}
    >
      <span className="absolute right-5 top-5 h-20 w-20 rounded-full border border-[var(--color-primary)]/15" aria-hidden="true" />
      <span className="absolute right-14 top-16 h-10 w-10 rounded-full bg-white/45" aria-hidden="true" />
      <span className="relative text-xs font-bold uppercase text-[var(--color-primary)]">{speciesLabels[animal.species]}</span>
      <span className="relative mt-2 text-3xl font-black text-[var(--color-text)]">{animal.name}</span>
      <span className="relative mt-4 h-1 w-20 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
    </div>
  );
}
