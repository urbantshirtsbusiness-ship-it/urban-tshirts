const PRODUCTS=[{"id":"p1","name":"Goku Power Graphic Tee","price":199,"category":"Anime","image":"assets/goku.jpg","sizes":["M","L","XL"],"badge":"NEW"},{"id":"p2","name":"VIKAS Street Tee","price":199,"category":"Streetwear","image":"assets/vibes-blue.jpg","sizes":["M","L","XL"],"badge":"BESTSELLER"},{"id":"p3","name":"Naruto x Itachi Graphic Tee","price":199,"category":"Anime","image":"assets/naruto-itachi.jpg","sizes":["M","L","XL"],"badge":"NEW"},{"id":"p4","name":"Fire Fighter Graphic Tee","price":199,"category":"Graphic","image":"assets/fire-fighter.jpg","sizes":["M","L","XL"],"badge":"TRENDING"},{"id":"p5","name":"Itachi Cream Oversized Tee","price":199,"category":"Anime","image":"assets/itachi-cream.jpg","sizes":["M","L","XL"],"badge":""},{"id":"p6","name":"VIKAS Red Street Tee","price":199,"category":"Streetwear","image":"assets/vibes-red.jpg","sizes":["M","L","XL"],"badge":"HOT"},{"id":"p7","name":"Itachi Akatsuki Tee","price":199,"category":"Anime","image":"assets/itachi-green.jpg","sizes":["M","L","XL"],"badge":""},{"id":"p8","name":"Akaza Graphic Tee","price":199,"category":"Anime","image":"assets/akaza.jpg","sizes":["M","L","XL"],"badge":"NEW"},{"id":"p9","name":"ONESELF Graphic Tee","price":199,"category":"Graphic","image":"assets/oneself.jpg","sizes":["M","L","XL"],"badge":""}];

const PRODUCTS_KEY="urban_products_v4";
const CART_KEY="urban_cart_v4";
const WISHLIST_KEY="urban_wishlist_v4";
const THEME_KEY="urban_theme_v4";
function safeRead(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
let products=safeRead(PRODUCTS_KEY,null) || safeRead("urban_products_v3",PRODUCTS);
let cart=safeRead(CART_KEY,null) || safeRead("urban_cart_v3",[]);
let wishlist=safeRead(WISHLIST_KEY,[]);
let category="All";
const comboSelection=new Map();
const $=s=>document.querySelector(s);
function money(n){return "₹"+Math.round(Number(n)||0)}
function save(){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products));localStorage.setItem(CART_KEY,JSON.stringify(cart));localStorage.setItem(WISHLIST_KEY,JSON.stringify(wishlist))}
function showToast(t){const x=$("#toast");if(!x)return;x.textContent=t;x.classList.add("show");clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>x.classList.remove("show"),1800)}
function scrollShop(){document.querySelector("#shop")?.scrollIntoView({behavior:"smooth"})}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function safeImage(v){return String(v||"").replace(/"/g,"&quot;")}

function render(){
 const q=($("#search")?.value||"").toLowerCase().trim();
 let list=products.filter(p=>(category==="All"||p.category===category)&&(!q||String(p.name).toLowerCase().includes(q)||String(p.category).toLowerCase().includes(q)));
 const sort=$("#sort")?.value;
 if(sort==="low")list.sort((a,b)=>(a.price||0)-(b.price||0));
 if(sort==="high")list.sort((a,b)=>(b.price||0)-(a.price||0));
 const grid=$("#productGrid");
 if(!grid)return;
 grid.innerHTML=list.map(p=>{
   const selected=comboSelection.get(p.id)?.size||"";
   const liked=wishlist.includes(p.id);
   return `<article class="product" data-product-id="${escapeHtml(p.id)}">
    <div class="product-image"><img src="${safeImage(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" data-action="preview"><span class="image-loading" aria-hidden="true"></span>${p.badge?`<span class="badge">${escapeHtml(p.badge)}</span>`:""}<button class="heart ${liked?"liked":""}" data-action="wishlist" title="${liked?"Remove from wishlist":"Add to wishlist"}" aria-label="${liked?"Remove from wishlist":"Add to wishlist"}">${liked?"♥":"♡"}</button></div>
    <div class="product-info"><h3>${escapeHtml(p.name)}</h3><div class="rating">★★★★★ <span>New drop</span></div>
     <div class="price"><strong>${money(p.price)}</strong><del>₹299</del></div>
     <div class="sizes">${(p.sizes||["M","L","XL"]).map(s=>`<button class="size ${selected===s?"selected":""}" data-size="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("")}</div>
     <button class="add" data-action="add">ADD TO BAG</button>
     <button class="combo-add ${comboSelection.has(p.id)?"chosen":""}" data-action="combo">${comboSelection.has(p.id)?"✓ IN COMBO":"ADD TO ₹499 COMBO"}</button>
    </div></article>`;
 }).join("")||"<p class='empty-state'>No products found. Try another search.</p>";
 updateComboUI();updateWishlistUI();
}

function selectSize(btn){
 const card=btn.closest(".product");
 if(!card)return;
 card.querySelectorAll(".size").forEach(x=>x.classList.remove("selected"));
 btn.classList.add("selected");
 const id=card.dataset.productId;
 if(comboSelection.has(id))comboSelection.get(id).size=btn.dataset.size||btn.textContent.trim();
}
function getSelectedSizeForProduct(id){
 const card=document.querySelector(`.product[data-product-id="${CSS.escape(id)}"]`);
 return card?.querySelector(".size.selected")?.dataset.size||card?.querySelector(".size.selected")?.textContent?.trim()||"M";
}
function addToCart(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 const size=getSelectedSizeForProduct(id);
 cart.push({type:"single",id:p.id,name:p.name,price:Number(p.price)||199,image:p.image,size});
 save();renderCart();showToast(`Added ${p.name} — Size ${size}`);openCart();
}
function toggleComboItem(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 if(comboSelection.has(id)){comboSelection.delete(id);render();return}
 if(comboSelection.size>=3){showToast("Choose only 3 tees for ₹499");return}
 comboSelection.set(id,{size:getSelectedSizeForProduct(id)});render();showToast(`${comboSelection.size}/3 selected for combo`);
}
function updateComboUI(){
 const btn=$("#comboButton");if(!btn)return;
 const ready=comboSelection.size===3;btn.textContent=ready?"ADD SELECTED 3 TO BAG →":`SELECT 3 TEES (${comboSelection.size}/3) →`;btn.disabled=!ready;
}
function addCombo(){
 if(comboSelection.size!==3){showToast("Select any 3 tees first");return}
 const items=[...comboSelection.entries()].map(([id,data])=>{const p=products.find(x=>x.id===id);return p?{id:p.id,name:p.name,image:p.image,size:data.size}:null}).filter(Boolean);
 if(items.length!==3){comboSelection.clear();render();showToast("Some selected products are no longer available");return}
 cart.push({type:"combo",id:"combo-"+Date.now(),name:"3-Piece Combo",price:499,image:items[0].image,items});
 comboSelection.clear();save();render();renderCart();showToast("3-piece combo added — ₹499");openCart();
}
function removeItem(i){if(!Number.isInteger(i)||!cart[i])return;cart.splice(i,1);save();renderCart();showToast("Removed from bag")}
function cartPieceCount(){return cart.reduce((n,x)=>n+(x.type==="combo"?3:1),0)}
function renderCart(){
 const count=$("#cartCount");if(count)count.textContent=cartPieceCount();
 const items=$("#cartItems");if(!items)return;
 items.innerHTML=cart.length?cart.map((x,i)=>x.type==="combo"?`<div class="cart-combo"><div class="cart-combo-head"><div><h4>3-Piece Combo</h4><small>Any 3 tees • ₹499</small></div><b>${money(x.price)}</b><button class="remove" data-remove="${i}" aria-label="Remove combo">×</button></div>${x.items.map(it=>`<div class="cart-item combo-line"><img src="${safeImage(it.image)}" alt="${escapeHtml(it.name)}" loading="lazy"><div><h4>${escapeHtml(it.name)}</h4><small>Size <b>${escapeHtml(it.size)}</b></small></div></div>`).join("")}</div>`:`<div class="cart-item"><img src="${safeImage(x.image)}" alt="${escapeHtml(x.name)}" loading="lazy"><div><h4>${escapeHtml(x.name)}</h4><small>Size <b>${escapeHtml(x.size||"M")}</b></small><div><b>${money(x.price)}</b></div></div><button class="remove" data-remove="${i}" aria-label="Remove item">×</button></div>`).join(""):"<div class='empty-cart'>Your bag is empty.</div>";
 const total=cart.reduce((s,x)=>s+(Number(x.price)||0),0);$("#cartTotal").textContent=money(total);
}
function toggleWishlist(id){const i=wishlist.indexOf(id);if(i>=0){wishlist.splice(i,1);showToast("Removed from wishlist")}else{wishlist.push(id);showToast("Saved to wishlist")}save();render()}
function updateWishlistUI(){const c=$("#wishlistCount");if(c)c.textContent=wishlist.length}
function openImageModal(src,name){const m=$("#imageModal"),img=$("#modalImage"),label=$("#modalLabel");if(!m||!img)return;img.src=src;img.alt=name;label.textContent=name;m.classList.add("open");document.body.style.overflow="hidden"}
function closeImageModal(e){if(e&&e.target&&e.target.id!=="imageModal"&&e.target.id!=="modalImage"&&!e.target.closest(".image-modal button"))return;$("#imageModal")?.classList.remove("open");if(!$("#cartPanel")?.classList.contains("open"))document.body.style.overflow=""}
function openCart(){$("#cartPanel")?.classList.add("open");$("#overlay")?.classList.add("open");document.body.style.overflow="hidden"}
function closeCart(){$("#cartPanel")?.classList.remove("open");$("#overlay")?.classList.remove("open");if(!$("#imageModal")?.classList.contains("open"))document.body.style.overflow=""}
function applyTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem(THEME_KEY,theme);const b=$("#themeToggle");if(b){b.textContent=theme==="dark"?"☀":"☾";b.title=theme==="dark"?"Switch to light theme":"Switch to dark theme";b.setAttribute("aria-label",b.title)}}
function initTheme(){applyTheme(safeRead(THEME_KEY,"light"))}
function checkout(){
 if(!cart.length){showToast("Your bag is empty");return}
 const lines=[];cart.forEach((x,i)=>{if(x.type==="combo"){lines.push(`${i+1}. 3-Piece Combo - ₹499`);x.items.forEach((it,j)=>lines.push(`   ${j+1}) ${it.name} - Size ${it.size}`))}else lines.push(`${i+1}. ${x.name} - Size ${x.size||"M"} - ${money(x.price)}`)});
 const total=cart.reduce((s,x)=>s+(Number(x.price)||0),0);const msg=`Hi URBAN T-SHIRTS! I want to order:\n${lines.join("\n")}\nTotal: ${money(total)}\nPlease confirm availability and delivery details.`;window.open("https://wa.me/917603871293?text="+encodeURIComponent(msg),"_blank","noopener");
}

async function loadCatalog(){
  try{
    const res=await fetch("products.json?v="+Date.now());
    if(res.ok){
      const data=await res.json();
      if(Array.isArray(data)&&data.length){
        const local=safeRead(PRODUCTS_KEY,null);
        if(!local){
          products=data;
          render();
        }
      }
    }
  }catch(e){}
}

document.addEventListener("DOMContentLoaded",()=>{
 initTheme();
 $("#search")?.addEventListener("input",render);$("#sort")?.addEventListener("change",render);
 document.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.cat;document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()}));
 $("#themeToggle")?.addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
 $("#wishlistBtn")?.addEventListener("click",()=>{showToast(wishlist.length?`${wishlist.length} item${wishlist.length>1?"s":""} saved in wishlist`:"Your wishlist is empty")});
 $("#productGrid")?.addEventListener("click",e=>{const card=e.target.closest(".product");if(!card)return;const id=card.dataset.productId,p=products.find(x=>x.id===id);if(!p)return;const action=e.target.closest("[data-action]")?.dataset.action;if(e.target.classList.contains("size")){selectSize(e.target);return}if(action==="preview"){openImageModal(p.image,p.name);return}if(action==="wishlist"){toggleWishlist(id);return}if(action==="add"){addToCart(id);return}if(action==="combo"){toggleComboItem(id);return}});
 $("#cartItems")?.addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b)removeItem(Number(b.dataset.remove))});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();$("#imageModal")?.classList.remove("open");document.body.style.overflow=""}});
 window.addEventListener("storage",e=>{if(e.key===PRODUCTS_KEY){products=safeRead(PRODUCTS_KEY,products);render()}});
 render();renderCart();
 loadCatalog();
});
