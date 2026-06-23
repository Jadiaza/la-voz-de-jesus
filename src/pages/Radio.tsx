import {
  ArrowLeft,
  CalendarDays,
  Church,
  Headphones,
  Loader2,
  Pause,
  Play,
  Radio as RadioIcon,
  Share2,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/lvdj/BottomNav";
import { Logo } from "@/components/lvdj/Logo";
import { useRadioPlayer } from "@/context/RadioPlayerContext";
import {
  ProgramacionRadio,
  getPublishedProgramacion,
} from "@/services/sheetsService";
import {
  formatTime,
  getNextProgram,
  isProgramLive,
} from "@/utils/programacion";
import monstranceImage from "@/assets/monstrance-hero.jpg";

const fallbackSchedule: ProgramacionRadio[] = [
  {
    id: "santo-rosario",
    dia_semana: "diario",
    hora_inicio: "06:00",
    hora_fin: "07:00",
    programa: "Santo Rosario",
    descripcion: "Meditacion de los misterios del Rosario.",
    imagen_url: "",
    estado: "publicado",
  },
  {
    id: "santa-misa",
    dia_semana: "diario",
    hora_inicio: "10:00",
    hora_fin: "11:00",
    programa: "Santa Misa",
    descripcion: "Celebracion de la Eucaristia.",
    imagen_url: "",
    estado: "publicado",
  },
  {
    id: "adoracion",
    dia_semana: "diario",
    hora_inicio: "19:00",
    hora_fin: "20:00",
    programa: "Adoracion Eucaristica",
    descripcion: "Un tiempo para adorar al Senor en el Santisimo.",
    imagen_url: "",
    estado: "publicado",
  },
];

const statusLabel = {
  idle: "Pausado",
  connecting: "Conectando...",
  playing: "En vivo",
  error: "Error de conexion",
};

const quickLinks = [
  { label: "Oracion", to: "/", icon: Church },
  { label: "Evangelio", to: "/lecturas-del-dia" },
  { label: "Podcast", to: "/" },
  { label: "Programacion", to: "/programacion" },
];

const Radio = () => {
  const navigate = useNavigate();
  const player = useRadioPlayer();
  const [programacion, setProgramacion] = useState<ProgramacionRadio[]>([]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let mounted = true;

    getPublishedProgramacion()
      .then((data) => {
        if (mounted) setProgramacion(data);
      })
      .catch(() => {
        if (mounted) setProgramacion([]);
      });

    const timer = window.setInterval(() => setNow(new Date()), 60_000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const schedule = programacion.length ? programacion : fallbackSchedule;
  const currentProgram = useMemo(
    () => schedule.find((program) => isProgramLive(program, now)) ?? null,
    [now, schedule],
  );
  const nextProgram = useMemo(
    () => getNextProgram(schedule, now),
    [now, schedule],
  );

  const programName = currentProgram?.programa ?? player.title;
  const programTime = currentProgram
    ? `${formatTime(currentProgram.hora_inicio)} - ${formatTime(
        currentProgram.hora_fin,
      )}`
    : "Senal en vivo 24/7";

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  const shareRadio = async () => {
    const url = window.location.href;
    const text = "Escucha La Voz de Jesus en vivo";

    try {
      if (navigator.share) {
        await navigator.share({ title: "La Voz de Jesus", text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("No se pudo compartir la radio:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-navy-deep text-foreground">
      <header className="border-b border-gold/15 bg-navy-deep/95">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-6 xl:px-8">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full gold-border text-gold transition hover:bg-gold/10"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <Logo size="sm" className="justify-center" />

          <Link
            to="/programacion"
            className="inline-flex h-10 items-center gap-2 rounded-lg gold-border px-3 text-[11px] font-extrabold uppercase text-gold transition hover:bg-gold/10 sm:px-4"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Programacion</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-6 px-4 pb-32 pt-6 sm:px-6 xl:grid-cols-[0.8fr_1.15fr_0.8fr] xl:px-8 xl:pb-12 xl:pt-10">
        <section className="hidden rounded-2xl gold-border bg-navy-deep/45 p-6 shadow-deep xl:block">
          <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
            La Voz de Jesus
          </div>
          <h1 className="text-3xl font-bold leading-tight">
            Tu emisora catolica en vivo
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/72">
            Una experiencia sencilla para orar, escuchar y permanecer conectado
            con nuestra comunidad.
          </p>
        </section>

        <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center rounded-2xl gold-border bg-navy-deep/45 p-5 text-center shadow-deep sm:p-8 xl:min-h-[640px]">
          <div className="relative mb-7 flex h-52 w-52 items-center justify-center rounded-full sm:h-64 sm:w-64">
            <div className="absolute inset-0 rounded-full bg-gradient-radial-gold opacity-70 blur-sm shimmer" />
            <div className="absolute inset-6 rounded-full border border-gold/30 bg-black/25" />
            <img
              src={monstranceImage}
              alt=""
              className="relative h-40 w-40 rounded-full object-cover shadow-deep sm:h-52 sm:w-52"
            />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/35 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold">
            <span className="h-2 w-2 rounded-full bg-gold live-pulse" />
            {statusLabel[player.status]}
          </div>

          <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
            {programName}
          </h2>
          <p className="mt-2 text-sm font-semibold text-gold">{programTime}</p>
          {player.artist && (
            <p className="mt-2 text-sm text-foreground/60">{player.artist}</p>
          )}

          <button
            type="button"
            onClick={player.toggle}
            className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold text-navy-deep shadow-gold transition hover:scale-[1.02] active:scale-[0.98]"
            aria-label={player.isPlaying ? "Pausar" : "Reproducir"}
          >
            {player.status === "connecting" ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : player.isPlaying ? (
              <Pause className="h-9 w-9 fill-current" />
            ) : (
              <Play className="ml-1 h-9 w-9 fill-current" />
            )}
          </button>

          <div className="mt-8 flex w-full max-w-sm items-center gap-3">
            <Volume2 className="h-5 w-5 text-gold" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={player.volume}
              onChange={(event) => player.setVolume(Number(event.target.value))}
              className="w-full accent-gold"
              aria-label="Volumen"
            />
          </div>

          <button
            type="button"
            onClick={shareRadio}
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-foreground/65 transition hover:text-gold"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl gold-border bg-navy-deep/45 p-5 shadow-deep">
            <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
              Sigue despues
            </div>
            <h3 className="text-xl font-bold">
              {nextProgram?.programa ?? "Programacion continua"}
            </h3>
            <p className="mt-2 text-sm font-semibold text-gold">
              {nextProgram ? formatTime(nextProgram.hora_inicio) : "24/7"}
            </p>
          </section>

          <section className="rounded-2xl gold-border bg-navy-deep/45 p-5 shadow-deep">
            <div className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
              <Headphones className="h-4 w-4" />
              Accesos rapidos
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-xl gold-border px-3 py-3 text-center text-xs font-bold uppercase text-foreground/75 transition hover:bg-gold/10 hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl gold-border bg-navy-deep/45 p-4 text-center shadow-deep xl:min-h-[90px]">
            <div className="text-xs font-extrabold uppercase tracking-wide text-foreground/75">
              Espacio publicitario
            </div>
            <div className="mt-2 text-2xl font-bold">Tu marca aqui</div>
            <div className="mt-1 text-xs text-foreground/60">
              Llega a nuestra comunidad
            </div>
            <button
              type="button"
              onClick={() => navigate("/contacto")}
              className="mt-4 rounded-lg bg-gradient-gold px-4 py-2 text-xs font-bold text-navy-deep shadow-gold"
            >
              Anunciate
            </button>
          </section>
        </aside>
      </main>

      <BottomNav activeLabel="Radio" />
    </div>
  );
};

export default Radio;
