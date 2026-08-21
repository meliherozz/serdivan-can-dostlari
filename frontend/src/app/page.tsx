import Link from 'next/link';
import { AnimalCard } from '@/components/AnimalCard';
import { AnimalImage } from '@/components/AnimalImage';
import { HomeAdoptionProcess } from '@/components/HomeAdoptionProcess';
import { HomeBackgroundVideo } from '@/components/HomeBackgroundVideo';
import { HomeFaqPreview } from '@/components/HomeFaqPreview';
import { StatusBadge } from '@/components/StatusBadge';
import { getAnimalStats, getFAQs, getFeaturedAnimals, getShelterInfo } from '@/lib/strapi/client';

export default async function Home() {
  const [featuredAnimals, stats, faqs, shelter] = await Promise.all([
    getFeaturedAnimals().catch(() => []),
    getAnimalStats().catch(() => ({ total: 0, adopted: 0, available: 0, reserved: 0, unavailable: 0 })),
    getFAQs().catch(() => []),
    getShelterInfo().catch(() => null),
  ]);

  const availableFeatured = featuredAnimals.filter((animal) => animal.adoptionStatus === 'available');
  const heroAnimal = availableFeatured[0] ?? featuredAnimals[0] ?? null;
  const statItems = [
    [stats.total, 'Toplam Can Dostumuz'],
    [stats.available, 'Sahiplenilebilir'],
    [stats.reserved, 'Rezerve'],
    [stats.adopted, 'Yuvasına Kavuştu'],
    ...(stats.unavailable > 0 ? ([[stats.unavailable, 'Bakımda']] as Array<[number, string]>) : []),
  ] as Array<[number, string]>;

  return (
    <div className="relative isolate overflow-hidden">
      <HomeBackgroundVideo />

      <section className="relative z-10 flex min-h-[calc(100svh-69px)] flex-col justify-between border-b border-white/35 bg-transparent">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-8 pt-9 md:grid-cols-[1.03fr_0.97fr] md:items-center lg:gap-10 lg:pb-7 lg:pt-10">
          <div className="section-enter rounded-lg border border-white/40 bg-[rgba(251,250,246,0.9)] p-5 shadow-[0_18px_55px_rgba(31,37,33,0.08)] backdrop-blur-[2px] md:bg-[linear-gradient(90deg,rgba(251,250,246,0.92),rgba(251,250,246,0.74)_68%,rgba(251,250,246,0.3))] md:p-6">
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Dijital Hayvan Sahiplendirme Platformu</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[1.04] text-[var(--color-text)] sm:text-6xl">
              Bir Can Dostuna Yuva Ol
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi&apos;ndeki can dostlarımızı inceleyin ve uygun olanlar için
              sahiplendirme başvurusu oluşturun.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/can-dostlarimiz" className="btn-primary focus-ring px-5 py-3">
                Can Dostlarımızı Gör <span className="arrow-shift" aria-hidden="true">→</span>
              </Link>
              <a href="#sahiplenme-sureci" className="btn-secondary focus-ring bg-white/88 px-5 py-3">
                Sahiplenme Sürecini İncele
              </a>
            </div>
          </div>

          <div className="section-enter group relative">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--color-secondary)] opacity-70" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-lg border border-white/80 bg-white/96 p-3 shadow-[0_24px_70px_rgba(31,37,33,0.22)] backdrop-blur-[2px]">
              <div className="aspect-[4/3] overflow-hidden rounded-md">
                {heroAnimal ? (
                  <AnimalImage animal={heroAnimal} large />
                ) : (
                  <div className="flex h-full min-h-80 flex-col justify-end bg-[var(--color-primary-soft)] p-6">
                    <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Can Dostları</p>
                    <p className="mt-2 max-w-sm text-3xl font-black text-[var(--color-text)]">Yeni yuvasını bekleyen can dostlarımız</p>
                  </div>
                )}
              </div>
              {heroAnimal ? (
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4 rounded-lg border border-white/80 bg-white/96 p-4 shadow-lg backdrop-blur-[2px]">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)]">{heroAnimal.name}</p>
                    <p className="text-xs font-medium text-[var(--color-muted)]">Öne çıkan can dostumuz</p>
                  </div>
                  <StatusBadge status={heroAnimal.adoptionStatus} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map(([value, label]) => (
              <article
                key={label}
                className="interactive-card rounded-lg border border-white/70 bg-white/88 p-5 shadow-[0_14px_36px_rgba(31,37,33,0.12)] backdrop-blur-[3px]"
              >
                <p className="text-4xl font-black text-[var(--color-primary)]">{value}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">{label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-transparent px-4 py-14">
        <div className="mx-auto max-w-6xl rounded-lg border border-[var(--color-border)] bg-[rgba(251,250,246,0.94)] p-5 shadow-[0_24px_70px_rgba(31,37,33,0.09)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Öne çıkanlar</p>
              <h2 className="mt-2 text-4xl font-black text-[var(--color-text)]">Yeni Yuvasını Bekleyenler</h2>
              <p className="mt-3 max-w-2xl text-[var(--color-muted)]">Sahiplenilebilir durumdaki öne çıkarılmış can dostları.</p>
            </div>
            <Link href="/can-dostlarimiz" className="btn-ghost focus-ring px-1 py-2">
              Tümünü gör <span className="arrow-shift" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {availableFeatured.slice(0, 4).map((animal) => (
              <AnimalCard key={animal.documentId ?? animal.id} animal={animal} />
            ))}
          </div>
        </div>
      </section>

      <HomeAdoptionProcess />

      <section className="relative z-10 bg-[rgba(238,226,210,0.92)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="group overflow-hidden rounded-lg border border-white/70 bg-white p-3 shadow-[0_18px_48px_rgba(31,37,33,0.1)]">
            <div className="image-zoom flex aspect-[4/3] flex-col justify-end rounded-md bg-[var(--color-primary-soft)] p-6">
              <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Bakımevi</p>
              <p className="mt-2 max-w-sm text-3xl font-black text-[var(--color-text)]">Bakım, tedavi ve sahiplendirme merkezi</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Serdivan Belediyesi</p>
            <h2 className="mt-2 text-4xl font-black text-[var(--color-text)]">Sahipsiz Hayvanlar Bakımevi</h2>
            <p className="mt-5 max-w-2xl leading-8 text-[var(--color-muted)]">
              {shelter?.description ||
                'Bakımevi hakkında yayınlanmış açıklama bulunmuyor.'}
            </p>
            <Link href="/bakimevi" className="btn-secondary focus-ring mt-7 px-5 py-3">
              Bakımevimizi Tanıyın <span className="arrow-shift" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <HomeFaqPreview faqs={faqs} />
    </div>
  );
}
