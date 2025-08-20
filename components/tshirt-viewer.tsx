"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type AreaKey = "frente" | "espalda" | "manga_izq" | "manga_der"

export type Viewer2DProps = {
  color?: string
  sideImages?: (color: string) => Partial<Record<AreaKey, string>>
  customElements: Array<{
    id: string
    type: "text" | "image"
    content: string
    placement: {
      x: number // porcentaje 0..100 (posición horizontal dentro del contenedor)
      y: number // porcentaje 0..100 (posición vertical dentro del contenedor)
      rotation: number // grados
      scale: number // 1 = 100%
      area: AreaKey
    }
  }>
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (
    id: string,
    updates: Partial<{ x: number; y: number; rotation: number; scale: number; area: AreaKey }>
  ) => void
  /** Lado actual; por defecto "frente" */
  initialSide?: AreaKey
}

const DEFAULT_SHIRT_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzUwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgyPScwJyB5Mj0nMSc+PHN0b3Agb2Zmc2V0PScwJyBzdG9wLWNvbG9yPScjZjVmNWY1Jy8+PHN0b3Agb2Zmc2V0PScxJyBzdG9wLWNvbG9yPScjZWVlJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzUwMCcgaGVpZ2h0PSc1MDAnIGZpbGw9InVybCgjZykiIHJ4PSc0MCcvPjxyZWN0IHg9JzgwJyB5PSc4MCcgd2lkdGg9JzM0MCcgaGVpZ2h0PSczNDAnIGZpbGw9JyNmZmYnIHJ4PSc2MCcvPjxnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDI1MCwyNTApJz48Y2lyY2xlIHI9JzQwJyBmaWxsPScjZGRkJy8+PHRleHQgeD0nMCcgeT0nMScgZHk9JzAuOCcgZmlsbD0nIzc3NycgZm9udC1zaXplPScyNHB4JyB0ZXh0LWFuY2hvcj0nLW1pZGRsZSc+U2hpcnQgMiRELXRlc3Q8L3RleHQ+PC9nPjwvc3ZnPiI="

const SIDE_LABELS: Record<AreaKey, string> = {
  frente: "Frente completo",
  espalda: "Espalda completa",
  manga_izq: "Manga izquierda",
  manga_der: "Manga derecha",
}

const AREA_TO_BASE: Record<AreaKey, AreaKey> = {
  "frente": "frente",
  "espalda": "espalda",
  "manga_izq": "manga_izq",
  "manga_der": "manga_der",
}

// Función para obtener imágenes específicas según el color
const getSideImagesByColor = (color: string): Partial<Record<AreaKey, string>> => {
  const colorName = color.toLowerCase();
  
  // Mapeo de colores a imágenes específicas
  const colorImageMap: Record<string, Partial<Record<AreaKey, string>>> = {
    "blanco": {
      frente: "/customize/tshirt-front-white.png",
      espalda: "/customize/tshirt-back-white.png",
      manga_izq: "/customize/tshirt-sleeve-left-white.png",
      manga_der: "/customize/tshirt-sleeve-right-white.png",
    },
    "negro": {
      frente: "/customize/tshirt-front-black.png",
      espalda: "/customize/tshirt-back-black.png",
      manga_izq: "/customize/tshirt-sleeve-left-black.png",
      manga_der: "/customize/tshirt-sleeve-right-black.png",
    },
    "celeste": {
      frente: "/customize/tshirt-front-lightblue.png",
      espalda: "/customize/tshirt-back-lightblue.png",
      manga_izq: "/customize/tshirt-sleeve-left-lightblue.png",
      manga_der: "/customize/tshirt-sleeve-right-lightblue.png",
    },
    "azul marino": {
      frente: "/customize/tshirt-front-navy.png",
      espalda: "/customize/tshirt-back-navy.png",
      manga_izq: "/customize/tshirt-sleeve-left-navy.png",
      manga_der: "/customize/tshirt-sleeve-right-navy.png",
    },
    "gris": {
      frente: "/customize/tshirt-front-gray.png",
      espalda: "/customize/tshirt-back-gray.png",
      manga_izq: "/customize/tshirt-sleeve-left-gray.png",
      manga_der: "/customize/tshirt-sleeve-right-gray.png",
    },
    "azul": {
      frente: "/customize/tshirt-front-blue.png",
      espalda: "/customize/tshirt-back-blue.png",
      manga_izq: "/customize/tshirt-sleeve-left-blue.png",
      manga_der: "/customize/tshirt-sleeve-right-blue.png",
    }
  };

  // Retorna las imágenes para el color especificado o las imágenes por defecto para blanco
  return colorImageMap[colorName] || colorImageMap["blanco"];
};

function useImage(url?: string) {
  const [loaded, setLoaded] = useState<string | null>(null)
  useEffect(() => {
    if (!url) return setLoaded(null)
    const img = new Image()
    img.onload = () => setLoaded(url)
    img.onerror = () => setLoaded(null)
    img.src = url
  }, [url])
  return loaded
}

export default function TShirtViewer2D({
  color = "#ffffff",
  sideImages = getSideImagesByColor,
  customElements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  initialSide = "frente",
}: Viewer2DProps) {
  const [side, setSide] = useState<AreaKey>(initialSide)
  useEffect(() => {
    setSide(initialSide)
  }, [initialSide])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isPointerDown = useRef(false)
  const draggingId = useRef<string | null>(null)

  // Obtener las imágenes según el color actual
  const colorImages = useMemo(() => {
    return sideImages(color);
  }, [sideImages, color])

  // Imagen base según el lado actual (mapeando pecho -> frente)
  const baseKey = AREA_TO_BASE[side]
  const baseUrl = colorImages[baseKey]
  const resolvedBase = useImage(baseUrl) || DEFAULT_SHIRT_PLACEHOLDER

  // Elementos visibles del lado actual
  const visibleElements = useMemo(() => {
    return customElements.filter((el) => el.placement.area === side)
  }, [customElements, side])

  // Helpers para convertir coordenadas del cursor a % del contenedor
  const clientToPercent = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 50, y: 50 }
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
  }, [])

  // Arrastrar: iniciar
  const onPointerDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      e.stopPropagation()
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
      isPointerDown.current = true
      draggingId.current = id
      onSelectElement(id)
    },
    [onSelectElement]
  )

  // Arrastrar: mover
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDown.current || !draggingId.current) return
      const id = draggingId.current
      const { x, y } = clientToPercent(e.clientX, e.clientY)
      onUpdateElement(id, { x, y })
    },
    [clientToPercent, onUpdateElement]
  )

  // Arrastrar: terminar
  const onPointerUp = useCallback(() => {
    isPointerDown.current = false
    draggingId.current = null
  }, [])

  // Escala / rotación con rueda
  const onWheel = useCallback(
    (e: React.WheelEvent, elId: string) => {
      e.stopPropagation()
      const el = customElements.find((c) => c.id === elId)
      if (!el) return
      if (e.shiftKey) {
        // Rotación con Shift + rueda
        const next = (el.placement.rotation || 0) + (e.deltaY > 0 ? 2 : -2)
        onUpdateElement(elId, { rotation: Math.max(-360, Math.min(360, next)) })
      } else {
        // Escala con rueda
        const next = (el.placement.scale || 1) * (e.deltaY > 0 ? 0.95 : 1.05)
        onUpdateElement(elId, { scale: Math.max(0.1, Math.min(10, next)) })
      }
    },
    [customElements, onUpdateElement]
  )

  // Deseleccionar haciendo click en vacío
  const onBackgroundClick = useCallback(() => onSelectElement(null), [onSelectElement])

  return (
    <div className="w-full h-full">
      {/* Lienzo 2D */}
      <div
        ref={containerRef}
        onClick={onBackgroundClick}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative w-full grow bg-[var(--viewer-bg,#f6f6f6)] rounded-xl shadow-inner overflow-hidden"
        style={{
          backgroundColor: color,
          // Mantener una proporción vertical similar a una polera (4:5)
          aspectRatio: "4 / 5",
        }}
      >
        {/* Imagen base de la camiseta */}
        <img
          src={resolvedBase}
          alt={`${SIDE_LABELS[baseKey]} base`}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        {/* Overlays del lado actual */}
        {visibleElements.map((el) => {
          const isSelected = selectedElement === el.id
          const { x, y, rotation, scale, area } = el.placement
          // Si es espalda, opcionalmente espejamos X para simular el 3D
          const mirrorX = area === "espalda" ? -1 : 1

          const baseStyle: React.CSSProperties = {
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${mirrorX * scale}, ${scale})`,
            transformOrigin: "center center",
            userSelect: "none",
            touchAction: "none",
            cursor: isSelected ? "move" : "grab",
            outline: isSelected ? "2px solid rgba(59,130,246,0.9)" : "none",
            borderRadius: 8,
          }

          if (el.type === "image") {
            const src = el.content || DEFAULT_IMG_PLACEHOLDER
            return (
              <img
                key={el.id}
                src={src}
                alt="custom"
                style={baseStyle}
                className="max-w-[60%] max-h-[60%]"
                onPointerDown={(e) => onPointerDown(e, el.id)}
                onWheel={(e) => onWheel(e, el.id)}
                draggable={false}
              />)
          }

          return (
            <div
              key={el.id}
              style={baseStyle}
              className="px-2 py-1 bg-transparent text-black text-base font-medium whitespace-pre text-center max-w-[70%]"
              onPointerDown={(e) => onPointerDown(e, el.id)}
              onWheel={(e) => onWheel(e, el.id)}
            >
              {el.content || "Texto de ejemplo"}
            </div>
          )
        })}

        {/* Mensaje por defecto si no hay overlays */}
        {visibleElements.length === 0 && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            
          </div>
        )}
      </div>
    </div>
  )
}

const DEFAULT_IMG_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMjAwJyBoZWlnaHQ9JzIwMCcgZmlsbD0nI2YwZjBmMCcgcng9JzE2Jy8+PGNpcmNsZSBjeD0nMTAwJyBjeT0nMTAwJyByPSc0MCcgZmlsbD0nI2RkZCcvPjx0ZXh0IHg9JzEwMCcgeT0nMTA1JyBmb250LXNpemU9JzE0JyBmaWxsPScjNjY2JyB0ZXh0LWFuY2hvcj0nbWlkZGxlJz5JbWFnZW48L3RleHQ+PHRleHQgeD0nMTAwJyB5PScxMjUnIGZvbnQtc2l6ZT0nMTQnIGZpbGw9JyM2NjYnIHRleHQtYW5jaG9yPSdtaWRkbGUnPkRlZmF1bHQ8L3RleHQ+PC9zdmc+"