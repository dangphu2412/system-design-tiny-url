"use client"

import type React from "react"
import {useState} from "react"

import {Minus, Plus, ShoppingBag, Star} from "lucide-react"
import Image from "next/image"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Separator} from "@/components/ui/separator"
import {Product, useToteStore} from "@/features/totes/totes.store"
import {useGetQuickViewToteQuery} from "@/features/totes/totes.graphql";

interface QuickViewDialogProps {
    id: string;
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}


// Color options with their hex values
const colorOptions = [
    { name: "black", hex: "#000000" },
    { name: "white", hex: "#ffffff" },
    { name: "beige", hex: "#f5f5dc" },
    { name: "brown", hex: "#964b00" },
    { name: "pastel", hex: "#ffd1dc" },
    { name: "bright", hex: "#ff4500" },
]

// Size options
const sizeOptions = ["small", "medium", "large"]

export function QuickViewDialog({ id, trigger, open, onOpenChange }: QuickViewDialogProps) {
    const { data } = useGetQuickViewToteQuery({
        variables: {
            id
        },
        skip: !open
    })
    const { addToCart } = useToteStore()
    const [selectedSize, setSelectedSize] = useState(sizeOptions[0])
    const [quantity, setQuantity] = useState(1)

    const product = data?.tote;

    function handleAddToCart() {
        const productToAdd = {
            ...data?.tote,
            size: selectedSize,
        } as Product

        // Add to cart multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(productToAdd)
        }

        // Notify added

        // Close dialog if onOpenChange is provided
        if (onOpenChange) {
            onOpenChange(false)
        }
    }

    function incrementQuantity() {
        setQuantity((prev) => prev + 1);
    }

    function decrementQuantity() {
        setQuantity((prev) => Math.max(1, prev - 1));
    }

    if (!product) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Product Image */}
                    <div className="relative h-[300px] md:h-full bg-[#e0e5ce]">
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
                        <Image src={product.bannerURL || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    </div>

                    {/* Product Details */}
                    <div className="p-6 flex flex-col">
                        <div className="flex justify-between items-start">
                            <DialogHeader className="text-left space-y-2 p-0">
                                <DialogTitle className="text-2xl font-semibold">{product.name}</DialogTitle>
                                <DialogDescription className="text-[#338838] text-xl font-semibold">
                                    ${product.price.toFixed(2)}
                                </DialogDescription>
                            </DialogHeader>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => onOpenChange && onOpenChange(false)}
                            >
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">({product.rating})</span>
                        </div>

                        {/* Product Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {product.style.map((style) => (
                                <Badge key={style} variant="secondary" className="capitalize">
                                    {style}
                                </Badge>
                            ))}
                            <Badge variant="secondary">{product.material}</Badge>
                        </div>

                        <Separator className="my-4" />

                        {/* Color Selection */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-3">
                                    Color: <span className="capitalize">{product.color}</span>
                                </h3>
                                <div className="flex gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.name}
                                            className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center
                        ${color.name === product.color ? "border-[#415444]" : "border-gray-300"}
                      `}
                                            style={{ backgroundColor: color.hex }}
                                            disabled={color.name !== product.color}
                                            aria-label={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Size</h3>
                                <RadioGroup value={product.size} onValueChange={setSelectedSize} className="flex gap-3">
                                    {sizeOptions.map((size) => (
                                        <div key={size} className="flex items-center">
                                            <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                                            <label
                                                htmlFor={`size-${size}`}
                                                className="flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium capitalize peer-data-[state=checked]:border-[#415444] peer-data-[state=checked]:bg-[#415444] peer-data-[state=checked]:text-white"
                                            >
                                                {size}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                                <div className="flex items-center border border-gray-200 rounded-md w-fit">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-none border-r border-gray-200"
                                        onClick={decrementQuantity}
                                    >
                                        <Minus className="h-4 w-4" />
                                        <span className="sr-only">Decrease quantity</span>
                                    </Button>
                                    <div className="w-12 text-center">{quantity}</div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-none border-l border-gray-200"
                                        onClick={incrementQuantity}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="sr-only">Increase quantity</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button
                                className="w-full bg-[#415444] hover:bg-[#415444]/90 h-12"
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                {product.inStock ? "Add to Cart" : "Pre-order"}
                            </Button>

                            {!product.inStock && (
                                <p className="text-sm text-gray-500 text-center">
                                    This item is currently out of stock. Pre-order now and we'll ship it as soon as it's available.
                                </p>
                            )}
                        </div>

                        {/* Product Description */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium mb-2">Description</h3>
                            <p className="text-sm text-gray-600">
                                The {product.name} is a premium {product.material} tote bag, perfect for {product.style.join(", ")} use.
                                This {product.size} sized bag combines style and functionality, making it an essential accessory for any
                                outfit.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
