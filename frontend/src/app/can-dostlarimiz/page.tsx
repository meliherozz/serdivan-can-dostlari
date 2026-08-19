import { AnimalCard } from '@/components/AnimalCard';
import { AnimalFilters } from '@/components/AnimalFilters';
import { getAnimals } from '@/lib/strapi/client';

type AnimalsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AnimalsPage({ searchParams }: AnimalsPageProps) {
  const params = await searchParams;
  const animals = await getAnimals({
    species: typeof params.species === 'string' ? params.species : undefined,
    gender: typeof params.gender === 'string' ? params.gender : undefined,
    ageGroup: typeof params.ageGroup === 'string' ? params.ageGroup : undefined,
    size: typeof params.size === 'string' ? params.size : undefined,
  }).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Can Dostlarımız</h1>
      <p className="mt-2 max-w-2xl text-stone-600">Yayınlanmış demo kayıtları tür, cinsiyet, yaş ve boyuta göre filtreleyebilirsiniz.</p>
      <div className="mt-6">
        <AnimalFilters />
      </div>
      {animals.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600">
          Bu filtrelerle eşleşen kayıt bulunamadı.
        </div>
      )}
    </div>
  );
}
