/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: MobileHome.tsx
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
Pantalla principal para la experiencia movil de la PWA.

FUNCIONES:
- Presenta el hero con la custodia y el logo de la emisora.
- Integra el reproductor en vivo.
- Muestra accesos rapidos a las secciones principales.
- Carga la Palabra para Hoy mediante GospelCard.
- Muestra el proximo programa y la navegacion inferior.

==============================================================================
*/

import { Logo } from "./Logo";
import { QuickAccess } from "./QuickAccess";
import { GospelCard } from "./GospelCard";
import { ProgramCard } from "./ProgramCard";
import { BottomNav } from "./BottomNav";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ==========================================================================
   DISTRIBUCION MOVIL
   ==========================================================================
   Proporciones de referencia:
   header 8% | custodia 33% | radio 9% | accesos 20%
   evangelio 15% | proximo programa 8% | menu inferior 7%
*/

export const MobileHome = () => {
  return (
    <div className="relative min-h-screen bg-navy-deep text-foreground overflow-x-hidden">
      <main className="relative z-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {/* Hero principal: primera impresion de capilla virtual. */}
        <section className="relative w-full h-[340px]">
          <img
            src="/mobile-monstrance.png"
            alt="Santísimo Sacramento"
            className="absolute inset-0 w-full h-full object-cover brightness-110"
          />

          <div className="absolute top-2 left-2 z-20">
            <Logo size="lg" />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-radial-gold opacity-55 mix-blend-screen" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        </section>

        <section className="relative -mt-7 px-4 z-10">
          <Link
            to="/capilla-virtual"
            className="group flex min-h-[92px] items-center gap-4 rounded-2xl border border-gold/45 bg-gradient-to-br from-[#f6c54a] via-[#e2a925] to-[#b98012] p-4 text-[#070b14] shadow-[0_18px_42px_rgba(0,0,0,0.38)] transition active:scale-[0.985]"
            aria-label="Entrar a la Capilla Virtual"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-deep shadow-[inset_0_0_0_1px_rgba(246,197,74,0.45),0_8px_22px_rgba(0,0,0,0.28)]">
              <img
                src="/icons/custodia.png"
                alt=""
                className="h-11 w-11 object-contain"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[1.35rem] font-extrabold leading-tight tracking-tight">
                Entrar a la Capilla
              </span>
              <span className="mt-1 block text-[0.98rem] font-semibold leading-snug text-black/82">
                Adoración Eucarística 24/7
              </span>
            </span>

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/70 text-gold shadow-[inset_0_0_0_1px_rgba(246,197,74,0.28)] transition group-active:scale-95">
              <ChevronRight className="h-7 w-7" strokeWidth={3} />
            </span>
          </Link>
        </section>

        <section className="relative z-20 px-4 mt-5">
          <QuickAccess compact />
        </section>

        <section className="px-4 mt-4">
          <GospelCard />
        </section>

        <section className="px-4 mt-3 pb-28">
          <ProgramCard showAction={false} />
        </section>
      </main>

      <BottomNav />
    </div>
  );
};
