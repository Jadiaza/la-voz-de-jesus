/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: RadioCard.tsx
VERSION: 2.0.0

DESCRIPCION:
Acceso compacto al reproductor global de radio.
==============================================================================
*/

import { Loader2, Pause, Play, Radio as RadioIcon } from "lucide-react";
import { useRadioPlayer } from "@/context/RadioPlayerContext";

export const RadioCard = () => {
  const { artist, title, status, isPlaying, toggle } = useRadioPlayer();

  return (
    <button
      onClick={toggle}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-gradient-gold px-4 py-3 shadow-gold transition-all hover:scale-[1.01] active:scale-[0.99]"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep/90 shadow-deep">
        {status === "connecting" ? (
          <Loader2 className="h-5 w-5 animate-spin text-gold" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 fill-gold text-gold" />
        ) : (
          <Play className="ml-0.5 h-5 w-5 fill-gold text-gold" />
        )}
      </span>

      <div className="min-w-0 flex-1 text-left">
        <div className="truncate text-[15px] font-bold text-navy-deep/95">
          {isPlaying ? title : "CONECTA TU ESPIRITU"}
        </div>

        {artist && isPlaying && (
          <div className="mt-0.5 truncate text-[12px] font-medium text-navy-deep/70">
            {artist}
          </div>
        )}

        {status === "error" && (
          <div className="mt-1 text-xs text-red-700">
            No se pudo conectar a la transmision
          </div>
        )}
      </div>

      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-deep/15">
        {isPlaying && (
          <span className="absolute inset-0 rounded-full bg-navy-deep/30 animate-ping" />
        )}

        <RadioIcon className="relative h-4 w-4 text-navy-deep" />
      </span>
    </button>
  );
};
