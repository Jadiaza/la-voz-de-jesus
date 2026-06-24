import { Logo } from "./Logo";

export const AppSplash = () => (
  <div className="fixed inset-0 z-[9999] flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-navy-deep text-foreground">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--gold)/0.16),transparent_42%)]" />
    <div className="relative flex w-full max-w-[320px] flex-col items-center px-8 text-center">
      <Logo size="lg" className="justify-center" />

      <div className="mt-8 h-2 w-full overflow-hidden rounded-full border border-orange-300/25 bg-black/35 shadow-[0_0_22px_rgba(245,132,35,0.18)]">
        <div className="app-splash-loader h-full w-1/2 rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-orange-400" />
      </div>

      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-orange-200/85">
        Cargando
      </p>
    </div>
  </div>
);
