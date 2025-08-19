"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

type ViewerProps = {
  color: string
  customElements: Array<{
    id: string
    type: 'text' | 'image'
    content: string
    placement: {
      x: number
      y: number
      rotation: number
      scale: number
      area: string
    }
  }>
  selectedElement: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<{
    x: number
    y: number
    rotation: number
    scale: number
    area: string
  }>) => void
}

const AREA_POSITIONS: Record<string, { x: number; y: number; z: number }> = {
  pecho: { x: 0, y: 0.00, z: 0.78 },
  frente: { x: 0, y: 0.00, z: 0.38 },
  espalda: { x: 0, y: 0.00, z: -0.78 },
  manga_izq: { x: -0.3, y: 0.00, z: 0.35 },
  manga_der: { x: 0.3, y: 0.00, z: 0.35 },
}

const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjQwIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIxMDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkRlZmF1bHQ8L3RleHQ+Cjwvc3ZnPg=='

function Model({ color, customElements, selectedElement, onSelectElement }: ViewerProps) {
  const { scene } = useGLTF('/glb/t-shirt_3d.glb')
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({})
  const [defaultTexture, setDefaultTexture] = useState<THREE.Texture | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  const textureLoader = useRef(new THREE.TextureLoader())

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const material = mesh.material
        if (Array.isArray(material)) {
          material.forEach((m) => {
            const mat = m as THREE.MeshStandardMaterial
            mat.color.set(color)
            mat.needsUpdate = true
          })
        } else if (material) {
          const mat = material as THREE.MeshStandardMaterial
          mat.color.set(color)
          mat.needsUpdate = true
        }
      }
    })
  }, [scene, color])

  // Cargar textura por defecto
  useEffect(() => {
    const loadDefaultTexture = () => {
      textureLoader.current.load(
        DEFAULT_IMAGE,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          texture.anisotropy = 16
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter
          setDefaultTexture(texture)
        },
        undefined,
        (error) => {
          console.error("Error loading default texture:", error)
        }
      )
    }

    loadDefaultTexture()

    return () => {
      if (defaultTexture) {
        defaultTexture.dispose()
      }
    }
  }, [])

  // Cargar texturas para imágenes personalizadas
  useEffect(() => {
    const imageElements = customElements.filter(el => el.type === 'image')

    const loadTextures = async () => {
      const newTextures: Record<string, THREE.Texture> = {}

      for (const element of imageElements) {
        if (!textures[element.id] && element.content) {
          try {
            const texture = await new Promise<THREE.Texture>((resolve, reject) => {
              textureLoader.current.load(
                element.content,
                (texture) => {
                  texture.colorSpace = THREE.SRGBColorSpace
                  texture.anisotropy = 50
                  texture.wrapS = THREE.ClampToEdgeWrapping
                  texture.wrapT = THREE.ClampToEdgeWrapping
                  texture.minFilter = THREE.LinearFilter
                  texture.magFilter = THREE.LinearFilter
                  resolve(texture)
                },
                undefined,
                reject
              )
            })

            newTextures[element.id] = texture
          } catch (error) {
            console.error("Error loading texture:", error)
          }
        }
      }

      if (Object.keys(newTextures).length > 0) {
        setTextures(prev => ({ ...prev, ...newTextures }))
      }
    }

    loadTextures()

    return () => {
      Object.values(textures).forEach(texture => {
        if (texture) texture.dispose()
      })
    }
  }, [customElements])

  // Función para mostrar imagen (personalizada o por defecto)
  const renderImageElement = (element: any, areaPosition: any) => {
    const { x, y, rotation, scale, area } = element.placement
    const texture = textures[element.id]
    const useDefaultImage = !element.content || !texture
    const displayTexture = useDefaultImage ? defaultTexture : texture

    // VOLTEAR EN EL EJE X SI ESTÁ EN LA ESPALDA
    const isBack = area === 'espalda'
    const flipRotation = isBack ? Math.PI : 0 // 180 grados (Math.PI) para espalda

    if (!displayTexture) {
      return (
        <mesh
          key={element.id}
          position={[
            areaPosition.x + (x / 1000),
            areaPosition.y + (y / 1000),
            areaPosition.z
          ]}
          rotation={[rotation * Math.PI / 180, 0, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelectElement(element.id)
          }}
        >
          <planeGeometry args={[0.15 * scale, 0.15 * scale]} />
          <meshBasicMaterial color="gray" transparent opacity={0.3} />
        </mesh>
      )
    }

    const aspect = displayTexture.image ? displayTexture.image.width / displayTexture.image.height : 1
    const baseSize = 1
    const width = baseSize * scale * (aspect > 1 ? 1 : aspect)
    const height = baseSize * scale * (aspect > 1 ? 1 / aspect : 1)

    return (
      <mesh
        key={element.id}
        position={[
          areaPosition.x + (x / 100),
          areaPosition.y + (y / 100),
          areaPosition.z
        ]}
        rotation={[0,flipRotation, rotation * Math.PI / 180]} // Aplicar volteo en X para espalda
        onClick={(e) => {
          e.stopPropagation()
          onSelectElement(element.id)
        }}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={displayTexture}
          transparent={true}
          alphaTest={0.05}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={false}
        />
      </mesh>
    )
  }

  // Función para mostrar texto
  const renderTextElement = (element: any, areaPosition: any) => {
    const { x, y, rotation, scale, area } = element.placement
    const isBack = area === 'espalda'
    const flipRotation = isBack ? Math.PI : 0 // 180 grados para espalda

    return (
      <Text
        key={element.id}
        position={[
          areaPosition.x + (x / 1000),
          areaPosition.y + (y / 1000),
          areaPosition.z
        ]}
        rotation={[flipRotation, 0, rotation * Math.PI / 180]} // Aplicar volteo en X para espalda
        scale={scale * 0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        onClick={(e) => {
          e.stopPropagation()
          onSelectElement(element.id)
        }}
      >
        {element.content || "Texto de ejemplo"}
      </Text>
    )
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[4, 4, 4]} />

      {/* Renderizar elementos personalizados */}
      {customElements.map(element => {
        const { area } = element.placement
        const areaPosition = AREA_POSITIONS[area] || AREA_POSITIONS.frente

        if (element.type === 'text') {
          return renderTextElement(element, areaPosition)
        } else {
          return renderImageElement(element, areaPosition)
        }
      })}

      {/* Mostrar imagen por defecto si no hay elementos personalizados */}
      {customElements.length === 0 && defaultTexture && (
        <mesh
          position={[0, 0.3, 0.02]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial
            map={defaultTexture}
            transparent={true}
            alphaTest={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

function TShirtViewerContent(props: ViewerProps) {
  const handleCanvasClick = (e: any) => {
    if (e.object?.type !== 'Mesh' && e.object?.type !== 'Text') {
      props.onSelectElement(null)
    }
  }

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true
      }}
      onClick={handleCanvasClick}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[2, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />
      <Model {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        enableDamping={true}
        dampingFactor={0.1}
      />
    </Canvas>
  )
}

const TShirtViewer = dynamic(() => Promise.resolve(TShirtViewerContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-pulse text-gray-500">Cargando visualizador 3D...</div>
    </div>
  )
})

export default TShirtViewer

if (typeof window !== 'undefined') {
  import('@react-three/drei').then(({ useGLTF }) => {
    useGLTF.preload('/glb/t-shirt_3d.glb')
  })
}