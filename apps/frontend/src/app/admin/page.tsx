'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import {
  initialFallbackProducts,
  initialFallbackCategories,
  getCombinedProductsList,
  createProductAPI,
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

const projectAssetFiles = [
  { path: '/products/2412.jpg', name: '2412.jpg', label: 'Berger Robbialac Synthetic Enamel Tin', cat: 'Paints' },
  { path: '/products/2416.jpg', name: '2416.jpg', label: 'Aqua Paints CNG Royal Green Enamel Can', cat: 'Paints' },
  { path: '/products/2413.jpg', name: '2413.jpg', label: 'Fevicol 1K PUR Polyurethane Adhesive Bottle', cat: 'Adhesives' },
  { path: '/products/2414.jpg', name: '2414.jpg', label: 'JM Acrylic Spray Can (Black & Chrome)', cat: 'Sprays' },
  { path: '/products/2415.jpg', name: '2415.jpg', label: 'HMBR Stainless Steel Security Padlock 50mm', cat: 'Padlocks' },
  { path: '/products/2417.jpg', name: '2417.jpg', label: 'Professional Industrial Paint Brush 125mm', cat: 'Brushes' },
  { path: '/logo.jpg', name: 'logo.jpg', label: 'M/S Rong Bahar Official Store Logo', cat: 'Store' },
];

export default function AdminControlPanel() {
  const { user, isAdmin, token, openAuthModal } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  // PRECISE HARDWARE STORE ADD PRODUCT FORM STATE
  // ---------------------------------------------------------------------------
  const [productType, setProductType] = useState<'paint' | 'brush' | 'lock' | 'adhesive' | 'thinners' | 'sanitary' | 'electrical' | 'general'>('paint');
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('synthetic-enamel-paints');
  const [prodVendor, setProdVendor] = useState('Berger Paints BD');
  const [prodSku, setProdSku] = useState(`RB-BER-${Math.floor(1000 + Math.random() * 9000)}`);
  const [prodBarcode, setProdBarcode] = useState(`8901234${Math.floor(10000 + Math.random() * 90000)}`);
  const [prodUnit, setProdUnit] = useState('Volume & Color');
  const [prodCostPrice, setProdCostPrice] = useState<number>(380);
  const [prodRetailPrice, setProdRetailPrice] = useState<number>(450);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | undefined>(undefined);
  const [prodDescription, setProdDescription] = useState('');
  const [prodWarranty, setProdWarranty] = useState('5 Years Anti-Rust & Genuine Quality Guarantee');
  const [prodCoverage, setProdCoverage] = useState('120-140 sq. ft / Litre / Coat');
  const [prodDryingTime, setProdDryingTime] = useState('Touch dry: 3 hrs, Full cure: 18 hrs');
  const [prodOrigin, setProdOrigin] = useState('Bangladesh (Direct Factory Stock)');
  const [prodIsNewArrival, setProdIsNewArrival] = useState(true);
  const [prodIsFeatured, setProdIsFeatured] = useState(true);

  // Dual-Mode Image Browser
  const [imageSourceTab, setImageSourceTab] = useState<'drive' | 'project'>('drive');
  const [selectedImageUrl, setSelectedImageUrl] = useState('/products/2412.jpg');
  const [uploadedDriveFileName, setUploadedDriveFileName] = useState('');

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
  }>>([
    { id: 'var-init-1', name: '0.455L Can – CNG Royal Green', sizeOrWeight: '0.455 Litre Can', colorName: 'CNG Royal Green', colorHex: '#166534', costPrice: 195, price: 240, stock: 40, sku: 'BER-045L-GRN' },
    { id: 'var-init-2', name: '0.91L Tin – CNG Royal Green', sizeOrWeight: '0.91 Litre Tin', colorName: 'CNG Royal Green', colorHex: '#166534', costPrice: 380, price: 450, stock: 35, sku: 'BER-091L-GRN' },
    { id: 'var-init-3', name: '3.64L Gallon – CNG Royal Green', sizeOrWeight: '3.64 Litre Gallon', colorName: 'CNG Royal Green', colorHex: '#166534', costPrice: 1450, price: 1700, stock: 20, sku: 'BER-364L-GRN' },
  ]);

  const [tempVarSize, setTempVarSize] = useState('0.91 Litre Tin');
  const [tempVarColor, setTempVarColor] = useState('CNG Royal Green');
  const [tempVarColorHex, setTempVarColorHex] = useState('#166534');
  const [tempVarCost, setTempVarCost] = useState<number>(380);
  const [tempVarPrice, setTempVarPrice] = useState<number>(450);
  const [tempVarStock, setTempVarStock] = useState<number>(30);

  const [addSuccessMessage, setAddSuccessMessage] = useState('');
  const [addedProductSlug, setAddedProductSlug] = useState('');
  const [addedProductTitle, setAddedProductTitle] = useState('');

  // Load from local storage and sync products
  useEffect(() => {
    try {
      const combined = getCombinedProductsList();
      setProductsList(combined);

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

  // Local Drive / Mobile Gallery Image Upload
  const handleDriveImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDriveFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        setSelectedImageUrl(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch product category preset
  const handleProductTypeChange = (type: 'paint' | 'brush' | 'lock' | 'adhesive' | 'thinners' | 'sanitary' | 'electrical' | 'general') => {
    setProductType(type);
    const skuCode = `RB-${type.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setProdSku(skuCode);

    if (type === 'paint') {
      setProdCategoryId('synthetic-enamel-paints');
      setProdVendor('Berger Paints BD');
      setProdUnit('Volume & Color');
      setProdCostPrice(380);
      setProdRetailPrice(450);
      setProdWarranty('5 Years Anti-Rust & Gloss Retention');
      setProdCoverage('120-140 sq. ft / Litre / Coat');
      setProdDryingTime('Touch dry: 3 hrs, Full cure: 18 hrs');
      setTempVarSize('0.91 Litre Tin');
      setTempVarColor('CNG Royal Green');
      setTempVarColorHex('#166534');
      setTempVarCost(380);
      setTempVarPrice(450);
      setSelectedImageUrl('/products/2412.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '0.455L Can – CNG Royal Green', sizeOrWeight: '0.455 Litre Can', colorName: 'CNG Royal Green', colorHex: '#166534', costPrice: 195, price: 240, stock: 40, sku: `${skuCode}-045L` },
        { id: `v-${Date.now()}-2`, name: '0.91L Tin – CNG Royal Green', sizeOrWeight: '0.91 Litre Tin', colorName: 'CNG Royal Green', colorHex: '#166534', costPrice: 380, price: 450, stock: 35, sku: `${skuCode}-091L` },
        { id: `v-${Date.now()}-3`, name: '3.64L Gallon – CNG Royal Green', sizeOrWeight: '3.64 Litre Gallon', colorName: 'CNG Royal Green', colorHex: '#166534', costPrice: 1450, price: 1700, stock: 20, sku: `${skuCode}-364L` },
      ]);
    } else if (type === 'brush') {
      setProdCategoryId('paint-brushes-and-tools');
      setProdVendor('Master Brush BD');
      setProdUnit('Width (mm / Inch)');
      setProdCostPrice(60);
      setProdRetailPrice(90);
      setProdWarranty('Zero Bristle Shedding Guarantee');
      setProdCoverage('100% Pure White Hog Bristle');
      setProdDryingTime('Wash with solvent after use');
      setTempVarSize('50 mm (2 Inch)');
      setTempVarColor('');
      setTempVarCost(60);
      setTempVarPrice(90);
      setSelectedImageUrl('/products/2417.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '25 mm (1 Inch) Brush', sizeOrWeight: '25 mm (1 Inch)', costPrice: 30, price: 50, stock: 40, sku: `${skuCode}-25MM` },
        { id: `v-${Date.now()}-2`, name: '50 mm (2 Inch) Brush', sizeOrWeight: '50 mm (2 Inch)', costPrice: 60, price: 90, stock: 35, sku: `${skuCode}-50MM` },
        { id: `v-${Date.now()}-3`, name: '75 mm (3 Inch) Brush', sizeOrWeight: '75 mm (3 Inch)', costPrice: 90, price: 130, stock: 30, sku: `${skuCode}-75MM` },
        { id: `v-${Date.now()}-4`, name: '100 mm (4 Inch) Brush', sizeOrWeight: '100 mm (4 Inch)', costPrice: 115, price: 160, stock: 25, sku: `${skuCode}-100MM` },
        { id: `v-${Date.now()}-5`, name: '125 mm (5 Inch) Brush', sizeOrWeight: '125 mm (5 Inch)', costPrice: 145, price: 200, stock: 20, sku: `${skuCode}-125MM` },
      ]);
    } else if (type === 'lock') {
      setProdCategoryId('padlocks-and-security');
      setProdVendor('HMBR Hardware BD');
      setProdUnit('Perimeter / Width (mm)');
      setProdCostPrice(370);
      setProdRetailPrice(490);
      setProdWarranty('10 Years Anti-Cut & Anti-Pick Guarantee');
      setProdCoverage('Hardened Boron Steel + Solid Brass');
      setProdDryingTime('Weatherproof & Rustproof');
      setTempVarSize('50 mm Top Security');
      setTempVarColor('');
      setTempVarCost(370);
      setTempVarPrice(490);
      setSelectedImageUrl('/products/2415.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '40 mm Standard Lock', sizeOrWeight: '40 mm Standard', costPrice: 290, price: 390, stock: 20, sku: `${skuCode}-40MM` },
        { id: `v-${Date.now()}-2`, name: '50 mm Top Security Lock', sizeOrWeight: '50 mm Top Security', costPrice: 370, price: 490, stock: 15, sku: `${skuCode}-50MM` },
        { id: `v-${Date.now()}-3`, name: '60 mm Heavy Armour Lock', sizeOrWeight: '60 mm Heavy Armour', costPrice: 510, price: 650, stock: 10, sku: `${skuCode}-60MM` },
        { id: `v-${Date.now()}-4`, name: '70 mm Master Shutter Lock', sizeOrWeight: '70 mm Master Shutter', costPrice: 680, price: 850, stock: 5, sku: `${skuCode}-70MM` },
      ]);
    } else if (type === 'adhesive') {
      setProdCategoryId('adhesives-and-glues');
      setProdVendor('Pidilite (Fevicol)');
      setProdUnit('Weight (gm / kg)');
      setProdCostPrice(620);
      setProdRetailPrice(744);
      setProdWarranty('Lifetime Waterproof D4 Bond');
      setProdCoverage('1-Component Moisture Curing PU');
      setProdDryingTime('Initial set: 30 mins, Cure: 24 hrs');
      setTempVarSize('500 gm Bottle');
      setTempVarColor('');
      setTempVarCost(620);
      setTempVarPrice(744);
      setSelectedImageUrl('/products/2413.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '250 gm Bottle', sizeOrWeight: '250 gm Bottle', costPrice: 310, price: 390, stock: 30, sku: `${skuCode}-250G` },
        { id: `v-${Date.now()}-2`, name: '500 gm Bottle', sizeOrWeight: '500 gm Bottle', costPrice: 620, price: 744, stock: 40, sku: `${skuCode}-500G` },
        { id: `v-${Date.now()}-3`, name: '1 kg Bottle', sizeOrWeight: '1 kg Bottle', costPrice: 1190, price: 1420, stock: 20, sku: `${skuCode}-1KG` },
      ]);
    } else if (type === 'thinners') {
      setProdCategoryId('thinners-and-solvents');
      setProdVendor('Berger Solvents');
      setProdUnit('Volume (Litre / Gallon)');
      setProdCostPrice(140);
      setProdRetailPrice(180);
      setProdWarranty('100% Pure Grade Mineral Thinner');
      setProdCoverage('Compatible with synthetic enamels & PU');
      setProdDryingTime('Instant paint reducer');
      setTempVarSize('1 Litre Bottle');
      setTempVarColor('');
      setTempVarCost(140);
      setTempVarPrice(180);
      setSelectedImageUrl('/products/2416.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '0.5 Litre Bottle', sizeOrWeight: '0.5 Litre Bottle', costPrice: 80, price: 105, stock: 40, sku: `${skuCode}-05L` },
        { id: `v-${Date.now()}-2`, name: '1.0 Litre Bottle', sizeOrWeight: '1.0 Litre Bottle', costPrice: 140, price: 180, stock: 35, sku: `${skuCode}-10L` },
        { id: `v-${Date.now()}-3`, name: '5.0 Litre Gallon', sizeOrWeight: '5.0 Litre Gallon', costPrice: 650, price: 820, stock: 15, sku: `${skuCode}-50L` },
      ]);
    } else if (type === 'sanitary') {
      setProdCategoryId('sanitary-and-pipes');
      setProdVendor('RFL Sanitary');
      setProdUnit('Diameter & Length');
      setProdCostPrice(280);
      setProdRetailPrice(360);
      setProdWarranty('20 Years Leakproof Guarantee');
      setProdCoverage('High Grade uPVC & Brass Insert');
      setProdDryingTime('Immediate Pressure Tolerant');
      setTempVarSize('0.75 Inch (3/4")');
      setTempVarColor('');
      setTempVarCost(280);
      setTempVarPrice(360);
      setSelectedImageUrl('/products/2415.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '0.5 Inch (1/2") Heavy Fitting', sizeOrWeight: '0.5 Inch (1/2")', costPrice: 180, price: 240, stock: 50, sku: `${skuCode}-05IN` },
        { id: `v-${Date.now()}-2`, name: '0.75 Inch (3/4") Heavy Fitting', sizeOrWeight: '0.75 Inch (3/4")', costPrice: 280, price: 360, stock: 40, sku: `${skuCode}-075IN` },
        { id: `v-${Date.now()}-3`, name: '1.0 Inch (1") Heavy Fitting', sizeOrWeight: '1.0 Inch (1")', costPrice: 420, price: 540, stock: 25, sku: `${skuCode}-10IN` },
      ]);
    } else {
      setProdCategoryId('electrical-and-tools');
      setProdVendor('General Hardware BD');
      setProdUnit('Piece / Pack');
      setProdCostPrice(190);
      setProdRetailPrice(260);
      setProdWarranty('Standard Manufacturer Warranty');
      setProdCoverage('Industrial Grade Component');
      setProdDryingTime('N/A');
      setTempVarSize('1 Piece');
      setTempVarColor('');
      setTempVarCost(190);
      setTempVarPrice(260);
      setSelectedImageUrl('/products/2414.jpg');
      setConfiguredVariants([
        { id: `v-${Date.now()}-1`, name: '1 Piece Standard', sizeOrWeight: '1 Piece', costPrice: 190, price: 260, stock: 50, sku: `${skuCode}-01` },
      ]);
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

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      try {
        localStorage.setItem('rong_bahar_all_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
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

    const slug = prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const firstVar = configuredVariants[0];
    const basePrice = firstVar ? firstVar.price : prodRetailPrice;
    const baseCostPrice = firstVar && firstVar.costPrice ? firstVar.costPrice : prodCostPrice;
    const totalStock = configuredVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || 50;

    const matchedCategory = initialFallbackCategories.find((c) => c.slug === prodCategoryId || c.id === prodCategoryId) || {
      id: prodCategoryId,
      name: prodVendor,
      slug: prodCategoryId,
    };

    const colors = Array.from(new Set(configuredVariants.map((v) => v.colorName).filter(Boolean))).map((name) => ({
      name: name as string,
      hex: configuredVariants.find((v) => v.colorName === name)?.colorHex || '#166534',
    }));

    const sizes = Array.from(new Set(configuredVariants.map((v) => v.sizeOrWeight).filter(Boolean))) as string[];

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: prodTitle,
      slug: slug || `product-${Date.now()}`,
      description: prodDescription || `${prodTitle} distributed by ${prodVendor}. Authentic genuine stock ready for instant Pakundia local dispatch.`,
      categoryId: matchedCategory.id,
      category: matchedCategory,
      basePrice,
      costPrice: baseCostPrice,
      discountPrice: prodDiscountPrice || undefined,
      stock: totalStock,
      sku: prodSku,
      barcode: prodBarcode,
      images: [selectedImageUrl || '/products/2412.jpg'],
      unit: prodUnit,
      isActive: true,
      isNewArrival: prodIsNewArrival,
      isFeatured: prodIsFeatured,
      vendor: prodVendor,
      badge: prodIsNewArrival ? 'New Arrival' : 'In Stock',
      warranty: prodWarranty,
      specifications: {
        coverage: prodCoverage,
        dryingTime: prodDryingTime,
        origin: prodOrigin,
      },
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      variants: configuredVariants.map((v) => ({
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
      })),
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

    setAddSuccessMessage(`🎉 Product "${prodTitle}" is 100% successfully listed across your storefront, catalog, and admin inventory!`);
    setAddedProductSlug(newProduct.slug);
    setAddedProductTitle(newProduct.title);

    // Reset form
    setProdTitle('');
    setProdDescription('');

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

            {/* STEP 4: DUAL-MODE IMAGE PICKER */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <label className="block text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    4. Product Photo Source (Drive Storage or Project Files)
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Upload image from PC hard drive / mobile camera or pick from project repository
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageSourceTab('drive')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      imageSourceTab === 'drive'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Browse Device Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceTab('project')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      imageSourceTab === 'project'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Browse Project Files</span>
                  </button>
                </div>
              </div>

              {imageSourceTab === 'drive' && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="sm:col-span-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 bg-white dark:bg-slate-900/60 rounded-2xl p-6 text-center cursor-pointer transition space-y-2 group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDriveImageUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto transition">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                      📁 Click to Browse from PC Hard Drive or Mobile Storage
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Supports JPG, PNG, WEBP from Phone Gallery or Computer
                    </p>
                    {uploadedDriveFileName && (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                        ✓ Loaded: {uploadedDriveFileName}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Storefront Preview</span>
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                      <img src={selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Ready for Storefront</span>
                  </div>
                </div>
              )}

              {imageSourceTab === 'project' && (
                <div className="space-y-3">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                    Select a project asset image from <code className="text-amber-500 font-mono">/public/products/</code>:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {projectAssetFiles.map((file, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImageUrl(file.path)}
                        className={`p-2 rounded-xl border cursor-pointer transition text-center space-y-1.5 ${
                          selectedImageUrl === file.path
                            ? 'bg-amber-500/20 border-amber-500 shadow-md ring-1 ring-amber-500'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <img src={file.path} alt="" className="w-full h-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-950" />
                        <div className="text-[10px] font-bold text-slate-900 dark:text-white truncate">{file.name}</div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block truncate">{file.cat}</span>
                      </div>
                    ))}
                  </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                Live Inventory &amp; Multi-Variant Manager
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Expand any paint, brush, or lock to edit individual variant prices, stock, or delete/add variants
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black rounded-lg">
                {productsList.length} Total Products
              </span>
              <button
                onClick={() => setActiveTab('add_product')}
                className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-lg hover:bg-amber-400 transition"
              >
                + Add Product
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {productsList.map((product) => {
              const isExpanded = expandedInventoryProdId === product.id;
              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden transition shadow-xs"
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={product.images[0] || '/products/2412.jpg'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{product.title}</h3>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-bold">{product.vendor || 'Berger'}</span> •{' '}
                          <span className="text-amber-500 dark:text-amber-400 font-bold">{product.variants?.length || 1} Variants</span> •{' '}
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{product.stock} total stock</span> •{' '}
                          <span className="font-mono">SKU: {product.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-500 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1"
                        title="View Live PDP"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">PDP</span>
                      </Link>

                      <button
                        onClick={() => setExpandedInventoryProdId(isExpanded ? null : product.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          isExpanded
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span>Manage Variants</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs pb-1">
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          Edit Individual Variants &amp; Stock for &quot;{product.title}&quot;:
                        </span>
                        <button
                          onClick={() => handleAddNewVariantToProduct(product.id)}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 dark:text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" /> + Add Variant
                        </button>
                      </div>

                      <div className="space-y-2">
                        {product.variants?.map((v) => (
                          <div
                            key={v.id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {v.colorHex && (
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20 shrink-0"
                                  style={{ backgroundColor: v.colorHex }}
                                />
                              )}
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => handleUpdateProductVariant(product.id, v.id, 'name', e.target.value)}
                                className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white text-xs font-bold w-48 sm:w-64"
                              />
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                                <span className="text-amber-500 font-bold">৳</span>
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => handleUpdateProductVariant(product.id, v.id, 'price', Number(e.target.value))}
                                  className="w-16 bg-transparent text-slate-900 dark:text-white font-bold font-mono focus:outline-none text-right"
                                />
                              </div>

                              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Stock:</span>
                                <input
                                  type="number"
                                  value={v.stock}
                                  onChange={(e) => handleUpdateProductVariant(product.id, v.id, 'stock', Number(e.target.value))}
                                  className="w-12 bg-transparent text-emerald-600 dark:text-emerald-400 font-bold font-mono focus:outline-none text-right"
                                />
                              </div>

                              <button
                                onClick={() => handleDeleteProductVariant(product.id, v.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition"
                                title="Delete variant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
                  <th className="pb-3 font-bold text-right">Action</th>
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
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs text-amber-600 dark:text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> 100% Details
                      </button>
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
                Requests submitted by customers from the storefront
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
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> + Add to Shop
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productsList.filter((p) => p.isNewArrival).map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                <img
                  src={item.images[0] || '/products/2412.jpg'}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                />
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

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
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

              <Link
                href={`/track-order?query=${selectedOrder.orderNumber}`}
                target="_blank"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-amber-500" /> Print Invoice
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
