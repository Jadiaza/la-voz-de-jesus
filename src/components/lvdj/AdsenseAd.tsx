import { ReactNode, useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT =
  import.meta.env.VITE_ADSENSE_CLIENT || "ca-pub-4848923962603353";

interface AdsenseAdProps {
  slot?: string;
  className?: string;
  format?: "auto" | "horizontal" | "rectangle";
  fullWidthResponsive?: boolean;
  fallback: ReactNode;
}

export const AdsenseAd = ({
  slot,
  className = "",
  format = "auto",
  fullWidthResponsive = true,
  fallback,
}: AdsenseAdProps) => {
  useEffect(() => {
    if (!slot) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense render error:", error);
    }
  }, [slot]);

  if (!slot) {
    return <>{fallback}</>;
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
};
