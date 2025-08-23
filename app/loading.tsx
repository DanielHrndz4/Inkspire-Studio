"use client"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-8">
        {/* Logo de Inkspire */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 rounded-lg flex items-center justify-center">
           <img src="https://inkspire-studio.vercel.app/logo.png" alt="Inkspire Studio" />
          </div>
          <span className="text-xl font-semibold text-[#2a2a2a] uppercase">Inkspire Studio</span>
        </div>
        
        {/* Spinner más grande */}
        <div className="relative w-20 h-20">
          <div className="absolute w-full h-full border-3 border-gray-200 rounded-full"></div>
          <div className="absolute w-full h-full border-3 border-[#2a2a2a] border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Texto de carga */}
        <p className="text-[#2a2a2a] text-sm font-medium">Cargando...</p>
      </div>
    </div>
  )
}