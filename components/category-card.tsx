import Image from "next/image"
import Link from "next/link"

type Props = {
  slug: string
  title: string
  image: string
  count?: number
}

export default function CategoryCard({ slug, title, image, count = 0 }: Props) {
  return (
    <Link href={`/categories/${slug}`} className="group relative overflow-hidden rounded-md">
      <div className="relative aspect-[16/9] w-full">
        <Image src={image || "/placeholder.svg?height=900&width=1600&query=categoria"} alt={`Categoría ${title}`} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"/>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 text-white">
        <div className="text-xs tracking-widest uppercase opacity-80">{count} {count === 1 ? "producto" : "productos"}</div>
        <div className="text-xl font-medium">{title}</div>
      </div>
    </Link>
  )
}
