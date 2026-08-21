import Link from 'next/link';

const footerLinks = [
  { href: '/can-dostlarimiz', label: 'Can Dostlarımız' },
  { href: '/bakimevi', label: 'Bakımevi' },
  { href: '/sss', label: 'Sık Sorulan Sorular' },
  { href: '/gizlilik', label: 'Gizlilik' },
];

export function SiteFooter() {
  return (
    <footer className="bg-[var(--color-dark)] text-stone-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-bold">Serdivan Belediyesi</p>
          <p className="mt-1 text-2xl font-black uppercase">Can Dostları</p>
          <p className="mt-3 max-w-md text-stone-300">Dijital Hayvan Sahiplendirme Platformu</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:justify-self-end">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring group relative w-fit py-1 font-semibold text-stone-300 hover:text-white"
            >
              {link.label}
              <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-200 transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-stone-400">© 2026</div>
      </div>
    </footer>
  );
}
