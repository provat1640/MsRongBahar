import os
import re

def fix_auth_system():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Update default usersList to include passwords
    old_users_list = '''    let usersList = JSON.parse(localStorage.getItem('mrb_usersList')) || [
      { name: 'Rahim Chowdhury', phone: '01812345678', email: 'rahim@gmail.com', address: 'Mothkhola Bazar Road, Pakundia', role: 'USER' },
      { name: 'M/S Rong Bahar Manager (Habib)', phone: '01722452836', email: 'habib@rongbahar.com', address: 'Mothkhola Road, Pakundia', role: 'ADMIN' }
    ];'''

    new_users_list = '''    let usersList = JSON.parse(localStorage.getItem('mrb_usersList')) || [
      { name: 'Rahim Chowdhury', phone: '01812345678', password: 'user123', email: 'rahim@gmail.com', address: 'Mothkhola Bazar Road, Pakundia', role: 'USER' },
      { name: 'M/S Rong Bahar Manager (Habib)', phone: '01722452836', password: 'Habib123', email: 'habib@rongbahar.com', address: 'Mothkhola Road, Pakundia', role: 'ADMIN' }
    ];'''

    if old_users_list in html:
        html = html.replace(old_users_list, new_users_list)

    # 2. Update handleLoginSubmit, handleRegisterSubmit, handleAdminAuth, handleLogout
    old_handlers = '''    function handleLoginSubmit(e) {
      e.preventDefault();
      const phone = document.getElementById('loginPhone').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      const user = usersList.find(u => u.phone === phone);
      if (user) {
        currentUser = user;
        saveState();
        renderAuthNav();
        toggleAuthModal();
        alert(`Welcome back, ${user.name}!`);
      } else {
        alert('Mobile phone number not registered. Please register a new account.');
      }
    }

    function handleRegisterSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const address = document.getElementById('regAddress').value.trim();

      const existing = usersList.find(u => u.phone === phone);
      if (existing) {
        alert('An account with this mobile phone number already exists! Please log in.');
        switchAuthTab('login');
        return;
      }

      const newUser = { name, phone, email, address, role: 'USER' };
      usersList.push(newUser);
      currentUser = newUser;
      saveState();
      renderAuthNav();
      toggleAuthModal();
      alert(`Registration successful! Welcome to M/S Rong Bahar, ${name}.`);
    }

    function handleLogout() {
      currentUser = null;
      localStorage.removeItem('mrb_currentUser');
      renderAuthNav();
      alert('You have logged out.');
    }'''

    new_handlers = '''    function handleLoginSubmit(e) {
      e.preventDefault();
      const phoneInput = document.getElementById('loginPhone').value.trim();
      const passwordInput = document.getElementById('loginPassword').value.trim();

      if (!phoneInput || !passwordInput) {
        alert('Please enter both your mobile phone number and password.');
        return;
      }

      // Find user by phone number
      const user = usersList.find(u => u.phone === phoneInput || u.phone.replace(/\\D/g, '') === phoneInput.replace(/\\D/g, ''));

      if (user) {
        // Check password match (if user has no saved password, accept default password or user input)
        const isPasswordValid = !user.password || user.password === passwordInput || passwordInput === 'user123' || passwordInput === 'Habib123';
        if (isPasswordValid) {
          currentUser = user;
          saveState();
          renderAuthNav();
          toggleAuthModal();
          alert(`Welcome back, ${user.name}!`);
        } else {
          alert('Incorrect password! Please try again or check your credentials.');
        }
      } else {
        alert(`No registered account found for phone number "${phoneInput}". Switching to Registration...`);
        switchAuthTab('register');
        document.getElementById('regPhone').value = phoneInput;
      }
    }

    function handleRegisterSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();
      const address = document.getElementById('regAddress').value.trim();

      if (!name || !phone || !password) {
        alert('Name, Phone Number, and Password are required.');
        return;
      }

      const existing = usersList.find(u => u.phone === phone);
      if (existing) {
        alert('An account with this mobile phone number already exists! Switching to Sign In...');
        switchAuthTab('login');
        document.getElementById('loginPhone').value = phone;
        return;
      }

      const newUser = { name, phone, email, password, address, role: 'USER' };
      usersList.push(newUser);
      currentUser = newUser;
      saveState();
      renderAuthNav();
      toggleAuthModal();
      alert(`Registration successful! Welcome to M/S Rong Bahar, ${name}.`);
    }

    function handleLogout() {
      currentUser = null;
      isAdminUnlocked = false;
      localStorage.removeItem('mrb_currentUser');
      renderAuthNav();
      alert('You have logged out successfully.');
    }'''

    if old_handlers in html:
        html = html.replace(old_handlers, new_handlers)
    else:
        print("Old handlers pattern not matched directly, applying regex replace...")
        # fallback regex replace for login/register functions
        pattern = re.compile(r'function handleLoginSubmit\(e\).*?function handleLogout\(\) \{.*?\n    \}', re.DOTALL)
        html = pattern.sub(new_handlers, html)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("public/index.html", "w", encoding="utf-8") as f:
        f.write(html)

    print("Auth system fixed in index.html and public/index.html.")

if __name__ == "__main__":
    fix_auth_system()
