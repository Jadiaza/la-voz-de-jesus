/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: BottomNav.tsx
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
Menu inferior fijo para la navegacion principal en dispositivos moviles.

FUNCIONES:
- Presenta accesos persistentes a las secciones principales.
- Marca visualmente la seccion activa.
- Respeta el area segura inferior en dispositivos con gestos o notch.

==============================================================================
*/

import {
  CalendarRange,
  HandHeart,
  Home,
  MoreHorizontal,
  Radio,
} from "lucide-react";

const items = [
  { icon: Home, label: "Inicio", active: true },
  { icon: Radio, label: "Radio" },
  { icon: HandHeart, label: "Oración" },
  { icon: CalendarRange, label: "Programas" },
  { icon: MoreHorizontal, label: "Más" },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 inset-x-0 z-50">
    <div className="mx-auto max-w-md">
      <div className="glass border-t border-[hsl(var(--gold)/0.2)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end justify-around">
          {items.map((item) => (
            <button
              key={item.label}
              className="flex flex-col items-center gap-1 px-2 py-1 min-w-[56px]"
            >
              <item.icon
                className={`h-5 w-5 ${
                  item.active ? "text-gold" : "text-foreground/55"
                }`}
                strokeWidth={item.active ? 2 : 1.6}
              />
              <span
                className={`text-[10px] ${
                  item.active ? "text-gold font-medium" : "text-foreground/55"
                }`}
              >
                {item.label}
              </span>
              {item.active && (
                <span className="h-0.5 w-5 rounded-full bg-gradient-gold -mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  </nav>
);
