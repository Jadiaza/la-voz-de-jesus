/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: ProgramCard.tsx
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
Tarjeta informativa del proximo programa de la emisora.

FUNCIONES:
- Muestra el nombre del proximo programa.
- Muestra la hora de emision.
- Ofrece acceso a la programacion completa.
- Incluye variante compacta para la version de escritorio.

==============================================================================
*/

import { Clock, ChevronRight } from "lucide-react";

/* ==========================================================================
   PROPIEDADES DEL COMPONENTE
   ========================================================================== */

export const ProgramCard = ({
  title = "Santa Misa",
  time = "10:00 AM",
  className = "",
  compact = false,
}: {
  title?: string;
  time?: string;
  className?: string;
  compact?: boolean;
}) => (
  <article
    className={`relative overflow-hidden rounded-2xl glass gold-border flex items-center gap-4 ${
      compact ? "p-4" : "p-5"
    } ${className}`}
  >
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-2 ${compact ? "mb-1.5" : "mb-2"}`}>
        <Clock className="h-4 w-4 text-gold" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          Proximo Programa
        </span>
      </div>

      <div className={`font-display leading-tight ${compact ? "text-xl" : "text-2xl"}`}>
        {title}
      </div>

      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-gold/70" /> {time}
      </div>
    </div>

    <button className="shrink-0 inline-flex items-center gap-1 gold-border rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold hover:bg-gold/10 transition">
      Ver Programacion <ChevronRight className="h-3 w-3" />
    </button>
  </article>
);
