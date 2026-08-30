'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import {
  initialFallbackProducts,
  initialFallbackCategories,
  getCombinedProductsList,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  Product,
  ProductVariant,
} from '../../lib/api';
import Link from 'next/link';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  ClipboardList,
  CheckCircle,
  RefreshCw,
  Edit,
  Save,
  PlusCircle,
  Sparkles,
  Eye,
  X,
  Phone,
  Printer,
  Layers,
  Flame,
  Star,
  Check,
  Upload,
  Camera,
  Image as ImageIcon,
  Smartphone,
  HardDrive,
  FolderOpen,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Settings,
  Moon,
  Sun,
  Download,
  DollarSign,
  Barcode,
  Award,
  Clock,
  Shield,
  Search,
  Filter,
  ArrowUpRight,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface OrderDetail {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  district: string;
  thana: string;
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  cancelReason?: string;
  bkashTrxId?: string;
  notes?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productTitle: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    sku?: string;
    image?: string;
  }>;
}

interface ProductRequest {
  id: string;
  customerName: string;
  phone: string;
  productName: string;
  brand: string;
  notes?: string;
  status: string;
  createdAt: string;
}

interface StoreSettings {
  storeName: string;
  tagline: string;
  managerName: string;
  hotline: string;
  address: string;
  binNumber: string;
  themeMode: 'night' | 'day';
  deliveryFee: number;
  expressDeliveryTime: string;
  freeDeliveryThreshold: number;
  bkashNumber: string;
  nagadNumber: string;
  enableCod: boolean;
}

export default function AdminControlPanel() {
  const { user, isAdmin, token, openAuthModal } = useAuth();
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'add_product' | 'stock' | 'requests' | 'new_arrivals' | 'settings'>('orders');

  // Metrics
  const [metrics, setMetrics] = useState({
    totalRevenue: 348500,
    totalOrders: 78,
    pendingOrders: 4,
    completedOrders: 74,
    grossProfit: 68400,
  });

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'M/S Rong Bahar PRO',
    tagline: 'Paint, Hardware & Sanitary Superstore',
    managerName: 'Habib (Md. Habibullah)',
    hotline: '01722-452836',
    address: 'Mothkhola Road, Pakundia Bazar, Kishoreganj',
    binNumber: 'BIN-192837465-BD',
    themeMode: 'night',
    deliveryFee: 40,
    expressDeliveryTime: 'Under 2 Hours',
    freeDeliveryThreshold: 5000,
    bkashNumber: '01722-452836',
    nagadNumber: '01722-452836',
    enableCod: true,
  });

  const [settingsSavedToast, setSettingsSavedToast] = useState('');

  // Orders State with search and filter
  const [orders, setOrders] = useState<OrderDetail[]>([
    {
      id: 'ord-1',
      orderNumber: 'ORD-9821',
      customerName: 'Rahim Chowdhury',
      phone: '01812345678',
      deliveryAddress: 'Hospital Road, Mothkhola Bazar Road',
      district: 'Kishoreganj',
      thana: 'Pakundia',
      totalAmount: 1850,
      deliveryFee: 40,
      paymentMethod: 'COD',
      paymentStatus: 'VERIFIED',
      orderStatus: 'CONFIRMED',
      notes: 'Please deliver before 5 PM at hardware store site',
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 'it-1',
          productTitle: 'Berger Robbialac Synthetic Enamel',
          variantName: '0.91 Litre Tin (CNG Green)',
          quantity: 2,
          unitPrice: 450,
          sku: 'BER-ROB-091L',
          image: '/products/2412.jpg',
        },
        {
          id: 'it-2',
          productTitle: 'HMBR 50mm Stainless Steel Padlock',
          variantName: '50mm Top Security Lock',
          quantity: 1,
          unitPrice: 490,
          sku: 'HMBR-PL-50MM',
          image: '/products/2415.jpg',
        },
        {
          id: 'it-3',
          productTitle: 'Professional 125mm Paint Brush',
          variantName: '125mm (5-Inch)',
          quantity: 2,
          unitPrice: 180,
          sku: 'PBR-IND-125MM',
          image: '/products/2417.jpg',
        },
      ],
    },
    {
      id: 'ord-2',
      orderNumber: 'ORD-7541',
      customerName: 'Roton Babu Raj',
      phone: '01605955996',
      deliveryAddress: 'Pakundia High School Road, Ward 4',
      district: 'Kishoreganj',
      thana: 'Pakundia',
      totalAmount: 540,
      deliveryFee: 40,
      paymentMethod: 'bKash Online',
      paymentStatus: 'VERIFIED',
      orderStatus: 'SHIPPED',
      bkashTrxId: 'BK9X274819',
      notes: 'Handover to security gate',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      items: [
        {
          id: 'it-4',
          productTitle: 'Professional 125mm Industrial Paint Brush',
          variantName: '125 mm (5 Inch) Brush',
          quantity: 2,
          unitPrice: 200,
          sku: 'PBR-125MM',
          image: '/products/2417.jpg',
        },
      ],
    },
  ]);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Customer Product Requests State
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([
    {
      id: 'req-1',
      customerName: 'Shahidul Islam (Contractor)',
      phone: '01719876543',
      productName: 'Berger WeatherCoat Glow Exterior White (20L Drum)',
      brand: 'Berger Paints BD',
      notes: 'Need 3 drums urgently for residential building exterior in Mothkhola',
      status: 'PENDING SOURCING',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'req-2',
      customerName: 'Alamgir Hossain',
      phone: '01912344556',
      productName: 'Asian Paints Apex Ultima Protek (4L Can)',
      brand: 'Asian Paints',
      notes: 'Looking for genuine 10-year warranty exterior topcoat with base primer',
      status: 'CONTACTED CUSTOMER',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [expandedInventoryProdId, setExpandedInventoryProdId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // CLEAN HARDWARE STORE ADD PRODUCT FORM STATE
  // ---------------------------------------------------------------------------
  const [productType, setProductType] = useState<'paint' | 'brush' | 'lock' | 'adhesive' | 'thinners' | 'sanitary' | 'electrical' | 'general'>('paint');
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('synthetic-enamel-paints');
  const [prodVendor, setProdVendor] = useState('Berger Paints BD');
  const [prodSku, setProdSku] = useState(`RB-PNT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [prodBarcode, setProdBarcode] = useState(`8901234${Math.floor(10000 + Math.random() * 90000)}`);
  const [prodUnit, setProdUnit] = useState('Volume & Color');
  const [prodCostPrice, setProdCostPrice] = useState<number>(0);
  const [prodRetailPrice, setProdRetailPrice] = useState<number>(0);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | undefined>(undefined);
  const [prodDescription, setProdDescription] = useState('');
  const [prodWarranty, setProdWarranty] = useState('Genuine Store Guarantee');
  const [prodCoverage, setProdCoverage] = useState('');
  const [prodDryingTime, setProdDryingTime] = useState('');
  const [prodOrigin, setProdOrigin] = useState('Bangladesh (Direct Store Stock)');
  const [prodIsNewArrival, setProdIsNewArrival] = useState(true);
  const [prodIsFeatured, setProdIsFeatured] = useState(true);

  // Camera & Gallery Uploads
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    url: string;
    name: string;
    source: 'camera' | 'gallery';
  }>>([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number>(0);

  // Universal Multi-Attribute Variants Array
  const [configuredVariants, setConfiguredVariants] = useState<Array<{
    id: string;
    name: string;
    sizeOrWeight: string;
    colorName?: string;
    colorHex?: string;
    costPrice?: number;
    price: number;
    stock: number;
    sku: string;
  }>>([]);

  const [tempVarSize, setTempVarSize] = useState('');
  const [tempVarColor, setTempVarColor] = useState('');
  const [tempVarColorHex, setTempVarColorHex] = useState('#166534');
  const [tempVarCost, setTempVarCost] = useState<number>(0);
  const [tempVarPrice, setTempVarPrice] = useState<number>(0);
  const [tempVarStock, setTempVarStock] = useState<number>(20);

  const [addSuccessMessage, setAddSuccessMessage] = useState('');
  const [addedProductSlug, setAddedProductSlug] = useState('');
  const [addedProductTitle, setAddedProductTitle] = useState('');

  // ---------------------------------------------------------------------------
  // LIVE INVENTORY EDITING & MULTI-VARIANT STUDIO STATE
  // ---------------------------------------------------------------------------
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('ALL');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editVendor, setEditVendor] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('synthetic-enamel-paints');
  const [editSku, setEditSku] = useState('');
  const [editBarcode, setEditBarcode] = useState('');
  const [editUnit, setEditUnit] = useState('Volume & Color');
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editRetailPrice, setEditRetailPrice] = useState<number>(0);
  const [editDiscountPrice, setEditDiscountPrice] = useState<number | undefined>(undefined);
  const [editDescription, setEditDescription] = useState('');
  const [editWarranty, setEditWarranty] = useState('Genuine Store Guarantee');
  const [editCoverage, setEditCoverage] = useState('');
  const [editDryingTime, setEditDryingTime] = useState('');
  const [editOrigin, setEditOrigin] = useState('Bangladesh');
  const [editIsNewArrival, setEditIsNewArrival] = useState(false);
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editVariants, setEditVariants] = useState<ProductVariant[]>([]);

  // Edit Modal New Variant Row Fields
  const [editNewVarSize, setEditNewVarSize] = useState('');
  const [editNewVarColor, setEditNewVarColor] = useState('');
  const [editNewVarColorHex, setEditNewVarColorHex] = useState('#166534');
  const [editNewVarCost, setEditNewVarCost] = useState<number>(0);
  const [editNewVarPrice, setEditNewVarPrice] = useState<number>(0);
  const [editNewVarStock, setEditNewVarStock] = useState<number>(20);

  const editCameraInputRef = useRef<HTMLInputElement | null>(null);
  const editGalleryInputRef = useRef<HTMLInputElement | null>(null);

  // Load from local storage and sync products
  useEffect(() => {
    try {
      const combined = getCombinedProductsList();
      const cleanProducts = combined.filter(
        (p: Product) => !['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'].includes(p.id)
      );
      setProductsList(cleanProducts);
      if (cleanProducts.length !== combined.length) {
        localStorage.setItem('rong_bahar_products_list', JSON.stringify(cleanProducts));
      }

      const savedOrders = localStorage.getItem('rong_bahar_all_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders(parsed);
          const revenue = parsed.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
          setMetrics((prev) => ({
            ...prev,
            totalOrders: parsed.length,
            totalRevenue: 348500 + revenue,
            pendingOrders: parsed.filter((o: any) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PENDING').length,
          }));
        }
      }

      const savedRequests = localStorage.getItem('rong_bahar_customer_requests');
      if (savedRequests) {
        const parsedReqs = JSON.parse(savedRequests);
        if (Array.isArray(parsedReqs) && parsedReqs.length > 0) {
          setProductRequests(parsedReqs);
        }
      }

      const savedTheme = localStorage.getItem('rong_bahar_theme_mode');
      const savedSettings = localStorage.getItem('rong_bahar_store_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings) {
          setStoreSettings((prev) => ({
            ...prev,
            ...parsedSettings,
            themeMode: savedTheme === 'light' ? 'day' : 'night',
          }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleApplyThemeMode = (mode: 'night' | 'day') => {
    setStoreSettings({ ...storeSettings, themeMode: mode });
    if (mode === 'day') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rong_bahar_theme_mode', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('rong_bahar_theme_mode', 'dark');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('rong_bahar_store_settings', JSON.stringify(storeSettings));
      setSettingsSavedToast('⚙️ Store Settings saved successfully!');
      setTimeout(() => setSettingsSavedToast(''), 4000);
    } catch {
      // ignore
    }
  };

  const handleExportOrdersJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RongBahar_Orders_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 📸 Direct Camera Snap handler
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setUploadedImages((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            url: base64Url,
            name: `Camera Snap (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            source: 'camera',
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // 🖼️ Device Gallery & File Uploader handler
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          setUploadedImages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url: base64Url,
              name: file.name,
              source: 'gallery',
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (selectedCoverIndex >= index && selectedCoverIndex > 0) {
      setSelectedCoverIndex(selectedCoverIndex - 1);
    }
  };

  const handleSetCoverImage = (index: number) => {
    setSelectedCoverIndex(index);
  };

  // Wipe / Reset catalog to completely blank (0 products)
  const handleResetAllProducts = () => {
    if (window.confirm('⚠️ Are you sure you want to wipe all store products and reset the catalog to 0? This will give you a 100% clean blank catalog.')) {
      setProductsList([]);
      try {
        localStorage.removeItem('rong_bahar_products_list');
      } catch {}
      setSettingsSavedToast('🧹 Store Catalog wiped! Product list is now 100% blank (0 products).');
      setTimeout(() => setSettingsSavedToast(''), 4000);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const updated = productsList.filter((p) => p.id !== productId);
    setProductsList(updated);
    try {
      localStorage.setItem('rong_bahar_products_list', JSON.stringify(updated));
    } catch {}
    deleteProductAPI(productId).catch(() => {});
    setSettingsSavedToast('🗑️ Product deleted from store catalog.');
    setTimeout(() => setSettingsSavedToast(''), 3000);
  };

  // ---------------------------------------------------------------------------
  // FULL PRODUCT EDIT STUDIO HANDLERS
  // ---------------------------------------------------------------------------
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.title || '');
    setEditVendor(product.vendor || '');
    setEditCategoryId(product.category?.slug || product.categoryId || 'synthetic-enamel-paints');
    setEditSku(product.sku || '');
    setEditBarcode(product.barcode || '');
    setEditUnit(product.unit || 'Volume & Color');
    setEditCostPrice(product.costPrice || 0);
    setEditRetailPrice(product.basePrice || 0);
    setEditDiscountPrice(product.discountPrice);
    setEditDescription(product.description || '');
    setEditWarranty(product.warranty || 'Genuine Store Guarantee');
    setEditCoverage(product.specifications?.coverage || '');
    setEditDryingTime(product.specifications?.dryingTime || '');
    setEditOrigin(product.specifications?.origin || 'Bangladesh');
    setEditIsNewArrival(Boolean(product.isNewArrival));
    setEditIsFeatured(Boolean(product.isFeatured));
    setEditImages(Array.isArray(product.images) ? [...product.images] : []);
    setEditVariants(
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants.map((v) => ({ ...v }))
        : [
            {
              id: `var-${Date.now()}`,
              productId: product.id,
              name: `${product.unit || '1 Unit'} Standard`,
              sizeOrWeight: product.unit || '1 Unit',
              costPrice: product.costPrice || 0,
              price: product.basePrice || 0,
              stock: product.stock || 20,
              sku: product.sku || `RB-${Date.now()}`,
            },
          ]
    );
    // Reset new variant inputs
    setEditNewVarSize('');
    setEditNewVarColor('');
    setEditNewVarColorHex('#166534');
    setEditNewVarCost(product.costPrice || 0);
    setEditNewVarPrice(product.basePrice || 0);
    setEditNewVarStock(20);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
  };

  const handleEditAddVariant = () => {
    if (!editNewVarSize.trim() || !editNewVarPrice) {
      alert('Please enter a variant size / dimension and retail selling price.');
      return;
    }
    const name = editNewVarColor.trim() ? `${editNewVarSize} – ${editNewVarColor}` : editNewVarSize;
    const newSku = `${editSku || 'RB'}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      productId: editingProduct?.id || `prod-${Date.now()}`,
      name,
      sizeOrWeight: editNewVarSize,
      colorName: editNewVarColor || undefined,
      colorHex: editNewVarColorHex || undefined,
      costPrice: Number(editNewVarCost) || undefined,
      price: Number(editNewVarPrice),
      stock: Number(editNewVarStock) || 20,
      sku: newSku,
    };

    setEditVariants([...editVariants, newVar]);
    setEditNewVarSize('');
    setEditNewVarColor('');
  };

  const handleEditDeleteVariant = (variantId: string) => {
    setEditVariants(editVariants.filter((v) => v.id !== variantId));
  };

  const handleEditUpdateVariant = (variantId: string, field: string, value: any) => {
    setEditVariants(
      editVariants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const handleEditCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setEditImages((prev) => [...prev, base64Url]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleEditGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          setEditImages((prev) => [...prev, base64Url]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = '';
  };

  const handleEditRemoveImage = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSetCoverImage = (index: number) => {
    if (index === 0) return;
    setEditImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editTitle.trim()) {
      alert('Product title cannot be empty.');
      return;
    }

    const firstVar = editVariants[0];
    const basePrice = firstVar ? Number(firstVar.price) : Number(editRetailPrice) || 0;
    const baseCostPrice = firstVar && firstVar.costPrice ? Number(firstVar.costPrice) : Number(editCostPrice) || 0;
    const totalStock = editVariants.length > 0
      ? editVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : editingProduct.stock || 50;

    const matchedCat = initialFallbackCategories.find((c) => c.slug === editCategoryId || c.id === editCategoryId) || {
      id: editCategoryId,
      name: editVendor || 'Hardware Item',
      slug: editCategoryId,
    };

    const colors = Array.from(new Set(editVariants.map((v) => v.colorName).filter(Boolean))).map((name) => ({
      name: name as string,
      hex: editVariants.find((v) => v.colorName === name)?.colorHex || '#166534',
    }));

    const sizes = Array.from(new Set(editVariants.map((v) => v.sizeOrWeight).filter(Boolean))) as string[];

    const updatedProduct: Product = {
      ...editingProduct,
      title: editTitle,
      vendor: editVendor || 'M/S Rong Bahar',
      categoryId: matchedCat.id,
      category: matchedCat,
      sku: editSku || editingProduct.sku,
      barcode: editBarcode || editingProduct.barcode,
      unit: editUnit || editingProduct.unit,
      basePrice,
      costPrice: baseCostPrice,
      discountPrice: editDiscountPrice || undefined,
      stock: totalStock,
      description: editDescription || editingProduct.description,
      warranty: editWarranty || editingProduct.warranty,
      specifications: {
        ...editingProduct.specifications,
        coverage: editCoverage || undefined,
        dryingTime: editDryingTime || undefined,
        origin: editOrigin || 'Bangladesh',
      },
      isNewArrival: editIsNewArrival,
      isFeatured: editIsFeatured,
      images: editImages.length > 0 ? editImages : editingProduct.images,
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      variants: editVariants.length > 0 ? editVariants : editingProduct.variants,
    };

    const updatedList = productsList.map((p) => (p.id === editingProduct.id ? updatedProduct : p));
    setProductsList(updatedList);
    try {
      localStorage.setItem('rong_bahar_products_list', JSON.stringify(updatedList));
    } catch {}

    updateProductAPI(editingProduct.id, updatedProduct).catch((err) => {
      console.warn('Backend update sync:', err);
    });

    setEditingProduct(null);
    setSettingsSavedToast(`✅ Product "${editTitle}" updated successfully across your entire storefront and inventory!`);
    setTimeout(() => setSettingsSavedToast(''), 4000);
  };

  const handleInlineUpdateProduct = (productId: string, field: keyof Product, value: any) => {
    setProductsList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const updatedProd = { ...p, [field]: value };
          updateProductAPI(productId, updatedProd).catch(() => {});
          return updatedProd;
        }
        return p;
      });
      try {
        localStorage.setItem('rong_bahar_products_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSettingsSavedToast('💾 In-place product updates saved.');
    setTimeout(() => setSettingsSavedToast(''), 2000);
  };

  // Switch product category preset (configures category metadata without forcing dummy items)
  const handleProductTypeChange = (type: 'paint' | 'brush' | 'lock' | 'adhesive' | 'thinners' | 'sanitary' | 'electrical' | 'general') => {
    setProductType(type);
    const skuCode = `RB-${type.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setProdSku(skuCode);

    if (type === 'paint') {
      setProdCategoryId('synthetic-enamel-paints');
      setProdUnit('Volume & Color');
      setProdWarranty('5 Years Anti-Rust & Gloss Retention Guarantee');
      setProdCoverage('120-140 sq. ft / Litre / Coat');
      setProdDryingTime('Touch dry: 3 hrs, Full cure: 18 hrs');
      setTempVarSize('0.91 Litre Tin');
      setTempVarColor('CNG Royal Green');
      setTempVarColorHex('#166534');
    } else if (type === 'brush') {
      setProdCategoryId('paint-brushes-and-tools');
      setProdUnit('Width (mm / Inch)');
      setProdWarranty('Zero Bristle Shedding Guarantee');
      setProdCoverage('100% Pure White Hog Bristle');
      setProdDryingTime('Wash with solvent after use');
      setTempVarSize('50 mm (2 Inch)');
      setTempVarColor('');
    } else if (type === 'lock') {
      setProdCategoryId('padlocks-and-security');
      setProdUnit('Perimeter / Width (mm)');
      setProdWarranty('10 Years Anti-Cut & Anti-Pick Guarantee');
      setProdCoverage('Hardened Boron Steel + Solid Brass');
      setProdDryingTime('Weatherproof & Rustproof');
      setTempVarSize('50 mm Top Security');
      setTempVarColor('');
    } else if (type === 'adhesive') {
      setProdCategoryId('adhesives-and-glues');
      setProdUnit('Weight (gm / kg)');
      setProdWarranty('Lifetime Waterproof D4 Bond');
      setProdCoverage('1-Component Moisture Curing PU');
      setProdDryingTime('Initial set: 30 mins, Cure: 24 hrs');
      setTempVarSize('500 gm Bottle');
      setTempVarColor('');
    } else if (type === 'thinners') {
      setProdCategoryId('thinners-and-solvents');
      setProdUnit('Volume (Litre / Gallon)');
      setProdWarranty('100% Pure Grade Mineral Thinner');
      setProdCoverage('Compatible with synthetic enamels & PU');
      setProdDryingTime('Instant paint reducer');
      setTempVarSize('1 Litre Bottle');
      setTempVarColor('');
    } else if (type === 'sanitary') {
      setProdCategoryId('sanitary-and-pipes');
      setProdUnit('Diameter & Length');
      setProdWarranty('20 Years Leakproof Guarantee');
      setProdCoverage('High Grade uPVC & Brass Insert');
      setProdDryingTime('Immediate Pressure Tolerant');
      setTempVarSize('0.75 Inch (3/4")');
      setTempVarColor('');
    } else {
      setProdCategoryId('electrical-and-tools');
      setProdUnit('Piece / Pack');
      setProdWarranty('Standard Manufacturer Warranty');
      setProdCoverage('Industrial Grade Component');
      setProdDryingTime('N/A');
      setTempVarSize('1 Piece');
      setTempVarColor('');
    }
  };

  const handleAddCustomVariant = () => {
    if (!tempVarSize || !tempVarPrice) return;
    const name = tempVarColor ? `${tempVarSize} – ${tempVarColor}` : tempVarSize;
    const sku = `${prodSku}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    setConfiguredVariants([
      ...configuredVariants,
      {
        id: `var-${Date.now()}`,
        name,
        sizeOrWeight: tempVarSize,
        colorName: tempVarColor || undefined,
        colorHex: tempVarColorHex || undefined,
        costPrice: Number(tempVarCost) || undefined,
        price: Number(tempVarPrice),
        stock: Number(tempVarStock) || 20,
        sku,
      },
    ]);
  };

  const handleDeleteFormVariant = (id: string) => {
    setConfiguredVariants(configuredVariants.filter((v) => v.id !== id));
  };

  const handleUpdateFormVariant = (id: string, field: 'price' | 'costPrice' | 'stock' | 'name' | 'sizeOrWeight', value: any) => {
    setConfiguredVariants(
      configuredVariants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleUpdateProductVariant = (productId: string, variantId: string, field: string, value: any) => {
    setProductsList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          const updatedVars = p.variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v));
          return { ...p, variants: updatedVars };
        }
        return p;
      });
      try {
        localStorage.setItem('rong_bahar_products_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteProductVariant = (productId: string, variantId: string) => {
    setProductsList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, variants: p.variants.filter((v) => v.id !== variantId) };
        }
        return p;
      });
      try {
        localStorage.setItem('rong_bahar_products_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddNewVariantToProduct = (productId: string) => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      productId,
      name: 'New Custom Variant / Dimension',
      sizeOrWeight: '1 Unit',
      price: 500,
      stock: 20,
      sku: `RB-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setProductsList((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return { ...p, variants: [...p.variants, newVar] };
        }
        return p;
      });
      try {
        localStorage.setItem('rong_bahar_products_list', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string, cancelReason?: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            cancelReason: newStatus === 'CANCELLED' ? (cancelReason || o.cancelReason || 'Product not in stock / not delivered') : undefined,
          };
        }
        return o;
      });
      try {
        localStorage.setItem('rong_bahar_all_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        orderStatus: newStatus,
        cancelReason: newStatus === 'CANCELLED' ? (cancelReason || selectedOrder.cancelReason || 'Product not in stock / not delivered') : undefined,
      });
    }
  };

  const handleCancelOrderWithReason = (orderId: string, reason: string) => {
    handleUpdateOrderStatus(orderId, 'CANCELLED', reason);
    setSettingsSavedToast(`❌ Order marked as CANCELLED: ${reason}`);
    setTimeout(() => setSettingsSavedToast(''), 3500);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete this order request? (Use this when the product is not in stock or cannot be delivered)')) return;
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem('rong_bahar_all_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(null);
    }
    setSettingsSavedToast('🗑️ Order deleted from pipeline.');
    setTimeout(() => setSettingsSavedToast(''), 3000);
  };

  const handleDeleteProductRequest = (requestId: string) => {
    if (!window.confirm('Are you sure you want to delete / dismiss this customer request?')) return;
    setProductRequests((prev) => {
      const updated = prev.filter((r) => r.id !== requestId);
      try {
        localStorage.setItem('rong_bahar_customer_requests', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSettingsSavedToast('🗑️ Customer product request dismissed.');
    setTimeout(() => setSettingsSavedToast(''), 3000);
  };

  const handleConvertRequestToProduct = (req: ProductRequest) => {
    setProdTitle(req.productName);
    setProdVendor(req.brand && req.brand !== 'Any Brand' ? req.brand : 'Berger Paints BD');
    setProdDescription(req.notes || `Requested by customer ${req.customerName}`);
    setActiveTab('add_product');
  };

  // ---------------------------------------------------------------------------
  // SUBMIT & PERSIST NEW PRODUCT (100% STOREFRONT & ADMIN LISTING GUARANTEE)
  // ---------------------------------------------------------------------------
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodTitle.trim()) {
      alert('Please enter a product title.');
      return;
    }

    const slug = prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const firstVar = configuredVariants[0];
    const basePrice = firstVar ? firstVar.price : (Number(prodRetailPrice) || 0);
    const baseCostPrice = firstVar && firstVar.costPrice ? firstVar.costPrice : (Number(prodCostPrice) || 0);
    const totalStock = configuredVariants.length > 0
      ? configuredVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : 50;

    const matchedCategory = initialFallbackCategories.find((c) => c.slug === prodCategoryId || c.id === prodCategoryId) || {
      id: prodCategoryId,
      name: prodVendor || 'Hardware Superstore',
      slug: prodCategoryId,
    };

    // Images from Camera and Gallery
    const productImages = uploadedImages.length > 0
      ? [
          uploadedImages[selectedCoverIndex]?.url || uploadedImages[0].url,
          ...uploadedImages.filter((_, i) => i !== selectedCoverIndex).map((img) => img.url),
        ]
      : [];

    const colors = Array.from(new Set(configuredVariants.map((v) => v.colorName).filter(Boolean))).map((name) => ({
      name: name as string,
      hex: configuredVariants.find((v) => v.colorName === name)?.colorHex || '#166534',
    }));

    const sizes = Array.from(new Set(configuredVariants.map((v) => v.sizeOrWeight).filter(Boolean))) as string[];

    const variantsToSave: ProductVariant[] = configuredVariants.length > 0
      ? configuredVariants.map((v) => ({
          id: v.id,
          productId: `prod-${Date.now()}`,
          name: v.name,
          sizeOrWeight: v.sizeOrWeight,
          colorName: v.colorName,
          colorHex: v.colorHex,
          costPrice: v.costPrice,
          price: Number(v.price),
          stock: Number(v.stock),
          sku: v.sku,
        }))
      : [
          {
            id: `var-${Date.now()}`,
            productId: `prod-${Date.now()}`,
            name: `${prodUnit || '1 Unit'} Standard`,
            sizeOrWeight: prodUnit || '1 Unit',
            costPrice: baseCostPrice,
            price: basePrice,
            stock: 50,
            sku: prodSku,
          },
        ];

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: prodTitle,
      slug: slug || `product-${Date.now()}`,
      description: prodDescription || `${prodTitle} available at M/S Rong Bahar. Authentic genuine stock ready for instant Pakundia local dispatch.`,
      categoryId: matchedCategory.id,
      category: matchedCategory,
      basePrice,
      costPrice: baseCostPrice,
      discountPrice: prodDiscountPrice || undefined,
      stock: totalStock,
      sku: prodSku,
      barcode: prodBarcode,
      images: productImages,
      unit: prodUnit,
      isActive: true,
      isNewArrival: prodIsNewArrival,
      isFeatured: prodIsFeatured,
      vendor: prodVendor || 'M/S Rong Bahar',
      badge: prodIsNewArrival ? 'New Arrival' : 'In Stock',
      warranty: prodWarranty,
      specifications: {
        coverage: prodCoverage || undefined,
        dryingTime: prodDryingTime || undefined,
        origin: prodOrigin,
      },
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      variants: variantsToSave,
      createdAt: new Date().toISOString(),
    };

    // Save to active state and persistent localStorage
    const updatedList = [newProduct, ...productsList];
    setProductsList(updatedList);
    try {
      localStorage.setItem('rong_bahar_products_list', JSON.stringify(updatedList));
    } catch {}

    // Asynchronously send to backend PostgreSQL database
    createProductAPI(newProduct).catch((err) => {
      console.warn('Backend sync warning:', err);
    });

    setAddSuccessMessage(`🎉 Product "${prodTitle}" was successfully added from your camera/gallery and is live on your storefront!`);
    setAddedProductSlug(newProduct.slug);
    setAddedProductTitle(newProduct.title);

    // Reset form fields cleanly for the next physical store item
    setProdTitle('');
    setProdDescription('');
    setUploadedImages([]);
    setSelectedCoverIndex(0);
    setConfiguredVariants([]);
    setProdCostPrice(0);
    setProdRetailPrice(0);
    setProdDiscountPrice(undefined);
    setProdSku(`RB-${productType.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdBarcode(`8901234${Math.floor(10000 + Math.random() * 90000)}`);

    // Scroll to success notification
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
    const matchesSearch =
      !orderSearchQuery ||
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  const profitMarginPercent = prodRetailPrice > 0 ? Math.round(((prodRetailPrice - prodCostPrice) / prodRetailPrice) * 100) : 0;
  const netProfitUnit = prodRetailPrice - prodCostPrice;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Manager Login Required</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          This control panel is for M/S Rong Bahar store managers.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs transition shadow-lg"
        >
          Login as Manager (01722452836)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 text-xs font-black rounded-lg">
              Manager: {storeSettings.managerName.split(' ')[0] || 'Habib'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {storeSettings.storeName} Control Panel
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {storeSettings.tagline} • Pakundia Bazar, Kishoreganj
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
          >
            <Settings className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Store Settings &amp; Mode</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          </button>
        </div>
      </div>

      {/* Live Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Total Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">{orders.length} Orders recorded</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Pending Deliveries</span>
            <Package className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">
            {orders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PENDING').length} Orders
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Need Pakundia van dispatch</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Store Catalog</span>
            <Layers className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">
            {productsList.length} Products
          </div>
          <div className="text-[10px] text-slate-500 font-medium">100% Listed on storefront</div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold">Customer Requests</span>
            <ClipboardList className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
            {productRequests.length} Requests
          </div>
          <div className="text-[10px] text-slate-500 font-medium">Unlisted sourcing pipeline</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add_product')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'add_product'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>➕ Add Hardware Product</span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'stock'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Inventory &amp; Variants ({productsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Customer Requests ({productRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new_arrivals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'new_arrivals'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Arrivals ({productsList.filter((p) => p.isNewArrival).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>⚙️ Settings &amp; Mode</span>
        </button>
      </div>

      {/* Instant Product Added Confirmation Card */}
      {addSuccessMessage && (
        <div className="p-6 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <strong className="text-sm sm:text-base font-black text-slate-900 dark:text-white block">
                  {addSuccessMessage}
                </strong>
                <span className="text-xs text-emerald-700 dark:text-emerald-400">
                  Customers can now find &amp; buy &quot;{addedProductTitle}&quot; directly from the storefront!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/products/${addedProductSlug}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition shadow flex items-center gap-1.5"
              >
                <span>View Live in Storefront</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setAddSuccessMessage('')}
                className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Saved Notification */}
      {settingsSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm flex items-center gap-2 shadow-lg font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{settingsSavedToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ➕ PRECISE HARDWARE STORE ADD PRODUCT FORM                          */}
      {/* ========================================================================= */}
      {activeTab === 'add_product' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-8 max-w-5xl mx-auto">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-black uppercase">
                Hardware Superstore Matrix
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              Add Product to Store Catalog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports paints (multi-color &amp; volume), padlocks (multi-perimeter), brushes (mm/inch width), adhesives, and sanitary fittings with exact profit margin calculations.
            </p>
          </div>

          <form onSubmit={handleAddProductSubmit} className="space-y-8 text-xs">
            {/* STEP 1: CATEGORY PRESET SELECTION */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-slate-800 dark:text-slate-200 font-black text-xs uppercase tracking-wider">
                1. Select Hardware Category Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {[
                  { id: 'paint', label: '🎨 Paints & Enamels', desc: 'Colors + Litres' },
                  { id: 'thinners', label: '🧪 Thinners & Solvents', desc: 'Turpentine & Reducer' },
                  { id: 'adhesive', label: '🧴 PUR Adhesives', desc: 'D4 Wood Glues' },
                  { id: 'lock', label: '🔒 Security Padlocks', desc: 'mm Shackle Sizes' },
                  { id: 'brush', label: '🖌️ Paint Brushes', desc: 'mm & Inch Widths' },
                  { id: 'sanitary', label: '🚿 Sanitary & Pipes', desc: 'uPVC & Brass' },
                  { id: 'electrical', label: '⚡ Electrical & Tools', desc: 'Cables & Discs' },
                  { id: 'general', label: '📦 General Hardware', desc: 'Screws & Fittings' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleProductTypeChange(t.id as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      productType === t.id
                        ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-300 shadow-md ring-2 ring-amber-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="font-black text-xs truncate">{t.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: CORE IDENTIFICATION & BARCODE */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] block border-b border-slate-200 dark:border-slate-800 pb-2">
                2. Product Identification &amp; Vendor
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Berger Robbialac Synthetic Enamel (High Gloss Protective Shield)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Manufacturer / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodVendor}
                    onChange={(e) => setProdVendor(e.target.value)}
                    placeholder="e.g. Berger Paints BD, Aqua Paints, HMBR, Fevicol"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Category Taxonomy *
                  </label>
                  <select
                    value={prodCategoryId}
                    onChange={(e) => setProdCategoryId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  >
                    {initialFallbackCategories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Product SKU *
                  </label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                    <Barcode className="w-4 h-4 text-amber-500" />
                    <input
                      type="text"
                      required
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value)}
                      className="w-full bg-transparent text-slate-900 dark:text-white font-mono font-bold focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Measurement Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="e.g. Volume & Color, Width (mm), Weight (kg)"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* STEP 3: RETAIL PRICING & PROFIT MARGIN ENGINE */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> 3. Pricing &amp; Profit Margin Engine
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black">
                  Margin: {profitMarginPercent}% (+৳{netProfitUnit} / unit)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Wholesale / Buying Cost (BDT) *
                  </label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <span className="text-slate-400 font-bold font-mono">৳</span>
                    <input
                      type="number"
                      required
                      value={prodCostPrice}
                      onChange={(e) => setProdCostPrice(Number(e.target.value))}
                      className="w-full bg-transparent text-slate-900 dark:text-white font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Retail Selling Price (BDT) *
                  </label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <span className="text-amber-500 font-bold font-mono">৳</span>
                    <input
                      type="number"
                      required
                      value={prodRetailPrice}
                      onChange={(e) => setProdRetailPrice(Number(e.target.value))}
                      className="w-full bg-transparent text-slate-900 dark:text-white font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Promotional / Discount Price (Optional)
                  </label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5">
                    <span className="text-emerald-500 font-bold font-mono">৳</span>
                    <input
                      type="number"
                      value={prodDiscountPrice || ''}
                      onChange={(e) => setProdDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 420"
                      className="w-full bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: CAMERA & GALLERY PHOTO UPLOADER */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    4. Product Photos (Live Camera Snap &amp; Gallery Upload Only)
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Snap real photos of physical products in your shop or choose images from your gallery/storage
                  </span>
                </div>
                {uploadedImages.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                    {uploadedImages.length} {uploadedImages.length === 1 ? 'Photo' : 'Photos'} Attached
                  </span>
                )}
              </div>

              {/* Hidden file inputs for Camera and Gallery */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />

              {/* Primary Action Buttons: Camera Snap & Gallery Choose */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/25 border-2 border-amber-500/50 hover:border-amber-500 text-amber-600 dark:text-amber-300 transition flex items-center justify-center gap-3 font-black text-xs shadow-sm cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center group-hover:scale-110 transition shadow">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500">
                      📸 Take Photo with Camera
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Launches mobile/tablet camera immediately
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 transition flex items-center justify-center gap-3 font-black text-xs shadow-sm cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500/20 text-slate-600 dark:text-slate-300 group-hover:text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500">
                      🖼️ Choose from Gallery / Photos
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Pick photos from phone album or computer disk
                    </div>
                  </div>
                </button>
              </div>

              {/* Image Preview & Gallery List */}
              {uploadedImages.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Product Photos ({uploadedImages.length}) — Click &quot;Set Cover&quot; for main display:
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                      Cover photo appears first in storefront
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {uploadedImages.map((img, idx) => {
                      const isCover = idx === selectedCoverIndex;
                      return (
                        <div
                          key={img.id}
                          className={`relative rounded-xl border p-1.5 transition ${
                            isCover
                              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500 shadow-md'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            {isCover && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-wider shadow">
                                Cover
                              </span>
                            )}
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-white font-mono text-[8px] flex items-center gap-0.5">
                              {img.source === 'camera' ? '📸 Camera' : '🖼️ Gallery'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1 mt-1.5 pt-1 border-t border-slate-200 dark:border-slate-800/80">
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(idx)}
                                className="text-[9px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                              >
                                Set Cover
                              </button>
                            ) : (
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                ✓ Primary
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedImage(idx)}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1.5">
                  <div className="text-slate-400 dark:text-slate-500 text-xs font-bold">
                    No product photos attached yet
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Snap a photo using your camera or select an image from your device gallery above.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 5: UNIVERSAL MULTI-ATTRIBUTE VARIANT MATRIX */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    5. Universal Multi-Attribute Variants ({configuredVariants.length})
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Each combination has its own SKU, wholesale cost, retail selling price, and stock count
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                  Customizable Matrix
                </span>
              </div>

              {/* LIST OF CURRENT VARIANTS */}
              <div className="space-y-2">
                {configuredVariants.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {v.colorHex && (
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20 shrink-0 shadow-xs"
                          style={{ backgroundColor: v.colorHex }}
                          title={v.colorName}
                        />
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{v.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {v.sizeOrWeight} {v.colorName ? `• ${v.colorName}` : ''} • SKU: {v.sku}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-amber-500 font-bold">৳</span>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleUpdateFormVariant(v.id, 'price', Number(e.target.value))}
                          className="w-16 bg-transparent text-slate-900 dark:text-white font-bold font-mono focus:outline-none text-right"
                          title="Retail Selling Price"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 text-[10px]">Stock:</span>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleUpdateFormVariant(v.id, 'stock', Number(e.target.value))}
                          className="w-12 bg-transparent text-emerald-600 dark:text-emerald-400 font-bold font-mono focus:outline-none text-right"
                          title="Inventory Stock Count"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteFormVariant(v.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
                        title="Delete this variant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD NEW VARIANT ROW */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold block">
                  + Add Custom Variant to Matrix:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                  <input
                    type="text"
                    value={tempVarSize}
                    onChange={(e) => setTempVarSize(e.target.value)}
                    placeholder="Size / Weight / mm (e.g. 0.91L or 50mm)"
                    className="sm:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs"
                  />

                  {productType === 'paint' && (
                    <input
                      type="text"
                      value={tempVarColor}
                      onChange={(e) => setTempVarColor(e.target.value)}
                      placeholder="Color Shade Name"
                      className="sm:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs"
                    />
                  )}

                  <input
                    type="number"
                    value={tempVarPrice || ''}
                    onChange={(e) => setTempVarPrice(Number(e.target.value))}
                    placeholder="Retail ৳"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs font-bold"
                  />

                  <input
                    type="number"
                    value={tempVarStock || ''}
                    onChange={(e) => setTempVarStock(Number(e.target.value))}
                    placeholder="Stock Qty"
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  />

                  <button
                    type="button"
                    onClick={handleAddCustomVariant}
                    className="py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1 shadow"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 6: TECHNICAL HARDWARE SPECIFICATIONS & WARRANTY */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] block border-b border-slate-200 dark:border-slate-800 pb-2">
                6. Technical Hardware Specs &amp; Warranty
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Warranty / Guarantee Tag
                  </label>
                  <input
                    type="text"
                    value={prodWarranty}
                    onChange={(e) => setProdWarranty(e.target.value)}
                    placeholder="e.g. 10 Years Anti-Rust Guarantee"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Coverage Area / Material
                  </label>
                  <input
                    type="text"
                    value={prodCoverage}
                    onChange={(e) => setProdCoverage(e.target.value)}
                    placeholder="e.g. 120-140 sq. ft / Litre / Coat"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                    Drying Time / Setting Time
                  </label>
                  <input
                    type="text"
                    value={prodDryingTime}
                    onChange={(e) => setProdDryingTime(e.target.value)}
                    placeholder="e.g. Touch dry: 3 hrs, Full cure: 18 hrs"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Detail the gloss finish, adhesion strength, or technical surface preparation..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block">✨ Feature in &quot;New Arrivals&quot;</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Highlight on homepage storefront</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prodIsNewArrival}
                    onChange={(e) => setProdIsNewArrival(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block">🔥 Feature in &quot;Hot Deals&quot;</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Featured badge in catalog</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={prodIsFeatured}
                    onChange={(e) => setProdIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* PUBLISH BUTTON */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm transition shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" /> Publish &amp; List Product in Hardware Superstore
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 📦 LIVE INVENTORY & MULTI-VARIANT MANAGER                          */}
      {/* ========================================================================= */}
      {activeTab === 'stock' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Header & Main Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Live Inventory &amp; Multi-Variant Manager
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Edit product names, pricing, photos, and multi-attribute variant matrix directly in real-time
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black rounded-xl">
                {productsList.length} Total Products
              </span>
              <button
                onClick={() => setActiveTab('add_product')}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Add Product</span>
              </button>
              {productsList.length > 0 && (
                <button
                  onClick={handleResetAllProducts}
                  className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  title="Wipe catalog to start completely blank"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Wipe All / Reset to 0</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Search & Category Filter Bar */}
          {productsList.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 w-full sm:w-80 shadow-xs">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  placeholder="Search product title, brand, SKU..."
                  className="bg-transparent text-slate-900 dark:text-white text-xs focus:outline-none w-full"
                />
                {stockSearchQuery && (
                  <button onClick={() => setStockSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={stockCategoryFilter}
                  onChange={(e) => setStockCategoryFilter(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs font-bold focus:outline-none w-full sm:w-auto"
                >
                  <option value="ALL">All Categories ({productsList.length})</option>
                  {initialFallbackCategories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {productsList.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Store Catalog is 100% Blank</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  Ready for you to start cataloging real products from your camera or phone gallery.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('add_product')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md"
              >
                <Camera className="w-4 h-4" /> Start Adding Products with Camera
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {productsList
                .filter((p) => {
                  const matchesCategory =
                    stockCategoryFilter === 'ALL' ||
                    p.category?.slug === stockCategoryFilter ||
                    p.categoryId === stockCategoryFilter;
                  const matchesSearch =
                    !stockSearchQuery ||
                    p.title.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                    p.vendor?.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                    p.sku.toLowerCase().includes(stockSearchQuery.toLowerCase());
                  return matchesCategory && matchesSearch;
                })
                .map((product) => {
                  const isExpanded = expandedInventoryProdId === product.id;
                  const coverImage = product.images?.[0] || '';
                  const totalVariantsCount = product.variants?.length || 0;
                  return (
                    <div
                      key={product.id}
                      className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition shadow-xs"
                    >
                      {/* Product Header Card Block */}
                      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
                        {/* Top: Photo Thumbnail + Product Info */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 relative group flex items-center justify-center">
                            {coverImage ? (
                              <img src={coverImage} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-7 h-7 text-slate-400" />
                            )}
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="absolute inset-0 bg-slate-950/80 text-amber-400 font-bold text-[9px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="Edit product photos"
                            >
                              <Camera className="w-4 h-4 mb-0.5" />
                              <span>Photos</span>
                            </button>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            {/* Product Title */}
                            <h3
                              onClick={() => handleOpenEditModal(product)}
                              className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug break-words cursor-pointer hover:text-amber-500 transition"
                              title="Click to edit product"
                            >
                              {product.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                                {product.vendor || 'M/S Rong Bahar'}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black font-mono">
                                ৳{product.basePrice} base price
                              </span>
                              {product.isNewArrival && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                  ★ New Arrival
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Middle: Badges Wrap */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                            <Sliders className="w-3 h-3 text-amber-500" />
                            {totalVariantsCount} {totalVariantsCount === 1 ? 'Variant' : 'Variants'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                            <Package className="w-3 h-3 text-emerald-500" />
                            {product.stock} total stock
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 font-mono text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                            SKU: {product.sku}
                          </span>
                        </div>

                        {/* Bottom: Action Buttons Bar (2x2 Grid on Mobile, Flex on Desktop - NO OVERLAP) */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-900">
                          {/* ✏️ Full Product Edit Studio Button */}
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="col-span-1 sm:flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                            title="Edit full product details, photos, and variants matrix"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Product</span>
                          </button>

                          {/* 📦 Manage Variants In-Place Button */}
                          <button
                            onClick={() => setExpandedInventoryProdId(isExpanded ? null : product.id)}
                            className={`col-span-1 sm:flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              isExpanded
                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                            }`}
                            title="Toggle in-place variant editor"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Variants ({totalVariantsCount})</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {/* 👁️ View Live PDP Button */}
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="col-span-1 sm:w-auto py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition"
                            title="View Live Product Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View PDP</span>
                          </Link>

                          {/* 🗑️ Delete Entire Product Button */}
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="col-span-1 sm:w-auto py-2.5 px-3 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                            title="Delete entire product from store"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable In-Place Variant Manager Drawer */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div>
                              <span className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5" />
                                Multi-Variant Stock Matrix
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                                Edit prices, stock counts, or remove variants. Changes save instantly.
                              </span>
                            </div>
                            <button
                              onClick={() => handleAddNewVariantToProduct(product.id)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 self-start sm:self-auto shadow-xs"
                            >
                              <PlusCircle className="w-3.5 h-3.5" /> + Add Variant
                            </button>
                          </div>

                          <div className="space-y-3">
                            {product.variants?.map((v) => (
                              <div
                                key={v.id}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {v.colorHex && (
                                    <span
                                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20 shrink-0 shadow-xs"
                                      style={{ backgroundColor: v.colorHex }}
                                      title={v.colorName}
                                    />
                                  )}
                                  <div className="flex-1 space-y-1 min-w-0">
                                    <input
                                      type="text"
                                      value={v.name}
                                      onChange={(e) => handleUpdateProductVariant(product.id, v.id, 'name', e.target.value)}
                                      placeholder="Variant Name / Dimension"
                                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white text-xs font-bold w-full focus:outline-none focus:border-amber-500"
                                    />
                                    <div className="text-[10px] text-slate-400 font-mono flex flex-wrap items-center gap-2">
                                      <span>Size: {v.sizeOrWeight}</span>
                                      {v.colorName && <span>• Color: {v.colorName}</span>}
                                      <span>• SKU: {v.sku}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-900">
                                  <div className="flex items-center gap-2">
                                    {/* Selling Price */}
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                                      <span className="text-amber-500 font-bold text-xs">৳</span>
                                      <input
                                        type="number"
                                        value={v.price}
                                        onChange={(e) => handleUpdateProductVariant(product.id, v.id, 'price', Number(e.target.value))}
                                        className="w-16 sm:w-20 bg-transparent text-slate-900 dark:text-white font-bold font-mono focus:outline-none text-right text-xs"
                                        title="Retail Selling Price"
                                      />
                                    </div>

                                    {/* Stock Count */}
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">Stock:</span>
                                      <input
                                        type="number"
                                        value={v.stock}
                                        onChange={(e) => handleUpdateProductVariant(product.id, v.id, 'stock', Number(e.target.value))}
                                        className="w-12 sm:w-16 bg-transparent text-emerald-600 dark:text-emerald-400 font-bold font-mono focus:outline-none text-right text-xs"
                                        title="Inventory Stock Count"
                                      />
                                    </div>
                                  </div>

                                  {/* Delete Variant */}
                                  <button
                                    onClick={() => handleDeleteProductVariant(product.id, v.id)}
                                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
                                    title="Delete this variant"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL PRODUCT EDIT STUDIO MODAL (CAMERA, GALLERY, SPECS, VARIANTS MATRIX)  */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Edit Product &amp; Multi-Variant Matrix
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {editingProduct.id} • SKU: {editingProduct.sku}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-6">
              {/* SECTION 1: CORE PRODUCT DETAILS */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> 1. Core Specifications
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      Product Name / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="e.g. Berger Robbialac Synthetic Enamel High Gloss"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      Brand / Manufacturer *
                    </label>
                    <input
                      type="text"
                      required
                      value={editVendor}
                      onChange={(e) => setEditVendor(e.target.value)}
                      placeholder="e.g. Berger Paints BD, Aqua, HMBR, Fevicol"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      Category Taxonomy *
                    </label>
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                    >
                      {initialFallbackCategories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      Measurement Unit *
                    </label>
                    <input
                      type="text"
                      required
                      value={editUnit}
                      onChange={(e) => setEditUnit(e.target.value)}
                      placeholder="e.g. Volume & Color, Width (mm), Weight (kg)"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Describe genuine features, surface application, or durability..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PHOTOS (CAMERA SNAP & GALLERY PICKER) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Camera className="w-4 h-4" /> 2. Product Photos ({editImages.length})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Cover photo appears first on the storefront
                  </span>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={editCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleEditCameraCapture}
                  className="hidden"
                />
                <input
                  ref={editGalleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditGalleryUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => editCameraInputRef.current?.click()}
                    className="p-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-black text-xs transition flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" /> Snap New Photo with Camera
                  </button>

                  <button
                    type="button"
                    onClick={() => editGalleryInputRef.current?.click()}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs transition flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" /> Add from Phone Gallery / Files
                  </button>
                </div>

                {/* Image Thumbnails */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                    {editImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border p-1 transition ${
                          idx === 0
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-wider">
                              Cover
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-[9px]">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleEditSetCoverImage(idx)}
                              className="font-bold text-amber-600 hover:underline"
                            >
                              Set Cover
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold">✓ Primary</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEditRemoveImage(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: MULTI-ATTRIBUTE VARIANTS MATRIX */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> 3. Multi-Attribute Variant Matrix ({editVariants.length})
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Each variant holds its own retail selling price, wholesale cost, and stock
                  </span>
                </div>

                <div className="space-y-2">
                  {editVariants.map((v) => (
                    <div
                      key={v.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {v.colorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20 shrink-0"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => handleEditUpdateVariant(v.id, 'name', e.target.value)}
                          placeholder="Variant Name"
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white font-bold w-full focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                          <span className="text-amber-500 font-bold">Price: ৳</span>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleEditUpdateVariant(v.id, 'price', Number(e.target.value))}
                            className="w-16 bg-transparent text-slate-900 dark:text-white font-bold font-mono focus:outline-none text-right"
                          />
                        </div>

                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 text-[10px]">Stock:</span>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleEditUpdateVariant(v.id, 'stock', Number(e.target.value))}
                            className="w-12 bg-transparent text-emerald-600 dark:text-emerald-400 font-bold font-mono focus:outline-none text-right"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEditDeleteVariant(v.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Variant to Matrix in Edit Modal */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold block">
                    + Add New Variant to Matrix:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      value={editNewVarSize}
                      onChange={(e) => setEditNewVarSize(e.target.value)}
                      placeholder="Size / Volume (e.g. 0.91L Tin)"
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500 sm:col-span-2"
                    />
                    <input
                      type="text"
                      value={editNewVarColor}
                      onChange={(e) => setEditNewVarColor(e.target.value)}
                      placeholder="Color (e.g. CNG Green)"
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5">
                      <span className="text-amber-500 text-xs font-bold">৳</span>
                      <input
                        type="number"
                        value={editNewVarPrice || ''}
                        onChange={(e) => setEditNewVarPrice(Number(e.target.value))}
                        placeholder="Price"
                        className="w-full bg-transparent text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleEditAddVariant}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition"
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 4: BADGES & STORE DISPLAY TOGGLES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block">✨ Feature in &quot;New Arrivals&quot;</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Show badge on homepage</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsNewArrival}
                    onChange={(e) => setEditIsNewArrival(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs block">🔥 Feature in &quot;Hot Deals&quot;</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Highlighted in catalog</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsFeatured}
                    onChange={(e) => setEditIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* MODAL ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes &amp; Update Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 📋 ADMINISTRATIVE ORDERS PIPELINE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Customer Orders Pipeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage order delivery confirmations, invoices, and customer contact details
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search phone or order #..."
                  className="bg-transparent text-slate-900 dark:text-white focus:outline-none text-xs w-36"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer Name</th>
                  <th className="pb-3 font-bold">Mobile Phone</th>
                  <th className="pb-3 font-bold">Items Ordered</th>
                  <th className="pb-3 font-bold">Total Bill</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                    <td className="py-3.5 font-mono font-black text-amber-600 dark:text-amber-400">{o.orderNumber}</td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{o.customerName}</td>
                    <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">{o.phone}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                      {o.items?.map((it: any) => `${it.productTitle || it.product?.title || 'Item'} (${it.quantity})`).join(', ') || 'Ordered Items'}
                    </td>
                    <td className="py-3.5 font-mono font-black text-slate-900 dark:text-white">{formatCurrency(o.totalAmount)}</td>
                    <td className="py-3.5">
                      <div className="space-y-1">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className={`border rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-amber-500 ${
                            o.orderStatus === 'CANCELLED'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                              : o.orderStatus === 'DELIVERED'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-amber-600 dark:text-amber-300'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {o.orderStatus === 'CANCELLED' && (
                          <div className="text-[10px] text-rose-500 font-bold block max-w-[150px] truncate" title={o.cancelReason || 'Product not in stock / not delivered'}>
                            ⚠ {o.cancelReason || 'Out of Stock / Cancelled'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition"
                          title="View order details and invoices"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/15 border border-rose-500/20 transition"
                          title="Delete order request (when product not delivered or out of stock)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER PRODUCT REQUESTS */}
      {activeTab === 'requests' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                Customer Product Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Manage requests submitted by customers; add to catalog or dismiss out-of-stock items
              </p>
            </div>
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold rounded-lg">
              {productRequests.length} Requests
            </span>
          </div>

          <div className="space-y-4">
            {productRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">{req.productName}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        {req.brand || 'Any Brand'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Requested by: <strong className="text-slate-900 dark:text-white">{req.customerName}</strong> • Phone:{' '}
                      <a href={`tel:${req.phone}`} className="text-cyan-600 dark:text-cyan-400 hover:underline font-mono">
                        {req.phone}
                      </a>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleConvertRequestToProduct(req)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1 shadow"
                      title="Add this product to store catalog"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> + Add to Shop
                    </button>
                    <button
                      onClick={() => handleDeleteProductRequest(req.id)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      title="Delete / Dismiss request (e.g. not in stock or cannot procure)"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                </div>

                {req.notes && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic">
                    &quot;{req.notes}&quot;
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                  <span>Requested on: {new Date(req.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <a
                    href={`https://wa.me/88${req.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Smartphone className="w-3 h-3" /> WhatsApp Customer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NEW ARRIVALS */}
      {activeTab === 'new_arrivals' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                Featured New Arrivals in Shop
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Products highlighted on the homepage</p>
            </div>
            <button
              onClick={() => setActiveTab('add_product')}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>

          {productsList.filter((p) => p.isNewArrival).length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
              <Flame className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No products tagged as &quot;New Arrival&quot; yet.</p>
              <button
                onClick={() => setActiveTab('add_product')}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition"
              >
                + Add New Arrival with Camera
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsList.filter((p) => p.isNewArrival).map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-center">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase">
                      New Arrival
                    </span>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white truncate mt-1">{item.title}</h3>
                    <div className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">{formatCurrency(item.basePrice)}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.stock} in stock</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SETTINGS & THEME MODE */}
      {activeTab === 'settings' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Store Settings &amp; Appearance Mode
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure Day / Night mode, store branding, delivery fee, and manager contact numbers
              </p>
            </div>
            <button
              onClick={handleExportOrdersJSON}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" /> Export Orders Backup
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* 1. APPEARANCE MODE */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sun className="w-4 h-4" /> 1. Appearance Mode (Day vs. Night)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Active: {storeSettings.themeMode === 'day' ? '☀️ Day Mode (Light)' : '🌙 Night Mode (Dark)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleApplyThemeMode('night')}
                  className={`p-4 rounded-2xl border text-left transition flex items-center gap-3.5 ${
                    storeSettings.themeMode === 'night'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md ring-2 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center font-black shrink-0">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-sm font-black text-slate-900 dark:text-white block">🌙 Night Mode (Dark Luxe)</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Deep obsidian background with golden accents</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyThemeMode('day')}
                  className={`p-4 rounded-2xl border text-left transition flex items-center gap-3.5 ${
                    storeSettings.themeMode === 'day'
                      ? 'border-amber-500 bg-amber-500/15 text-amber-600 shadow-md ring-2 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 text-amber-600 flex items-center justify-center font-black shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-sm font-black text-slate-900 dark:text-white block">☀️ Day Mode (Clean Light)</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Bright, high-contrast daytime store theme</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. STORE CONTACT & IDENTITY */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] block border-b border-slate-200 dark:border-slate-800 pb-2">
                2. Store Identity &amp; Contact Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-800 dark:text-slate-300 font-bold mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-300 font-bold mb-1">Store Tagline *</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.tagline}
                    onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-300 font-bold mb-1">Manager Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.managerName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, managerName: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 dark:text-slate-300 font-bold mb-1">Hotline &amp; WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={storeSettings.hotline}
                    onChange={(e) => setStoreSettings({ ...storeSettings, hotline: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-2xl text-sm transition shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-5 h-5" /> Save Store Settings
            </button>
          </form>
        </div>
      )}

      {/* 100% ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Order Details: {selectedOrder.orderNumber}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px]">Customer Information</div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{selectedOrder.customerName}</div>
                <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-500" /> {selectedOrder.phone}
                </div>
                {selectedOrder.notes && (
                  <div className="text-slate-500 italic pt-1">
                    &quot;{selectedOrder.notes}&quot;
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px]">Delivery Address</div>
                <div className="text-slate-800 dark:text-slate-200">{selectedOrder.deliveryAddress}</div>
                <div className="text-slate-500">
                  Thana: <strong className="text-slate-800 dark:text-slate-200">{selectedOrder.thana}</strong>, {selectedOrder.district}
                </div>
              </div>
            </div>

            {/* Cancellation / Out of Stock Reason Notice */}
            {selectedOrder.orderStatus === 'CANCELLED' && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs space-y-1">
                <div className="font-black flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4" /> Order Request Cancelled / Not Delivered
                </div>
                <p className="text-[11px] text-rose-500/90">
                  Reason: <strong className="text-rose-600 dark:text-rose-300">{selectedOrder.cancelReason || 'Product is not in physical stock or cannot be delivered.'}</strong>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Customer will see this explanation when tracking order #{selectedOrder.orderNumber}.
                </p>
              </div>
            )}

            {/* Total */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block">Payment Method:</span>
                <strong className="text-slate-900 dark:text-white uppercase">{selectedOrder.paymentMethod}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Total Bill:</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <div className="font-bold text-slate-700 dark:text-slate-300 text-xs">Items Ordered ({selectedOrder.items?.length || 0})</div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
                {selectedOrder.items?.map((item: any, idx: number) => {
                  const title = item.productTitle || item.product?.title || item.title || 'Product';
                  const variant = item.variantName || item.variant?.name;
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{title}</div>
                        {variant && <div className="text-[10px] text-amber-600 dark:text-amber-400">{variant}</div>}
                      </div>
                      <div className="text-right">
                        <div className="text-slate-600 dark:text-slate-300">{item.quantity} × {formatCurrency(item.unitPrice)}</div>
                        <div className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(item.quantity * item.unitPrice)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold">Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-600 dark:text-amber-300 font-black focus:outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Out of stock & delivery cancellation shortcuts */}
                {selectedOrder.orderStatus !== 'CANCELLED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCancelOrderWithReason(selectedOrder.id, 'Product not in stock in store')}
                      className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition"
                      title="Cancel order because product is out of stock"
                    >
                      🚫 Out of Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelOrderWithReason(selectedOrder.id, 'Product not delivered / unfulfillable')}
                      className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition"
                      title="Cancel order because product cannot be delivered"
                    >
                      🚚 Undeliverable
                    </button>
                  </>
                )}

                {/* Permanent Delete Order Request Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Permanently delete order request"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Order
                </button>

                <Link
                  href={`/track-order?query=${selectedOrder.orderNumber}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-500" /> Print Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
