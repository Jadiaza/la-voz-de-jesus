import { Zap } from "lucide-react";

export const AdBanner = () => (
  <aside className="w-full max-w-full overflow-hidden rounded-2xl gold-border bg-navy-deep/60 shadow-deep">
    <div className="relative grid min-h-[118px] items-center gap-3 px-4 py-4 sm:px-5 xl:min-h-[90px] xl:grid-cols-[180px_1fr_auto] xl:gap-4 xl:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--gold)/0.16),transparent_36%),linear-gradient(90deg,hsl(var(--navy-deep)),hsl(var(--navy)/0.74))]" />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 text-xs font-extrabold uppercase leading-relaxed tracking-wide text-foreground/90">
        <div>Espacio publicitario</div>
        <div className="hidden text-foreground/60 xl:block">Anuncio 728x90</div>
      </div>

      <div className="relative z-10 min-w-0 text-center sm:text-left lg:text-center">
        <div className="truncate text-2xl font-extrabold text-foreground xl:text-4xl">
          Tu marca aqui
        </div>
        <div className="mt-1 text-xs text-foreground/70 xl:text-base">
          Llega a nuestra comunidad
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-4">
        <button
          type="button"
          className="rounded-lg bg-gradient-gold px-4 py-2 text-xs font-bold text-navy-deep shadow-gold xl:px-5 xl:py-2.5 xl:text-sm"
        >
          Anunciate
        </button>
        <div className="hidden items-center gap-1 text-sm font-bold text-foreground/80 xl:flex">
          <Zap className="h-4 w-4 fill-gold text-gold" />
          AdMob
        </div>
      </div>
    </div>
  </aside>
);
