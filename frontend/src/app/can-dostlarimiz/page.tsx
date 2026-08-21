import { AnimalCard } from '@/components/AnimalCard';
import { AnimalFilters } from '@/components/AnimalFilters';
import { getAnimals } from '@/lib/strapi/client';

type AnimalsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AnimalsPage({ searchParams }: AnimalsPageProps) {
  const params = await searchParams;
  const animalResult = await getAnimals({
    species: typeof params.species === 'string' ? params.species : undefined,
    gender: typeof params.gender === 'string' ? params.gender : undefined,
    ageGroup: typeof params.ageGroup === 'string' ? params.ageGroup : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
    adoptionStatus: typeof params.adoptionStatus === 'string' ? params.adoptionStatus : undefined,
  })
    .then((items) => ({ animals: items, loadError: false }))
    .catch(() => ({ animals: [], loadError: true }));

  const { animals, loadError } = animalResult;

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Katalog</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-5xl font-black leading-tight text-[var(--color-text)]">Can Dostlarımız</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
                Yeni yuvasını bekleyen can dostlarımızı filtreleyerek inceleyebilirsiniz.
              </p>
            </div>
            <p className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-primary)]">
              {animals.length} can dostu bulundu
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <AnimalFilters />

        {loadError ? (
          <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-white p-10 text-center text-[var(--color-muted)]">
            Can dostlarımız şu anda görüntülenemiyor. Lütfen daha sonra tekrar deneyin.
          </div>
        ) : animals.length > 0 ? (
          <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
            {animals.map((animal) => (
              <AnimalCard key={animal.documentId ?? animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-white p-10 text-center text-[var(--color-muted)]">
            Bu filtrelerle eşleşen kayıt bulunamadı.
          </div>
        )}
      </section>
    </div>
  );
}
