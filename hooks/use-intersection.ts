"use client"

import { useEffect, useState } from "react"

type Options = IntersectionObserverInit

export function useIntersection<T extends HTMLElement>(ref: React.RefObject<T>, options?: Options) {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting)
    }, options)
    obs.observe(el)
    return () => {
      obs.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}
