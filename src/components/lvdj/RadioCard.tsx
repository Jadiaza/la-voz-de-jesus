/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: RadioCard.tsx
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
Componente principal del reproductor de radio.

FUNCIONES:
- Reproduce el audio en vivo de la emisora.
- Obtiene metadatos desde Zeno FM.
- Visualiza el programa o cancion actual.
- Controla los estados Play, Pause, Connecting y Error.
- Se adapta a mobile, tablet y escritorio.

==============================================================================
*/

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, Radio as RadioIcon } from "lucide-react";

/* ==========================================================================
   CONFIGURACION DE STREAM
   ========================================================================== */

/**
 * Stream principal de la emisora.
 */
const STREAM_URL = "https://stream.zeno.fm/phybdd3ph98uv";

/**
 * Endpoint de metadatos de Zeno FM.
 */
const META_URL =
  "https://api.zeno.fm/mounts/metadata/subscribe/phybdd3ph98uv";

/* ==========================================================================
   TIPOS
   ========================================================================== */

type Status = "idle" | "connecting" | "playing" | "error";

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */

export const RadioCard = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("Radio Católica");

  /* =========================================================================
     INICIALIZACION DEL AUDIO
     ========================================================================= */

  useEffect(() => {
    const audio = new Audio(STREAM_URL);

    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";

    audioRef.current = audio;

    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("connecting");
    const onError = () => setStatus("error");
    const onPause = () =>
      setStatus((currentStatus) =>
        currentStatus === "playing" ? "idle" : currentStatus
      );

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  /* =========================================================================
     RECEPCION DE METADATOS DESDE ZENO FM
     ========================================================================= */

  useEffect(() => {
    const meta = new EventSource(META_URL);

    meta.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data?.streamTitle) {
          const parts = data.streamTitle.split(" - ");

          if (parts.length > 1) {
            setArtist(parts[0].trim());
            setTitle(parts.slice(1).join(" - ").trim());
          } else {
            setArtist("");
            setTitle(data.streamTitle);
          }
        }
      } catch (err) {
        console.error("Metadata error:", err);
      }
    };

    return () => {
      meta.close();
    };
  }, []);

  /* =========================================================================
     PLAY / PAUSE
     ========================================================================= */

  const toggle = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (status === "playing" || status === "connecting") {
      audio.pause();
      setStatus("idle");
      return;
    }

    setStatus("connecting");

    try {
      audio.load();
      await audio.play();
    } catch (err) {
      console.error("Error al reproducir:", err);
      setStatus("error");
    }
  };

  /* =========================================================================
     VARIABLES DERIVADAS
     ========================================================================= */

  const isOn = status === "playing" || status === "connecting";

  const cleanTitle = title
    .replace(/^\d+\.\s*/, "")
    .replace(/^Track\s*\d+\s*-\s*/i, "")
    .trim();

  const titleCase = cleanTitle
    .toLowerCase()
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());

  const artistCase = artist
    .toLowerCase()
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());

  /* =========================================================================
     RENDER
     ========================================================================= */

  return (
    <button
      onClick={toggle}
      className="group w-full relative overflow-hidden rounded-2xl bg-gradient-gold shadow-gold px-4 py-3 flex items-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-all"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep/90 shadow-deep">
        {status === "connecting" ? (
          <Loader2 className="h-5 w-5 text-gold animate-spin" />
        ) : isOn ? (
          <Pause className="h-5 w-5 text-gold fill-gold" />
        ) : (
          <Play className="h-5 w-5 text-gold fill-gold ml-0.5" />
        )}
      </span>

      <div className="flex-1 text-left min-w-0">
        <div className="text-[15px] font-bold text-navy-deep/95 truncate">
          {isOn ? titleCase : "CONECTA TU ESPIRITU"}
        </div>

        {artistCase && isOn && (
          <div className="text-[12px] font-medium text-navy-deep/70 truncate mt-0.5">
            {artistCase}
          </div>
        )}

        {status === "error" && (
          <div className="text-xs text-red-700 mt-1">
            No se pudo conectar a la transmisión
          </div>
        )}
      </div>

      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep/15 shrink-0">
        {isOn && (
          <span className="absolute inset-0 rounded-full animate-ping bg-navy-deep/30" />
        )}

        <RadioIcon className="h-4 w-4 text-navy-deep relative" />
      </span>
    </button>
  );
};
