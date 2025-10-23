// ------------------------------
// 🍽️ Restaurant Management System
// ------------------------------

// 🛒 Cart array (temporary)
let cart = [];

// ✅ When page loads
window.onload = function() {
  const username = localStorage.getItem("loggedUser");
  if (username) {
    loadUserInterface();
  } else {
    document.getElementById("loginSection").style.display = "block";
  }
};

// ------------------------------
// 🔐 LOGIN / LOGOUT SYSTEM
// ------------------------------
function loginUser() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    alert("Please enter your name to login!");
    return;
  }

  localStorage.setItem("loggedUser", username);

  // Create order history if not exists
  if (!localStorage.getItem(`orders_${username}`)) {
    localStorage.setItem(`orders_${username}`, JSON.stringify([]));
  }

  loadUserInterface();
}

function logoutUser() {
  localStorage.removeItem("loggedUser");
  location.reload();
}

function loadUserInterface() {
  const username = localStorage.getItem("loggedUser");

  if (username) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    document.getElementById("userNameDisplay").textContent = username;

    // Load menu, cart, and order history
    displayUserMenu();
    displayCart();
    showOrderHistory();
  }
}

// ------------------------------
// 🍱 MENU DISPLAY
// ------------------------------
function displayUserMenu() {
  const menuDiv = document.getElementById("userMenuList");

  // Example menu (you can add dynamically or from database later)
  const menuItems = [
    { id: 1, name: "Veg Burger", price: 120 },
    { id: 2, name: "Chicken Wrap", price: 180 },
    { id: 3, name: "French Fries", price: 80 },
    { id: 4, name: "Paneer Pizza", price: 220 },
    { id: 5, name: "Cold Coffee", price: 90 }
  ];

  menuDiv.innerHTML = menuItems.map(item => `
    <div class="menu-card">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button onclick="orderItem(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
    </div>
  `).join('');
}

// ------------------------------
// 🛒 CART MANAGEMENT
// ------------------------------
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

// ------------------------------
// 💾 PLACE ORDER & SAVE HISTORY
// ------------------------------
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const username = localStorage.getItem("loggedUser");
  if (!username) {
    alert("Please login first!");
    return;
  }

  const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];

  const newOrder = {
    date: new Date().toLocaleString(),
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price, 0)
  };

  orders.push(newOrder);
  localStorage.setItem(`orders_${username}`, JSON.stringify(orders));

  alert("✅ Order placed successfully!");
  cart = [];
  displayCart();
  showOrderHistory();
}

// ------------------------------
// 📜 ORDER HISTORY DISPLAY
// ------------------------------
function showOrderHistory() {
  const username = localStorage.getItem("loggedUser");
  const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
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
