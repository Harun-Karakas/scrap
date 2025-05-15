"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, TrendingDown, TrendingUp } from "lucide-react"
import { ScreenSize, useScreenSize } from "@/hooks/use-mobile"

interface PricePoint {
  date: string
  price: number
}

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  percentChange: number
  image: string
  platform: string
  source: string
  rating: number
}

interface PriceHistoryModalProps {
  product: Product
  onClose: () => void
}

export function PriceHistoryModal({ product, onClose }: PriceHistoryModalProps) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)
  const screenSize = useScreenSize()

  useEffect(() => {
    // Gerçek uygulamada bu bir API çağrısı olacaktır
    const generateMockPriceHistory = () => {
      setLoading(true)
      const mockData: PricePoint[] = []
      const today = new Date()
      let basePrice = product.price

      // Son 30 günün fiyat geçmişini oluştur
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Rastgele fiyat değişimleri ekle
        if (i % 5 === 0) {
          // Her 5 günde bir daha büyük fiyat değişimi
          basePrice = basePrice + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 15)
        } else {
          // Günlük küçük dalgalanmalar
          basePrice = basePrice + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
        }

        // Fiyatın 20'nin altına düşmesini engelle
        basePrice = Math.max(20, basePrice)

        mockData.push({
          date: date.toISOString().split("T")[0],
          price: basePrice,
        })
      }

      setPriceHistory(mockData)
      setLoading(false)
    }

    generateMockPriceHistory()
  }, [product])

  // Fiyat istatistiklerini hesapla
  const calculateStats = () => {
    if (priceHistory.length === 0) return { min: 0, max: 0, avg: 0, current: 0, oldest: 0 }

    const prices = priceHistory.map((point) => point.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const current = priceHistory[priceHistory.length - 1].price
    const oldest = priceHistory[0].price

    return { min, max, avg, current, oldest }
  }

  const stats = calculateStats()
  const priceChange = stats.current - stats.oldest
  const percentChange = (priceChange / stats.oldest) * 100

  // Fiyat geçmişi grafiği için min ve max değerleri bul
  const prices = priceHistory.map((point) => point.price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const range = maxPrice - minPrice

  // Tablet ve mobil için optimize edilmiş görünüm
  const isTabletOrMobile = screenSize !== ScreenSize.Desktop

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full ${isTabletOrMobile ? "max-w-[95%]" : "max-w-4xl"} max-h-[90vh] overflow-y-auto`}>
        <CardContent className={`${isTabletOrMobile ? "p-4" : "p-6"}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-start gap-4">
              <div
                className={`${isTabletOrMobile ? "h-12 w-12" : "h-16 w-16"} rounded-md overflow-hidden flex-shrink-0`}
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className={isTabletOrMobile ? "max-w-[70%]" : ""}>
                <h2 className={`${isTabletOrMobile ? "text-lg" : "text-xl"} font-bold truncate`}>{product.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline">{product.platform}</Badge>
                  <Badge variant="outline">{product.source}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-lg">{product.price.toFixed(2)} TL</span>
                  {product.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.oldPrice.toFixed(2)} TL</span>
                  )}
                  {product.percentChange !== 0 && (
                    <Badge className={product.percentChange < 0 ? "bg-green-500" : "bg-red-500"}>
                      {product.percentChange < 0 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(product.percentChange).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-lg font-medium mb-4">Fiyat Geçmişi</h3>

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Fiyat Geçmişi Grafiği ve İstatistikleri */}
              <div
                className={`grid grid-cols-1 ${isTabletOrMobile ? "md:grid-cols-1 gap-4" : "md:grid-cols-3 gap-6"} mb-6`}
              >
                {/* Çizgi Grafiği - Tablet/Mobil için tam genişlik, Masaüstü için 2/3 genişlik */}
                <div className={`${isTabletOrMobile ? "" : "md:col-span-2"} h-64 relative border rounded-lg p-4`}>
                  <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                    {/* Y ekseni çizgileri */}
                    <line x1="50" y1="20" x2="50" y2="280" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="50" y1="280" x2="950" y2="280" stroke="#e5e7eb" strokeWidth="1" />

                    {/* Y ekseni değerleri */}
                    <text x="45" y="30" textAnchor="end" fontSize="12" fill="currentColor">
                      {maxPrice.toFixed(0)} TL
                    </text>
                    <text x="45" y="150" textAnchor="end" fontSize="12" fill="currentColor">
                      {((maxPrice + minPrice) / 2).toFixed(0)} TL
                    </text>
                    <text x="45" y="280" textAnchor="end" fontSize="12" fill="currentColor">
                      {minPrice.toFixed(0)} TL
                    </text>

                    {/* Çizgi grafiği */}
                    <polyline
                      points={priceHistory
                        .map((point, index) => {
                          const x = 50 + (900 / (priceHistory.length - 1)) * index
                          const y = 280 - ((point.price - minPrice) / (maxPrice - minPrice || 1)) * 260
                          return `${x},${y}`
                        })
                        .join(" ")}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />

                    {/* Veri noktaları */}
                    {priceHistory.map((point, index) => {
                      const x = 50 + (900 / (priceHistory.length - 1)) * index
                      const y = 280 - ((point.price - minPrice) / (maxPrice - minPrice || 1)) * 260
                      return (
                        <g key={index} className="group">
                          <circle cx={x} cy={y} r="4" fill="hsl(var(--primary))" className="cursor-pointer" />

                          {/* Tooltip */}
                          <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <rect
                              x={x - 50}
                              y={y - 40}
                              width="100"
                              height="30"
                              rx="4"
                              fill="hsl(var(--background))"
                              stroke="hsl(var(--border))"
                            />
                            <text x={x} y={y - 20} textAnchor="middle" fontSize="12" fill="currentColor">
                              {point.price.toFixed(2)} TL
                            </text>
                            <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
                              {point.date.split("-").slice(1).join("/")}
                            </text>
                          </g>
                        </g>
                      )
                    })}
                  </svg>

                  {/* X ekseni etiketleri */}
                  <div className="flex justify-between px-12 mt-2">
                    {priceHistory
                      .filter((_, i) => i % (isTabletOrMobile ? 10 : 5) === 0 || i === priceHistory.length - 1)
                      .map((point, index) => (
                        <span key={index} className="text-[10px] text-muted-foreground">
                          {point.date.split("-").slice(1).join("/")}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Fiyat İstatistikleri - Tablet/Mobil için grid, Masaüstü için 1/3 genişlik */}
                <div className={`${isTabletOrMobile ? "grid grid-cols-2 gap-2" : "space-y-4"}`}>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Güncel Fiyat</p>
                    <p className="text-lg font-bold">{stats.current.toFixed(2)} TL</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">En Düşük Fiyat</p>
                    <p className="text-lg font-bold text-green-500">{stats.min.toFixed(2)} TL</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">En Yüksek Fiyat</p>
                    <p className="text-lg font-bold text-red-500">{stats.max.toFixed(2)} TL</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">30 Günlük Değişim</p>
                    <div className="flex items-center">
                      <p className={`text-lg font-bold ${percentChange < 0 ? "text-green-500" : "text-red-500"}`}>
                        {percentChange < 0 ? "" : "+"}
                        {percentChange.toFixed(2)}%
                      </p>
                      {percentChange < 0 ? (
                        <TrendingDown className="h-4 w-4 ml-2 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 ml-2 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiyat Tablosu */}
              <div className="mt-8">
                <h4 className="text-md font-medium mb-2">Fiyat Değişim Tablosu</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[200px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left p-2 text-sm font-medium">Tarih</th>
                          <th className="text-right p-2 text-sm font-medium">Fiyat</th>
                          <th className="text-right p-2 text-sm font-medium">Değişim</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceHistory.map((point, index) => {
                          const prevPrice = index > 0 ? priceHistory[index - 1].price : point.price
                          const change = point.price - prevPrice
                          const changePercent = (change / prevPrice) * 100

                          return (
                            <tr key={index} className="border-t">
                              <td className="p-2 text-sm">
                                {new Date(point.date).toLocaleDateString("tr-TR", {
                                  day: "numeric",
                                  month: "short",
                                  year: isTabletOrMobile ? undefined : "numeric",
                                })}
                              </td>
                              <td className="p-2 text-sm text-right font-medium">{point.price.toFixed(2)} TL</td>
                              <td
                                className={`p-2 text-sm text-right ${
                                  change === 0
                                    ? "text-muted-foreground"
                                    : change < 0
                                      ? "text-green-500"
                                      : "text-red-500"
                                }`}
                              >
                                {change === 0 ? (
                                  "-"
                                ) : (
                                  <span className="flex items-center justify-end">
                                    {change < 0 ? (
                                      <TrendingDown className="h-3 w-3 mr-1" />
                                    ) : (
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                    )}
                                    {change < 0 ? "" : "+"}
                                    {change.toFixed(2)} TL ({changePercent.toFixed(2)}%)
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
