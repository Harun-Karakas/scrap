"use client"

import { useState, useEffect } from "react"

// Ekran boyutu için enum tanımlıyorum
export enum ScreenSize {
  Mobile = "mobile",
  Tablet = "tablet",
  Desktop = "desktop",
}

// Ekran boyutunu kontrol eden hook
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(ScreenSize.Desktop)

  useEffect(() => {
    // Tarayıcı ortamında olduğundan emin ol
    if (typeof window === "undefined") return

    // Ekran boyutunu kontrol eden fonksiyon
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setScreenSize(ScreenSize.Mobile)
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setScreenSize(ScreenSize.Tablet)
      } else {
        setScreenSize(ScreenSize.Desktop)
      }
    }

    // İlk kontrol
    checkScreenSize()

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener("resize", checkScreenSize)

    // Temizleme fonksiyonu
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return screenSize
}

// Geriye dönük uyumluluk için eski hook'u da koruyorum
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Tarayıcı ortamında olduğundan emin ol
    if (typeof window === "undefined") return

    // İlk yükleme için ekran genişliğini kontrol et
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // İlk kontrol
    checkMobile()

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener("resize", checkMobile)

    // Temizleme fonksiyonu
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [breakpoint])

  return isMobile
}
