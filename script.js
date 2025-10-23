// 🍔 Restaurant Management System
let cart = [];

// Default admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

// -------------------------
// ROLE SELECTION
// -------------------------
document.getElementById("roleSelect").addEventListener("change", function() {
  if (this.value === "admin") {
    document.getElementById("adminLoginFields").classList.remove("hidden");
    document.getElementById("userLoginFields").classList.add("hidden");
  } else {
    document.getElementById("adminLoginFields").classList.add("hidden");
    document.getElementById("userLoginFields").classList.remove("hidden");
  }
});

// -------------------------
// LOGIN FUNCTION
// -------------------------
function login() {
  const role = document.getElementById("roleSelect").value;

  if (role === "admin") {
    const name = document.getElementById("adminName").value.trim();
    const pass = document.getElementById("adminPass").value.trim();

    if (name === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem("loggedRole", "admin");
      showAdminDashboard();
    } else {
      alert("❌ Invalid admin credentials!");
    }

  } else {
    const userName = document.getElementById("userName").value.trim();
    const userPhone = document.getElementById("userPhone").value.trim();

    if (!userName || !userPhone) {
      alert("Please enter your name and phone number!");
      return;
    }

    if (!/^[0-9]{10}$/.test(userPhone)) {
      alert("Enter a valid 10-digit phone number!");
      return;
    }

    localStorage.setItem("loggedRole", "user");
    localStorage.setItem("loggedUser", userName);
    localStorage.setItem("loggedPhone", userPhone);

    if (!localStorage.getItem(`orders_${userPhone}`)) {
      localStorage.setItem(`orders_${userPhone}`, JSON.stringify([]));
    }

    showUserDashboard();
  }
}

function logout() {
  localStorage.removeItem("loggedRole");
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("loggedPhone");
  location.reload();
}

// -------------------------
// ON LOAD
// -------------------------
window.onload = function() {
  const role = localStorage.getItem("loggedRole");
  if (role === "admin") showAdminDashboard();
  else if (role === "user") showUserDashboard();
};

// -------------------------
// ADMIN FUNCTIONS
// -------------------------
function showAdminDashboard() {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("userDashboard").classList.add("hidden");
  document.getElementById("adminDashboard").classList.remove("hidden");
  displayAdminMenu();
}

function addMenuItem() {
  const name = document.getElementById("menuName").value.trim();
  const price = document.getElementById("menuPrice").value.trim();

  if (!name || !price) {
    alert("Please enter item name and price!");
    return;
  }

  const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
  menuItems.push({ id: Date.now(), name, price: parseFloat(price) });
  localStorage.setItem("menuItems", JSON.stringify(menuItems));

  document.getElementById("menuName").value = "";
  document.getElementById("menuPrice").value = "";
  displayAdminMenu();
}

function displayAdminMenu() {
  const menuDiv = document.getElementById("adminMenuList");
  const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];

  if (menuItems.length === 0) {
    menuDiv.innerHTML = "<p>No items added yet.</p>";
    return;
  }

  menuDiv.innerHTML = menuItems.map(item => `
    <div class="menu-card">
      <b>${item.name}</b> - ₹${item.price}
      <button onclick="deleteItem(${item.id})">Delete</button>
    </div>
  `).join('');
}

function deleteItem(id) {
  let menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];
  menuItems = menuItems.filter(i => i.id !== id);
  localStorage.setItem("menuItems", JSON.stringify(menuItems));
  displayAdminMenu();
}

// -------------------------
// USER FUNCTIONS
// -------------------------
function showUserDashboard() {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("adminDashboard").classList.add("hidden");
  document.getElementById("userDashboard").classList.remove("hidden");

  const username = localStorage.getItem("loggedUser");
  const userPhone = localStorage.getItem("loggedPhone");
  document.getElementById("userNameDisplay").textContent = username;
  document.getElementById("userPhoneDisplay").textContent = userPhone;

  displayUserMenu();
  displayCart();
  showOrderHistory();
}

function displayUserMenu() {
  const menuDiv = document.getElementById("userMenuList");
  const menuItems = JSON.parse(localStorage.getItem("menuItems")) || [];

  if (menuItems.length === 0) {
    menuDiv.innerHTML = "<p>No menu items available yet.</p>";
    return;
  }

  menuDiv.innerHTML = menuItems.map(item => `
    <div class="menu-card">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button onclick="orderItem(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
    </div>
  `).join('');
}

function orderItem(id, name, price) {
  cart.push({ id, name, price });
  displayCart();
}

function displayCart() {
  const cartDiv = document.getElementById("cartList");
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  cartDiv.innerHTML = cart.map(item => {
    total += item.price;
    return `<div>${item.name} - ₹${item.price}</div>`;
  }).join('');
  cartDiv.innerHTML += `<p><b>Total: ₹${total}</b></p>`;
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const phone = localStorage.getItem("loggedPhone");
  const orders = JSON.parse(localStorage.getItem(`orders_${phone}`)) || [];

  const newOrder = {
    date: new Date().toLocaleString(),
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price, 0)
  };

  orders.push(newOrder);
  localStorage.setItem(`orders_${phone}`, JSON.stringify(orders));

  alert("✅ Order placed successfully!");
  cart = [];
  displayCart();
  showOrderHistory();
}

function showOrderHistory() {
  const phone = localStorage.getItem("loggedPhone");
  const orders = JSON.parse(localStorage.getItem(`orders_${phone}`)) || [];
  const historyDiv = document.getElementById("orderHistory");

  if (orders.length === 0) {
    historyDiv.innerHTML = "<p>No previous orders found.</p>";
    return;
  }

  historyDiv.innerHTML = orders.map(order => `
    <div class="order-card">
      <p><b>Date:</b> ${order.date}</p>
      <p><b>Total:</b> ₹${order.total}</p>
      <ul>${order.items.map(i => `<li>${i.name} - ₹${i.price}</li>`).join('')}</ul>
    </div>
  `).join('');
}
