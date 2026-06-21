/*
==============================================================================
PROYECTO: LA VOZ DE JESUS - PWA RADIO CATOLICA
COMPONENTE: Logo.tsx
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
Componente reutilizable para mostrar el logotipo oficial de la emisora.

FUNCIONES:
- Centraliza la ruta del logo principal.
- Permite tres tamanos visuales: sm, md y lg.
- Aplica brillo y sombra para integrarse con el estilo oscuro/dorado.

==============================================================================
*/

import { cn } from "@/lib/utils";

export const Logo = ({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const heightClass =
    size === "lg" ? "h-20" : size === "sm" ? "h-9" : "h-14";

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/logo.png"
        alt="La Voz de Jesús"
        className={cn(
          heightClass,
          "w-auto brightness-125 drop-shadow-[0_0_18px_rgba(212,165,76,0.55)]"
        )}
      />
    </div>
  );
};
