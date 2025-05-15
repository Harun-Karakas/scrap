"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Heart, LineChart, X } from "lucide-react"
import { PriceChart } from "@/components/price-chart"

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image: string
  store: string
  rating: number
  keyword: string
}

interface KeywordTrackerProps {
  platform: string
  keywords: string[]
}

export function KeywordTracker({ platform, keywords }: KeywordTrackerProps) {
  const [view, setView] = useState<"bestsellers" | "recommended">("bestsellers")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showPriceChart, setShowPriceChart] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call to fetch products based on keywords and platform
    const fetchProducts = async () => {
      setLoading(true)

      // Mock data generation
      const mockProducts: Product[] = []

      keywords.forEach((keyword) => {
        // Generate 3-5 products per keyword
        const productCount = Math.floor(Math.random() * 3) + 3

        for (let i = 0; i < productCount; i++) {
          const price = Math.floor(Math.random() * 200) + 50
          const hasDiscount = Math.random() > 0.5

          mockProducts.push({
            id: `${platform}-${keyword}-${i}`,
            name: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${i + 1}`,
            price: price,
            oldPrice: hasDiscount ? price + Math.floor(Math.random() * 50) : undefined,
            image: "/placeholder.svg",
            store: ["Fellas", "Züber", "Waspco", "Protein Outlet", "Granolife"][Math.floor(Math.random() * 5)],
            rating: Math.floor(Math.random() * 5) + 1,
            keyword,
          })
        }
      })

      setProducts(mockProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [platform, keywords])

  const toggleFavorite = (productId: string) => {
    // In a real app, this would update a database or local storage
    console.log(`Toggle favorite for product ${productId}`)
  }

  const viewPriceHistory = (product: Product) => {
    setSelectedProduct(product)
    setShowPriceChart(true)
  }

  const closePriceChart = () => {
    setShowPriceChart(false)
    setSelectedProduct(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <Tabs defaultValue="bestsellers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bestsellers" onClick={() => setView("bestsellers")}>
            En Çok Satanlar
          </TabsTrigger>
          <TabsTrigger value="recommended" onClick={() => setView("recommended")}>
            Önerilen Ürünler
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bestsellers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.store} • {platform}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{product.price.toFixed(2)} TL</span>
                          {product.oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.oldPrice.toFixed(2)} TL
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Anahtar Kelime: {product.keyword}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => viewPriceHistory(product)}
                      >
                        <LineChart className="h-4 w-4" />
                        Fiyat Geçmişi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recommended">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {products
              .slice()
              .reverse()
              .map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.store} • {platform}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{product.price.toFixed(2)} TL</span>
                            {product.oldPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.oldPrice.toFixed(2)} TL
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Anahtar Kelime: {product.keyword}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => viewPriceHistory(product)}
                        >
                          <LineChart className="h-4 w-4" />
                          Fiyat Geçmişi
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {showPriceChart && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedProduct.name} - Fiyat Geçmişi</h3>
                <Button variant="ghost" size="sm" onClick={closePriceChart}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <PriceChart productId={selectedProduct.id} platform={platform} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
