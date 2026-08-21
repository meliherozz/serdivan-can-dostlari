'use client';

import { useEffect, useState } from 'react';

export function HomeBackgroundVideo() {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {!reducedMotion ? (
        <video
          className="homepage-video h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/can-dostlari-hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_70%_20%,rgba(21,92,67,0.22),transparent_34rem),linear-gradient(115deg,rgba(238,226,210,0.82),rgba(231,242,236,0.72))]" />
      )}
      <div className="absolute inset-0 bg-[rgba(251,250,246,0.18)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(243,239,230,0.42),rgba(231,242,236,0.2)_46%,rgba(238,226,210,0.34))]" />
    </div>
  );
}
