import { create } from 'zustand';

// Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  bannerURL: string;
  color: string;
  material: string;
  size: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  style: string[];
}

// Cart item interface
export interface CartItem extends Product {
  quantity: number;
}

// Filter interface
export interface Filters {
  colors: string[];
  priceRange: { min: number; max: number };
  materials: string[];
  sizes: string[];
  tags: string[];
  availability: string;
  minRating: number;
  styles: string[];
  searchQuery: string;
}

// Default filters
const defaultFilters: Filters = {
  colors: [],
  priceRange: { min: 0, max: 300 },
  materials: [],
  sizes: [],
  tags: [],
  availability: 'all',
  minRating: 0,
  styles: [],
  searchQuery: '',
};

// Store interface
interface ToteStore {
  // State
  products: Product[];
  filteredProducts: Product[];
  cartItems: CartItem[];
  filters: Filters;
  sortOption: string;
  showMobileFilters: boolean;

  // Actions
  setShowMobileFilters: (show: boolean) => void;
  setSortOption: (option: string) => void;
  updateFilter: (filterType: keyof Filters, value: any) => void;
  resetFilters: () => void;
  addToCart: (product: Product) => void;
  updateQuantity: (itemId: string, change: number) => void;
  clearCart: () => void;
  applyFilters: () => void;
}

// Create the store
export const useToteStore = create<ToteStore>()((set, get) => ({
  // Initial state
  products: [],
  filteredProducts: [],
  cartItems: [],
  filters: defaultFilters,
  sortOption: 'featured',
  showMobileFilters: false,

  // Actions
  setShowMobileFilters: (show) => set({ showMobileFilters: show }),

  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFilters();
  },

  updateFilter: (filterType, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterType]: value,
      },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, filters, sortOption } = get();
    let result = [...products];

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max,
    );

    // Filter by tags (new arrivals, best sellers)
    if (filters.tags.length > 0) {
      result = result.filter(
        (product) =>
          (filters.tags.includes('new') && product.isNewArrival) ||
          (filters.tags.includes('bestseller') && product.isBestSeller),
      );
    }

    // Filter by availability
    if (filters.availability === 'instock') {
      result = result.filter((product) => product.inStock);
    } else if (filters.availability === 'preorder') {
      result = result.filter((product) => !product.inStock);
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      result = result.filter((product) => product.rating >= filters.minRating);
    }

    // Filter by styles
    if (filters.styles.length > 0) {
      result = result.filter((product) =>
        product.style.some((style) => filters.styles.includes(style)),
      );
    }

    // Apply sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    // "featured" sorting is default order

    set({ filteredProducts: result });
  },

  addToCart: (product) => {
    const { cartItems } = get();
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      set({
        cartItems: [...cartItems, { ...product, quantity: 1 }],
      });
    }
  },

  updateQuantity: (itemId, change) => {
    const { cartItems } = get();
    const updatedItems = cartItems
      .map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          if (newQuantity === 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    set({ cartItems: updatedItems });
  },

  clearCart: () => set({ cartItems: [] }),
}));
