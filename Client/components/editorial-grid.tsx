import Image from "next/image"
import Link from "next/link"

type Tile =
  | { type: "image"; src: string; alt: string }
  | { type: "link"; src: string; alt: string; href: string; label: string; kicker?: string }

type Props = {
  tiles: Tile[]
  title?: string
  subtitle?: string
}

export default function EditorialGrid({
  tiles,
  title = "Exhibición · Edición 01",
  subtitle = "Una curaduría de prendas como arte",
}: Props) {
  return (
    <section aria-label="Exhibición editorial" className="bg-white">
      <div className="container mx-auto px-4 py-12 grid gap-6">
        <header className="grid gap-2">
          <h2 className="text-xl md:text-2xl tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[10px] gap-4">
          {tiles.map((t, i) => {
            const spans =
              i % 8 === 0
                ? "md:col-span-3 md:row-span-[24]"
                : i % 5 === 0
                ? "md:col-span-2 md:row-span-[18]"
                : "md:col-span-1 md:row-span-[12]"

            return (
              <div key={i} className={`relative col-span-2 ${spans} overflow-hidden rounded-md bg-white border`}>
                {t.type === "image" ? (
                  <>
                    <Image src={t.src || "/placeholder.svg"} alt={t.alt} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </>
                ) : (
                  <Link href={t.href} className="group block w-full h-full">
                    <Image
                      src={t.src || "/placeholder.svg"}
                      alt={t.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      {t.kicker ? (
                        <div className="text-xs uppercase tracking-widest text-white/90">{t.kicker}</div>
                      ) : null}
                      <div className="text-base font-medium text-white drop-shadow-sm">{t.label}</div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity ring-2 ring-white/80" />
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
