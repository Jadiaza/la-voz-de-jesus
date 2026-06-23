import { ArrowLeft, Headphones, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/lvdj/Logo";

const Contacto = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-deep px-4 py-6 text-foreground sm:px-6">
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full gold-border text-gold transition hover:bg-gold/10"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Logo size="sm" />
          <span className="h-10 w-10" />
        </header>

        <section className="my-auto rounded-2xl gold-border bg-navy-deep/55 p-6 text-center shadow-deep sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full gold-border text-gold">
            <Headphones className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Contacto</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/72">
            Estamos para servirte y atender alianzas, anuncios y mensajes para
            nuestra comunidad.
          </p>
          <a
            href="mailto:contacto@lavozdejesus.com?subject=Contacto%20La%20Voz%20de%20Jesus"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-gold px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-navy-deep shadow-gold"
          >
            <Mail className="h-4 w-4" />
            Escribir correo
          </a>
        </section>
      </main>
    </div>
  );
};

export default Contacto;
