/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: QuickAccess.tsx
VERSION: 1.1.0

DESCRIPCION:
Modulo de accesos rapidos a las secciones principales de la aplicacion.
==============================================================================
*/

import { Link } from "react-router-dom";

interface QuickAccessItem {
  image: string;
  label: string;
  to?: string;
}

const items: QuickAccessItem[] = [
  {
    image: "/icons/custodia.png",
    label: "Capilla\nVirtual",
  },
  {
    image: "/icons/rosario.png",
    label: "Rosario",
  },
  {
    image: "/icons/podcast.png",
    label: "Podcast",
  },
  {
    image: "/icons/peticiones.png",
    label: "Peticiones",
  },
  {
    image: "/icons/comunidad.png",
    label: "Comunidad",
  },
  {
    image: "/icons/biblia.png",
    label: "Biblia",
  },
  {
    image: "/icons/programa.png",
    label: "Programacion",
    to: "/programacion",
  },
  {
    image: "/icons/donar.png",
    label: "Donar",
  },
];

const getVisibleItems = (compact: boolean) =>
  compact
    ? [items[0], items[1], items[2], items[3], items[4], items[6]]
    : items;

export const QuickAccess = ({ compact = false }: { compact?: boolean }) => (
  <div>
    <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/90">
      Accesos Rapidos
    </div>

    <div
      className={`grid gap-2.5 ${
        compact ? "grid-cols-3" : "grid-cols-4 md:grid-cols-8"
      }`}
    >
      {getVisibleItems(compact).map((item) => {
        const className =
          "group relative aspect-square rounded-2xl glass gold-border flex flex-col items-center justify-center gap-2.5 p-1.5 hover:bg-[hsl(var(--gold)/0.08)] active:scale-95 transition";
        const content = (
          <>
            <span className="absolute inset-0 rounded-2xl bg-gradient-radial-gold opacity-0 transition group-hover:opacity-60" />

            <img
              src={item.image}
              alt={item.label}
              className="relative h-12 w-12 object-contain"
            />

            <span className="relative whitespace-pre-line text-center text-[10px] font-medium leading-tight text-foreground/85">
              {item.label}
            </span>
          </>
        );

        return item.to ? (
          <Link key={item.label} to={item.to} className={className}>
            {content}
          </Link>
        ) : (
          <button key={item.label} type="button" className={className}>
            {content}
          </button>
        );
      })}
    </div>
  </div>
);
