"use client"

import Image from "next/image"
import {useState} from "react"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {type Product, useToteStore} from "@/features/totes/totes.store"
import {QuickViewDialog} from "@/features/totes/search-totes/quick-view-dialog";

interface ProductCardProps {
    product: Product
}

export function ToteOverviewCard({ product }: ProductCardProps) {
    const { addToCart } = useToteStore()
    const [quickViewOpen, setQuickViewOpen] = useState(false)

    const handleAddToCart = () => {
        addToCart(product)
    }

    return (
        <>
            <Card className="group border-0 bg-[#e0e5ce] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 z-10" />
                    <Button
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 transform scale-95 transition-all group-hover:opacity-100 group-hover:scale-100 bg-white text-black hover:bg-white/90"
                        onClick={() => setQuickViewOpen(true)}
                    >
                        Quick View
                    </Button>
                    {(product.isNewArrival || product.isBestSeller) && (
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            {product.isNewArrival && <Badge className="bg-[#338838] hover:bg-[#338838]">New</Badge>}
                            {product.isBestSeller && <Badge className="bg-[#d4a017] hover:bg-[#d4a017]">Best Seller</Badge>}
                        </div>
                    )}
                    {!product.inStock && (
                        <Badge variant="outline" className="absolute top-4 right-4 z-10 bg-white/80">
                            Pre-order
                        </Badge>
                    )}
                    <Image
                        src={product.bannerURL || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="h-[280px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h4>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.rating})</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[#338838] text-xl font-semibold">$ {product.price.toFixed(2)}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full hover:bg-[#415444] hover:text-white transition-colors"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <QuickViewDialog id={product.id} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
        </>
    )
}
