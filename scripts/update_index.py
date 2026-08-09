import os
import re

def main():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Update Header Buttons
    target_header = '''      <!-- Action Buttons -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Paint Calculator Trigger -->
        <button 
          onclick="togglePaintCalcModal()"
          class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition"
          title="Paint Quantity Calculator"
        >
          <i class="fa-solid fa-calculator"></i> Paint Calc
        </button>

        <!-- Request Unlisted Product Button -->
        <button 
          onclick="toggleProductRequestModal()"
          class="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition"
        >
          <i class="fa-solid fa-clipboard-question text-amber-400"></i> Request Item
        </button>'''

    new_header = '''      <!-- Action Buttons -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Live Order Tracker Button -->
        <button 
          onclick="toggleOrderTrackerModal()"
          class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition"
          title="Track Live Order Status & Print Receipts"
        >
          <i class="fa-solid fa-truck-fast text-amber-400"></i> <span class="hidden xl:inline">Track Order</span>
        </button>

        <!-- Wishlist Saved Items Button -->
        <button 
          onclick="toggleWishlistModal()"
          class="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-bold transition"
          title="Saved Favorites"
        >
          <i class="fa-solid fa-heart text-rose-500"></i>
          <span class="hidden md:inline">Wishlist</span>
          <span id="wishlistCountBadge" class="bg-rose-500/20 text-rose-400 text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center">0</span>
        </button>

        <!-- Full Paint Color Visualizer Modal Trigger -->
        <button 
          onclick="toggleColorVisualizerModal()"
          class="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition"
          title="Interactive Room Wall Color Visualizer"
        >
          <i class="fa-solid fa-palette text-amber-400"></i> Color Visualizer
        </button>

        <!-- Paint Calculator Trigger -->
        <button 
          onclick="togglePaintCalcModal()"
          class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition"
          title="Paint Quantity Calculator"
        >
          <i class="fa-solid fa-calculator"></i> Paint Calc
        </button>

        <!-- Request Unlisted Product Button -->
        <button 
          onclick="toggleProductRequestModal()"
          class="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition"
        >
          <i class="fa-solid fa-clipboard-question text-amber-400"></i> Request Item
        </button>'''

    if target_header in html:
        html = html.replace(target_header, new_header)

    # 2. Inject Modals right before </body>
    modals_code = '''
  <!-- 1. Live Order Tracker & Receipt Generator Modal -->
  <div id="orderTrackerModal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onclick="toggleOrderTrackerModal()"></div>
    <div class="relative max-w-lg mx-auto my-10 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <i class="fa-solid fa-truck-fast text-lg"></i>
          </div>
          <div>
            <h3 class="font-display text-lg font-bold text-white">Live Order Tracking & Receipt</h3>
            <p class="text-[11px] text-amber-400">Track delivery status or print official invoice</p>
          </div>
        </div>
        <button onclick="toggleOrderTrackerModal()" class="text-slate-400 hover:text-white text-xl">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="space-y-4 text-xs">
        <div class="flex gap-2">
          <input type="text" id="trackOrderInput" placeholder="Enter Order ID (e.g. ORD-9821) or Mobile Phone" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500" />
          <button onclick="trackOrderLookup()" class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition">
            <i class="fa-solid fa-magnifying-glass"></i> Track
          </button>
        </div>

        <div id="trackOrderResult" class="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <p class="text-slate-400 text-center italic py-4">Enter your Order ID above to view live dispatch timeline & print receipt.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Customer Wishlist Modal -->
  <div id="wishlistModal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onclick="toggleWishlistModal()"></div>
    <div class="relative max-w-lg mx-auto my-10 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
            <i class="fa-solid fa-heart text-lg"></i>
          </div>
          <div>
            <h3 class="font-display text-lg font-bold text-white">Your Saved Wishlist</h3>
            <p class="text-[11px] text-rose-400">Saved paints & hardware items for your projects</p>
          </div>
        </div>
        <button onclick="toggleWishlistModal()" class="text-slate-400 hover:text-white text-xl">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div id="wishlistItemsContainer" class="space-y-3 max-h-96 overflow-y-auto pr-1">
        <!-- Dynamic Wishlist Items -->
      </div>
    </div>
  </div>

  <!-- 3. Side-by-Side Product Comparison Drawer Modal -->
  <div id="productCompareModal" class="fixed inset-0 z-50 hidden overflow-y-auto">
    <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md" onclick="toggleCompareModal()"></div>
    <div class="relative max-w-4xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <i class="fa-solid fa-code-compare text-lg"></i>
          </div>
          <div>
            <h3 class="font-display text-lg font-bold text-white">Side-by-Side Product Comparison</h3>
            <p class="text-[11px] text-amber-400">Compare specs, warranty, washability & prices</p>
          </div>
        </div>
        <button onclick="toggleCompareModal()" class="text-slate-400 hover:text-white text-xl">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div id="compareTableContainer" class="overflow-x-auto">
        <!-- Dynamic Comparison Table -->
      </div>
    </div>
  </div>

  <!-- 4. Full Interactive Room Wall Color Visualizer Modal -->
  <div id="colorVisualizerModal" class="fixed inset-0 z-50 hidden overflow-y-auto">
    <div class="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onclick="toggleColorVisualizerModal()"></div>
    <div class="relative max-w-4xl mx-auto my-6 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 space-y-6">
      <div class="flex items-center justify-between border-b border-slate-800 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <i class="fa-solid fa-palette text-xl"></i>
          </div>
          <div>
            <h3 class="font-display text-xl font-black text-white">Interactive Room Paint Color Visualizer</h3>
            <p class="text-xs text-amber-400 font-semibold">Test real Bangladesh paint shades live on room walls</p>
          </div>
        </div>
        <button onclick="toggleColorVisualizerModal()" class="text-slate-400 hover:text-white text-2xl">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Visualizer Canvas Room Previewer -->
        <div class="lg:col-span-7 space-y-4">
          <div id="fullVisualizerRoom" class="h-64 sm:h-80 rounded-2xl p-6 transition-all duration-500 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10" style="background-color: #059669;">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/15"></div>
            
            <div class="relative z-10 flex items-center justify-between">
              <span id="fullVisualizerRoomTag" class="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full text-xs font-black">
                <i class="fa-solid fa-couch mr-1.5"></i> Living Room Facade
              </span>
              <span id="fullVisualizerFinishTag" class="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                Silk Sheen Finish
              </span>
            </div>

            <div class="relative z-10 bg-slate-950/75 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center space-y-1">
              <h4 id="fullVisualizerShadeTitle" class="text-lg font-black text-white">CNG Green (Berger / Aqua)</h4>
              <p id="fullVisualizerShadeHex" class="text-xs font-mono text-amber-400">HEX Code: #059669</p>
            </div>
          </div>

          <!-- Room Environment Switcher -->
          <div class="flex items-center justify-center gap-2 text-xs font-bold">
            <span class="text-slate-400">Room Type:</span>
            <button onclick="setVisualizerRoom('Living Room', 'fa-couch')" class="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black shadow">Living Room</button>
            <button onclick="setVisualizerRoom('Exterior Facade', 'fa-building')" class="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white">Exterior</button>
            <button onclick="setVisualizerRoom('Wooden Door', 'fa-door-closed')" class="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white">Wooden Door</button>
          </div>
        </div>

        <!-- Right Color Palette Swatches -->
        <div class="lg:col-span-5 space-y-4">
          <h4 class="text-xs font-extrabold text-slate-300 uppercase tracking-wider"><i class="fa-solid fa-swatchbook text-amber-400 mr-1.5"></i> Select Paint Shade Swatch:</h4>
          
          <div class="grid grid-cols-2 gap-2 text-xs font-bold max-h-64 overflow-y-auto pr-1">
            <button onclick="applyFullVisualizerColor('#059669', 'CNG Green', 'Berger / Aqua')" class="p-2.5 rounded-xl bg-emerald-700 text-white hover:scale-102 transition text-left flex items-center gap-2 border border-emerald-500/40">
              <span class="w-4 h-4 rounded-full bg-emerald-500 border border-white"></span> CNG Green
            </button>
            <button onclick="applyFullVisualizerColor('#f8fafc', 'Brill White', 'Berger Silk / Aqua Superstar')" class="p-2.5 rounded-xl bg-slate-100 text-slate-950 hover:scale-102 transition text-left flex items-center gap-2 border border-slate-300">
              <span class="w-4 h-4 rounded-full bg-white border border-slate-400"></span> Brill White
            </button>
            <button onclick="applyFullVisualizerColor('#1d4ed8', 'Royal Sapphire Blue', 'Berger Luxury')" class="p-2.5 rounded-xl bg-blue-700 text-white hover:scale-102 transition text-left flex items-center gap-2 border border-blue-500/40">
              <span class="w-4 h-4 rounded-full bg-blue-500 border border-white"></span> Royal Blue
            </button>
            <button onclick="applyFullVisualizerColor('#dc2626', 'Crimson Red', 'WeatherCoat Supreme')" class="p-2.5 rounded-xl bg-red-700 text-white hover:scale-102 transition text-left flex items-center gap-2 border border-red-500/40">
              <span class="w-4 h-4 rounded-full bg-red-500 border border-white"></span> Crimson Red
            </button>
            <button onclick="applyFullVisualizerColor('#d97706', 'Golden Amber Wheat', 'Aqua Muslin')" class="p-2.5 rounded-xl bg-amber-700 text-white hover:scale-102 transition text-left flex items-center gap-2 border border-amber-500/40">
              <span class="w-4 h-4 rounded-full bg-amber-500 border border-white"></span> Golden Wheat
            </button>
            <button onclick="applyFullVisualizerColor('#0d9488', 'Ocean Teal', 'Robbialac Enamel')" class="p-2.5 rounded-xl bg-teal-700 text-white hover:scale-102 transition text-left flex items-center gap-2 border border-teal-500/40">
              <span class="w-4 h-4 rounded-full bg-teal-500 border border-white"></span> Ocean Teal
            </button>
            <button onclick="applyFullVisualizerColor('#f59e0b', 'Sunburst Yellow', 'Jhilik Enamel')" class="p-2.5 rounded-xl bg-amber-500 text-slate-950 hover:scale-102 transition text-left flex items-center gap-2 border border-amber-300">
              <span class="w-4 h-4 rounded-full bg-yellow-400 border border-slate-900"></span> Sunburst Yellow
            </button>
            <button onclick="applyFullVisualizerColor('#475569', 'Charcoal Slate', 'WeatherCoat Smooth')" class="p-2.5 rounded-xl bg-slate-700 text-white hover:scale-102 transition text-left flex items-center gap-2 border border-slate-500">
              <span class="w-4 h-4 rounded-full bg-slate-500 border border-white"></span> Charcoal Slate
            </button>
          </div>

          <button onclick="orderCurrentVisualizerShade()" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl transition">
            <i class="fa-solid fa-cart-plus text-base"></i> Add Paint Product for this Shade to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
'''

    if "<!-- 1. Live Order Tracker" not in html:
        html = html.replace("</body>", modals_code + "\n</body>")

    # 3. Add JS state and functions right before </script>
    js_code = '''
    // === ENHANCED SCALABLE & ROBUST STOREFRONT LOGIC ===
    let wishlistList = JSON.parse(localStorage.getItem('mrb_wishlist')) || [];
    let compareList = [];
    let activeSortOption = 'default';
    let activeQuickFilter = 'all';
    let currentVisualizerShadeName = 'CNG Green';

    // Wishlist Functions
    function toggleWishlist(productId) {
      const idx = wishlistList.indexOf(productId);
      if (idx !== -1) {
        wishlistList.splice(idx, 1);
      } else {
        wishlistList.push(productId);
      }
      localStorage.setItem('mrb_wishlist', JSON.stringify(wishlistList));
      updateWishlistBadge();
      renderProducts();
    }

    function updateWishlistBadge() {
      const badge = document.getElementById('wishlistCountBadge');
      if (badge) badge.innerText = wishlistList.length;
    }

    function toggleWishlistModal() {
      const modal = document.getElementById('wishlistModal');
      modal.classList.toggle('hidden');
      if (!modal.classList.contains('hidden')) renderWishlistItems();
    }

    function renderWishlistItems() {
      const container = document.getElementById('wishlistItemsContainer');
      const items = productsData.filter(p => wishlistList.includes(p.id));

      if (items.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-center py-6 text-xs">No saved wishlist items yet. Click the heart icon on any product to save it!</p>`;
        return;
      }

      container.innerHTML = items.map(product => `
        <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <img src="${product.image}" class="w-12 h-12 rounded-xl object-cover" />
          <div class="flex-1">
            <h4 class="font-bold text-white line-clamp-1">${product.title}</h4>
            <p class="text-[11px] text-amber-400">৳ ${product.variants[0].price}</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="addToCart(${product.id})" class="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-xs">Add to Cart</button>
            <button onclick="toggleWishlist(${product.id}); renderWishlistItems();" class="text-rose-400 text-sm px-1"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `).join('');
    }

    // Side-by-Side Product Comparison Functions
    function toggleCompare(productId) {
      const idx = compareList.indexOf(productId);
      if (idx !== -1) {
        compareList.splice(idx, 1);
      } else {
        if (compareList.length >= 3) {
          alert('You can compare up to 3 products at a time.');
          return;
        }
        compareList.push(productId);
      }
      document.getElementById('compareBadgeCount').innerText = compareList.length;
      renderProducts();
    }

    function toggleCompareModal() {
      const modal = document.getElementById('productCompareModal');
      modal.classList.toggle('hidden');
      if (!modal.classList.contains('hidden')) renderCompareTable();
    }

    function renderCompareTable() {
      const container = document.getElementById('compareTableContainer');
      const items = productsData.filter(p => compareList.includes(p.id));

      if (items.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-center py-6 text-xs">No products selected for comparison. Click "Compare" on product cards!</p>`;
        return;
      }

      container.innerHTML = `
        <table class="w-full text-xs text-left text-slate-300 border-collapse">
          <thead>
            <tr class="border-b border-slate-800">
              <th class="p-3 text-slate-400">Feature / Spec</th>
              ${items.map(item => `
                <th class="p-3 font-bold text-amber-400 text-sm max-w-xs">
                  <div class="space-y-1">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl border border-slate-800" />
                    <span>${item.title}</span>
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr>
              <td class="p-3 font-bold text-white">Brand</td>
              ${items.map(item => `<td class="p-3 text-amber-400 font-bold">${item.brand}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Category</td>
              ${items.map(item => `<td class="p-3">${item.category}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Starting Price</td>
              ${items.map(item => `<td class="p-3 text-emerald-400 font-extrabold">৳ ${item.variants[0].price}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Key Specifications</td>
              ${items.map(item => `<td class="p-3 text-slate-300">${item.specs}</td>`).join('')}
            </tr>
            <tr>
              <td class="p-3 font-bold text-white">Action</td>
              ${items.map(item => `
                <td class="p-3">
                  <button onclick="addToCart(${item.id})" class="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-xs">Add to Cart</button>
                </td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      `;
    }

    // Catalog Quick Filters & Sorting
    function setSortOption(val) {
      activeSortOption = val;
      renderProducts();
    }

    function setQuickFilter(filter, btnEl) {
      activeQuickFilter = filter;
      ['qfAllBtn', 'qfInStockBtn', 'qfBudgetBtn'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.className = "px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 transition font-bold text-xs";
      });
      if (btnEl) btnEl.className = "px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs transition";
      renderProducts();
    }

    // Order Tracking & Receipt Generator Lookup
    function toggleOrderTrackerModal() {
      document.getElementById('orderTrackerModal').classList.toggle('hidden');
    }

    function trackOrderLookup() {
      const q = document.getElementById('trackOrderInput').value.trim().toLowerCase();
      const res = document.getElementById('trackOrderResult');

      if (!q) {
        res.innerHTML = `<p class="text-rose-400 text-center py-2">Please enter an Order ID or Mobile Number.</p>`;
        return;
      }

      const match = ordersList.find(o => o.id.toLowerCase() === q || o.phone.includes(q));

      if (!match) {
        res.innerHTML = `<p class="text-amber-400 text-center py-4">No matching order found for "${q}". Please check your receipt.</p>`;
        return;
      }

      res.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span class="font-extrabold text-amber-400 text-sm">${match.id}</span>
              <p class="text-[11px] text-slate-400">Customer: ${match.customerName} (${match.phone})</p>
            </div>
            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">${match.status}</span>
          </div>

          <div class="text-slate-300 text-xs space-y-1">
            <p><strong>Items:</strong> ${match.items}</p>
            <p><strong>Delivery Address:</strong> ${match.address}</p>
            <p><strong>Total Amount:</strong> <span class="text-emerald-400 font-bold">৳ ${match.total}</span></p>
          </div>

          <div class="pt-2 border-t border-slate-800 flex justify-end">
            <button onclick="printOrderInvoice('${match.id}')" class="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow">
              <i class="fa-solid fa-print"></i> Print Official Receipt
            </button>
          </div>
        </div>
      `;
    }

    function printOrderInvoice(orderId) {
      const ord = ordersList.find(o => o.id === orderId);
      if (!ord) return;

      const printWin = window.open('', '_blank', 'width=600,height=700');
      printWin.document.write(`
        <html>
          <head>
            <title>Official Invoice - ${ord.id} - M/S RONG BAHAR</title>
            <style>
              body { font-family: sans-serif; padding: 20px; color: #111; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
              .info { margin: 20px 0; font-size: 14px; }
              .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              .table th, .table td { border: 1px solid #ccc; padding: 8px; font-size: 13px; text-align: left; }
              .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 15px; }
              .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #555; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>M/S RONG BAHAR</h2>
              <p>Paint & Hardware Supplies • Mothkhola Road, Pakundia, Kishoreganj</p>
              <p>Hotline: 01722452836</p>
            </div>
            <div class="info">
              <p><strong>Order ID:</strong> ${ord.id}</p>
              <p><strong>Customer Name:</strong> ${ord.customerName}</p>
              <p><strong>Mobile Phone:</strong> ${ord.phone}</p>
              <p><strong>Delivery Address:</strong> ${ord.address}</p>
              <p><strong>Status:</strong> ${ord.status}</p>
            </div>
            <table class="table">
              <thead>
                <tr><th>Items Description</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td>${ord.items}</td><td>৳ ${ord.total}</td></tr>
              </tbody>
            </table>
            <div class="total">Total Bill: ৳ ${ord.total}</div>
            <div class="footer">
              <p>Thank you for shopping with M/S Rong Bahar!</p>
            </div>
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.print();
    }

    // Color Visualizer Modal Functions
    function toggleColorVisualizerModal() {
      document.getElementById('colorVisualizerModal').classList.toggle('hidden');
    }

    function applyFullVisualizerColor(hex, shadeName, brandInfo) {
      const room = document.getElementById('fullVisualizerRoom');
      room.style.backgroundColor = hex;
      currentVisualizerShadeName = shadeName;
      document.getElementById('fullVisualizerShadeTitle').innerText = `${shadeName} (${brandInfo})`;
      document.getElementById('fullVisualizerShadeHex').innerText = `HEX Code: ${hex}`;
    }

    function setVisualizerRoom(type, icon) {
      document.getElementById('fullVisualizerRoomTag').innerHTML = `<i class="fa-solid ${icon} mr-1.5"></i> ${type}`;
    }

    function orderCurrentVisualizerShade() {
      toggleColorVisualizerModal();
      setSearchFilter(currentVisualizerShadeName.split(' ')[0]);
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateWishlistBadge();
    });
'''

    if "// === ENHANCED SCALABLE" not in html:
        html = html.replace("</script>", js_code + "\n  </script>")

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("public/index.html", "w", encoding="utf-8") as f:
        f.write(html)

    print("Index updated with all 4 modals and JS logic.")

if __name__ == "__main__":
    main()
