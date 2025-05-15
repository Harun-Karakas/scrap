"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, LineChart, ChevronDown, Search, Store, ArrowUpDown } from "lucide-react"
import { PriceHistoryModal } from "@/components/price-history-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ScreenSize, useScreenSize } from "@/hooks/use-mobile"

// Ürün tipi tanımı
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

export default function Home() {
  // Ekran boyutu kontrolü
  const screenSize = useScreenSize()
  const isMobileOrTablet = screenSize !== ScreenSize.Desktop

  // Sabit 5 anahtar kelime - gerçek uygulamada bu kullanıcı tarafından ayarlanacak
  const [userKeywords] = useState<string[]>([
    "protein bar",
    "yüksek protein bar",
    "granola",
    "sağlıklı atıştırmalıklar",
    "protein tozu",
  ])

  // Kullanıcının takip ettiği mağazalar
  const [userStores] = useState<string[]>(["Fellas", "Züber", "Waspco"])

  // Aktif platform ve görünüm seçimi için state
  const [activePlatform, setActivePlatform] = useState("trendyol")
  const [activeTab, setActiveTab] = useState("keywords") // keywords veya stores

  // Fiyat geçmişi modalı için state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showPriceHistory, setShowPriceHistory] = useState(false)

  // Seçilen anahtar kelime ve mağaza için state
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  // Sıralama için state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | null
    direction: "ascending" | "descending"
  }>({
    key: null,
    direction: "ascending",
  })

  // Fiyat geçmişi modalını açma fonksiyonu
  const openPriceHistory = (product: Product) => {
    setSelectedProduct(product)
    setShowPriceHistory(true)
  }

  // Fiyat geçmişi modalını kapatma fonksiyonu
  const closePriceHistory = () => {
    setShowPriceHistory(false)
    setSelectedProduct(null)
  }

  // Mock ürün verileri oluşturma fonksiyonu
  const generateMockProducts = (count: number, platform: string, type: "keyword" | "store", source: string) => {
    const products = []

    for (let i = 0; i < count; i++) {
      const price = Math.floor(Math.random() * 200) + 50
      const hasDiscount = Math.random() > 0.5
      const oldPrice = hasDiscount ? price + Math.floor(Math.random() * 50) : undefined
      const percentChange = hasDiscount ? ((price - (oldPrice || 0)) / (oldPrice || 1)) * 100 : 0

      products.push({
        id: `${platform}-${source}-${i}`,
        name:
          type === "keyword"
            ? `${source.charAt(0).toUpperCase() + source.slice(1)} Ürün ${i + 1}`
            : `${source} Ürün ${i + 1}`,
        price: price,
        oldPrice: oldPrice,
        percentChange: percentChange,
        image: `/placeholder.svg?height=150&width=300&text=${encodeURIComponent(source)}`,
        platform: platform,
        source: source,
        rating: Math.floor(Math.random() * 5) + 1,
      })
    }

    return products
  }

  // Aktif platform ve görünüme göre anahtar kelime ürünlerini oluştur
  const getKeywordProducts = () => {
    const products = []

    // Eğer seçili anahtar kelime varsa sadece o anahtar kelimeye ait ürünleri getir
    const keywordsToUse = selectedKeyword ? [selectedKeyword] : userKeywords

    keywordsToUse.forEach((keyword) => {
      // Her anahtar kelime için 4-5 ürün oluştur (toplam 24'e kadar)
      const productCount = Math.min(5, Math.floor(24 / keywordsToUse.length))
      products.push(...generateMockProducts(productCount, activePlatform, "keyword", keyword))
    })

    return products.slice(0, 24) // Maksimum 24 ürün
  }

  // Mağazalara göre ürünleri oluştur
  const getStoreProducts = () => {
    // Eğer seçili mağaza varsa sadece o mağazaya ait ürünleri getir
    const storesToUse = selectedStore ? [selectedStore] : userStores

    let products: Product[] = []

    storesToUse.forEach((store) => {
      // Her mağaza için 20 ürün oluştur (gerçek uygulamada çok daha fazla olabilir)
      products = [...products, ...generateMockProducts(20, activePlatform, "store", store)]
    })

    return products
  }

  // Aktif görünüme göre ürünleri al
  const keywordProducts = getKeywordProducts()
  const storeProducts = getStoreProducts()

  // Sıralama fonksiyonu
  const requestSort = (key: keyof Product) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Ürünleri sırala
  const sortedProducts = (products: Product[]) => {
    if (!sortConfig.key) return products

    return [...products].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const sortedKeywordProducts = sortedProducts(keywordProducts)
  const sortedStoreProducts = sortedProducts(storeProducts)

  // Platform renklerini belirle
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "trendyol":
        return "text-orange-500"
      case "hepsiburada":
        return "text-yellow-500"
      case "n11":
        return "text-blue-500"
      default:
        return ""
    }
  }

  // Platform için border rengi
  const getPlatformBorderColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "trendyol":
        return "#ff6000" // Trendyol turuncu
      case "hepsiburada":
        return "#ffd100" // Hepsiburada sarı
      case "n11":
        return "#2962ff" // N11 mavi
      default:
        return "#e5e7eb" // Varsayılan gri
    }
  }

  // Ürün kartı bileşeni - Mobil ve tablet için
  const ProductCard = ({ product }: { product: Product }) => (
    <Card
      className="mb-4 border-l-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: getPlatformBorderColor(product.platform) }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{product.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            onClick={() => openPriceHistory(product)}
          >
            <LineChart className="h-4 w-4" />
            <span className="sr-only">Fiyat Geçmişi</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Anahtar Kelime:</p>
            <p className="font-medium">{product.source}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Platform:</p>
            <p className={`font-medium ${getPlatformColor(product.platform)}`}>{product.platform}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fiyat:</p>
            <div>
              <span className="font-bold text-blue-700">{product.price.toFixed(2)} TL</span>
              {product.oldPrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {product.oldPrice.toFixed(2)} TL
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Değişim:</p>
            {product.percentChange !== 0 ? (
              <Badge
                className={`${product.percentChange < 0 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
              >
                {product.percentChange < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(product.percentChange).toFixed(1)}%
              </Badge>
            ) : (
              <span>-</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Tablet için kompakt tablo görünümü
  const TabletTableView = ({ products }: { products: Product[] }) => (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <Table>
        <TableHeader className="bg-blue-50">
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => requestSort("name")}
                className="flex items-center text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                Ürün
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => requestSort("platform")}
                className="flex items-center text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                Platform
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => requestSort("price")}
                className="flex items-center ml-auto text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                Fiyat
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[80px]">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={product.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50/30"} hover:bg-blue-50 border-l-4`}
              style={{ borderLeftColor: getPlatformBorderColor(product.platform) }}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.source}</p>
                </div>
              </TableCell>
              <TableCell className={getPlatformColor(product.platform)}>{product.platform}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-bold text-blue-700">{product.price.toFixed(2)} TL</span>
                  {product.oldPrice && (
                    <span className="text-xs text-muted-foreground line-through">{product.oldPrice.toFixed(2)} TL</span>
                  )}
                  {product.percentChange !== 0 && (
                    <Badge
                      className={`mt-1 ${product.percentChange < 0 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                      {product.percentChange < 0 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(product.percentChange).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  onClick={() => openPriceHistory(product)}
                >
                  <LineChart className="h-4 w-4" />
                  <span className="sr-only">Fiyat Geçmişi</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Ekran boyutuna göre uygun görünümü seç
  const renderProductView = (products: Product[]) => {
    if (screenSize === ScreenSize.Mobile) {
      // Mobil için kart görünümü
      return (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )
    } else if (screenSize === ScreenSize.Tablet) {
      // Tablet için kompakt tablo görünümü
      return <TabletTableView products={products} />
    } else {
      // Masaüstü için tam tablo görünümü
      return (
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
          <Table>
            <TableHeader className="bg-blue-50">
              <TableRow>
                <TableHead className="w-[400px]">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="flex items-center text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    Ürün Adı
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("source")}
                    className="flex items-center text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    {activeTab === "keywords" ? "Anahtar Kelime" : "Mağaza"}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("platform")}
                    className="flex items-center text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    Platform
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("price")}
                    className="flex items-center ml-auto text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    Fiyat
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("percentChange")}
                    className="flex items-center ml-auto text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  >
                    Değişim
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50/30"} hover:bg-blue-50 border-l-4`}
                  style={{ borderLeftColor: getPlatformBorderColor(product.platform) }}
                >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.source}</TableCell>
                  <TableCell className={getPlatformColor(product.platform)}>{product.platform}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-blue-700">{product.price.toFixed(2)} TL</span>
                      {product.oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {product.oldPrice.toFixed(2)} TL
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.percentChange !== 0 && (
                      <Badge
                        className={`${product.percentChange < 0 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                      >
                        {product.percentChange < 0 ? (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(product.percentChange).toFixed(1)}%
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      onClick={() => openPriceHistory(product)}
                    >
                      <LineChart className="h-4 w-4" />
                      <span className="sr-only">Fiyat Geçmişi</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col max-w-[1400px] mx-auto">
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
        <div className="px-4 flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="h-6 w-6" />
            <span>FiyatTakip</span>
          </Link>
          <nav className="ml-auto">
            <Link href="/profile" className="text-sm font-medium hover:underline underline-offset-4">
              Profil
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-blue-800 border-b pb-2 border-blue-200">Ürün Takip Panelim</h1>

        {/* Ana İçerik Sekmeleri */}
        <Tabs defaultValue="keywords" onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-blue-100">
            <TabsTrigger value="keywords" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Anahtar Kelime Ürünleri
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Mağaza Ürünleri
            </TabsTrigger>
          </TabsList>

          {/* Anahtar Kelime Ürünleri Sekmesi */}
          <TabsContent value="keywords" className="space-y-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-blue-700">Anahtar Kelime Ürünleri</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {selectedKeyword || "Anahtar Kelime Seç"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 border-blue-200">
                    <DropdownMenuItem onClick={() => setSelectedKeyword(null)} className="hover:bg-blue-50">
                      <span className="font-medium">Tümünü Göster</span>
                    </DropdownMenuItem>
                    {userKeywords.map((keyword, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedKeyword(keyword)}
                        className="hover:bg-blue-50"
                      >
                        <Search className="mr-2 h-4 w-4 text-blue-600" />
                        <span>{keyword}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Tabs defaultValue="trendyol" onValueChange={setActivePlatform} className="w-full sm:w-auto">
                  <TabsList
                    className={`grid grid-cols-3 w-full sm:w-auto bg-gray-100 ${screenSize === ScreenSize.Tablet ? "text-xs" : ""}`}
                  >
                    <TabsTrigger
                      value="trendyol"
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Trendyol
                    </TabsTrigger>
                    <TabsTrigger
                      value="hepsiburada"
                      className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                    >
                      Hepsiburada
                    </TabsTrigger>
                    <TabsTrigger value="n11" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      N11
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {sortedKeywordProducts.length > 0 ? (
              renderProductView(sortedKeywordProducts)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm">
                <p className="text-muted-foreground mb-4">Seçilen kriterlere uygun ürün bulunamadı</p>
                <Button onClick={() => setSelectedKeyword(null)} className="bg-blue-600 hover:bg-blue-700">
                  Tüm Ürünleri Göster
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Mağaza Ürünleri Sekmesi */}
          <TabsContent value="stores" className="space-y-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-blue-700">Mağaza Ürünleri</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {selectedStore || "Mağaza Seç"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 border-blue-200">
                    <DropdownMenuItem onClick={() => setSelectedStore(null)} className="hover:bg-blue-50">
                      <span className="font-medium">Tüm Mağazalar</span>
                    </DropdownMenuItem>
                    {userStores.map((store, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedStore(store)}
                        className="hover:bg-blue-50"
                      >
                        <Store className="mr-2 h-4 w-4 text-blue-600" />
                        <span>{store}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Tabs defaultValue="trendyol" onValueChange={setActivePlatform}>
                  <TabsList className={`bg-gray-100 ${screenSize === ScreenSize.Tablet ? "text-xs" : ""}`}>
                    <TabsTrigger
                      value="trendyol"
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Trendyol
                    </TabsTrigger>
                    <TabsTrigger
                      value="hepsiburada"
                      className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                    >
                      Hepsiburada
                    </TabsTrigger>
                    <TabsTrigger value="n11" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      N11
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {userStores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-sm">
                <p className="text-muted-foreground mb-4">Henüz mağaza eklenmedi</p>
                <Button onClick={() => setActiveTab("keywords")} className="bg-blue-600 hover:bg-blue-700">
                  Anahtar Kelime Ürünlerine Dön
                </Button>
              </div>
            ) : (
              renderProductView(sortedStoreProducts.slice(0, 20))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="w-full border-t py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="px-4 flex items-center justify-between">
          <p className="text-sm">© 2024 FiyatTakip</p>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm hover:underline">
              Profil
            </Link>
            <Link href="/settings" className="text-sm hover:underline">
              Ayarlar
            </Link>
          </div>
        </div>
      </footer>

      {/* Fiyat Geçmişi Modalı */}
      {showPriceHistory && selectedProduct && (
        <PriceHistoryModal product={selectedProduct} onClose={closePriceHistory} />
      )}
    </div>
  )
}
