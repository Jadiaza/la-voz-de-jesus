/*
==============================================================================
PROYECTO: LA VOZ DE JESÚS - PWA RADIO CATÓLICA
COMPONENTE: RadioCard.tsx
VERSIÓN: 1.0.0

DESARROLLADO POR:
Ing. José Alberto Díaz Agresott

PROPIETARIO:
Emisora Católica La Voz de Jesús

UBICACIÓN:
Montería - Córdoba - Colombia

DERECHOS RESERVADOS ©
Emisora La Voz de Jesús

DESCRIPCIÓN:
Componente principal del reproductor de radio.

FUNCIONES:
✓ Reproducción de audio en vivo.
✓ Obtención de metadatos desde Zeno FM.
✓ Visualización del programa o canción actual.
✓ Control Play / Pause.
✓ Manejo de estados del reproductor.
✓ Adaptado para dispositivos móviles.

==============================================================================
*/

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Loader2,
  Radio as RadioIcon,
} from "lucide-react";

/* ==========================================================================
   CONFIGURACIÓN DE STREAM
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
  /**
   * Referencia al reproductor HTML5.
   */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * Estado del reproductor.
   */
  const [status, setStatus] = useState<Status>("idle");

  /**
   * Programa o canción actual.
   */
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("Radio Católica");

  /* ========================================================================
     INICIALIZACIÓN DEL AUDIO
     ======================================================================== */

  useEffect(() => {
    const a = new Audio(STREAM_URL);

    a.preload = "metadata";
    a.crossOrigin = "anonymous";

    audioRef.current = a;

    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("connecting");
    const onError = () => setStatus("error");

    const onPause = () =>
      setStatus((s) => (s === "playing" ? "idle" : s));

    a.addEventListener("playing", onPlaying);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("error", onError);
    a.addEventListener("pause", onPause);

    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  /* ========================================================================
     RECEPCIÓN DE METADATOS DESDE ZENO FM
     ======================================================================== */

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

  /* ========================================================================
     PLAY / PAUSE
     ======================================================================== */

  const toggle = async () => {
    const a = audioRef.current;

    if (!a) return;

    if (status === "playing" || status === "connecting") {
      a.pause();
      setStatus("idle");
    } else {
      setStatus("connecting");

      try {
        a.load();
        await a.play();
      } catch (err) {
        console.error("Error al reproducir:", err);
        setStatus("error");
      }
    }
  };

  /* ========================================================================
     VARIABLES DERIVADAS
     ======================================================================== */

  /**
   * Determina si la radio está activa.
   */
  const isOn =
    status === "playing" || status === "connecting";

  /**
   * Limpia numeraciones o prefijos.
   */
  const cleanTitle = title
    .replace(/^\d+\.\s*/, "")
    .replace(/^Track\s*\d+\s*-\s*/i, "")
    .trim();

  /**
   * Convierte:
   *
   * CORONILLA DIVINA MISERICORDIA
   *
   * en:
   *
   * Coronilla Divina Misericordia
   */
  const titleCase = cleanTitle
     .toLowerCase()
     .replace(/\b\w/g, (l: string) => l.toUpperCase());

  const artistCase = artist
    .toLowerCase()
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  /* ========================================================================
     RENDER
     ======================================================================== */

  return (
    <button
      onClick={toggle}
      className="group w-full relative overflow-hidden rounded-2xl bg-gradient-gold shadow-gold px-4 py-3 flex items-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-all"
    >
      {/* ==========================================================
          BOTÓN PLAY / PAUSE
          ========================================================== */}

      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep/90 shadow-deep">
        {status === "connecting" ? (
          <Loader2 className="h-5 w-5 text-gold animate-spin" />
        ) : isOn ? (
          <Pause className="h-5 w-5 text-gold fill-gold" />
        ) : (
          <Play className="h-5 w-5 text-gold fill-gold ml-0.5" />
        )}
      </span>

      {/* ==========================================================
          INFORMACIÓN PRINCIPAL
          ========================================================== */}

      <div className="flex-1 text-left min-w-0">
        {/* Marca */}
         <div className="text-[15px] font-bold text-navy-deep/95 truncate">
         {isOn ? titleCase : "CONECTA TU ESPIRITU"}
         </div>
              
        {/* Programa actual */}
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

      {/* ==========================================================
          INDICADOR VISUAL
          ========================================================== */}

      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep/15 shrink-0">
        {isOn && (
          <span className="absolute inset-0 rounded-full animate-ping bg-navy-deep/30" />
        )}

        <RadioIcon className="h-4 w-4 text-navy-deep relative" />
      </span>
    </button>
  );
};