import Link from 'next/link';

const navItems = [
  { href: '/can-dostlarimiz', label: 'Can Dostlarımız' },
  { href: '/bakimevi', label: 'Bakımevi' },
  { href: '/sss', label: 'SSS' },
  { href: '/gizlilik', label: 'Gizlilik' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="leading-tight text-stone-950">
          <span className="block text-sm font-semibold">Serdivan Belediyesi</span>
          <span className="block text-lg font-bold">Can Dostları</span>
        </Link>
        <nav aria-label="Ana menü" className="flex flex-wrap gap-2 text-sm font-medium text-stone-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
