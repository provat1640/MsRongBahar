'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus, Search, Edit2, Trash2, AlertTriangle, X, Image as ImageIcon, Layers, Settings, Sparkles, CheckCircle, Zap } from 'lucide-react';
import { Product, Category } from '@/types';
import { AIPredictionResult } from '@/lib/ml-predictor';

interface UnitType {
  id: string;
  name: string;
  category: string;
}

interface AdminProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function AdminProductsClient({ initialProducts, categories }: AdminProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Available local images gallery state
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Custom Unit Types state
  const [units, setUnits] = useState<UnitType[]>([]);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitCategory, setNewUnitCategory] = useState('Dimension');

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [basePrice, setBasePrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('Dimension (mm)');
  const [imageUrl, setImageUrl] = useState('/products/2412.jpg');
  const [variantsText, setVariantsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-Time AI ML Catalog Predictor State
  const [aiPrediction, setAiPrediction] = useState<AIPredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/images')
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          setLocalImages(data.images);
        }
      })
      .catch((e) => console.error('Failed to load local images', e));

    fetch('/api/admin/units')
      .then((res) => res.json())
      .then((data) => {
        if (data.units && data.units.length > 0) {
          setUnits(data.units);
        }
      })
      .catch((e) => console.error('Failed to load units', e));
  }, []);

  // Real-time AI prediction trigger on Title change
  const runAIPrediction = async (productTitle: string) => {
    if (!productTitle || productTitle.length < 3) {
      setAiPrediction(null);
      return;
    }

    setIsPredicting(true);
    try {
      const res = await fetch('/api/admin/predict-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: productTitle }),
      });
      const data = await res.json();
      if (data.prediction) {
        setAiPrediction(data.prediction);
      }
    } catch (e) {
      console.error('AI Predict error', e);
    } finally {
      setIsPredicting(false);
    }
  };

  const applyAIPredictions = () => {
    if (!aiPrediction) return;

    // Find category ID by slug or name
    const matchedCat = categories.find(
      (c) => c.slug === aiPrediction.categorySlug || c.name.toLowerCase().includes(aiPrediction.categoryName.toLowerCase())
    );
    if (matchedCat) {
      setCategoryId(matchedCat.id);
    }

    setUnit(aiPrediction.unit);
    setBasePrice(aiPrediction.suggestedBasePrice.toString());
    setDescription(aiPrediction.suggestedDescription);
    setSku(`${aiPrediction.suggestedSkuPrefix}-${Math.floor(1000 + Math.random() * 9000)}`);

    if (aiPrediction.suggestedVariants && aiPrediction.suggestedVariants.length > 0) {
      setVariantsText(
        aiPrediction.suggestedVariants
          .map((v) => `${v.name}:${v.price}:${v.stock}`)
          .join(', ')
      );
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;

    try {
      const res = await fetch('/api/admin/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUnitName.trim(), category: newUnitCategory }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create unit');

      setUnits([data.unit, ...units]);
      setUnit(data.unit.name);
      setNewUnitName('');
      setIsUnitModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom unit type?')) return;

    try {
      const res = await fetch(`/api/admin/units?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete unit');

      setUnits(units.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || p.categoryId === filterCategory;

    const isLow = p.stock < 5 || (p.variants && p.variants.some((v) => v.stock < 5));
    const matchesLowStock = !showLowStockOnly || isLow;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCategoryId(categories[0]?.id || '');
    setBasePrice('220');
    setStock('45');
    setSku(`RB-PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setUnit(units[0]?.name || 'Dimension (mm)');
    setImageUrl('/products/2412.jpg');
    setVariantsText('');
    setAiPrediction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSlug(p.slug);
    setDescription(p.description);
    setCategoryId(p.categoryId);
    setBasePrice(p.basePrice.toString());
    setStock(p.stock.toString());
    setSku(p.sku);
    setUnit(p.unit || 'Dimension (mm)');
    setAiPrediction(null);

    try {
      const parsed = typeof p.images === 'string' && p.images.startsWith('[')
        ? JSON.parse(p.images)
        : p.images;
      if (Array.isArray(parsed) && parsed.length > 0) setImageUrl(parsed[0]);
      else if (typeof parsed === 'string') setImageUrl(parsed);
      else setImageUrl('/products/2412.jpg');
    } catch (e) {
      setImageUrl(p.images || '/products/2412.jpg');
    }

    if (p.variants && p.variants.length > 0) {
      setVariantsText(p.variants.map((v) => `${v.name}:${v.price}:${v.stock}`).join(', '));
    } else {
      setVariantsText('');
    }

    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedVariants = variantsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((str) => {
          const parts = str.split(':');
          return {
            name: parts[0]?.trim() || 'Standard',
            price: parseFloat(parts[1]?.trim() || basePrice),
            stock: parseInt(parts[2]?.trim() || stock),
          };
        });

      const endpoint = '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = {
        ...(editingProduct ? { id: editingProduct.id } : {}),
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        categoryId,
        basePrice,
        stock,
        sku,
        unit,
        images: [imageUrl || '/products/2412.jpg'],
        variants: parsedVariants,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setIsModalOpen(false);
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hardware product?')) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Catalog & AI Predictive Sub-Units <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">List hardware, paints, electrical, plumbing & building materials with 1-click AI unit prediction</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUnitModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" /> Manage Custom Unit Types
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Product with AI Prediction
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-3 pr-8 text-xs text-slate-100 placeholder-slate-500 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl py-2 px-3 outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-2 rounded-xl font-bold border transition flex items-center gap-1.5 ${
              showLowStockOnly
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Only Low Stock (&lt;5)
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Image</th>
                <th className="p-3.5">SKU & Title</th>
                <th className="p-3.5">Unit Metric</th>
                <th className="p-3.5">Base Price</th>
                <th className="p-3.5">Sellable Sub-Units Breakdown</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => {
                const isLow = p.stock < 5 || (p.variants && p.variants.some((v) => v.stock < 5));

                let pImg = '/products/2412.jpg';
                try {
                  const parsed = typeof p.images === 'string' && p.images.startsWith('[')
                    ? JSON.parse(p.images)
                    : p.images;
                  if (Array.isArray(parsed) && parsed.length > 0) pImg = parsed[0];
                  else if (typeof parsed === 'string') pImg = parsed;
                } catch (e) {
                  if (typeof p.images === 'string') pImg = p.images;
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                        <img src={pImg} alt="thumb" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/products/2412.jpg'; }} />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-100">{p.title}</div>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                    </td>
                    <td className="p-3.5 font-bold text-amber-400">
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] flex items-center gap-1 w-fit">
                        <Layers className="w-3 h-3" /> {p.unit || 'Sub-Unit'}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      ৳{p.basePrice.toLocaleString('en-BD')}
                    </td>
                    <td className="p-3.5">
                      {p.variants && p.variants.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {p.variants.map((v) => (
                            <span key={v.id} className="px-2 py-0.5 bg-slate-950 text-slate-200 rounded text-[11px] font-semibold border border-slate-800">
                              {v.name} → <strong className="text-amber-400">৳{v.price}</strong> <span className={v.stock <= 5 ? 'text-red-400 font-bold' : 'text-slate-400'}>[{v.stock} left]</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">Standard Unit</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition"
                          title="Edit Product Sub-Units"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create & Manage Custom Unit Types */}
      {isUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" /> Create Custom Unit Types
              </h3>
              <button onClick={() => setIsUnitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Unit Label Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Length (Feet), Fluid (ml), Roll"
                    value={newUnitName}
                    onChange={(e) => setNewUnitName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category Metric</label>
                  <select
                    value={newUnitCategory}
                    onChange={(e) => setNewUnitCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-slate-100 outline-none"
                  >
                    <option value="Dimension">Dimension (mm / Inch)</option>
                    <option value="Weight">Weight (kg / gm)</option>
                    <option value="Volume">Volume (Litre / ml)</option>
                    <option value="Fluid Ounce">Fluid Ounce (oz)</option>
                    <option value="Quantity">Quantity (Pcs / Pack / Dozen)</option>
                    <option value="Custom">Custom Unit</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition"
              >
                + Save Custom Unit Type
              </button>
            </form>

            <div className="space-y-2 pt-2 border-t border-slate-800 max-h-48 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Existing Custom Unit Types:</span>
              <div className="flex flex-wrap gap-2">
                {units.map((u) => (
                  <div key={u.id} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs flex items-center gap-2 text-slate-200">
                    <span>{u.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteUnit(u.id)}
                      className="text-red-400 hover:text-red-300 font-bold ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal with AI Predictive Module */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {editingProduct ? 'Edit Product & Sellable Sub-Units' : 'Add Product with AI Catalog Prediction'}
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Title with AI Predict Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Product Title *</label>
                  <button
                    type="button"
                    onClick={() => runAIPrediction(title)}
                    disabled={isPredicting || !title.trim()}
                    className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> {isPredicting ? 'AI Thinking...' : 'Auto-Predict Units & Prices'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Partex Brass Padlock 65mm, Berger Luxury Silk Paint, RFL PVC Pipe 2 Inch..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    runAIPrediction(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-slate-100 outline-none text-sm"
                />
              </div>

              {/* Real-time AI Catalog Prediction Card */}
              {aiPrediction && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Suggested Category & Sub-Units ({Math.round(aiPrediction.confidence * 100)}% Confidence)
                    </span>
                    <button
                      type="button"
                      onClick={applyAIPredictions}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg shadow transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Apply AI Predictions
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                    <div>Category: <strong className="text-white">{aiPrediction.categoryName}</strong></div>
                    <div>Unit Type: <strong className="text-amber-400">{aiPrediction.unit}</strong></div>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Suggested Sub-Units & Prices:
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiPrediction.suggestedVariants.map((v, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-200 rounded border border-slate-700">
                          {v.name}: <strong className="text-amber-400">৳{v.price}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-slate-100 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-slate-100 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Base Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Select Unit Type Metric</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-amber-400 font-bold outline-none"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                    <option value="Dimension (mm)">Dimension (mm)</option>
                    <option value="Size (Inch / mm)">Size (Inch / mm)</option>
                    <option value="Volume (Litre)">Volume (Litre)</option>
                    <option value="Weight (gm / kg)">Weight (gm / kg)</option>
                    <option value="Power (Watt / Pcs)">Power (Watt / Pcs)</option>
                    <option value="Diameter (Inch / mm)">Diameter (Inch / mm)</option>
                  </select>
                </div>
              </div>

              {/* Sellable Sub-Units Config Input */}
              <div className="space-y-1 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <label className="font-semibold text-white block">
                  Sellable Sub-Unit Items (Format: Name:Price:Stock, Name:Price:Stock...)
                </label>
                <textarea
                  rows={2}
                  value={variantsText}
                  onChange={(e) => setVariantsText(e.target.value)}
                  placeholder="50mm Lock:220:25, 60mm Lock:320:12, 70mm Lock:400:8"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 outline-none font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400 block">
                  Format: <code>Sub-Unit Name:Price:Stock, ...</code>
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-slate-100 outline-none"
                />
              </div>

              {/* Product Image Path Picker */}
              <div className="space-y-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> Product Image Path
                  </label>
                  {localImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(!showImagePicker)}
                      className="text-[11px] text-amber-400 hover:underline font-bold"
                    >
                      {showImagePicker ? 'Hide Gallery' : `Pick from Local Folder (${localImages.length} Images)`}
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/products/2412.jpg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-100 outline-none font-mono"
                />

                {showImagePicker && localImages.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-900 rounded-lg border border-slate-800">
                      {localImages.map((img) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => {
                            setImageUrl(img);
                            setShowImagePicker(false);
                          }}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                            imageUrl === img ? 'border-amber-500 scale-105 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : 'Save Product & Sub-Units'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
