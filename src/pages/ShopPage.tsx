import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ALL_SIZES, CATEGORIES, FEATURED_COLLECTIONS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { CollectionSlug, ProductCategory } from '../types';
import { ProductGrid } from '../components/ProductGrid';

type SortOption = 'newest' | 'popularity' | 'price-asc' | 'price-desc';
type PriceRange = 'all' | 'under-1500' | '1500-2500' | 'above-2500';

interface ShopPageProps {
  mode?: 'shop' | 'new-arrivals' | 'collections';
}

export const ShopPage: React.FC<ShopPageProps> = ({ mode = 'shop' }) => {
  const { products } = useStore();
  const { slug } = useParams<{ slug?: CollectionSlug }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = (searchParams.get('category') as ProductCategory | null) || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState<string>(
    mode === 'new-arrivals' ? 'new-arrivals' : slug || 'all'
  );
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [query, setQuery] = useState<string>(initialQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL params when navigating between routes
  useEffect(() => {
    const paramCat = searchParams.get('category');
    const paramQ = searchParams.get('q');
    setSelectedCategory(paramCat || 'All');
    setQuery(paramQ || '');
  }, [searchParams]);

  useEffect(() => {
    if (mode === 'new-arrivals') {
      setSelectedCollection('new-arrivals');
    } else if (slug) {
      setSelectedCollection(slug);
    } else {
      setSelectedCollection('all');
    }
  }, [mode, slug]);

  const activeCollectionMeta = FEATURED_COLLECTIONS.find(
    (c) => c.slug === selectedCollection
  );

  const pageTitle =
    mode === 'new-arrivals'
      ? 'New Arrivals'
      : activeCollectionMeta
      ? activeCollectionMeta.title
      : mode === 'collections'
      ? 'Collections'
      : 'Shop All';

  const pageSubtitle =
    activeCollectionMeta?.subtitle ||
    (mode === 'new-arrivals'
      ? 'Latest contemporary silhouettes, freshly tailored for everyday comfort.'
      : 'Explore the complete Menzo Clothing demonstration catalog across tops, layering, and tailored bottoms.');

  useEffect(() => {
    document.title = `${pageTitle} — Menzo Clothing`;
  }, [pageTitle]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matches = products.filter((product) => {
      if (selectedCollection !== 'all') {
        if (selectedCollection === 'new-arrivals' && !product.isNewArrival && !product.collections.includes('new-arrivals')) {
          return false;
        }
        if (
          selectedCollection !== 'new-arrivals' &&
          !product.collections.includes(selectedCollection as CollectionSlug)
        ) {
          return false;
        }
      }

      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      if (priceRange === 'under-1500' && product.price >= 1500) return false;
      if (
        priceRange === '1500-2500' &&
        (product.price < 1500 || product.price > 2500)
      ) {
        return false;
      }
      if (priceRange === 'above-2500' && product.price <= 2500) return false;

      if (normalizedQuery) {
        const haystack = `${product.name} ${product.category} ${product.color} ${product.shortDescription} ${product.fabric}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });

    return [...matches].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return b.popularityScore - a.popularityScore;
        case 'newest':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [
    products,
    selectedCategory,
    selectedCollection,
    selectedSize,
    priceRange,
    sortBy,
    query,
  ]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSize !== 'All' ||
    priceRange !== 'all' ||
    query.trim() !== '' ||
    (selectedCollection !== 'all' && mode !== 'new-arrivals' && !slug);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setPriceRange('all');
    setQuery('');
    if (mode !== 'new-arrivals' && !slug) {
      setSelectedCollection('all');
    }
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Editorial Page Header */}
      <section className="border-b border-[#E4E0D8] bg-[#F3F1EC]/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-[#6B665E] mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-[#111111]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#111111]">{pageTitle}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#111111]">
                {pageTitle}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#5C574F] max-w-2xl leading-relaxed">
                {pageSubtitle}
              </p>
            </div>
            <p className="text-xs text-[#6B665E] tabular-nums whitespace-nowrap shrink-0">
              Showing {filteredProducts.length} of {products.length} pieces
            </p>
          </div>

          {/* Collection Quick Tabs when browsing Collections */}
          {mode === 'collections' && (
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCollection('all')}
                className={`px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase border transition-colors whitespace-nowrap ${
                  selectedCollection === 'all'
                    ? 'bg-[#111111] text-[#FAF9F7] border-[#111111]'
                    : 'bg-white text-[#4B463F] border-[#D8D3C9] hover:border-[#111111]'
                }`}
              >
                All Collections
              </button>
              {FEATURED_COLLECTIONS.map((col) => (
                <button
                  key={col.slug}
                  type="button"
                  onClick={() => setSelectedCollection(col.slug)}
                  className={`px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase border transition-colors whitespace-nowrap ${
                    selectedCollection === col.slug
                      ? 'bg-[#111111] text-[#FAF9F7] border-[#111111]'
                      : 'bg-white text-[#4B463F] border-[#D8D3C9] hover:border-[#111111]'
                  }`}
                >
                  {col.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toolbar: Search, Mobile Filter Toggle, Sort */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6 border-b border-[#E4E0D8]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-sm">
            <Search className="w-4 h-4 text-[#6B665E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, fabric, or color..."
              className="w-full bg-white border border-[#D8D3C9] pl-10 pr-4 py-2.5 text-sm text-[#111111] placeholder:text-[#8A8378] focus:border-[#111111] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D8D3C9] text-xs font-medium uppercase tracking-[0.08em] text-[#111111]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2.5">
              <label htmlFor="shop-sort" className="text-xs text-[#6B665E] whitespace-nowrap">
                Sort by
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-[#D8D3C9] px-3 py-2.5 text-xs font-medium text-[#111111] focus:border-[#111111] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar Filters + Product Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Filter Rail */}
          <aside
            className={`lg:col-span-3 space-y-8 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Category Filter */}
            <div>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] mb-3.5">
                Category
              </h2>
              <div className="flex flex-col space-y-1.5">
                {['All', ...CATEGORIES].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left py-1.5 text-sm transition-colors flex items-center justify-between ${
                      selectedCategory === category
                        ? 'text-[#111111] font-semibold'
                        : 'text-[#5C574F] hover:text-[#111111]'
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && (
                      <span className="w-1.5 h-1.5 bg-[#111111]" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-6 border-t border-[#E4E0D8]">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] mb-3.5">
                Price Range (INR)
              </h2>
              <div className="flex flex-col space-y-1.5">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-1500', label: 'Under ₹1,500' },
                  { id: '1500-2500', label: '₹1,500 – ₹2,500' },
                  { id: 'above-2500', label: 'Above ₹2,500' },
                ].map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setPriceRange(range.id as PriceRange)}
                    className={`text-left py-1.5 text-sm transition-colors flex items-center justify-between ${
                      priceRange === range.id
                        ? 'text-[#111111] font-semibold'
                        : 'text-[#5C574F] hover:text-[#111111]'
                    }`}
                  >
                    <span>{range.label}</span>
                    {priceRange === range.id && (
                      <span className="w-1.5 h-1.5 bg-[#111111]" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="pt-6 border-t border-[#E4E0D8]">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#111111] mb-3.5">
                Size
              </h2>
              <div className="flex flex-wrap gap-2">
                {['All', ...ALL_SIZES].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[42px] h-9 px-2.5 text-xs font-medium border transition-colors ${
                      selectedSize === size
                        ? 'bg-[#111111] text-[#FAF9F7] border-[#111111]'
                        : 'bg-white text-[#4B463F] border-[#D8D3C9] hover:border-[#111111]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-[#111111] underline underline-offset-4 hover:opacity-70"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="border border-[#E4E0D8] bg-[#F3F1EC]/50 py-20 px-6 text-center">
                <p className="font-serif text-3xl text-[#111111]">
                  No pieces match your current selection
                </p>
                <p className="mt-2 text-sm text-[#5C574F] max-w-md mx-auto">
                  Try widening your price range, clearing the size filter, or browsing the full
                  Menzo Clothing collection.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-6 px-6 py-3 bg-[#111111] text-[#FAF9F7] text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#2A2A2A] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} columns={3} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
