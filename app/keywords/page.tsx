"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Plus, X } from "lucide-react"
import { KeywordTracker } from "@/components/keyword-tracker"

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState("")
  const [activeTab, setActiveTab] = useState("trendyol")

  const addKeyword = () => {
    if (currentKeyword && keywords.length < 5 && !keywords.includes(currentKeyword)) {
      setKeywords([...keywords, currentKeyword])
      setCurrentKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addKeyword()
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
        <h1 className="text-2xl font-bold">Anahtar Kelime Takibi</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Anahtar Kelimeler Ekle</CardTitle>
          <CardDescription>Takip etmek istediğiniz ürünler için en fazla 5 anahtar kelime ekleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="px-3 py-1 text-sm">
                {keyword}
                <button onClick={() => removeKeyword(keyword)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {keywords.length === 0 && <p className="text-sm text-muted-foreground">Henüz anahtar kelime eklenmedi</p>}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Anahtar kelime girin (örn. protein bar)"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={keywords.length >= 5}
            />
            <Button onClick={addKeyword} disabled={!currentKeyword || keywords.length >= 5}>
              <Plus className="h-4 w-4 mr-1" />
              Ekle
            </Button>
          </div>
          {keywords.length >= 5 && (
            <p className="text-sm text-muted-foreground mt-2">Maksimum 5 anahtar kelime ekleyebilirsiniz</p>
          )}
        </CardContent>
      </Card>

      {keywords.length > 0 && (
        <Tabs defaultValue="trendyol" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trendyol">Trendyol</TabsTrigger>
            <TabsTrigger value="hepsiburada">Hepsiburada</TabsTrigger>
            <TabsTrigger value="n11">N11</TabsTrigger>
          </TabsList>
          <TabsContent value="trendyol">
            <KeywordTracker platform="Trendyol" keywords={keywords} />
          </TabsContent>
          <TabsContent value="hepsiburada">
            <KeywordTracker platform="Hepsiburada" keywords={keywords} />
          </TabsContent>
          <TabsContent value="n11">
            <KeywordTracker platform="N11" keywords={keywords} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
