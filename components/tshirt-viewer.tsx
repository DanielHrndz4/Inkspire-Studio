"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

type ViewerProps = {
  color: string
}

function Model({ color }: ViewerProps) {
  const { scene } = useGLTF('/glb/t-shirt_3d.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const material = mesh.material
        if (Array.isArray(material)) {
          material.forEach((m) => {
            const mat = m as THREE.MeshStandardMaterial
            mat.color.set(color)
          })
        } else if (material) {
          ;(material as THREE.MeshStandardMaterial).color.set(color)
        }
      }
    })
  }, [scene, color])

  return <primitive object={scene} />
}

export default function TShirtViewer({ color }: ViewerProps) {
  return (
    <Canvas className="w-full h-full" camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Model color={color} />
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}

useGLTF.preload('/glb/t-shirt_3d.glb')
