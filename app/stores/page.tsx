"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Plus, Search, X } from "lucide-react"
import { StoreTracker } from "@/components/store-tracker"

export default function StoresPage() {
  const [stores, setStores] = useState<string[]>([])
  const [currentStore, setCurrentStore] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("trendyol")

  // Mock store search function
  const searchStores = (query: string) => {
    if (!query) return []

    // Mock data - in a real app, this would be an API call
    const mockStores = [
      "Fellas",
      "Züber",
      "Waspco",
      "Protein Outlet",
      "Granolife",
      "Fitness Market",
      "Protein Plus",
      "Sağlıklı Yaşam",
      "Sporcu Gıdaları",
    ]

    return mockStores.filter((store) => store.toLowerCase().includes(query.toLowerCase()))
  }

  const handleSearch = () => {
    const results = searchStores(currentStore)
    setSearchResults(results)
  }

  const addStore = (store: string) => {
    if (!stores.includes(store)) {
      setStores([...stores, store])
      setSearchResults([])
      setCurrentStore("")
    }
  }

  const removeStore = (store: string) => {
    setStores(stores.filter((s) => s !== store))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Geri
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Mağaza Takibi</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Mağaza Ara</CardTitle>
          <CardDescription>Takip etmek istediğiniz mağazaları arayın ve ekleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {stores.map((store) => (
              <Badge key={store} variant="secondary" className="px-3 py-1 text-sm">
                {store}
                <button onClick={() => removeStore(store)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {stores.length === 0 && <p className="text-sm text-muted-foreground">Henüz mağaza eklenmedi</p>}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Mağaza adı girin (örn. Fellas)"
              value={currentStore}
              onChange={(e) => setCurrentStore(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-1" />
              Ara
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Arama Sonuçları:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {searchResults.map((store) => (
                  <Button key={store} variant="outline" className="justify-start" onClick={() => addStore(store)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {store}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {stores.length > 0 && (
        <Tabs defaultValue="trendyol" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trendyol">Trendyol</TabsTrigger>
            <TabsTrigger value="hepsiburada">Hepsiburada</TabsTrigger>
            <TabsTrigger value="n11">N11</TabsTrigger>
          </TabsList>
          <TabsContent value="trendyol">
            <StoreTracker platform="Trendyol" stores={stores} />
          </TabsContent>
          <TabsContent value="hepsiburada">
            <StoreTracker platform="Hepsiburada" stores={stores} />
          </TabsContent>
          <TabsContent value="n11">
            <StoreTracker platform="N11" stores={stores} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
