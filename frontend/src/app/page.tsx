import Link from 'next/link';
import { AnimalCard } from '@/components/AnimalCard';
import { getFAQs, getFeaturedAnimals, getShelterInfo } from '@/lib/strapi/client';

export default async function Home() {
  const [featuredAnimals, faqs, shelter] = await Promise.all([
    getFeaturedAnimals().catch(() => []),
    getFAQs().catch(() => []),
    getShelterInfo().catch(() => null),
  ]);

  return (
    <div>
      <section className="bg-emerald-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-100">Serdivan Belediyesi</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">Bir Can Dostuna Yuva Ol</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
              Bakımevindeki sahiplendirilebilir hayvanları inceleyin, size uygun can dostu için güvenli başvuru yapın.
            </p>
            <Link
              href="/can-dostlarimiz"
              className="mt-8 inline-flex rounded-md bg-white px-5 py-3 font-semibold text-emerald-900 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-900"
            >
              Can Dostlarımızı Gör
            </Link>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/10 p-6">
            <p className="text-sm text-emerald-100">Bakımevi</p>
            <h2 className="mt-2 text-2xl font-semibold">{shelter?.name ?? 'Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi'}</h2>
            <p className="mt-4 text-emerald-50">
              {shelter?.description ?? 'Demo içerik Strapi üzerinden seed edildikten sonra burada görüntülenecektir.'}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Öne Çıkan Can Dostları</h2>
            <p className="mt-2 text-stone-600">Strapi üzerinden gelen yayınlanmış demo kayıtları.</p>
          </div>
          <Link href="/can-dostlarimiz" className="font-semibold text-emerald-800 hover:text-emerald-900">
            Tümünü gör
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredAnimals.slice(0, 4).map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          {['İncele', 'Başvur', 'İletişim'].map((title, index) => (
            <div key={title}>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100 font-bold text-emerald-900">{index + 1}</div>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-stone-600">
                {index === 0 && 'Sahiplendirilebilir hayvanları filtreleyerek size uygun dostu bulun.'}
                {index === 1 && 'Formu doldurun; referans numaranız backend tarafından oluşturulsun.'}
                {index === 2 && 'Belediye personeli başvurunuzu Strapi Admin üzerinden değerlendirsin.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-bold">Sık Sorulan Sorular</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.slice(0, 4).map((faq) => (
            <article key={faq.id} className="rounded-lg border border-stone-200 bg-white p-5">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
