import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cross,
  Heart,
  Headphones,
  Home,
  Menu,
  MessageCircleQuestion,
  Mic2,
  Music2,
  Play,
  Quote,
  Radio,
  Settings,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Logo } from "@/components/lvdj/Logo";
import {
  LectioDivina,
  LiturgiaDia,
  SantoDelDia,
  getPublishedLectios,
  getPublishedLiturgias,
  getPublishedSantosDelDia,
  getTodayLectio,
  getTodayLiturgia,
  getTodaySantoDelDia,
  getTodayISO,
} from "@/services/sheetsService";

type LecturasTab = "liturgia" | "santo" | "lectio";

interface LecturasCache {
  liturgias: LiturgiaDia[];
  lectios: LectioDivina[];
  santos: SantoDelDia[];
}

const CACHE_KEY = "lvj_lecturas_publicadas_v7";

const liturgicalColorMap: Record<string, string> = {
  verde:
    "radial-gradient(circle at 35% 30%, #b8f7c5 0%, #3bb96f 38%, #087a3d 100%)",
  ordinario:
    "radial-gradient(circle at 35% 30%, #b8f7c5 0%, #3bb96f 38%, #087a3d 100%)",
  blanco:
    "radial-gradient(circle at 35% 30%, #ffffff 0%, #fff1b8 45%, #d4af37 100%)",
  rojo:
    "radial-gradient(circle at 35% 30%, #ffb3b3 0%, #d62828 42%, #7a0000 100%)",
  morado:
    "radial-gradient(circle at 35% 30%, #e6c9ff 0%, #8e44ad 42%, #4b1d66 100%)",
  rosa:
    "radial-gradient(circle at 35% 30%, #ffd6e7 0%, #e86aa0 42%, #9c2f5f 100%)",
  dorado:
    "radial-gradient(circle at 35% 30%, #fff2b8 0%, #d4af37 45%, #8a6500 100%)",
};

const formatFecha = (fecha?: string) => {
  if (!fecha) return "Meditación diaria";

  const date = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(date.getTime())) return fecha;

  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDiaSelector = (fecha: string) => {
  const date = new Date(`${fecha}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { day: fecha, weekday: "" };
  }

  return {
    day: date.toLocaleDateString("es-CO", { day: "2-digit" }),
    weekday: date.toLocaleDateString("es-CO", { weekday: "short" }),
  };
};

const normalizeLiturgicalColor = (color?: string) =>
  color?.trim().toLowerCase() ?? "";

const getLiturgicalColorValue = (color?: string) =>
  liturgicalColorMap[normalizeLiturgicalColor(color)] ??
  liturgicalColorMap.dorado;

const stripOuterQuotes = (value: string) =>
  value.replace(/^[«"“]\s*/, "").replace(/\s*[»"”]$/, "");

const compactText = (value?: string, maxLength = 150) => {
  const normalized = (value ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength).trim()}...`
    : normalized;
};

const formatPsalmResponse = (value?: string) => {
  if (!value) return "";

  const response = value.trim().replace(/^R[./]\s*/i, "");
  return response ? `R/. ${response}` : "";
};

const renderPsalmLine = (value: string) =>
  value.split(/(R[./])/gi).map((part, index) => {
    if (/^R[./]$/i.test(part)) {
      return (
        <span key={`${part}-${index}`} className="font-normal text-[#b17a12]">
          R/.
        </span>
      );
    }

    return part;
  });

const renderPreservedText = (
  value: string | undefined,
  fallback: string,
  renderLine: (line: string) => ReactNode = (line) => line,
) => {
  const text = value?.trimEnd() || fallback;
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((paragraph, paragraphIndex) => {
    const lines = paragraph.split("\n");

    return (
      <p
        key={`${paragraph.slice(0, 24)}-${paragraphIndex}`}
        className="mb-5 last:mb-0"
      >
        {lines.map((line, lineIndex) => (
          <Fragment key={`${lineIndex}-${line.slice(0, 12)}`}>
            {renderLine(line)}
            {lineIndex < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </p>
    );
  });
};

const readLecturasCache = (): LecturasCache | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as LecturasCache;
    if (
      !Array.isArray(parsed.liturgias) ||
      !Array.isArray(parsed.lectios) ||
      !Array.isArray(parsed.santos)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const writeLecturasCache = (cache: LecturasCache) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Si storage falla, la vista sigue funcionando con memoria.
  }
};

const TabButton = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
      active
        ? "bg-[#082347] text-white shadow-[0_8px_20px_-14px_rgba(8,35,71,0.9)]"
        : "text-[#071a33] hover:bg-[#f7ead1]"
    }`}
  >
    {children}
  </button>
);

const CompactReadingCard = ({
  title,
  subtitle,
  text,
  icon,
}: {
  title: string;
  subtitle?: string;
  text?: string;
  icon: ReactNode;
}) => {
  if (!text) return null;

  return (
    <article className="group rounded-xl border border-[#e6d8bf] bg-white p-4 shadow-[0_12px_32px_-28px_rgba(8,35,71,0.45)] transition hover:border-[#d4af37]/70">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7ead1] text-[#c08a19] shadow-inner">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#082347]">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-sm font-medium text-[#8e6413]">
                  {subtitle}
                </p>
              )}
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#8e6413] transition group-hover:translate-x-0.5" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#102039]">
            {compactText(text)}
          </p>
        </div>
      </div>
    </article>
  );
};

const LectioCard = ({
  title,
  text,
  icon,
}: {
  title: string;
  text?: string;
  icon: ReactNode;
}) => {
  if (!text) return null;

  return (
    <article className="rounded-xl border border-[#e6d8bf] bg-white p-4 shadow-[0_12px_32px_-28px_rgba(8,35,71,0.45)]">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c69222] text-white">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#082347]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#102039]">
            {compactText(text, 220)}
          </p>
        </div>
      </div>
    </article>
  );
};

const AccordionBlock = ({
  title,
  children,
}: {
  title: string;
  children?: string;
}) => {
  const [open, setOpen] = useState(false);

  if (!children) return null;

  return (
    <div className="rounded-xl border border-[#e6d8bf] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-bold text-[#082347]"
      >
        <span>{title}</span>
        <span className="text-xl leading-none text-[#8e6413]">
          {open ? "-" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t border-[#e6d8bf] px-4 py-4 text-sm leading-[1.75] text-[#102039]">
          {renderPreservedText(children, "")}
        </div>
      )}
    </div>
  );
};

const FullReadingBlock = ({
  title,
  subtitle,
  text,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  text?: string;
  icon: ReactNode;
  children?: ReactNode;
}) => {
  if (!text && !children) return null;

  return (
    <section className="rounded-xl border border-[#e6d8bf] bg-white p-5 shadow-[0_12px_32px_-28px_rgba(8,35,71,0.45)]">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7ead1] text-[#c08a19] shadow-inner">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#082347]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm font-medium text-[#8e6413]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="mt-5 text-[16px] leading-[1.85] text-[#102039]">
        {children ?? renderPreservedText(text, "")}
      </div>
    </section>
  );
};

const DesktopSidebar = () => (
  <aside
    className="hidden w-[238px] shrink-0 rounded-l-[28px] p-6 text-white shadow-[16px_0_44px_-36px_rgba(8,35,71,0.9)] md:block"
    style={{
      background:
        "linear-gradient(180deg, #04172e 0%, #082347 58%, #061a33 100%)",
    }}
  >
    <div className="mb-8 flex justify-center">
      <Logo size="lg" />
    </div>
    <nav className="space-y-2 text-sm">
      {[
        { label: "Inicio", icon: <Home className="h-5 w-5" /> },
        { label: "Lecturas del día", icon: <BookOpen className="h-5 w-5" />, active: true },
        { label: "Santo del día", icon: <UserRound className="h-5 w-5" /> },
        { label: "Radio en vivo", icon: <Radio className="h-5 w-5" /> },
        { label: "Lectio Divina", icon: <Sparkles className="h-5 w-5" /> },
        { label: "Oraciones", icon: <Heart className="h-5 w-5" /> },
        { label: "Ajustes", icon: <Settings className="h-5 w-5" /> },
      ].map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
            item.active
              ? "bg-[#d4af37] text-[#071a33]"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          {item.icon}
          <span className="font-semibold">{item.label}</span>
        </div>
      ))}
    </nav>
    <div className="mt-10 rounded-2xl border border-[#d4af37]/40 p-4">
      <p className="text-xs font-bold text-[#d4af37]">Radio en vivo</p>
      <p className="mt-2 text-sm leading-snug">La Voz de Jesús - Radio Católica</p>
      <div className="mt-5 flex items-center justify-center">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37] text-[#071a33]">
          <Play className="h-5 w-5 fill-current" />
        </button>
      </div>
    </div>
  </aside>
);

const SantoPanel = ({ santo }: { santo: SantoDelDia | null }) => (
  <aside className="rounded-2xl border border-[#e6d8bf] bg-white p-5 shadow-[0_12px_32px_-28px_rgba(8,35,71,0.45)]">
    <p className="text-center text-xs font-extrabold uppercase tracking-[0.18em] text-[#8e6413]">
      Santo del Día
    </p>
    {santo?.nombre ? (
      <div className="mt-5">
        {santo.imagen_url && (
          <img
            src={santo.imagen_url}
            alt={santo.nombre}
            loading="lazy"
            className="mx-auto h-36 w-28 rounded-xl object-cover"
          />
        )}
        <h2 className="mt-4 font-display text-2xl leading-tight text-[#082347]">
          {santo.nombre}
        </h2>
        {santo.titulo && (
          <p className="mt-1 text-sm font-medium text-[#102039]">{santo.titulo}</p>
        )}
        {santo.resumen && (
          <p className="mt-4 text-sm leading-relaxed text-[#102039]">
            {compactText(santo.resumen, 190)}
          </p>
        )}
        {santo.frase_destacada && (
          <div className="mt-5 rounded-xl border border-[#e6d8bf] bg-[#fffaf0] p-4 text-sm leading-relaxed text-[#102039]">
            «{compactText(santo.frase_destacada, 150)}»
          </div>
        )}
        <div className="mt-5 space-y-3">
          <AccordionBlock title="Historia">{santo.historia}</AccordionBlock>
          <AccordionBlock title="Lectura espiritual">
            {santo.lectura_espiritual}
          </AccordionBlock>
        </div>
      </div>
    ) : (
      <p className="mt-5 text-sm leading-relaxed text-[#102039]">
        El santo del día estará disponible pronto.
      </p>
    )}
  </aside>
);

const LecturasDelDia = () => {
  const [liturgia, setLiturgia] = useState<LiturgiaDia | null>(null);
  const [lectio, setLectio] = useState<LectioDivina | null>(null);
  const [santo, setSanto] = useState<SantoDelDia | null>(null);
  const [liturgias, setLiturgias] = useState<LiturgiaDia[]>([]);
  const [lectios, setLectios] = useState<LectioDivina[]>([]);
  const [santos, setSantos] = useState<SantoDelDia[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [activeTab, setActiveTab] = useState<LecturasTab>("liturgia");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const cached = readLecturasCache();

    if (cached?.liturgias.length) {
      const today = getTodayISO();
      const cachedToday =
        cached.liturgias.find((item) => item.fecha === today) ??
        cached.liturgias[cached.liturgias.length - 1];

      setLiturgias(cached.liturgias);
      setLectios(cached.lectios);
      setSantos(cached.santos);
      setSelectedDate(cachedToday.fecha);
      setLiturgia(cachedToday);
      setLectio(
        cached.lectios.find((item) => item.fecha === cachedToday.fecha) ?? null,
      );
      setSanto(
        cached.santos.find((item) => item.fecha === cachedToday.fecha) ?? null,
      );
      setLoading(false);
      setError(false);
    }

    Promise.all([
      getTodayLiturgia(),
      getTodayLectio(),
      getTodaySantoDelDia(),
      getPublishedLiturgias(),
      getPublishedLectios(),
      getPublishedSantosDelDia(),
    ])
      .then(
        ([
          liturgiaData,
          lectioData,
          santoData,
          liturgiasData,
          lectiosData,
          santosData,
        ]) => {
          if (!mounted) return;
          const lastPublishedDate =
            liturgiasData[liturgiasData.length - 1]?.fecha;
          const initialDate =
            liturgiaData?.fecha ?? lastPublishedDate ?? getTodayISO();

          setSelectedDate(initialDate);
          setLiturgia(liturgiaData);
          setLectio(lectioData);
          setSanto(santoData);
          setLiturgias(liturgiasData);
          setLectios(lectiosData);
          setSantos(santosData);
          writeLecturasCache({
            liturgias: liturgiasData,
            lectios: lectiosData,
            santos: santosData,
          });
          setError(!liturgiaData && liturgiasData.length === 0);
        },
      )
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

  useEffect(() => {
    const selectedLiturgia =
      liturgias.find((item) => item.fecha === selectedDate) ?? null;
    const selectedLectio =
      lectios.find((item) => item.fecha === selectedDate) ?? null;
    const selectedSanto =
      santos.find((item) => item.fecha === selectedDate) ?? null;

    if (selectedLiturgia || liturgias.length > 0) {
      setLiturgia(selectedLiturgia);
      setLectio(selectedLectio);
      setSanto(selectedSanto);
      setError(!selectedLiturgia);
    }
  }, [lectios, liturgias, santos, selectedDate]);

  const selectedIndex = liturgias.findIndex(
    (item) => item.fecha === selectedDate,
  );
  const previousDate =
    selectedIndex > 0 ? liturgias[selectedIndex - 1]?.fecha : "";
  const nextDate =
    selectedIndex >= 0 && selectedIndex < liturgias.length - 1
      ? liturgias[selectedIndex + 1]?.fecha
      : "";
  const visibleDays = liturgias.slice(
    Math.max(0, selectedIndex - 1),
    Math.min(liturgias.length, selectedIndex + 2),
  );
  const palabraHoy =
    liturgia?.palabra_hoy || "La Palabra para hoy estará disponible pronto.";
  const palabraHoyDisplay = loading
    ? "Cargando lecturas..."
    : `«${stripOuterQuotes(palabraHoy)}»`;
  const liturgicalColorValue = getLiturgicalColorValue(
    liturgia?.color_liturgico,
  );
  const liturgicalLabel =
    liturgia?.celebracion || liturgia?.tiempo_liturgico || "Tiempo litúrgico";

  const liturgiaCards = (
    <div className="space-y-4">
      <CompactReadingCard
        title="Primera Lectura"
        subtitle={liturgia?.primera_lectura_cita}
        text={liturgia?.primera_lectura_texto}
        icon={<BookOpen className="h-5 w-5" />}
      />
      <CompactReadingCard
        title="Salmo Responsorial"
        subtitle={`${liturgia?.salmo_cita ?? ""} ${formatPsalmResponse(
          liturgia?.salmo_respuesta,
        )}`.trim()}
        text={liturgia?.salmo_texto}
        icon={<Music2 className="h-5 w-5" />}
      />
      <CompactReadingCard
        title="Segunda Lectura"
        subtitle={liturgia?.segunda_lectura_cita}
        text={liturgia?.segunda_lectura_texto}
        icon={<BookOpen className="h-5 w-5" />}
      />
      <CompactReadingCard
        title="Evangelio"
        subtitle={liturgia?.evangelio_cita}
        text={liturgia?.evangelio_texto}
        icon={<Cross className="h-5 w-5" />}
      />
    </div>
  );

  const liturgiaFull = (
    <div className="space-y-5">
      <FullReadingBlock
        title="Primera Lectura"
        subtitle={liturgia?.primera_lectura_cita}
        text={liturgia?.primera_lectura_texto}
        icon={<BookOpen className="h-5 w-5" />}
      />
      <FullReadingBlock
        title="Salmo Responsorial"
        subtitle={liturgia?.salmo_cita}
        icon={<Music2 className="h-5 w-5" />}
      >
        {formatPsalmResponse(liturgia?.salmo_respuesta) && (
          <p className="mb-5 font-bold text-[#b17a12]">
            {formatPsalmResponse(liturgia?.salmo_respuesta)}
          </p>
        )}
        {renderPreservedText(
          liturgia?.salmo_texto,
          "Pendiente de publicar.",
          renderPsalmLine,
        )}
      </FullReadingBlock>
      <FullReadingBlock
        title="Segunda Lectura"
        subtitle={liturgia?.segunda_lectura_cita}
        text={liturgia?.segunda_lectura_texto}
        icon={<BookOpen className="h-5 w-5" />}
      />
      <FullReadingBlock
        title="Evangelio"
        subtitle={liturgia?.evangelio_cita}
        text={liturgia?.evangelio_texto}
        icon={<Cross className="h-5 w-5" />}
      />
    </div>
  );

  return (
    <main
      className="min-h-screen text-[#071a33]"
      style={{ backgroundColor: "#fff8ec" }}
    >
      <Link
        to="/"
        className="fixed left-[max(14px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-[999] inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#082347] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition hover:scale-95 hover:bg-[#0b2f5f] active:scale-95 md:hidden"
        aria-label="Volver al inicio"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div
        className="mx-auto w-full md:px-5 md:py-8"
        style={{ maxWidth: "1260px" }}
      >
        <div
          className="overflow-hidden md:flex md:rounded-[28px] md:border md:border-[#e6d8bf] md:shadow-[0_30px_90px_-70px_rgba(8,35,71,0.75)]"
          style={{ backgroundColor: "#fff8ec" }}
        >
          <DesktopSidebar />

          <section className="min-w-0 flex-1 px-4 pb-14 pt-4 sm:px-6 md:px-8 md:py-7">
            <header
              className="rounded-b-[28px] px-5 pb-6 pt-8 shadow-[0_16px_38px_-34px_rgba(8,35,71,0.8)] md:rounded-none md:p-0 md:shadow-none"
              style={{ backgroundColor: "transparent", color: "#071a33" }}
            >
              <div className="mb-4 flex items-center justify-between md:hidden">
                <Menu className="h-6 w-6" />
                <CalendarDays className="h-5 w-5 text-[#d4af37]" />
              </div>

              <div className="md:flex md:items-start md:justify-between">
                <div>
                  <h1 className="font-display text-xl font-bold md:text-3xl">
                    Evangelio del Día
                  </h1>
                  <p className="mt-2 text-sm font-medium capitalize text-[#102039]">
                    {formatFecha(liturgia?.fecha)}
                  </p>
                </div>

                {liturgias.length > 0 && (
                  <div className="mt-5 flex items-center justify-center gap-3 md:mt-0">
                    <button
                      onClick={() => previousDate && setSelectedDate(previousDate)}
                      disabled={!previousDate}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#082347] disabled:opacity-35"
                      aria-label="Día anterior"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-3">
                      {visibleDays.map((item) => {
                        const date = formatDiaSelector(item.fecha);
                        const active = item.fecha === selectedDate;

                        return (
                          <button
                            key={item.fecha}
                            onClick={() => setSelectedDate(item.fecha)}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold transition ${
                              active
                                ? "bg-[#c69222] text-white"
                                : "text-[#082347]"
                            }`}
                          >
                            {date.day}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => nextDate && setSelectedDate(nextDate)}
                      disabled={!nextDate}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[#082347] disabled:opacity-35"
                      aria-label="Día siguiente"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold md:justify-center">
                <span
                  className="h-3.5 w-3.5 rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.45),0_2px_8px_rgba(0,0,0,0.18)]"
                  style={{ background: liturgicalColorValue }}
                />
                <span>{liturgicalLabel}</span>
              </div>
            </header>

            <section className="sticky top-3 z-20 mt-4 rounded-xl border border-[#e6d8bf] bg-white p-4 text-center shadow-[0_14px_36px_-30px_rgba(8,35,71,0.55)] md:static md:rounded-2xl md:p-6">
              <div className="mx-auto mb-3 h-px max-w-48 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent md:hidden" />
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8e6413]">
                Palabra para Hoy
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold leading-tight text-[#082347] md:text-3xl">
                {palabraHoyDisplay}
              </h2>
              {liturgia?.evangelio_cita && (
                <p className="mt-3 text-sm font-semibold text-[#082347]">
                  {liturgia.evangelio_cita}
                </p>
              )}
              <div className="mx-auto mt-4 flex max-w-44 items-center justify-center gap-3 text-[#c69222]">
                <span className="h-px flex-1 bg-[#d4af37]" />
                <Cross className="h-4 w-4" />
                <span className="h-px flex-1 bg-[#d4af37]" />
              </div>
            </section>

            <nav
              className="mt-4 grid grid-cols-3 gap-1 rounded-xl bg-[#efe5d4] p-1"
              aria-label="Secciones de lectura"
            >
              <TabButton
                active={activeTab === "liturgia"}
                onClick={() => setActiveTab("liturgia")}
              >
                Liturgia
              </TabButton>
              <TabButton
                active={activeTab === "santo"}
                onClick={() => setActiveTab("santo")}
              >
                Santo
              </TabButton>
              <TabButton
                active={activeTab === "lectio"}
                onClick={() => setActiveTab("lectio")}
              >
                Lectio
              </TabButton>
            </nav>

            {error && !loading && (
              <div className="mt-4 rounded-2xl border border-[#d8c9ac] bg-white p-5 text-sm leading-relaxed text-[#13233a]">
                Todavía no hay liturgia publicada para hoy.
              </div>
            )}

            <div className="mt-5 md:grid md:grid-cols-[minmax(0,1fr)_280px] md:gap-5">
              <div>
                {activeTab === "liturgia" && (
                  <>
                    <div className="md:hidden">{liturgiaCards}</div>
                    <div className="hidden md:block">{liturgiaCards}</div>
                  </>
                )}

                {activeTab === "santo" && (
                  <div className="md:hidden">
                    <SantoPanel santo={santo} />
                  </div>
                )}

                {activeTab === "lectio" && (
                  <div className="space-y-4">
                    <LectioCard
                      title="Reflexión"
                      text={lectio?.reflexion}
                      icon={<Sparkles className="h-5 w-5" />}
                    />
                    <LectioCard
                      title="Pregunta para Meditar"
                      text={lectio?.pregunta_meditar}
                      icon={<MessageCircleQuestion className="h-5 w-5" />}
                    />
                    <LectioCard
                      title="Oración"
                      text={lectio?.oracion}
                      icon={<Heart className="h-5 w-5" />}
                    />
                    <LectioCard
                      title="Compromiso"
                      text={lectio?.compromiso}
                      icon={<CheckCircle2 className="h-5 w-5" />}
                    />
                    <LectioCard
                      title="Mensaje Final"
                      text={lectio?.mensaje_final}
                      icon={<Star className="h-5 w-5" />}
                    />
                    <article className="rounded-xl border border-[#e6d8bf] bg-white p-4 shadow-[0_12px_32px_-28px_rgba(8,35,71,0.45)]">
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c69222] text-white">
                          <Headphones className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#082347]">
                            Audio
                          </h2>
                          <button
                            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#082347] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                            disabled={!lectio?.audio_url}
                          >
                            <Mic2 className="h-4 w-4" />
                            Escuchar reflexión
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                )}
              </div>

              <div className="mt-5 hidden md:block md:mt-0">
                <SantoPanel santo={santo} />
              </div>
            </div>

            <div className="mt-8 hidden md:block">
              {activeTab === "liturgia" && liturgiaFull}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LecturasDelDia;
