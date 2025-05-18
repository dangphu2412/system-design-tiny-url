import {useToteStore} from "@/features/totes/totes.store";
import {SearchTotesDashboardQuery, useSearchTotesDashboardQuery} from "@/features/totes/totes.graphql";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Filter, Search, SlidersHorizontal} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ToteFilters} from "@/features/totes/search-totes/tote-filters";
import {Badge} from "@/components/ui/badge";
import {ToteOverviewCard} from "@/features/totes/search-totes/tote-overview-card";

export function SearchTotesView() {
    const {
        filters,
        sortOption,
        showMobileFilters,
        setShowMobileFilters,
        setSortOption,
        updateFilter,
        resetFilters,
        addToCart,
    } = useToteStore()

    const { data } = useSearchTotesDashboardQuery({
        variables: {
            getTotesInput: {
                page: 1,
                size: 20,
                searchQuery: filters.searchQuery,
                colors: filters.colors,
                sizes: filters.sizes,
                materials: filters.materials,
            }
        }
    });

    const products = (data?.totes ?? []) as Required<SearchTotesDashboardQuery['totes']>;

    // Handle adding to cart with toast notification
    const handleAddToCart = (product: any) => {
        addToCart(product)
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-[#fcfdfd]">

                {/* Main Content */}
                <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
                    <SearchHeader />

                    <div className="lg:grid lg:grid-cols-4 gap-6">
                        <Filters />

                        {/* Product grid */}
                        <div className="lg:col-span-3">
                            <SortSelectionDesktop />
                            <ActiveFilterTagsList />

                            {/* Products */}
                            {products.length === 0 ? (
                                <NoResultsBanner />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ToteOverviewCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}

function SearchHeader() {
    const searchQuery = useToteStore(state => state.filters.searchQuery);
    const updateFilter = useToteStore(state => state.updateFilter);

    return <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div>
                <h2 className="text-2xl font-semibold">Tote Bag Collection</h2>
                <p className="text-gray-500">Find your perfect tote bag</p>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    className="w-64 pl-10"
                    placeholder="Search totes..."
                    value={searchQuery}
                    onChange={(e) => updateFilter("searchQuery", e.target.value)}
                />
            </div>
        </div>
    </header>;
}

function NoResultsBanner() {
    return <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
        </div>
    </div>
}

function ActiveFilterTagsList() {
    const filters = useToteStore(state => state.filters);
    const updateFilter = useToteStore(state => state.updateFilter);

    return <>
        {/* Active filters */}
        {(filters.colors.length > 0 ||
            filters.materials.length > 0 ||
            filters.sizes.length > 0 ||
            filters.tags.length > 0 ||
            filters.styles.length > 0 ||
            filters.availability !== "all" ||
            filters.minRating > 0) && (
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {filters.colors.map((color) => (
                        <Badge key={color} variant="secondary" className="px-3 py-1">
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                            <button
                                className="ml-2"
                                onClick={() =>
                                    updateFilter(
                                        "colors",
                                        filters.colors.filter((c) => c !== color),
                                    )
                                }
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                    {filters.materials.map((material) => (
                        <Badge key={material} variant="secondary" className="px-3 py-1">
                            {material.charAt(0).toUpperCase() + material.slice(1)}
                            <button
                                className="ml-2"
                                onClick={() =>
                                    updateFilter(
                                        "materials",
                                        filters.materials.filter((m) => m !== material),
                                    )
                                }
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                    {filters.sizes.map((size) => (
                        <Badge key={size} variant="secondary" className="px-3 py-1">
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                            <button
                                className="ml-2"
                                onClick={() =>
                                    updateFilter(
                                        "sizes",
                                        filters.sizes.filter((s) => s !== size),
                                    )
                                }
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                    {filters.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                            {tag === "new" ? "New Arrival" : "Best Seller"}
                            <button
                                className="ml-2"
                                onClick={() =>
                                    updateFilter(
                                        "tags",
                                        filters.tags.filter((t) => t !== tag),
                                    )
                                }
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                    {filters.styles.map((style) => (
                        <Badge key={style} variant="secondary" className="px-3 py-1">
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                            <button
                                className="ml-2"
                                onClick={() =>
                                    updateFilter(
                                        "styles",
                                        filters.styles.filter((s) => s !== style),
                                    )
                                }
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                    {filters.availability !== "all" && (
                        <Badge variant="secondary" className="px-3 py-1">
                            {filters.availability === "instock" ? "In Stock" : "Pre-order"}
                            <button className="ml-2" onClick={() => updateFilter("availability", "all")}>
                                ×
                            </button>
                        </Badge>
                    )}
                    {filters.minRating > 0 && (
                        <Badge variant="secondary" className="px-3 py-1">
                            {filters.minRating}+ Stars
                            <button className="ml-2" onClick={() => updateFilter("minRating", 0)}>
                                ×
                            </button>
                        </Badge>
                    )}
                </div>
            </div>
        )}
    </>
}


type SortBySelectionProps = {
    countProducts: number;
}

function SortSelectionDesktop({countProducts} : SortBySelectionProps) {
    const sortOption = useToteStore(state => state.sortOption)
    const setSortOption = useToteStore(state => state.setSortOption)
    return <div className="hidden lg:flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
                Showing {countProducts} of 200 products
            </p>
        </div>

        <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
}

function Filters() {
    const {
        sortOption,
        showMobileFilters,
        setShowMobileFilters,
        setSortOption,
        resetFilters,
    } = useToteStore()

    return <>
        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
            <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
                <Filter className="h-4 w-4" />
                Filters
            </Button>
            <div className="flex items-center gap-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Mobile filters drawer */}
        <div
            className={`
              fixed inset-0 z-50 bg-white p-6 transition-transform duration-300 transform 
              ${showMobileFilters ? "translate-x-0" : "-translate-x-full"}
              lg:hidden
            `}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M18 6L6 18M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
                <ToteFilters />
            </div>
            <div className="mt-6 flex gap-4">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                    Clear All
                </Button>
                <Button
                    className="flex-1 bg-[#415444] hover:bg-[#415444]/90"
                    onClick={() => setShowMobileFilters(false)}
                >
                    Apply Filters
                </Button>
            </div>
        </div>

        {/* Desktop filters sidebar */}
        <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Clear All
                    </Button>
                </div>
                <ToteFilters />
            </div>
        </div>
    </>
}