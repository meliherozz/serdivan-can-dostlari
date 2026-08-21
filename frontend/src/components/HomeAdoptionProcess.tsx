import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Başvuru',
    description: 'Sahiplenme başvurunuzu online olarak oluşturun.',
    icon: <path d="M7 4h7l3 3v13H7V4Zm7 0v4h4M10 12h6M10 16h6" />,
  },
  {
    number: '02',
    title: 'Değerlendirme',
    description: 'Ekibimiz başvurunuzu değerlendirir.',
    icon: (
      <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0" />
    ),
  },
  {
    number: '03',
    title: 'Tanışma',
    description: 'Can dostunuzla bir araya gelirsiniz.',
    icon: <path d="M4 11 12 4l8 7v9h-5v-5H9v5H4v-9Zm6 1h4" />,
  },
  {
    number: '04',
    title: 'Yuva',
    description: 'Yeni hayatınıza birlikte başlanır.',
    icon: <path d="M12 20s-7-4.4-9-9a4.6 4.6 0 0 1 8-4.2A4.6 4.6 0 0 1 19 11c-2 4.6-7 9-7 9Z" />,
  },
];

export function HomeAdoptionProcess() {
  return (
    <section id="sahiplenme-sureci" className="relative z-10 px-4 py-14">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_16%_0%,rgba(152,211,177,0.24),transparent_26rem),linear-gradient(135deg,#0c2b20,#155c43_52%,#0f3c2d)] px-5 py-8 text-white shadow-[0_24px_70px_rgba(16,37,28,0.26)] md:px-8 md:py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-emerald-200">Sahiplenme Süreci</p>
            <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">Sahiplenme Süreci</h2>
            <p className="mt-4 max-w-2xl leading-7 text-emerald-50/80">
              Can dostumuzu sahiplenmek için izlemeniz gereken adımlar.
            </p>
          </div>
          <Link href="/sss" className="btn-secondary focus-ring shrink-0 border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.16]">
            Tüm adımları incele <span className="arrow-shift" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative mt-10">
          <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-white/25 md:block" aria-hidden="true" />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="group relative rounded-lg border border-white/10 bg-white/[0.06] p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09]"
              >
                <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white text-[var(--color-primary)] shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition duration-200 group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </svg>
                </div>
                <p className="mt-5 text-sm font-black text-emerald-200">{step.number}</p>
                <h3 className="mt-2 text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-emerald-50/80">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
