import os

def enhance_auth_and_panel():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Upgrade renderAuthNav to support Manager Control Panel button and Customer My Orders button directly in header
    old_auth_nav = '''    function renderAuthNav() {
      const container = document.getElementById('authNavContainer');
      if (currentUser) {
        container.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-amber-400 hidden lg:inline">Hi, ${currentUser.name.split(' ')[0]}</span>
            <button onclick="toggleAuthModal('login')" class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition">
              <i class="fa-solid fa-user-gear text-amber-400"></i> Account
            </button>
            <button onclick="handleLogout()" class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-bold transition">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        `;
        document.getElementById('custName').value = currentUser.name;
        document.getElementById('custPhone').value = currentUser.phone;
        document.getElementById('custAddress').value = currentUser.address || '';
      } else {
        container.innerHTML = `
          <button onclick="toggleAuthModal('login')" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-bold transition flex items-center gap-1.5">
            <i class="fa-solid fa-user text-amber-400"></i> Login / Register
          </button>
        `;
      }
    }'''

    new_auth_nav = '''    function renderAuthNav() {
      const container = document.getElementById('authNavContainer');
      if (currentUser) {
        const isAdmin = currentUser.role === 'ADMIN' || currentUser.phone === '01722452836' || currentUser.phone === 'Habib01722452836';
        if (isAdmin) {
          container.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-black rounded-lg hidden sm:inline flex items-center gap-1">
                <i class="fa-solid fa-shield-halved"></i> Manager: ${currentUser.name.split(' ')[0]}
              </span>
              <button onclick="openAdminPanelModal()" class="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg flex items-center gap-1.5">
                <i class="fa-solid fa-gauge-high"></i> <span class="hidden md:inline">Control Panel</span>
              </button>
              <button onclick="handleLogout()" title="Logout" class="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-bold transition">
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-[11px] font-bold rounded-lg hidden sm:inline">
                <i class="fa-solid fa-user text-amber-400 mr-1"></i> ${currentUser.name.split(' ')[0]}
              </span>
              <button onclick="toggleOrderTrackerModal()" class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold transition">
                <i class="fa-solid fa-clock-rotate-left text-amber-400"></i> My Orders
              </button>
              <button onclick="handleLogout()" title="Logout" class="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-bold transition">
                <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          `;
        }
        if (document.getElementById('custName')) document.getElementById('custName').value = currentUser.name;
        if (document.getElementById('custPhone')) document.getElementById('custPhone').value = currentUser.phone;
        if (document.getElementById('custAddress')) document.getElementById('custAddress').value = currentUser.address || '';
      } else {
        container.innerHTML = `
          <button onclick="toggleAuthModal('login')" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-bold transition flex items-center gap-1.5">
            <i class="fa-solid fa-user text-amber-400"></i> Login / Register
          </button>
        `;
      }
    }

    function openAdminPanelModal() {
      isAdminUnlocked = true;
      const modal = document.getElementById('adminPanelModal');
      modal.classList.remove('hidden');
      renderAdminTables();
    }'''

    if old_auth_nav in html:
        html = html.replace(old_auth_nav, new_auth_nav)

    # 2. Add Live Analytics Stats calculation in renderAdminTables
    old_render_admin_tables = '''    function renderAdminTables() {
      // Orders Table
      const ordersTbody = document.getElementById('adminOrdersTableBody');
      document.getElementById('orderCountBadge').innerText = `${ordersList.length} Orders`;'''

    new_render_admin_tables = '''    function renderAdminTables() {
      // Compute Live Stat Cards
      const totalRev = ordersList.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStockItems = productsData.filter(p => p.variants.some(v => v.stock < 10)).length;

      const revBadge = document.getElementById('adminStatRevenue');
      const lowStockBadge = document.getElementById('adminStatLowStock');
      if (revBadge) revBadge.innerText = `৳ ${totalRev.toLocaleString()}`;
      if (lowStockBadge) lowStockBadge.innerText = lowStockItems;

      // Orders Table
      const ordersTbody = document.getElementById('adminOrdersTableBody');
      document.getElementById('orderCountBadge').innerText = `${ordersList.length} Orders`;'''

    if old_render_admin_tables in html:
        html = html.replace(old_render_admin_tables, new_render_admin_tables)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("public/index.html", "w", encoding="utf-8") as f:
        f.write(html)

    print("Panel and auth enhancements applied successfully.")

if __name__ == "__main__":
    enhance_auth_and_panel()
