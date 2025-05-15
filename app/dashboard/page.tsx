"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, TrendingDown, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("trendyol")

  // Mock data for price alerts
  const priceAlerts = [
    {
      id: 1,
      productName: "Fellas Protein Bar",
      platform: "Trendyol",
      oldPrice: 149.99,
      newPrice: 129.99,
      percentChange: -13.33,
      date: "2024-05-14",
    },
    {
      id: 2,
      productName: "Züber Granola",
      platform: "Hepsiburada",
      oldPrice: 89.99,
      newPrice: 69.99,
      percentChange: -22.22,
      date: "2024-05-13",
    },
    {
      id: 3,
      productName: "Waspco Protein Tozu",
      platform: "N11",
      oldPrice: 399.99,
      newPrice: 449.99,
      percentChange: 12.5,
      date: "2024-05-12",
    },
    {
      id: 4,
      productName: "Protein Outlet Atıştırmalık",
      platform: "Trendyol",
      oldPrice: 59.99,
      newPrice: 49.99,
      percentChange: -16.67,
      date: "2024-05-11",
    },
  ]

  // Filter alerts by platform
  const filteredAlerts = priceAlerts.filter(
    (alert) => activeTab === "all" || alert.platform.toLowerCase() === activeTab.toLowerCase(),
  )

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Geri
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Fiyat Takip Paneli</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fiyat Değişim Uyarıları</CardTitle>
            <CardDescription>Takip ettiğiniz ürünlerdeki son fiyat değişimleri</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü</TabsTrigger>
                <TabsTrigger value="trendyol">Trendyol</TabsTrigger>
                <TabsTrigger value="hepsiburada">Hepsiburada</TabsTrigger>
                <TabsTrigger value="n11">N11</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <PriceAlertsList alerts={filteredAlerts} />
              </TabsContent>
              <TabsContent value="trendyol" className="mt-4">
                <PriceAlertsList alerts={filteredAlerts} />
              </TabsContent>
              <TabsContent value="hepsiburada" className="mt-4">
                <PriceAlertsList alerts={filteredAlerts} />
              </TabsContent>
              <TabsContent value="n11" className="mt-4">
                <PriceAlertsList alerts={filteredAlerts} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>En Çok İndirim Yapılan Ürünler</CardTitle>
              <CardDescription>Son 7 gün içinde en çok indirim yapılan ürünler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceAlerts
                  .filter((alert) => alert.percentChange < 0)
                  .sort((a, b) => a.percentChange - b.percentChange)
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{alert.productName}</h3>
                        <p className="text-sm text-muted-foreground">{alert.platform}</p>
                      </div>
                      <div className="flex items-center text-green-500">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        <span>{Math.abs(alert.percentChange).toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>En Çok Zam Yapılan Ürünler</CardTitle>
              <CardDescription>Son 7 gün içinde en çok zam yapılan ürünler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceAlerts
                  .filter((alert) => alert.percentChange > 0)
                  .sort((a, b) => b.percentChange - a.percentChange)
                  .slice(0, 3)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{alert.productName}</h3>
                        <p className="text-sm text-muted-foreground">{alert.platform}</p>
                      </div>
                      <div className="flex items-center text-red-500">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>{alert.percentChange.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface PriceAlert {
  id: number
  productName: string
  platform: string
  oldPrice: number
  newPrice: number
  percentChange: number
  date: string
}

interface PriceAlertsListProps {
  alerts: PriceAlert[]
}

function PriceAlertsList({ alerts }: PriceAlertsListProps) {
  if (alerts.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Bu platformda henüz fiyat değişimi bulunmuyor</div>
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">{alert.productName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{alert.platform}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{formatDate(alert.date)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-muted-foreground">{alert.oldPrice.toFixed(2)} TL</span>
              <span className="font-bold">{alert.newPrice.toFixed(2)} TL</span>
            </div>
            <div
              className={`text-sm flex items-center justify-end ${alert.percentChange < 0 ? "text-green-500" : "text-red-500"}`}
            >
              {alert.percentChange < 0 ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              <span>
                {alert.percentChange < 0 ? "-" : "+"}
                {Math.abs(alert.percentChange).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" })
}
