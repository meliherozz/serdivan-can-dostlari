'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/can-dostlarimiz', label: 'Can Dostlarımız' },
  { href: '/bakimevi', label: 'Bakımevi' },
  { href: '/sss', label: 'Sık Sorulan Sorular' },
];

const isActivePath = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="focus-ring rounded-md leading-tight text-[var(--color-text)]" onClick={() => setOpen(false)}>
          <span className="block text-sm font-bold">Serdivan Belediyesi</span>
          <span className="block text-lg font-black uppercase">Can Dostları</span>
        </Link>

        <button
          type="button"
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text)] md:hidden"
          aria-expanded={open}
          aria-controls="site-navigation"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          onClick={() => setOpen((current) => !current)}
        >
          <span aria-hidden="true" className="grid gap-1">
            <span className={`block h-0.5 w-5 bg-current transition ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </span>
        </button>

        <nav aria-label="Ana menü" className="hidden items-center gap-6 text-sm font-bold text-[var(--color-muted)] md:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`focus-ring group relative py-2 transition-colors duration-150 hover:text-[var(--color-primary)] ${
                  active ? 'text-[var(--color-primary)]' : ''
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-0.5 bg-[var(--color-primary)] transition-all duration-200 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      <nav
        id="site-navigation"
        aria-label="Mobil ana menü"
        className={`${open ? 'block' : 'hidden'} border-t border-[var(--color-border)] bg-white px-4 py-3 md:hidden`}
      >
        <div className="mx-auto grid max-w-6xl gap-1">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`focus-ring rounded-md px-3 py-3 text-base font-bold ${
                  active ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
