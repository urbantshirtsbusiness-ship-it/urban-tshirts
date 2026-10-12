
// Private Product Manager access gate with auto-login on typing ADMIN123 (no button required)
(function(){
  const PASSWORD = "ADMIN123";
  const SESSION_KEY = "urban_admin_unlocked_v4";
  const lock = document.getElementById("adminLock");
  const app = document.getElementById("adminApp");
  const input = document.getElementById("adminPassword");
  const err = document.getElementById("loginError");
  const logout = document.getElementById("logoutBtn");

  function setUnlocked(v) {
    if (v) {
      sessionStorage.setItem(SESSION_KEY, "1");
      if (lock) lock.hidden = true;
      if (app) app.hidden = false;
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      if (lock) lock.hidden = false;
      if (app) app.hidden = true;
    }
  }

  // Restore existing session
  setUnlocked(sessionStorage.getItem(SESSION_KEY) === "1");

  function verify() {
    if (!input) return;
    const val = input.value.trim();
    if (val === PASSWORD || val.toUpperCase() === PASSWORD) {
      if (err) err.hidden = true;
      input.value = "";
      setUnlocked(true);
    }
  }

  if (input) {
    input.addEventListener("input", () => {
      if (err) err.hidden = true;
      verify();
    });
    input.addEventListener("paste", () => {
      setTimeout(verify, 20);
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = input.value.trim();
        if (val === PASSWORD || val.toUpperCase() === PASSWORD) {
          if (err) err.hidden = true;
          input.value = "";
          setUnlocked(true);
        } else if (val) {
          if (err) err.hidden = false;
          input.select();
        }
      }
    });
  }

  if (logout) {
    logout.addEventListener("click", () => {
      setUnlocked(false);
      if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 50);
      }
    });
  }
})();

const DEMO_PRODUCTS=[{"id": "p1", "name": "Goku Power Graphic Tee", "price": 199, "category": "Anime", "image": "assets/goku.jpg", "sizes": ["M", "L", "XL"], "badge": "NEW"}, {"id": "p2", "name": "VIKAS Street Tee", "price": 199, "category": "Streetwear", "image": "assets/vibes-blue.jpg", "sizes": ["M", "L", "XL"], "badge": "BESTSELLER"}, {"id": "p3", "name": "Naruto x Itachi Graphic Tee", "price": 199, "category": "Anime", "image": "assets/naruto-itachi.jpg", "sizes": ["M", "L", "XL"], "badge": "NEW"}, {"id": "p4", "name": "Fire Fighter Graphic Tee", "price": 199, "category": "Graphic", "image": "assets/fire-fighter.jpg", "sizes": ["M", "L", "XL"], "badge": "TRENDING"}, {"id": "p5", "name": "Itachi Cream Oversized Tee", "price": 199, "category": "Anime", "image": "assets/itachi-cream.jpg", "sizes": ["M", "L", "XL"], "badge": ""}, {"id": "p6", "name": "VIKAS Red Street Tee", "price": 199, "category": "Streetwear", "image": "assets/vibes-red.jpg", "sizes": ["M", "L", "XL"], "badge": "HOT"}, {"id": "p7", "name": "Itachi Akatsuki Tee", "price": 199, "category": "Anime", "image": "assets/itachi-green.jpg", "sizes": ["M", "L", "XL"], "badge": ""}, {"id": "p8", "name": "Akaza Graphic Tee", "price": 199, "category": "Anime", "image": "assets/akaza.jpg", "sizes": ["M", "L", "XL"], "badge": "NEW"}, {"id": "p9", "name": "ONESELF Graphic Tee", "price": 199, "category": "Graphic", "image": "assets/oneself.jpg", "sizes": ["M", "L", "XL"], "badge": ""}];

let products = JSON.parse(localStorage.getItem("urban_products_v4") || "null") || DEMO_PRODUCTS;
const $ = s => document.querySelector(s);

function save() {
  localStorage.setItem("urban_products_v4", JSON.stringify(products));
}

function setImageValue(src) {
  const imgInput = $("#image");
  const preview = $("#imagePreview");
  const prompt = $("#uploadPrompt");
  const wrap = $("#uploadPreviewWrap");
  if (imgInput) imgInput.value = src || "";
  if (preview) preview.src = src || "";
  if (prompt) prompt.hidden = Boolean(src);
  if (wrap) wrap.hidden = !Boolean(src);
}

function onImageUrlInput(val) {
  const v = (val || "").trim();
  const preview = $("#imagePreview");
  const prompt = $("#uploadPrompt");
  const wrap = $("#uploadPreviewWrap");
  if (v) {
    if (preview) preview.src = v;
    if (prompt) prompt.hidden = true;
    if (wrap) wrap.hidden = false;
  } else {
    if (preview) preview.src = "";
    if (prompt) prompt.hidden = false;
    if (wrap) wrap.hidden = true;
  }
}

function changePhoto() {
  const fileInput = $("#imageFileInput");
  if (fileInput) fileInput.click();
}

function resetPhoto() {
  setImageValue("");
  const fileInput = $("#imageFileInput");
  if (fileInput) fileInput.value = "";
}

function handleImageFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please select an image file (JPG, PNG, WEBP).");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const MAX_SIZE = 800;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      setImageValue(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = $("#imageFileInput");
  if (fileInput) {
    fileInput.addEventListener("change", e => {
      if (e.target.files && e.target.files[0]) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  const dropzone = $("#dropzone");
  if (dropzone) {
    dropzone.addEventListener("dragover", e => {
      e.preventDefault();
      dropzone.style.borderColor = "#111";
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.style.borderColor = "";
    });
    dropzone.addEventListener("drop", e => {
      e.preventDefault();
      dropzone.style.borderColor = "";
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });
  }
});

function render() {
  const q = ($("#filter")?.value || "").toLowerCase();
  const list = products.filter(p => p.name.toLowerCase().includes(q));
  const listEl = $("#list");
  if (!listEl) return;
  listEl.innerHTML = list.map(p => `
    <div class="item">
      <img src="${p.image}" alt="${p.name}">
      <div>
        <h3>${p.name}</h3>
        <p>${p.category} • ₹${p.price} • ${(p.sizes || []).join(", ")} ${p.badge ? "• " + p.badge : ""}</p>
      </div>
      <div class="buttons">
        <button type="button" onclick="editProduct('${p.id}')">Edit</button>
        <button type="button" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>
  `).join("") || "<p>No products.</p>";
}

function clearForm() {
  $("#form")?.reset();
  if ($("#id")) $("#id").value = "";
  if ($("#price")) $("#price").value = 199;
  if ($("#sizes")) $("#sizes").value = "M,L,XL";
  resetPhoto();
}

function editProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  $("#id").value = p.id;
  $("#name").value = p.name;
  $("#price").value = p.price;
  $("#category").value = p.category;
  $("#sizes").value = (p.sizes || []).join(",");
  $("#badge").value = p.badge || "";
  setImageValue(p.image || "");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  if (confirm("Delete this product?")) {
    products = products.filter(p => p.id !== id);
    save();
    render();
  }
}

function resetProducts() {
  if (confirm("Reset the collection to the original demo products?")) {
    products = DEMO_PRODUCTS;
    save();
    render();
    clearForm();
  }
}

function exportProducts() {
  const jsonStr = JSON.stringify(products, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importProducts(e) {
  const file = e.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = JSON.parse(evt.target.result);
      if (Array.isArray(data)) {
        if (confirm(`Import ${data.length} products? This will update your store catalog.`)) {
          products = data;
          save();
          render();
          clearForm();
          alert(`Successfully loaded ${data.length} products!`);
        }
      } else {
        alert("Invalid file format: Expected a JSON array of products.");
      }
    } catch(err) {
      alert("Error reading JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

const formEl = $("#form");
if (formEl) {
  formEl.addEventListener("submit", e => {
    e.preventDefault();
    const imgVal = ($("#image")?.value || "").trim();
    if (!imgVal) {
      alert("Please upload a photo or provide an image link.");
      return;
    }
    const data = {
      id: $("#id")?.value || "p" + Date.now(),
      name: ($("#name")?.value || "").trim(),
      price: Number($("#price")?.value || 199),
      category: $("#category")?.value || "Streetwear",
      image: imgVal,
      sizes: ($("#sizes")?.value || "M,L,XL").split(",").map(x => x.trim()).filter(Boolean),
      badge: $("#badge")?.value || ""
    };
    const i = products.findIndex(p => p.id === data.id);
    if (i >= 0) products[i] = data;
    else products.unshift(data);
    save();
    render();
    clearForm();
    alert("✓ Product saved successfully! Check the storefront to see it live.");
  });
}

const filterEl = $("#filter");
if (filterEl) filterEl.addEventListener("input", render);
render();

// Theme toggle
(function(){
  const key = "urban_admin_theme_v4";
  const b = document.querySelector("#themeToggle");
  function set(t){
    document.documentElement.dataset.theme = t;
    localStorage.setItem(key, t);
    if (b) b.textContent = t === "dark" ? "☀ Light" : "☾ Dark";
  }
  if (b) b.addEventListener("click", () => set(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  set(localStorage.getItem(key) || "light");
})();

