import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Edit3,
  LayoutDashboard,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShoppingCart,
  Tags,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ALL_SIZES, CATEGORIES, EDITORIAL_MEDIA } from '../data/products';
import { formatINR, STORE_CONFIG } from '../data/storeConfig';
import { useStore } from '../context/StoreContext';
import {
  CollectionSlug,
  OrderStatus,
  Product,
  ProductCategory,
  StockStatus,
} from '../types';
import { SafeImage } from '../components/SafeImage';

type AdminTab = 'overview' | 'products' | 'pricing' | 'orders';

interface ProductFormState {
  name: string;
  sku: string;
  category: ProductCategory;
  price: string;
  originalPrice: string;
  color: string;
  fabric: string;
  fit: string;
  sizes: string[];
  stockStatus: StockStatus;
  stockCount: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  sku: '',
  category: 'T-Shirts',
  price: '1499',
  originalPrice: '',
  color: 'Jet Black',
  fabric: '100% Combed Cotton (240 GSM)',
  fit: 'Relaxed Modern',
  sizes: ['S', 'M', 'L', 'XL'],
  stockStatus: 'In Stock',
  stockCount: '25',
  shortDescription: '',
  description: '',
  imageUrl: EDITORIAL_MEDIA.cottonTee,
  isNewArrival: true,
  isBestSeller: false,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    resetDemoCatalog,
    updateOrderStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Console — Menzo Clothing';
  }, []);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, ord) => sum + ord.total, 0),
    [orders]
  );

  const lowOrOutCount = useMemo(
    () => products.filter((p) => p.stockStatus !== 'In Stock').length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (q && !`${p.name} ${p.sku} ${p.color} ${p.category}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [products, searchTerm, categoryFilter]);

  const openAddModal = () => {
    setEditingProductId(null);
    setForm({
      ...EMPTY_FORM,
      sku: `MNZ-${Math.floor(100 + Math.random() * 900)}`,
    });
    setEditorOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      color: product.color,
      fabric: product.fabric,
      fit: product.fit,
      sizes: [...product.sizes],
      stockStatus: product.stockStatus,
      stockCount: String(product.stockCount),
      shortDescription: product.shortDescription,
      description: product.description,
      imageUrl: product.images[0] || EDITORIAL_MEDIA.cottonTee,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
    });
    setEditorOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleFormSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Math.max(1, Number(form.price) || 999);
    const parsedOriginal = form.originalPrice ? Number(form.originalPrice) : undefined;
    const parsedStock = Math.max(0, Number(form.stockCount) || 0);
    const sizes = form.sizes.length > 0 ? form.sizes : ['M', 'L'];

    const collections: CollectionSlug[] = ['everyday-essentials'];
    if (form.isNewArrival) collections.push('new-arrivals');
    if (form.isBestSeller) collections.push('best-sellers');

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      updateProduct(editingProductId, {
        name: form.name.trim(),
        sku: form.sku.trim() || existing?.sku || 'MNZ-000',
        slug: slugify(form.name) || existing?.slug || `product-${Date.now()}`,
        category: form.category,
        price: parsedPrice,
        originalPrice:
          parsedOriginal && parsedOriginal > parsedPrice ? parsedOriginal : undefined,
        color: form.color.trim() || 'Neutral',
        fabric: form.fabric.trim() || '100% Cotton',
        fit: form.fit.trim() || 'Modern Fit',
        sizes,
        stockStatus: form.stockStatus,
        stockCount: parsedStock,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim() || form.shortDescription.trim(),
        images: [
          form.imageUrl || EDITORIAL_MEDIA.cottonTee,
          ...(existing?.images.slice(1) || [EDITORIAL_MEDIA.brandStory]),
        ],
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        collections,
      });
    } else {
      addProduct({
        name: form.name.trim(),
        sku: form.sku.trim() || `MNZ-${Date.now().toString().slice(-4)}`,
        slug: `${slugify(form.name) || 'menzo-piece'}-${Date.now().toString().slice(-3)}`,
        category: form.category,
        collections,
        price: parsedPrice,
        originalPrice:
          parsedOriginal && parsedOriginal > parsedPrice ? parsedOriginal : undefined,
        color: form.color.trim() || 'Neutral',
        sizes,
        images: [form.imageUrl || EDITORIAL_MEDIA.cottonTee, EDITORIAL_MEDIA.brandStory],
        shortDescription:
          form.shortDescription.trim() || 'Contemporary everyday garment from Menzo Clothing.',
        description:
          form.description.trim() ||
          form.shortDescription.trim() ||
          'Contemporary everyday garment from Menzo Clothing crafted for comfort and clean drape.',
        details: [
          form.fabric.trim() || '100% Combed Cotton',
          `Fit: ${form.fit.trim() || 'Modern Relaxed'}`,
          'Pre-shrunk finish for lasting silhouette',
        ],
        careInstructions: [
          'Machine wash cold inside out',
          'Line dry in shade',
          'Warm iron on reverse',
        ],
        fabric: form.fabric.trim() || '100% Combed Cotton',
        fit: form.fit.trim() || 'Modern Relaxed',
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        stockStatus: form.stockStatus,
        stockCount: parsedStock,
      });
    }

    setEditorOpen(false);
    setEditingProductId(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#111111] flex flex-col lg:flex-row">
      {/* Left Admin Sidebar */}
      <aside className="lg:w-64 bg-[#111111] text-[#EAE6DF] shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 bg-black border border-white/15 overflow-hidden shrink-0">
              <SafeImage
                src={STORE_CONFIG.logoUrl}
                alt="Menzo Clothing"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-lg tracking-[0.12em] uppercase text-white leading-none">
                Menzo
              </p>
              <p className="text-[11px] text-[#9A9389] mt-1">Store Admin (Demo)</p>
            </div>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'pricing', label: 'Categories & Pricing', icon: Tags },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#FAF9F7] text-[#111111]'
                      : 'text-[#C8C2B7] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block p-5 border-t border-white/10 space-y-3">
          <Link
            to="/"
            className="w-full py-2.5 px-3 border border-white/20 text-xs text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <p className="text-[11px] text-[#8E877D] leading-relaxed">
            Local demo storage active. Ready to connect to database &amp; cloud image storage.
          </p>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DFDAD0]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111]">
              {activeTab === 'overview' && 'Store Overview'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'pricing' && 'Categories & Price Management'}
              {activeTab === 'orders' && 'Order Management'}
            </h1>
            <p className="mt-1 text-xs text-[#6B665E]">
              Menzo Clothing · Local demonstration dashboard
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="lg:hidden px-3.5 py-2.5 border border-[#D8D3C9] bg-white text-xs font-medium text-[#111111] inline-flex items-center gap-1.5"
            >
              <span>Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2.5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.1em] hover:bg-[#2A2A2A] transition-colors inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="bg-white border border-[#E4E0D8] p-5">
                <p className="text-xs text-[#6B665E]">Catalog Products</p>
                <p className="mt-2 font-serif text-4xl text-[#111111] tabular-nums">
                  {products.length}
                </p>
                <p className="mt-1 text-[11px] text-[#7A746A]">
                  Across {CATEGORIES.length} categories
                </p>
              </div>
              <div className="bg-white border border-[#E4E0D8] p-5">
                <p className="text-xs text-[#6B665E]">Demo Orders</p>
                <p className="mt-2 font-serif text-4xl text-[#111111] tabular-nums">
                  {orders.length}
                </p>
                <p className="mt-1 text-[11px] text-[#7A746A]">
                  Includes live demo checkouts
                </p>
              </div>
              <div className="bg-white border border-[#E4E0D8] p-5">
                <p className="text-xs text-[#6B665E]">Demo Order Volume</p>
                <p className="mt-2 font-serif text-4xl text-[#111111] tabular-nums">
                  {formatINR(totalRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-[#7A746A]">Simulated INR total</p>
              </div>
              <div className="bg-white border border-[#E4E0D8] p-5">
                <p className="text-xs text-[#6B665E]">Stock Alerts</p>
                <p className="mt-2 font-serif text-4xl text-[#111111] tabular-nums">
                  {lowOrOutCount}
                </p>
                <p className="mt-1 text-[11px] text-[#7A746A]">Low or out-of-stock SKUs</p>
              </div>
            </div>

            {/* Recent Orders Snapshot */}
            <div className="bg-white border border-[#E4E0D8]">
              <div className="px-6 py-4 border-b border-[#EFECE6] flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#111111]">Recent Orders</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-medium text-[#111111] underline underline-offset-4"
                >
                  Manage All Orders
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[#EFECE6] text-[#6B665E] uppercase tracking-[0.08em]">
                      <th className="py-3 px-6">Order</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">City</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF9F7]">
                        <td className="py-3.5 px-6 font-semibold text-[#111111]">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">{ord.customer.fullName}</td>
                        <td className="py-3.5 px-4 text-[#5C574F]">{ord.customer.city}</td>
                        <td className="py-3.5 px-4">{ord.items.reduce((s, i) => s + i.quantity, 0)}</td>
                        <td className="py-3.5 px-4 font-medium">{formatINR(ord.total)}</td>
                        <td className="py-3.5 px-6 font-medium text-[#111111]">{ord.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="mt-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#6B665E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search SKU or product name..."
                    className="w-full bg-white border border-[#D8D3C9] pl-9 pr-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white border border-[#D8D3C9] px-3 py-2 text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={resetDemoCatalog}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#D8D3C9] bg-white text-xs text-[#5C574F] hover:text-[#111111] hover:border-[#111111] transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Catalog</span>
              </button>
            </div>

            <div className="bg-white border border-[#E4E0D8] overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-[#E4E0D8] text-[#6B665E] uppercase tracking-[0.08em]">
                    <th className="py-3.5 px-5">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Sizes</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#FAF9F7]">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-14 bg-[#ECE9E2] shrink-0 overflow-hidden">
                            <SafeImage
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-[#111111] text-sm">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#7A746A]">
                              {product.sku} · {product.color}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#4B463F]">{product.category}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#111111]">
                        {formatINR(product.price)}
                      </td>
                      <td className="py-3.5 px-4 text-[#5C574F]">
                        {product.sizes.join(', ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Stock status for ${product.name}`}
                          value={product.stockStatus}
                          onChange={(e) =>
                            updateProduct(product.id, {
                              stockStatus: e.target.value as StockStatus,
                            })
                          }
                          className="bg-[#FAF9F7] border border-[#D8D3C9] px-2.5 py-1.5 text-xs font-medium text-[#111111]"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-2 border border-[#D8D3C9] hover:border-[#111111] text-[#111111]"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {deleteConfirmId === product.id ? (
                            <button
                              type="button"
                              onClick={() => {
                                deleteProduct(product.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2.5 py-1.5 bg-[#991B1B] text-white text-[11px] font-medium"
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-2 border border-[#D8D3C9] hover:border-[#991B1B] hover:text-[#991B1B] text-[#5C574F]"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES & PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((category) => {
                const items = products.filter((p) => p.category === category);
                const avg =
                  items.length > 0
                    ? Math.round(
                        items.reduce((sum, p) => sum + p.price, 0) / items.length
                      )
                    : 0;
                return (
                  <div key={category} className="bg-white border border-[#E4E0D8] p-5">
                    <p className="text-xs font-semibold text-[#111111]">{category}</p>
                    <p className="mt-2 font-serif text-3xl text-[#111111] tabular-nums">
                      {items.length}
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B665E] tabular-nums">
                      Avg. {formatINR(avg)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-[#E4E0D8] overflow-x-auto">
              <div className="px-6 py-4 border-b border-[#EFECE6]">
                <h2 className="font-serif text-2xl text-[#111111]">
                  Quick Price &amp; Inventory Editor
                </h2>
              </div>
              <table className="w-full text-left text-xs border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-[#EFECE6] text-[#6B665E] uppercase tracking-[0.08em]">
                    <th className="py-3 px-6">Product</th>
                    <th className="py-3 px-4">Selling Price (₹)</th>
                    <th className="py-3 px-4">Original MRP (₹)</th>
                    <th className="py-3 px-4">Units</th>
                    <th className="py-3 px-6">Featured Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="py-3 px-6 font-medium text-[#111111]">
                        {product.name}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={1}
                          value={product.price}
                          onChange={(e) =>
                            updateProduct(product.id, {
                              price: Math.max(1, Number(e.target.value) || 0),
                            })
                          }
                          className="w-24 bg-[#FAF9F7] border border-[#D8D3C9] px-2.5 py-1.5 text-xs tabular-nums"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={0}
                          value={product.originalPrice || ''}
                          placeholder="None"
                          onChange={(e) =>
                            updateProduct(product.id, {
                              originalPrice: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          className="w-24 bg-[#FAF9F7] border border-[#D8D3C9] px-2.5 py-1.5 text-xs tabular-nums"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={0}
                          value={product.stockCount}
                          onChange={(e) =>
                            updateProduct(product.id, {
                              stockCount: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-20 bg-[#FAF9F7] border border-[#D8D3C9] px-2.5 py-1.5 text-xs tabular-nums"
                        />
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-4">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.isNewArrival}
                              onChange={(e) =>
                                updateProduct(product.id, {
                                  isNewArrival: e.target.checked,
                                })
                              }
                              className="accent-[#111111]"
                            />
                            <span>New</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={product.isBestSeller}
                              onChange={(e) =>
                                updateProduct(product.id, {
                                  isBestSeller: e.target.checked,
                                })
                              }
                              className="accent-[#111111]"
                            />
                            <span>Best Seller</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#E4E0D8] p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFECE6]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-[#111111] tabular-nums">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-[#6B665E]">·</span>
                      <span className="text-xs text-[#6B665E]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-[#6B665E]">·</span>
                      <span className="text-xs text-[#5C574F]">{order.paymentMethod}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#4B463F]">
                      {order.customer.fullName} · {order.customer.phone} ·{' '}
                      {order.customer.city}, {order.customer.state} ({order.customer.pinCode})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#111111] tabular-nums">
                      {formatINR(order.total)}
                    </span>
                    <select
                      aria-label={`Order status for ${order.orderNumber}`}
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-[#FAF9F7] border border-[#D8D3C9] px-3 py-1.5 text-xs font-medium text-[#111111]"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 bg-[#FAF9F7] border border-[#EFECE6]"
                    >
                      <div className="w-10 h-12 bg-[#ECE9E2] shrink-0 overflow-hidden">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 text-xs">
                        <p className="font-medium text-[#111111] truncate">{item.name}</p>
                        <p className="text-[#6B665E] tabular-nums">
                          Size {item.size} × {item.quantity} · {formatINR(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editingProductId ? 'Edit Product' : 'Add Product'}
        >
          <div
            className="fixed inset-0 bg-black/55"
            onClick={() => setEditorOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-[#FAF9F7] w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E4E0D8] shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E0D8]">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#111111]">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label="Close product editor"
                className="p-1 text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
              {/* Image Upload & Preview */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-28 aspect-[3/4] bg-[#ECE9E2] overflow-hidden shrink-0 border border-[#D8D3C9]">
                  <SafeImage
                    src={form.imageUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <label className="block text-xs font-medium text-[#111111]">
                    Product Image Upload (Local Demo / Cloud-Ready)
                  </label>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D8D3C9] hover:border-[#111111] text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <div>
                    <label className="block text-[11px] text-[#6B665E] mb-1">
                      Or use image path / URL
                    </label>
                    <input
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="w-full bg-white border border-[#D8D3C9] px-3 py-2 text-xs focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Heavyweight Stone Oversized T-Shirt"
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as ProductCategory })
                    }
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm tabular-nums focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Original Price (Optional INR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="Leave blank if not discounted"
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm tabular-nums focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Colorway
                  </label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1.5">
                    Stock Status
                  </label>
                  <select
                    value={form.stockStatus}
                    onChange={(e) =>
                      setForm({ ...form, stockStatus: e.target.value as StockStatus })
                    }
                    className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <span className="block text-xs font-medium text-[#111111] mb-2">
                  Available Sizes
                </span>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleFormSize(s)}
                      className={`min-w-[40px] h-9 px-2.5 text-xs font-medium border transition-colors ${
                        form.sizes.includes(s)
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-[#4B463F] border-[#D8D3C9]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="One-line summary shown in quick view"
                  className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white border border-[#D8D3C9] px-3.5 py-2.5 text-sm focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                    className="accent-[#111111]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="accent-[#111111]"
                  />
                  <span>Feature in Best Sellers</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-2.5 border border-[#D8D3C9] text-xs font-medium text-[#4B463F] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] text-[#FAF9F7] text-xs font-semibold uppercase tracking-[0.12em] hover:bg-[#2A2A2A]"
                >
                  {editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
