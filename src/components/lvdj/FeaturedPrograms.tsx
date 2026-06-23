import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRef, useState } from "react";
import bibleImage from "@/assets/bible.jpg";
import cathedralImage from "@/assets/cathedral-bg.jpg";
import microphoneImage from "@/assets/microphone.jpg";
import monstranceImage from "@/assets/monstrance-hero.jpg";
import rosaryImage from "@/assets/rosary.jpg";

const featured = [
  { title: "Santo Rosario", image: rosaryImage },
  { title: "Divina Misericordia", image: cathedralImage },
  { title: "Sangre de Cristo", image: bibleImage },
  { title: "San Jose", image: microphoneImage },
  { title: "Adoracion Eucaristica", image: monstranceImage },
];

export const FeaturedPrograms = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  const scrollFeatured = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "right" ? 240 : -240,
      behavior: "smooth",
    });
  };

  const visibleFeatured = showAllFeatured ? featured : featured.slice(0, 5);

  return (
    <section className="glass h-full w-full max-w-full overflow-hidden rounded-2xl gold-border p-3 shadow-deep sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-base font-extrabold uppercase text-gold sm:text-lg">
          <Star className="h-5 w-5 fill-gold" />
          Programas destacados
        </div>
        <button
          type="button"
          onClick={() => setShowAllFeatured((current) => !current)}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-gold hover:text-gold-bright"
        >
          {showAllFeatured ? "Ver menos" : "Ver todos"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollFeatured("left")}
          aria-label="Anterior"
          className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full gold-border bg-navy-deep/90 text-gold shadow-deep xl:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={carouselRef}
          className="flex max-h-[420px] max-w-full snap-x gap-4 overflow-x-auto overflow-y-hidden pb-4"
        >
          {visibleFeatured.map((program) => (
            <article
              key={program.title}
              className="relative h-[210px] w-[124px] shrink-0 snap-start overflow-hidden rounded-xl gold-border bg-navy-deep shadow-deep sm:h-[245px] sm:w-[172px] xl:h-[255px]"
            >
              <img
                src={program.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-75"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              <h3 className="absolute inset-x-2 bottom-4 text-center font-display text-lg font-bold uppercase leading-tight text-gold-bright sm:inset-x-3 sm:bottom-5 sm:text-xl">
                {program.title}
              </h3>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollFeatured("right")}
          aria-label="Siguiente"
          className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full gold-border bg-navy-deep/90 text-gold shadow-deep xl:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={`h-2.5 w-2.5 rounded-full ${
              dot === 0 ? "bg-gold" : "bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
