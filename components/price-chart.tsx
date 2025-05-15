"use client"

import { useEffect, useState } from "react"

interface PricePoint {
  date: string
  price: number
}

interface PriceChartProps {
  productId: string
  platform: string
}

export function PriceChart({ productId, platform }: PriceChartProps) {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to fetch price history
    const fetchPriceHistory = () => {
      setLoading(true)

      // Generate mock price history data for the last 30 days
      const mockData: PricePoint[] = []
      const today = new Date()
      let basePrice = Math.floor(Math.random() * 100) + 50

      for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        // Add some random price fluctuations
        if (i % 5 === 0) {
          // Bigger price change every 5 days
          basePrice = basePrice + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 15)
        } else {
          // Small daily fluctuations
          basePrice = basePrice + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3)
        }

        // Ensure price doesn't go below 20
        basePrice = Math.max(20, basePrice)

        mockData.push({
          date: date.toISOString().split("T")[0],
          price: basePrice,
        })
      }

      setPriceHistory(mockData)
      setLoading(false)
    }

    fetchPriceHistory()
  }, [productId, platform])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Find min and max prices for scaling
  const prices = priceHistory.map((point) => point.price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const range = maxPrice - minPrice

  // Calculate statistics
  const currentPrice = priceHistory[priceHistory.length - 1].price
  const oldestPrice = priceHistory[0].price
  const priceChange = currentPrice - oldestPrice
  const percentChange = (priceChange / oldestPrice) * 100

  // Find lowest price point
  const lowestPrice = Math.min(...prices)
  const lowestPriceDate = priceHistory.find((point) => point.price === lowestPrice)?.date

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Güncel Fiyat</p>
          <p className="text-2xl font-bold">{currentPrice.toFixed(2)} TL</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">30 Günlük Değişim</p>
          <p className={`text-2xl font-bold ${priceChange >= 0 ? "text-red-500" : "text-green-500"}`}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)} TL ({percentChange.toFixed(2)}%)
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">En Düşük Fiyat</p>
          <p className="text-2xl font-bold">{lowestPrice.toFixed(2)} TL</p>
          <p className="text-xs text-muted-foreground">{lowestPriceDate}</p>
        </div>
      </div>

      <div className="h-64 relative">
        <div className="absolute inset-0 flex items-end">
          {priceHistory.map((point, index) => {
            // Calculate height percentage based on price
            const heightPercentage = range === 0 ? 50 : ((point.price - minPrice) / range) * 80 + 10

            return (
              <div key={index} className="flex-1 flex flex-col items-center group" style={{ height: "100%" }}>
                <div className="relative w-full h-full flex items-end justify-center">
                  <div
                    className={`w-full max-w-[12px] mx-auto rounded-t ${
                      index === priceHistory.length - 1
                        ? "bg-primary"
                        : point.price === lowestPrice
                          ? "bg-green-500"
                          : "bg-muted-foreground/30"
                    }`}
                    style={{ height: `${heightPercentage}%` }}
                  ></div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded p-2 text-xs pointer-events-none z-10">
                    <p className="font-bold">{point.price.toFixed(2)} TL</p>
                    <p className="text-muted-foreground">{point.date}</p>
                  </div>
                </div>

                {/* X-axis labels (show every 5th day) */}
                {index % 5 === 0 && (
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {point.date.split("-").slice(1).join("/")}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
