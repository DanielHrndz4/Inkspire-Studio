// components/PWAInstall.tsx
'use client';

import { useState, useEffect } from 'react';

export default function PWAInstall() {
  // Define the type for BeforeInstallPromptEvent
  type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  };

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;   
    }

    // Detectar si es iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.hasOwnProperty("MSStream");
    setIsIOS(iOS);

    const handler = (e:any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Mostrar después de 5 segundos
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detectar si el usuario ya rechazó la instalación
    const installDismissed = localStorage.getItem('installDismissed');
    if (installDismissed) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      // Para iOS, solo podemos guiar al usuario
      if (isIOS) {
        return;
      }
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const closePrompt = () => {
    setIsVisible(false);
    localStorage.setItem('installDismissed', 'true');
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs border border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Instalar App</h3>
          <button 
            onClick={closePrompt}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Instala Inkspire Studio para una experiencia más rápida y acceso directo.
        </p>
        
        {isIOS ? (
          <div className="text-xs text-gray-500 mb-3">
            <p>Para iOS: Toca <span className="font-semibold">Compartir</span> → <span className="font-semibold">Agregar a Pantalla de Inicio</span></p>
          </div>
        ) : null}
        
        <div className="flex gap-2">
          <button
            onClick={installApp}
            className="flex-1 bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
          >
            Instalar
          </button>
          <button
            onClick={closePrompt}
            className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 px-3 rounded transition-colors"
          >
            Después
          </button>
        </div>
      </div>
    </div>
  );
}