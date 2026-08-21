import { getShelterInfo } from '@/lib/strapi/client';

export default async function ShelterPage() {
  const shelter = await getShelterInfo().catch(() => null);

  const details = [
    ['Adres', shelter?.address ?? 'Bilgi bulunmuyor.'],
    ['Telefon', shelter?.phone ?? 'Bilgi bulunmuyor.'],
    ['E-posta', shelter?.email ?? 'Bilgi bulunmuyor.'],
    ['Çalışma saatleri', shelter?.workingHours ?? 'Bilgi bulunmuyor.'],
  ];

  return (
    <div>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-warm)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[0.85fr_1.15fr] md:items-center md:py-14">
          <div className="group overflow-hidden rounded-lg border border-white/70 bg-white p-3 shadow-[0_20px_60px_rgba(31,37,33,0.1)]">
            <div className="image-zoom flex aspect-[4/3] flex-col justify-end rounded-md bg-[var(--color-primary-soft)] p-6">
              <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Bakımevi</p>
              <p className="mt-2 text-3xl font-black text-[var(--color-text)]">Can dostlarımız için güvenli bakım alanı</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-[var(--color-primary)]">Serdivan Belediyesi</p>
            <h1 className="mt-2 text-5xl font-black leading-tight text-[var(--color-text)]">
              {shelter?.name ?? 'Serdivan Belediyesi Sahipsiz Hayvanlar Bakımevi'}
            </h1>
            <p className="mt-5 max-w-3xl leading-8 text-[var(--color-muted)]">
              {shelter?.description ??
                'Bakımevi hakkında yayınlanmış açıklama bulunmuyor.'}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {details.map(([label, value]) => (
            <div key={label} className="interactive-card rounded-lg border border-[var(--color-border)] bg-white p-5">
              <dt className="font-black text-[var(--color-text)]">{label}</dt>
              <dd className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
