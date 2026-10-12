
// Private Product Manager access gate (client-side protection for this static site).
(function(){
  const HASH="81a754c4110038f8a98bb39177471d6998ce93a8ccf2ab4a1b69b77c15472820";
  const SESSION_KEY="urban_admin_unlocked_v4";
  const lock=document.getElementById("adminLock"), app=document.getElementById("adminApp"), form=document.getElementById("adminLoginForm"), input=document.getElementById("adminPassword"), err=document.getElementById("loginError"), logout=document.getElementById("logoutBtn");
  async function digest(text){ const data=new TextEncoder().encode(text); const hash=await crypto.subtle.digest("SHA-256",data); return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join(""); }
  function setUnlocked(v){ if(v){sessionStorage.setItem(SESSION_KEY,"1");lock.hidden=true;app.hidden=false;}else{sessionStorage.removeItem(SESSION_KEY);lock.hidden=false;app.hidden=true;} }
  setUnlocked(sessionStorage.getItem(SESSION_KEY)==="1");
  form.addEventListener("submit",async e=>{e.preventDefault(); const ok=(await digest(input.value))===HASH; if(ok){err.hidden=true;input.value="";setUnlocked(true);}else{err.hidden=false;input.select();}});
  logout.addEventListener("click",()=>{setUnlocked(false); input.focus();});
})();
const DEMO_PRODUCTS=[{"id": "p1", "name": "Goku Power Graphic Tee", "price": 199, "category": "Anime", "image": "assets/goku.jpg", "sizes": ["M", "L", "XL"], "badge": "NEW"}, {"id": "p2", "name": "VIKAS Street Tee", "price": 199, "category": "Streetwear", "image": "assets/vibes-blue.jpg", "sizes": ["M", "L", "XL"], "badge": "BESTSELLER"}, {"id": "p3", "name": "Naruto x Itachi Graphic Tee", "price": 199, "category": "Anime", "image": "assets/naruto-itachi.jpg", "sizes": ["M", "L", "XL"], "badge": "NEW"}, {"id": "p4", "name": "Fire Fighter Graphic Tee", "price": 199, "category": "Graphic", "image": "assets/fire-fighter.jpg", "sizes": ["M", "L", "XL"], "badge": "TRENDING"}, {"id": "p5", "name": "Itachi Cream Oversized Tee", "price": 199, "category": "Anime", "image": "assets/itachi-cream.jpg", "sizes": ["M", "L", "XL"], "badge": ""}, {"id": "p6", "name": "VIKAS Red Street Tee", "price": 199, "category": "Streetwear", "image": "assets/vibes-red.jpg", "sizes": ["M", "L", "XL"], "badge": "HOT"}, {"id": "p7", "name": "Itachi Akatsuki Tee", "price": 199, "category": "Anime", "image": "assets/itachi-green.jpg", "sizes": ["M", "L", "XL"], "badge": ""}, {"id": "p8", "name": "Akaza Graphic Tee", "price": 199, "category": "Anime", "image": "assets/akaza.jpg", "sizes": ["M", "L", "XL"], "badge": "NEW"}, {"id": "p9", "name": "ONESELF Graphic Tee", "price": 199, "category": "Graphic", "image": "assets/oneself.jpg", "sizes": ["M", "L", "XL"], "badge": ""}];

let products=JSON.parse(localStorage.getItem("urban_products_v4")||"null")||DEMO_PRODUCTS;
const $=s=>document.querySelector(s);
function save(){localStorage.setItem("urban_products_v4",JSON.stringify(products))}
function render(){
 const q=($("#filter").value||"").toLowerCase();
 const list=products.filter(p=>p.name.toLowerCase().includes(q));
 $("#list").innerHTML=list.map(p=>`<div class="item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${p.category} • ₹${p.price} • ${p.sizes.join(", ")} ${p.badge?"• "+p.badge:""}</p></div><div class="buttons"><button onclick="editProduct('${p.id}')">Edit</button><button onclick="deleteProduct('${p.id}')">Delete</button></div></div>`).join("")||"<p>No products.</p>";
}
function clearForm(){$("#form").reset();$("#id").value="";$("#price").value=199;$("#sizes").value="M,L,XL"}
function editProduct(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 $("#id").value=p.id;$("#name").value=p.name;$("#price").value=p.price;$("#category").value=p.category;$("#image").value=p.image;$("#sizes").value=p.sizes.join(",");$("#badge").value=p.badge||"";
 window.scrollTo({top:0,behavior:"smooth"});
}
function deleteProduct(id){if(confirm("Delete this product?")){products=products.filter(p=>p.id!==id);save();render()}}
function resetProducts(){if(confirm("Reset the collection to the original demo products?")){products=DEMO_PRODUCTS;save();render();clearForm()}}
$("#form").addEventListener("submit",e=>{
 e.preventDefault();
 const data={id:$("#id").value||"p"+Date.now(),name:$("#name").value.trim(),price:Number($("#price").value),category:$("#category").value,image:$("#image").value.trim(),sizes:$("#sizes").value.split(",").map(x=>x.trim()).filter(Boolean),badge:$("#badge").value};
 const i=products.findIndex(p=>p.id===data.id); if(i>=0)products[i]=data; else products.unshift(data);
 save();render();clearForm();alert("Product saved. Open the store to see it.");
});
$("#filter").addEventListener("input",render);render();


(function(){const key="urban_admin_theme_v4";const b=document.querySelector("#themeToggle");function set(t){document.documentElement.dataset.theme=t;localStorage.setItem(key,t);if(b)b.textContent=t==="dark"?"☀ Light":"☾ Dark"}if(b)b.addEventListener("click",()=>set(document.documentElement.dataset.theme==="dark"?"light":"dark"));set(localStorage.getItem(key)||"light")})();
