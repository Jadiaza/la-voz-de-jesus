import { useEffect, useState } from "react";

interface Evangelio {
  fecha: string;
  cita: string;
  extracto: string;
  fuente: string;
}

export const useEvangelio = () => {
  const [evangelio, setEvangelio] =
    useState<Evangelio | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evangelio")
      .then((r) => r.json())
      .then((data) => {
        setEvangelio(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { evangelio, loading };
};