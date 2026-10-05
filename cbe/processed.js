window.CBE_PROCESSED=[
{
name:"Dr Pepper",emoji:"🥤",category:"Drink",fit:"conditional",fitLabel:"Likely CBE-compatible",nutrition:"treat",nutritionLabel:"Treat / low nutrient density",
ingredients:"Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural and artificial flavors, sodium benzoate, caffeine.",
why:"The corn-derived sweetener can fit CBE's annual/seed rule, and the nonliving additives do not create a CBE conflict. The main uncertainty is the proprietary natural/artificial flavor system, whose biological sources are not fully disclosed.",
watch:"Opaque flavor sourcing prevents a Strong Fit rating.",
source:"https://www.keurigdrpepper.com/human-rights-responsible-sourcing-supply-chain-livelihoods/",
reviewed:"2026-09-10"
},
{
name:"Coca-Cola Original",emoji:"🥤",category:"Drink",fit:"conditional",fitLabel:"Likely CBE-compatible",nutrition:"treat",nutritionLabel:"Treat / high added sugar",
ingredients:"Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine.",
why:"HFCS is corn-derived and fits the annual/seed logic. Natural flavors are not fully source-transparent, so the product cannot earn a Strong Fit classification.",
watch:"Natural flavor sourcing is proprietary; regular Coke is also high in added sugar.",
source:"https://www.coca-cola.com/us/en/brands/coca-cola/products/original",
reviewed:"2026-09-10"
},
{
name:"Pepsi",emoji:"🥤",category:"Drink",fit:"conditional",fitLabel:"Likely CBE-compatible",nutrition:"treat",nutritionLabel:"Treat / high added sugar",
ingredients:"Carbonated water, high fructose corn syrup, caramel color, sugar, phosphoric acid, caffeine, citric acid, natural flavor.",
why:"Corn sweetener can fit the annual rule. The added sugar source and proprietary natural flavor create sourcing uncertainty.",
watch:"Sugar may come from crops with different CBE implications, and natural flavor is opaque.",
source:"https://www.pepsi.com/products/pepsi",
reviewed:"2026-09-10"
},
{
name:"Original Cheerios",emoji:"🥣",category:"Cereal",fit:"conditional",fitLabel:"CBE-friendly with sourcing questions",nutrition:"solid",nutritionLabel:"Nutritionally useful",
ingredients:"Whole grain oats, corn starch, sugar, salt, tripotassium phosphate, vitamin E, and added vitamins/minerals including calcium, iron, zinc, B vitamins, B12 and D3.",
why:"Oats and corn are annual/seed foods and fit CBE well. Fortification is nutritionally useful, but some vitamin inputs and the sugar source are not transparent enough for a Strong Fit.",
watch:"Vitamin D3 and sugar sourcing may vary; fortified ingredients are industrially sourced.",
source:"https://www.cheerios.com/products/original-cheerios",
reviewed:"2026-09-10"
},
{
name:"Barilla Spaghetti",emoji:"🍝",category:"Pantry",fit:"strong",fitLabel:"Strong processed fit",nutrition:"solid",nutritionLabel:"Useful staple",
ingredients:"Semolina.",
why:"The product is essentially processed mature wheat. Wheat is an annual grain that fits CBE when harvested at maturity with continuation preserved.",
watch:"What you put on the pasta can change the CBE rating of the meal.",
source:"https://www.barilla.com/en-us/products/pasta/classic-blue-box/spaghetti",
reviewed:"2026-09-10"
},
{
name:"Lay's Classic Potato Chips",emoji:"🥔",category:"Snack",fit:"conditional",fitLabel:"CBE conditional",nutrition:"treat",nutritionLabel:"Snack / moderate sodium and fat",
ingredients:"Potatoes, vegetable oil (canola, corn, soybean and/or sunflower oil), salt.",
why:"The seed oils come from annual crops and fit well. Potatoes are living tubers and are already method-dependent in CBE, so the finished chips inherit that conditional status.",
watch:"Potato harvest is the main philosophical issue, not the processing itself.",
source:"https://www.lays.com/products/lays-classic-potato-chips",
reviewed:"2026-09-10"
},
{
name:"Heinz Tomato Ketchup",emoji:"🍅",category:"Condiment",fit:"conditional",fitLabel:"CBE conditional",nutrition:"treat",nutritionLabel:"Condiment / added sugar and sodium",
ingredients:"Tomato concentrate, distilled vinegar, high fructose corn syrup, corn syrup, salt, spice, onion powder, natural flavoring.",
why:"Tomatoes and corn sweeteners fit CBE well. Onion powder comes from a bulb crop and natural flavoring is not source-transparent, keeping the product conditional.",
watch:"Onion powder is method-dependent under CBE.",
source:"https://www.heinz.com/products/00013000004664-tomato-ketchup%2C1713757890",
reviewed:"2026-09-10"
},
{
name:"OREO Original",emoji:"🍪",category:"Snack",fit:"conditional",fitLabel:"CBE conditional",nutrition:"treat",nutritionLabel:"Treat / high added sugar",
ingredients:"Enriched wheat flour, sugar, palm oil, soybean and/or canola oil, cocoa, high fructose corn syrup, leavening, salt, soy lecithin, chocolate, artificial flavor.",
why:"Wheat, soy, canola, cocoa and corn-derived ingredients can fit CBE. The sugar source and artificial flavor system are not sufficiently source-transparent to give a Strong Fit.",
watch:"Ingredient sourcing is more complex than the simple plant-based appearance suggests.",
source:"https://www.oreo.com/products/oreo-cookie",
reviewed:"2026-09-10"
}
];
window.CBE_PROCESSED_META={
reviewed:"2026-09-10",
rule:"Processed does not automatically mean non-CBE. The app evaluates each ingredient, then lowers confidence when sourcing is proprietary or ambiguous.",
nutritionRule:"CBE compatibility and nutrition quality are separate judgments."
};

/* Lightweight public visitor counter for the static CBE site. */
(function(){
  var COUNTER_KEY='cbe-continuance-based-eating-visitors-2026-10-04-a91f6d2c';
  var SEEN_KEY='cbeVisitorCounted_v1';
  var BASE='https://countapi.mileshilliard.com/api/v1';
  function addCounter(){
    if(document.getElementById('cbeVisitorCounter')) return;
    var nav=document.querySelector('nav');
    var el=document.createElement('div');
    el.id='cbeVisitorCounter';
    el.setAttribute('aria-live','polite');
    el.style.cssText='margin:28px 20px 18px;text-align:center;color:#61756e;font-size:12px;line-height:1.4';
    el.innerHTML='<span style="display:inline-flex;align-items:center;gap:7px;background:#fff;border:1px solid #dce8e0;border-radius:999px;padding:8px 12px;box-shadow:0 5px 18px #234b3920"><span aria-hidden="true">🌿</span><span><b id="cbeVisitorCount" style="color:#1c6a49">…</b> visitors since Oct. 2026</span></span>';
    if(nav && nav.parentNode) nav.parentNode.insertBefore(el,nav); else document.body.appendChild(el);
  }
  function showCount(value){var n=document.getElementById('cbeVisitorCount');if(n&&value!==undefined&&value!==null)n.textContent=Number(value).toLocaleString()}
  function hideCounter(){var el=document.getElementById('cbeVisitorCounter');if(el)el.style.display='none'}
  function loadCounter(){
    addCounter();
    var seen=false;try{seen=localStorage.getItem(SEEN_KEY)==='1'}catch(e){}
    var endpoint=seen?'get':'hit';
    fetch(BASE+'/'+endpoint+'/'+encodeURIComponent(COUNTER_KEY),{cache:'no-store'}).then(function(res){
      if(!res.ok&&seen&&res.status===404)return fetch(BASE+'/hit/'+encodeURIComponent(COUNTER_KEY),{cache:'no-store'}).then(function(r){return r.json()});
      if(!res.ok)throw new Error('counter unavailable');return res.json();
    }).then(function(data){showCount(data.value);if(!seen){try{localStorage.setItem(SEEN_KEY,'1')}catch(e){}}}).catch(hideCounter)
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCounter);else loadCounter();
})();

/* CBE-first Bariatric Friendly layer. BF is a secondary recipe tag, never a substitute for CBE compatibility. */
(function(){
  var BADGE='data:image/webp;base64,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';
  var recipes=window.CBE_RECIPES=window.CBE_RECIPES||[];
  function mark(name,data){var r=recipes.find(function(x){return x.name===name});if(r)Object.assign(r,data)}
  mark('Garden Herb CBE Scramble',{bf:true,bfSource:true,bfTraits:['soft texture','protein-forward','simple'],bfNote:'Soft scrambled eggs are a classic bariatric-style format: moist, easy to portion, and protein-centered. Use CBE-compatible unfertilized eggs.'});
  mark('Mushroom-Chive CBE Frittata',{bf:true,bfSource:true,bfTraits:['protein-forward','soft texture','portionable'],bfNote:'Egg-based, soft, and easy to cut into small portions. Mushrooms add flavor without making the dish dense.'});
  mark('Spinach-Chive Blossom Crustless Quiche',{bf:true,bfSource:true,bfTraits:['protein-forward','soft texture','portionable'],bfNote:'Crustless quiche keeps the texture soft and removes a dense crust while staying protein-centered.'});
  var add=[
    {name:'CBE Egg-chilada',emoji:'🥚',time:'15 min',fit:'CBE egg + tofu fit',season:'eggs',desc:'A soft rolled egg wrap filled with tofu and salsa.',ingredients:['1 CBE-compatible unfertilized egg','1 egg white','1 ounce soft crumbled tofu','2 tablespoons salsa','chives optional','black pepper'],steps:['Whisk the egg and egg white.','Cook in a lightly oiled skillet like a thin omelet.','Add tofu down the center with a little salsa.','Roll gently and top with the remaining salsa.'],note:'A CBE adaptation of a bariatric-style egg-forward breakfast. Eggs must meet the CBE continuance and welfare standard.',bf:true,bfSource:true,bfTraits:['protein-forward','soft texture','small-portion friendly'],bfNote:'Compact, moist, protein-centered, and naturally portioned.'},
    {name:'Fluffy CBE Scrambled Eggs',emoji:'☁️',time:'10 min',fit:'CBE egg fit',season:'eggs',desc:'Very soft scrambled CBE-compatible eggs with optional chives.',ingredients:['2 CBE-compatible unfertilized eggs','black pepper','chives optional','small amount of CBE-compatible cooking fat or spray'],steps:['Whisk eggs thoroughly.','Cook gently over medium-low heat, stirring often.','Stop while the eggs are still soft and moist.','Top with chives if using.'],note:'Keep the eggs moist rather than dry. Egg sourcing must meet CBE continuance and welfare principles.',bf:true,bfSource:true,bfTraits:['soft texture','protein-forward','simple'],bfNote:'Soft scrambled eggs are a common bariatric-style protein format and are easy to portion.'},
    {name:'CBE Spinach Egg Muffins',emoji:'🧁',time:'25 min',fit:'CBE egg + strong plant fits',season:'eggs',desc:'Small baked egg portions with finely chopped spinach and optional soft tomato.',ingredients:['6 CBE-compatible unfertilized eggs','1/2 cup finely chopped cooked spinach','small amount of finely chopped peeled tomato optional','chives','black pepper'],steps:['Beat the eggs with black pepper.','Divide spinach and optional tomato among lined muffin cups.','Pour in the egg mixture.','Bake at 375°F for 14 to 16 minutes or until just set.'],note:'The small portions are deliberate. For a softer stage, omit tomato skin and keep vegetables finely chopped.',bf:true,bfSource:true,bfTraits:['protein-forward','portionable','meal-prep friendly'],bfNote:'Naturally small portions and a soft egg texture make this especially practical for many post-op eaters.'},
    {name:'Savory Tofu Tomato Scramble Bowl',emoji:'🍅',time:'15 min',fit:'Strong + completed-cycle fits',season:'brunch',desc:'Soft tofu with peeled tomato, chives, and basil for a warm light meal.',ingredients:['soft tofu','peeled tomato','chives','basil','olive oil optional'],steps:['Warm a small pan and gently break up the tofu.','Add peeled chopped tomato and cook until soft.','Finish with chives and basil.','Serve warm in a small bowl.'],note:'Soft tofu keeps this CBE-first while giving the meal a protein base.',bf:true,bfSource:true,bfTraits:['soft texture','protein-forward','light feel'],bfNote:'Soft, moist, easy to chew, and protein-forward without a heavy sauce or crust.'},
    {name:'Soft Tomato Basil Protein Soup',emoji:'🍅',time:'15 min',fit:'Strong CBE fit',season:'everyday',desc:'Smooth tomato-basil soup blended with silken tofu for extra protein.',ingredients:['whole peeled tomatoes','fresh basil','silken tofu','pinch of cumin optional','black pepper','low-sodium vegetable broth as needed'],steps:['Blend tomatoes until smooth.','Add basil and silken tofu and blend again.','Warm gently, thinning with broth as needed.','Serve in a small bowl.'],note:'Silken tofu keeps the recipe CBE-aligned while adding protein and a soft texture.',bf:true,bfSource:true,bfTraits:['soft texture','protein-added','small-portion friendly'],bfNote:'Smooth, moist, easy to portion, and protein-enhanced without relying on meat.'}
  ];
  add.forEach(function(r){if(!recipes.some(function(x){return x.name===r.name}))recipes.push(r)});

  var bfOnly=false, recipeQuery='';
  function aliasBF(q){return /^(bf|b\.f\.|bariatric|bariatric friendly|wls|weight loss surgery|post[- ]?op)$/i.test((q||'').trim())}
  function getRecipeForCard(card){var h=card.querySelector('h3');if(!h)return null;return recipes.find(function(x){return h.textContent.indexOf(x.name)>=0})||null}
  function style(){
    if(document.getElementById('cbeBfStyle'))return;
    var s=document.createElement('style');s.id='cbeBfStyle';
    s.textContent='.bflegend{display:flex;gap:14px;align-items:center;flex-wrap:wrap;background:#fff;border:1px solid #dce8e0;border-radius:22px;padding:16px;margin:14px 0;box-shadow:0 7px 21px #214b3810}.bflegend img{width:82px;height:82px;object-fit:contain}.bflegend h3{margin:0 0 5px}.bflegend p{margin:0;color:#61756e;font-size:12px;line-height:1.5;max-width:680px}.bfpill{display:inline-flex;align-items:center;gap:6px;background:#f3f9f4;border:1px solid #cfe2cf;border-radius:999px;padding:5px 8px;font-size:10px;font-weight:900;color:#31553c;margin:6px 5px 0 0;cursor:pointer}.bfpill:hover{background:#e8f4ed}.bfpill img{width:20px;height:20px;object-fit:contain}.bfinformed{display:inline-block;background:#fff7ea;border:1px solid #efd4a0;border-radius:999px;padding:5px 8px;font-size:10px;font-weight:900;color:#8a5a10;margin:6px 5px 0 0}.bftraits{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.bftrait{background:#f3f7f5;border:1px solid #e0e9e4;border-radius:999px;padding:4px 7px;font-size:10px;font-weight:750;color:#526a60}.bfnote{margin-top:8px;padding:10px 11px;background:#f7faf8;border:1px solid #dce8e0;border-radius:13px;color:#526a60;font-size:11px;line-height:1.45}.bfhide{display:none!important}.bfcontrols{display:grid;grid-template-columns:1fr auto;gap:9px;margin:10px 0 4px}.bfsearch{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #dce8e0;border-radius:18px;padding:10px 13px;box-shadow:0 7px 23px #214b3812}.bfsearch input{width:100%;border:0;outline:0;background:transparent;font-size:15px;color:#17362c}.bffilter{display:inline-flex!important;align-items:center;gap:7px}.bffilter img{width:24px;height:24px;object-fit:contain}.bfshortcut{grid-column:1/-1}.bfempty{padding:18px;border:1px dashed #cddbd3;border-radius:16px;color:#61756e;text-align:center;margin:12px 0;background:#fff}.seasonblock.bfsectionhide{display:none!important}@media(max-width:650px){.bfcontrols{grid-template-columns:1fr}.bffilter{justify-content:center}}';
    document.head.appendChild(s)
  }
  function updateSeasonVisibility(){document.querySelectorAll('.seasonblock').forEach(function(section){var cards=Array.from(section.querySelectorAll('.recipe')),visible=cards.filter(function(c){return !c.classList.contains('bfhide')});section.classList.toggle('bfsectionhide',visible.length===0);var count=section.querySelector('.seasonhead span');if(count)count.textContent=visible.length+' recipe'+(visible.length===1?'':'s')})}
  function applyRecipeFilter(){
    var q=(recipeQuery||'').trim().toLowerCase(),alias=aliasBF(q);
    document.querySelectorAll('.recipe').forEach(function(card){var r=getRecipeForCard(card),isBF=!!(r&&r.bf);var text=(card.textContent+' '+(r&&r.ingredients?r.ingredients.join(' '):'')+' '+(r&&r.bfTraits?r.bfTraits.join(' '):'')+' '+(isBF?' bf bariatric bariatric friendly wls weight loss surgery post op':'')).toLowerCase();var matches=alias?isBF:(!q||text.indexOf(q)>=0);card.classList.toggle('bfhide',!(matches&&(!bfOnly||isBF))) });
    updateSeasonVisibility();
    var empty=document.getElementById('bfRecipeEmpty'),visible=document.querySelectorAll('.recipe:not(.bfhide)').length;
    if(!empty){empty=document.createElement('div');empty.id='bfRecipeEmpty';empty.className='bfempty';empty.style.display='none';var R=document.getElementById('recipes');if(R)R.prepend(empty)}
    empty.style.display=visible?'none':'block';empty.textContent='No recipes match that search yet.'
  }
  function setBF(value){bfOnly=!!value;var b=document.getElementById('bfOnlyBtn');if(b)b.classList.toggle('active',bfOnly);applyRecipeFilter()}
  function decorate(){
    style();
    var feature=document.getElementById('recipeFeature');
    if(feature&&!document.getElementById('bfLegend')){var legend=document.createElement('div');legend.id='bfLegend';legend.className='bflegend';legend.innerHTML='<img src="'+BADGE+'" alt="BF Likely Bariatric Friendly"><div><h3>BF = Likely Bariatric Friendly</h3><p><b>CBE comes first.</b> BF is a second recipe tag for CBE recipes that also look especially practical for many post-op bariatric eaters. <b>BF-informed</b> means the design was calibrated using bariatric recipe patterns; it is not clinical verification. A future verified badge will require review of the exact CBE recipe by an appropriate bariatric professional.</p></div>';feature.insertAdjacentElement('afterend',legend)}
    var jump=document.getElementById('recipeJump');
    if(jump&&!document.getElementById('bfControls')){var controls=document.createElement('div');controls.id='bfControls';controls.className='bfcontrols';controls.innerHTML='<label class="bfsearch">🔎 <input id="bfRecipeSearch" type="search" autocomplete="off" placeholder="Search recipes — try tofu, BF, bariatric, WLS…"></label><button id="bfOnlyBtn" class="chip bffilter" type="button"><img src="'+BADGE+'" alt="">BF recipes</button>';jump.parentNode.insertBefore(controls,jump);var input=document.getElementById('bfRecipeSearch');input.addEventListener('input',function(){recipeQuery=input.value;applyRecipeFilter()});document.getElementById('bfOnlyBtn').onclick=function(){setBF(!bfOnly)}}
    document.querySelectorAll('.recipe').forEach(function(card){
      if(card.dataset.bfDecorated)return;var r=getRecipeForCard(card);if(!r)return;card.dataset.bfDecorated='1';if(!r.bf)return;card.dataset.bf='1';var head=card.querySelector('.recipehead');if(!head)return;var box=document.createElement('div');box.innerHTML='<button type="button" class="bfpill" title="Show all BF recipes"><img src="'+BADGE+'" alt="BF">BF • Likely Bariatric Friendly</button>'+(r.bfSource?'<span class="bfinformed">BF-informed</span>':'')+'<div class="bftraits">'+(r.bfTraits||[]).map(function(x){return'<span class="bftrait">'+x+'</span>'}).join('')+'</div><div class="bfnote"><b>Why BF:</b> '+(r.bfNote||'Designed around common bariatric eating considerations.')+'<br><b>Status:</b> not clinically verified yet.</div>';head.insertAdjacentElement('afterend',box);var pill=box.querySelector('.bfpill');if(pill)pill.onclick=function(){setBF(true);var controls=document.getElementById('bfControls');if(controls)controls.scrollIntoView({behavior:'smooth',block:'center'})}
    });
    applyRecipeFilter();
    var mainQ=document.getElementById('q');
    if(mainQ&&!mainQ.dataset.bfShortcutBound){mainQ.dataset.bfShortcutBound='1';mainQ.addEventListener('input',function(){setTimeout(function(){if(!aliasBF(mainQ.value))return;var foods=document.getElementById('foods'),count=document.getElementById('count');if(!foods)return;if(count)count.textContent='BF recipe results';foods.innerHTML='<article class="card bfshortcut" id="bfRecipeShortcut"><div class="top"><div class="foodname"><img src="'+BADGE+'" alt="BF" style="width:42px;height:42px;object-fit:contain"><div><h3>Likely Bariatric Friendly recipes</h3><div class="group">CBE first • BF second</div></div></div><span class="status strong">Open recipes</span></div><p class="reason">“BF,” “bariatric,” and “WLS” are recipe filters in CBE. Tap here to see only CBE recipes carrying the BF tag.</p></article>';var shortcut=document.getElementById('bfRecipeShortcut');if(shortcut)shortcut.onclick=function(){if(typeof activateTab==='function')activateTab('recipesTab');setBF(true);setTimeout(function(){var c=document.getElementById('bfControls');if(c)c.scrollIntoView({behavior:'smooth',block:'start'})},80)}},0)})}
  }
  window.CBE_BF_FILTER={show:function(){setBF(true)},clear:function(){setBF(false)},apply:applyRecipeFilter};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate);else setTimeout(decorate,0);
})();