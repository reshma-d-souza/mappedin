let DATA = null;
let currentFloor = null;
let selectedShop = null;
let shopkeeperMode = false;


async function init(){
DATA = await fetch('shops.json').then(r=>r.json());
const floorSelect = document.getElementById('floorSelect');
DATA.floors.forEach(f=>{
const opt = document.createElement('option'); opt.value=f.id; opt.textContent=f.name; floorSelect.appendChild(opt);
});
floorSelect.addEventListener('change', e=>{ currentFloor = DATA.floors.find(x=>x.id===e.target.value); renderMap(); renderShopList(); });


document.getElementById('searchInput').addEventListener('input', e=>renderShopList(e.target.value));
document.getElementById('shopkeeperToggle').addEventListener('click', toggleShopkeeper);
document.getElementById('routeBtn').addEventListener('click', showRoute);
document.getElementById('qrBtn').addEventListener('click', generateQr);
document.getElementById('saveEdit').addEventListener('click', saveEdit);


// Default floor
currentFloor = DATA.floors[0];
document.getElementById('floorSelect').value = currentFloor.id;
renderMap(); renderShopList(); updateTimings();
  //If URL has shopId param, open it
const url = new URL(window.location);
const shopId = url.searchParams.get('shopId');
if(shopId){ selectById(shopId); }
}


function updateTimings(){ document.getElementById('openTime').textContent='10:00'; document.getElementById('closeTime').textContent='22:00'; }


function renderShopList(filter=''){
const ul = document.getElementById('shopList'); ul.innerHTML='';
const nodes = currentFloor.nodes.filter(n=>n.type==='shop' || n.type==='poi' || n.type==='entrance');
const q = filter.trim().toLowerCase();
nodes.forEach(n=>{
if(q && !( (n.name||'').toLowerCase().
          const li = document.createElement('li'); li.className='shop-item';
li.innerHTML = `<div><strong>${n.name||n.id}</strong><div class="meta">${n.category||n.type}</div></div><div><button data-id="${n.id}">Open</button></div>`;
li.querySelector('button').addEventListener('click', ()=>selectById(n.id));
ul.appendChild(li);
});
}


function renderMap(){
const container = document.getElementById('mapContainer'); container.innerHTML='';
const w = container.clientWidth, h = container.clientHeight;
const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('width','100%'); svg.setAttribute('height','100%'); svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
// background grid
const bg = document.createElementNS('http://www.w3.org/2000/svg','rect'); bg.setAttribute('x',0); bg.setAttribute('y',0); bg.setAttribute('width',w); bg.setAttribute('height',h); bg.setAttribute('fill','#fff'); svg.appendChild(bg);


// draw edges
const edges = currentFloor.edges||[];
edges.forEach(e=>{
const a = findNode(e[0]); const b = findNode(e[1]);
if(!a||!b) return;
const line = document.createElementNS('http://www.w3.org/2000/svg','line');
line.setAttribute('x1',a.x); line.setAttribute('y1',a.y); line.setAttribute('x2',b.x); line.setAttribute('y2',b.y);
line.setAttribute('stroke','#e6eef0'); line.setAttribute('stroke-width',6); line.setAttribute('stroke-linecap','round'); svg.appendChild(line);
});
  // draw nodes
currentFloor.nodes.forEach(n=>{
const group = document.createElementNS('http://www.w3.org/2000/svg','g');
group.setAttribute('transform',`translate(${n.x},${n.y})`);
const circle = document.createElementNS('http://www.w3.org/2000/svg','rect');
circle.setAttribute('x',-22); circle.setAttribute('y',-18); circle.setAttribute('width',44); circle.setAttribute('height',36);
circle.setAttribute('rx',6); circle.setAttribute('fill',n.type==='shop'? '#f0fbfb' : '#fff'); circle.setAttribute('stroke','#bfe6e6'); circle.setAttribute('stroke-width',2);
group.appendChild(circle);
const text = document.createElementNS('http://www.w3.org/2000/svg','text');
text.setAttribute('y',4); text.setAttribute('x',0); text.setAttribute('text-anchor','middle'); text.setAttribute('font-size',12); text.textContent = n.name||n.id;
group.appendChild(text);
group.style.cursor='pointer';
group.addEventListener('click', ()=>selectById(n.id));
svg.appendChild(group);
});


container.appendChild(svg);
}


function findNode(id){ return currentFloor.nodes.find(n=>n.id===id); }


function selectById(id){
const node = currentFloor.nodes.find(n=>n.id===id) || DATA.floors.flatMap(f=>f.nodes).find(n=>n.id===id);
  if(!node) return alert('Shop not found');
selectedShop = node; document.getElementById('selectedInfo').inner
