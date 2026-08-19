import type { Animal } from '@/types/domain';

type Props = {
  animal: Animal;
  large?: boolean;
};

export function AnimalImage({ animal, large = false }: Props) {
  const image = animal.featuredImage;

  if (image?.url) {
    return (
      <div
        role="img"
        aria-label={image.alternativeText || `${animal.name} fotoğrafı`}
        className={`h-full w-full bg-cover bg-center ${large ? 'min-h-80' : 'min-h-56'}`}
        style={{ backgroundImage: `url(${image.url})` }}
      />
    );
  }

  return (
    <div
      className={`flex h-full min-h-56 w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-amber-100 p-6 text-center text-sm font-semibold text-stone-700 ${
        large ? 'min-h-80' : ''
      }`}
      role="img"
      aria-label={`${animal.name} için geçici görsel alanı`}
    >
      {animal.name}
    </div>
  );
}
