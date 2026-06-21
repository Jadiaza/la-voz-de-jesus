/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: QuickAccess.tsx
VERSION: 1.0.0

DESARROLLADO POR:
Ing. Jose Alberto Diaz Agresott

PROPIETARIO:
Emisora Catolica La Voz de Jesus

UBICACION:
Monteria - Cordoba - Colombia

DERECHOS RESERVADOS
Emisora La Voz de Jesus

DESCRIPCION:
Modulo de accesos rapidos a las secciones principales de la aplicacion.

FUNCIONES:
- Presenta accesos visuales con iconos propios de la marca.
- Muestra seis accesos en modo compacto para mobile.
- Muestra todos los accesos disponibles en tablet y escritorio.
- Mantiene el estilo oscuro/dorado del home principal.

==============================================================================
*/

interface QuickAccessItem {
  image: string;
  label: string;
}

/* ==========================================================================
   ACCESOS DISPONIBLES
   ========================================================================== */

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
    label: "Programa",
  },
  {
    image: "/icons/donar.png",
    label: "Donar",
  },
];

export const QuickAccess = ({ compact = false }: { compact?: boolean }) => (
  <div>
    <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/90 mb-3 px-1">
      Accesos Rápidos
    </div>

    <div
      className={`grid gap-2.5 ${
        compact ? "grid-cols-3" : "grid-cols-4 md:grid-cols-8"
      }`}
    >
      {(compact ? items.slice(0, 6) : items).map((item) => (
        <button
          key={item.label}
          className="group relative aspect-square rounded-2xl glass gold-border flex flex-col items-center justify-center gap-2.5 p-1.5 hover:bg-[hsl(var(--gold)/0.08)] active:scale-95 transition"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-radial-gold opacity-0 group-hover:opacity-60 transition" />

          <img
            src={item.image}
            alt={item.label}
            className="relative h-12 w-12 object-contain"
          />

          <span className="relative text-[10px] leading-tight text-center text-foreground/85 font-medium whitespace-pre-line">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  </div>
);
