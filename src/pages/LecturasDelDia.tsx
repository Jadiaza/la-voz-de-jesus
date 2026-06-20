import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Cross,
  Heart,
  Headphones,
  Music2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LectioDivina,
  LiturgiaDia,
  getTodayLectio,
  getTodayLiturgia,
} from "@/services/sheetsService";

const formatFecha = (fecha?: string) => {
  if (!fecha) return "Meditacion diaria";

  const date = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(date.getTime())) return fecha;

  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const TextBlock = ({
  title,
  subtitle,
  children,
  icon,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-[#d8c9ac] bg-white/85 p-5 shadow-[0_18px_50px_-30px_rgba(28,20,10,0.45)]">
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08203d] text-[#c08a19]">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#071a33]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm font-medium leading-snug text-[#b17a12]">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    <div className="whitespace-pre-line text-[15px] leading-relaxed text-[#13233a]">
      {children}
    </div>
  </section>
);

const LecturasDelDia = () => {
  const [liturgia, setLiturgia] = useState<LiturgiaDia | null>(null);
  const [lectio, setLectio] = useState<LectioDivina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    Promise.all([getTodayLiturgia(), getTodayLectio()])
      .then(([liturgiaData, lectioData]) => {
        if (!mounted) return;
        setLiturgia(liturgiaData);
        setLectio(lectioData);
        setError(!liturgiaData);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const palabraHoy =
    liturgia?.palabra_hoy || "La Palabra para hoy estara disponible pronto.";

  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#071a33]">
      <section className="mx-auto max-w-md px-4 pb-10 pt-5 md:max-w-3xl">
        <header className="mb-5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8c9ac] bg-white text-[#071a33] shadow-sm"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[#b17a12]">
              <BookOpen className="h-5 w-5" />
              Evangelio del Dia
            </div>
            <div className="mt-1 text-xs font-medium capitalize text-[#071a33]/70">
              {formatFecha(liturgia?.fecha)}
            </div>
          </div>
        </header>

        <article className="rounded-2xl border border-[#d8c9ac] bg-gradient-to-br from-white via-[#fffaf0] to-[#f6ead2] p-5 text-center shadow-[0_22px_70px_-38px_rgba(28,20,10,0.55)]">
          <div className="mb-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b17a12]">
            <CalendarDays className="h-4 w-4" />
            Palabra para Hoy
          </div>
          <p className="mx-auto max-w-lg text-xl font-bold leading-snug text-[#071a33]">
            {loading ? "Cargando lecturas..." : palabraHoy}
          </p>
          {liturgia?.evangelio_cita && (
            <div className="mt-4 text-sm font-semibold text-[#b17a12]">
              {liturgia.evangelio_cita}
            </div>
          )}
        </article>

        {error && !loading && (
          <div className="mt-4 rounded-2xl border border-[#d8c9ac] bg-white/85 p-5 text-sm leading-relaxed text-[#13233a]">
            Todavia no hay liturgia publicada para hoy. Cuando el administrador
            publique el contenido, aparecera aqui automaticamente.
          </div>
        )}

        {liturgia && (
          <div className="mt-4 space-y-4">
            {(liturgia.celebracion ||
              liturgia.tiempo_liturgico ||
              liturgia.color_liturgico) && (
              <section className="rounded-2xl border border-[#d8c9ac] bg-white/80 p-4 text-sm text-[#13233a]">
                {liturgia.celebracion && (
                  <div className="font-semibold">{liturgia.celebracion}</div>
                )}
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.12em] text-[#b17a12]">
                  {liturgia.tiempo_liturgico && (
                    <span>{liturgia.tiempo_liturgico}</span>
                  )}
                  {liturgia.color_liturgico && (
                    <span>{liturgia.color_liturgico}</span>
                  )}
                </div>
              </section>
            )}

            <TextBlock
              title="Primera Lectura"
              subtitle={liturgia.primera_lectura_cita}
              icon={<BookOpen className="h-5 w-5" />}
            >
              {liturgia.primera_lectura_texto || "Pendiente de publicar."}
            </TextBlock>

            <TextBlock
              title="Salmo Responsorial"
              subtitle={liturgia.salmo_cita}
              icon={<Music2 className="h-5 w-5" />}
            >
              {liturgia.salmo_respuesta && (
                <strong className="mb-3 block text-[#b17a12]">
                  R. {liturgia.salmo_respuesta}
                </strong>
              )}
              {liturgia.salmo_texto || "Pendiente de publicar."}
            </TextBlock>

            {liturgia.segunda_lectura_texto && (
              <TextBlock
                title="Segunda Lectura"
                subtitle={liturgia.segunda_lectura_cita}
                icon={<BookOpen className="h-5 w-5" />}
              >
                {liturgia.segunda_lectura_texto}
              </TextBlock>
            )}

            <TextBlock
              title="Evangelio"
              subtitle={liturgia.evangelio_cita}
              icon={<Cross className="h-5 w-5" />}
            >
              {liturgia.evangelio_texto || "Pendiente de publicar."}
            </TextBlock>

            <TextBlock
              title="Reflexion LVJ"
              subtitle="La Palabra de hoy para tu vida"
              icon={<Heart className="h-5 w-5" />}
            >
              {lectio?.reflexion ||
                "La reflexion de hoy estara disponible pronto."}
            </TextBlock>

            <TextBlock
              title="Oracion Final"
              icon={<Heart className="h-5 w-5" />}
            >
              {lectio?.oracion ||
                "Senor Jesus, haz que tu palabra transforme mi vida y me acerque mas a ti. Amen."}
            </TextBlock>

            <section className="rounded-2xl border border-[#d8c9ac] bg-white/85 p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#08203d] text-[#c08a19]">
                  <Headphones className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#071a33]">
                    Audio
                  </h2>
                  <p className="text-sm font-medium text-[#b17a12]">
                    Reflexion en audio
                  </p>
                </div>
              </div>
              <button
                className="inline-flex items-center gap-3 rounded-full bg-[#c08a19] px-5 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!lectio?.audio_url}
              >
                <Music2 className="h-4 w-4" />
                Escuchar reflexion
              </button>
            </section>
          </div>
        )}
      </section>
    </main>
  );
};

export default LecturasDelDia;
