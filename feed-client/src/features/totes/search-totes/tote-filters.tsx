"use client"

import { Check, Star } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { type Filters, useToteStore } from "@/features/totes/totes.store"

export function ToteFilters() {
    const { filters, updateFilter } = useToteStore()

    // Color options with their hex values
    const colorOptions = [
        { name: "black", hex: "#000000" },
        { name: "white", hex: "#ffffff" },
        { name: "beige", hex: "#f5f5dc" },
        { name: "brown", hex: "#964b00" },
        { name: "pastel", hex: "#ffd1dc" },
        { name: "bright", hex: "#ff4500" },
    ]

    // Material options
    const materialOptions = ["canvas", "leather", "jute", "cotton", "recycled"]

    // Size options
    const sizeOptions = ["small", "medium", "large"]

    // Style options
    const styleOptions = ["everyday", "work", "travel", "eco-friendly", "minimalist", "boho"]

    // Handle checkbox change for array-based filters
    const handleCheckboxChange = (filterType: keyof Filters, value: string) => {
        const currentValues = filters[filterType] as string[]
        const newValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value]
        updateFilter(filterType, newValues)
    }

    // Handle price range change
    const handlePriceChange = (value: number[]) => {
        updateFilter("priceRange", { min: value[0], max: value[1] })
    }

    return (
        <div className="space-y-6">
            {/* Color Filter */}
            <Accordion type="single" collapsible defaultValue="colors">
                <AccordionItem value="colors">
                    <AccordionTrigger className="text-base font-medium">Colors</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {colorOptions.map((color) => (
                                <div key={color.name} className="flex flex-col items-center gap-1">
                                    <button
                                        className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center
                      ${filters.colors.includes(color.name) ? "border-[#415444]" : "border-gray-300"}
                      ${color.name === "white" ? "bg-white" : ""}
                    `}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => handleCheckboxChange("colors", color.name)}
                                        aria-label={color.name}
                                    >
                                        {filters.colors.includes(color.name) && (
                                            <Check
                                                className={`h-4 w-4 ${color.name === "white" || color.name === "pastel" ? "text-black" : "text-white"}`}
                                            />
                                        )}
                                    </button>
                                    <span className="text-xs capitalize">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Price Range Filter */}
            <Accordion type="single" collapsible defaultValue="price">
                <AccordionItem value="price">
                    <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-2">
                            <Slider
                                defaultValue={[filters.priceRange.min, filters.priceRange.max]}
                                max={300}
                                step={10}
                                onValueChange={handlePriceChange}
                                className="py-4"
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    ${filters.priceRange.min} - ${filters.priceRange.max}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        filters.priceRange.min === 0 && filters.priceRange.max === 50
                                            ? "bg-[#415444] text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                    onClick={() => updateFilter("priceRange", { min: 0, max: 50 })}
                                >
                                    Under $50
                                </button>
                                <button
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        filters.priceRange.min === 50 && filters.priceRange.max === 150
                                            ? "bg-[#415444] text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                    onClick={() => updateFilter("priceRange", { min: 50, max: 150 })}
                                >
                                    $50 - $150
                                </button>
                                <button
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        filters.priceRange.min === 150 && filters.priceRange.max === 300
                                            ? "bg-[#415444] text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                                    onClick={() => updateFilter("priceRange", { min: 150, max: 300 })}
                                >
                                    $150+
                                </button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Material Filter */}
            <Accordion type="single" collapsible defaultValue="material">
                <AccordionItem value="material">
                    <AccordionTrigger className="text-base font-medium">Material</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            {materialOptions.map((material) => (
                                <div key={material} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`material-${material}`}
                                        checked={filters.materials.includes(material)}
                                        onCheckedChange={() => handleCheckboxChange("materials", material)}
                                    />
                                    <Label htmlFor={`material-${material}`} className="capitalize">
                                        {material}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Size Filter */}
            <Accordion type="single" collapsible defaultValue="size">
                <AccordionItem value="size">
                    <AccordionTrigger className="text-base font-medium">Size</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-2 pt-2">
                            {sizeOptions.map((size) => (
                                <button
                                    key={size}
                                    className={`
                    flex-1 py-2 px-3 border rounded-md text-sm capitalize
                    ${
                                        filters.sizes.includes(size)
                                            ? "bg-[#415444] text-white border-[#415444]"
                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                    }
                  `}
                                    onClick={() => handleCheckboxChange("sizes", size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Tags Filter */}
            <Accordion type="single" collapsible defaultValue="tags">
                <AccordionItem value="tags">
                    <AccordionTrigger className="text-base font-medium">Product Tags</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tag-new"
                                    checked={filters.tags.includes("new")}
                                    onCheckedChange={() => handleCheckboxChange("tags", "new")}
                                />
                                <Label htmlFor="tag-new">New Arrivals</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tag-bestseller"
                                    checked={filters.tags.includes("bestseller")}
                                    onCheckedChange={() => handleCheckboxChange("tags", "bestseller")}
                                />
                                <Label htmlFor="tag-bestseller">Best Sellers</Label>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Availability Filter */}
            <Accordion type="single" collapsible defaultValue="availability">
                <AccordionItem value="availability">
                    <AccordionTrigger className="text-base font-medium">Availability</AccordionTrigger>
                    <AccordionContent>
                        <RadioGroup
                            value={filters.availability}
                            onValueChange={(value) => updateFilter("availability", value)}
                            className="pt-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="availability-all" />
                                <Label htmlFor="availability-all">All Items</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="instock" id="availability-instock" />
                                <Label htmlFor="availability-instock">In Stock Only</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="preorder" id="availability-preorder" />
                                <Label htmlFor="availability-preorder">Pre-order</Label>
                            </div>
                        </RadioGroup>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Rating Filter */}
            <Accordion type="single" collapsible defaultValue="rating">
                <AccordionItem value="rating">
                    <AccordionTrigger className="text-base font-medium">Rating</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    className={`
                    flex items-center w-full py-2 px-3 rounded-md text-sm
                    ${filters.minRating === rating ? "bg-[#e0e5ce] text-[#415444]" : "hover:bg-gray-50"}
                  `}
                                    onClick={() => updateFilter("minRating", filters.minRating === rating ? 0 : rating)}
                                >
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2">& Up</span>
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Style/Occasion Filter */}
            <Accordion type="single" collapsible defaultValue="style">
                <AccordionItem value="style">
                    <AccordionTrigger className="text-base font-medium">Style / Occasion</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pt-2">
                            {styleOptions.map((style) => (
                                <div key={style} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`style-${style}`}
                                        checked={filters.styles.includes(style)}
                                        onCheckedChange={() => handleCheckboxChange("styles", style)}
                                    />
                                    <Label htmlFor={`style-${style}`} className="capitalize">
                                        {style}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
