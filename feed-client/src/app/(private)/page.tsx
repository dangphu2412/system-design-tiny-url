"use client"
import {useCallback, useState} from "react";
import {Bell, Search} from "lucide-react"
import Image from "next/image"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Toaster} from "@/components/ui/sonner"
import {toast} from "sonner"

interface CartItem {
    id: string
    name: string
    price: number
    size: string
    quantity: number
    image: string
}

export default function HomePage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            name: "Monocle Canvas Tote Bag",
            price: 213.99,
            size: "L",
            quantity: 1,
            image:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20Best%20Media%20Tote%20Bags,%20Ranked.jpg-z2O2nGPSTrjey8xEM1cc5aTI2ggjXE.jpeg",
        },
        {
            id: "2",
            name: "Square One District Tote",
            price: 189.99,
            size: "M",
            quantity: 1,
            image:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Index,%20Vanderbrand.jpg-Fv7HHkBaQgZe7HG3hbz5aojPoFRIuo.jpeg",
        },
    ])

    const popularItems = [
        {
            id: "1",
            name: "Monocle Canvas Tote Bag",
            price: 213.99,
            rating: 4.9,
            image:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20Best%20Media%20Tote%20Bags,%20Ranked.jpg-z2O2nGPSTrjey8xEM1cc5aTI2ggjXE.jpeg",
        },
        {
            id: "2",
            name: "Square One District Tote",
            price: 189.99,
            rating: 4.9,
            image:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Index,%20Vanderbrand.jpg-Fv7HHkBaQgZe7HG3hbz5aojPoFRIuo.jpeg",
        },
        {
            id: "3",
            name: "Sporty & Rich Canvas Tote",
            price: 221.99,
            rating: 4.9,
            image:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20(2).jpg-zbeT25jMphcVf4DmpAlTVsGALg88Zn.jpeg",
        },
    ]

    const updateQuantity = useCallback((itemId: string, change: number) => {
        setCartItems(
            (prevItems) =>
                prevItems
                    .map((item) => {
                        if (item.id === itemId) {
                            const newQuantity = Math.max(0, item.quantity + change)
                            if (newQuantity === 0) {
                                toast.success("Item added to cart", {
                                    description: `${item.name} has been added to your cart.`,
                                })
                                return null
                            }
                            return { ...item, quantity: newQuantity }
                        }
                        return item
                    })
                    .filter(Boolean) as CartItem[],
        )
    }, [])

    const addToCart = useCallback((item: (typeof popularItems)[0]) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((cartItem) => cartItem.id === item.id)
            if (existingItem) {
                return prevItems.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                )
            }
            toast.success("Item added to cart", {
                description: `${item.name} has been added to your cart.`,
            })
            return [...prevItems, { ...item, quantity: 1, size: "M" }]
        })
    }, [])

    const calculateTotal = useCallback((items: CartItem[]) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }, [])

    const cartTotal = calculateTotal(cartItems)
  return (
    <>
        <Toaster />
        {/* Main Content */}
        <main className="flex-1 px-8 py-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">
                        Hi, Dollar! <span className="ml-1">👋</span>
                    </h2>
                    <p className="text-gray-500">Welcome Back</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input className="w-64 pl-10" placeholder="Search destination" />
                    </div>
                    <Button size="icon" variant="ghost">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Avatar className="w-10 h-10">
                        <AvatarImage
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-482Kz4Ro7YXPgsZnttDFsQEmrWQnhG.jpeg"
                            alt="User avatar"
                        />
                        <AvatarFallback>NA</AvatarFallback>
                    </Avatar>
                </div>
            </header>

            <div className="mb-12 grid grid-cols-2 gap-6">
                <Card className="bg-[#e0e5ce] border-0 rounded-[24px]">
                    <CardContent className="p-6">
                        <p className="mb-2 text-sm font-medium uppercase text-[#338838]">BEST OFFERS</p>
                        <h3 className="mb-4 text-2xl font-semibold">Tote Bag Collection</h3>
                        <p className="mb-6 text-gray-600">Join and discover the best product according to your passion</p>
                        <Button className="bg-[#415444] hover:bg-[#415444]/90">See More</Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#e7ddd1] border-0 rounded-[24px]">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <h3 className="mb-4 text-3xl font-semibold">Flash Sale ✨</h3>
                            <p className="mb-6 text-5xl font-bold">75% OFF</p>
                            <Button className="bg-[#415444] hover:bg-[#415444]/90">Buy Now!</Button>
                        </div>
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Index,%20Vanderbrand.jpg-Fv7HHkBaQgZe7HG3hbz5aojPoFRIuo.jpeg"
                            alt="Square One District Tote"
                            width={200}
                            height={200}
                            className="object-contain"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Popular Collection</h3>
                <Button variant="link">See All</Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {popularItems.map((item) => (
                    <Card
                        key={item.id}
                        className="group border-0 bg-[#e0e5ce] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <CardHeader className="p-0 relative">
                            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 z-10" />
                            <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 transform scale-95 transition-all group-hover:opacity-100 group-hover:scale-100 bg-white text-black hover:bg-white/90">
                                Quick View
                            </Button>
                            <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={400}
                                height={400}
                                className="h-[280px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold mb-1 line-clamp-1">{item.name}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">({item.rating})</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-[#338838] text-xl font-semibold">$ {item.price}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full hover:bg-[#415444] hover:text-white transition-colors"
                                    onClick={() => addToCart(item)}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    </>
  );
}
