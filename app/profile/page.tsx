"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Save, X } from "lucide-react"

export default function ProfilePage() {
  // Mock user data
  const [user, setUser] = useState({
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    username: "ahmetyilmaz",
  })

  // Mock tracked keywords and stores
  const [trackedKeywords, setTrackedKeywords] = useState([
    "protein bar",
    "yüksek protein bar",
    "granola",
    "sağlıklı atıştırmalıklar",
  ])

  const [trackedStores, setTrackedStores] = useState(["Fellas", "Züber", "Waspco"])

  const removeKeyword = (keyword: string) => {
    setTrackedKeywords(trackedKeywords.filter((k) => k !== keyword))
  }

  const removeStore = (store: string) => {
    setTrackedStores(trackedStores.filter((s) => s !== store))
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
        <h1 className="text-2xl font-bold">Profil</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Değişiklikleri Kaydet
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Takip Edilen Anahtar Kelimeler</CardTitle>
              <CardDescription>Takip ettiğiniz anahtar kelimeleri yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trackedKeywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="px-3 py-1 text-sm">
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {trackedKeywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">Henüz anahtar kelime takip etmiyorsunuz</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/keywords">Anahtar Kelime Ekle</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Takip Edilen Mağazalar</CardTitle>
              <CardDescription>Takip ettiğiniz mağazaları yönetin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trackedStores.map((store) => (
                  <Badge key={store} variant="secondary" className="px-3 py-1 text-sm">
                    {store}
                    <button onClick={() => removeStore(store)} className="ml-2">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {trackedStores.length === 0 && (
                  <p className="text-sm text-muted-foreground">Henüz mağaza takip etmiyorsunuz</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/stores">Mağaza Ekle</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
