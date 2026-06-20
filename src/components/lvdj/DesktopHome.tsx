import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Church,
  Clock,
  Play,
  Radio as RadioIcon,
  User2,
} from "lucide-react";
import { Logo } from "./Logo";
import { RadioCard } from "./RadioCard";
import { QuickAccess } from "./QuickAccess";
import { GospelCard } from "./GospelCard";
import { ProgramCard } from "./ProgramCard";
import { Footer } from "./Footer";
import monstranceHero from "@/assets/monstrance-hero.jpg";

const links = [
  "Inicio",
  "Radio",
  "Capilla",
  "Evangelio",
  "Comunidad",
  "Programacion",
  "Contacto",
];

const schedule = [
  { time: "06:00 AM", title: "Santo Rosario", live: false },
  { time: "07:00 AM", title: "Laudes", live: false },
  { time: "10:00 AM", title: "Santa Misa", live: true },
  { time: "03:00 PM", title: "Hora de la Misericordia", live: false },
  { time: "07:00 PM", title: "Adoracion Eucaristica", live: false },
];

export const DesktopHome = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <header className="relative z-30 border-b border-[hsl(var(--gold)/0.18)] bg-navy-deep/95">
      <div className="mx-auto flex h-24 max-w-[1760px] items-center justify-between px-8 2xl:px-12">
        <Logo size="lg" />

        <nav className="hidden lg:flex items-center gap-2">
          {links.map((link, index) => (
            <a
              key={link}
              href="#"
              className={`relative px-3 py-2 text-sm font-semibold transition-colors xl:px-4 ${
                index === 0
                  ? "text-gold"
                  : "text-foreground/72 hover:text-gold"
              }`}
            >
              {link}
              {index === 0 && (
                <span className="absolute left-1/2 top-full h-px w-10 -translate-x-1/2 bg-gradient-gold" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative hidden h-11 w-11 items-center justify-center rounded-full gold-border text-gold transition hover:bg-gold/10 md:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold ring-2 ring-navy-deep" />
          </button>
          <button className="inline-flex h-11 items-center gap-2 rounded-full gold-border px-4 text-xs font-bold uppercase tracking-wider text-gold transition hover:bg-gold/10">
            <RadioIcon className="h-4 w-4" />
            En Vivo
          </button>
          <button className="hidden h-11 items-center gap-2 rounded-full gold-border bg-navy-deep/40 pl-1.5 pr-3 text-sm font-semibold text-foreground/85 transition hover:bg-gold/10 xl:inline-flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-navy-deep">
              <User2 className="h-4 w-4" />
            </span>
            Mi cuenta
            <ChevronDown className="h-3.5 w-3.5 text-foreground/55" />
          </button>
        </div>
      </div>
    </header>

    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={monstranceHero}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/35 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-transparent to-background" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1760px] items-center px-8 py-14 2xl:px-12">
          <div className="max-w-[560px]">
            <h1 className="font-display text-6xl font-semibold leading-[1.02] xl:text-7xl 2xl:text-8xl">
              Adora al Santisimo
              <br />
              <span className="gold-text">las 24 horas</span>
            </h1>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px w-24 bg-gradient-gold" />
              <Church className="h-5 w-5 text-gold" />
              <span className="h-px w-24 bg-gradient-gold" />
            </div>

            <p className="max-w-lg text-lg leading-relaxed text-foreground/78">
              En nuestra Capilla Virtual puedes orar, adorar y estar en la
              presencia real de Jesus.
            </p>

            <button className="mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-gold px-7 py-4 text-sm font-bold uppercase tracking-wide text-navy-deep shadow-gold transition hover:scale-[1.01]">
              <Church className="h-5 w-5" />
              Entrar a la Capilla Virtual
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1760px] px-8 pt-0 2xl:px-12">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 xl:col-span-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="lvj-frame-card lvj-radio-slot">
              <RadioCard />
            </div>
            <div className="min-w-0">
              <GospelCard className="h-full" compact />
            </div>
          </div>

          <div className="min-w-0 xl:col-span-4">
            <ProgramCard className="h-full" compact />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-4 grid max-w-[1760px] grid-cols-1 gap-4 px-8 xl:grid-cols-12 2xl:px-12">
        <div className="rounded-2xl gold-border bg-navy-deep/35 p-5 xl:col-span-8">
          <QuickAccess />
        </div>

        <aside className="rounded-2xl gold-border bg-navy-deep/35 p-5 xl:col-span-4">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gold" />
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
              Programacion de Hoy
            </h2>
          </div>

          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className="grid grid-cols-[82px_1fr] gap-3 text-sm"
              >
                <div className="text-foreground/72">{item.time}</div>
                <div
                  className={
                    item.live
                      ? "font-bold text-gold"
                      : "font-medium text-foreground/88"
                  }
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold hover:text-gold-bright">
            Ver toda la programacion
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </aside>
      </section>

      <section className="mx-auto max-w-[1760px] px-8 py-14 2xl:px-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              En el aire
            </div>
            <h2 className="font-display text-4xl">Programacion de Hoy</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-gold" />
            Hora local
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          {schedule.map((item) => (
            <article
              key={`card-${item.time}-${item.title}`}
              className={`rounded-2xl gold-border p-4 ${
                item.live ? "bg-gold/10" : "bg-navy-deep/35"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-gold">
                  {item.time}
                </span>
                <button className="flex h-8 w-8 items-center justify-center rounded-full gold-border text-gold">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>
              <div className="font-semibold leading-snug">{item.title}</div>
              {item.live && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  En vivo
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);
