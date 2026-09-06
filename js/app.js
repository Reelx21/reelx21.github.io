(() => {
"use strict";

const feed=document.getElementById("feed");
const viewsKey="reelx21_views", likesKey="reelx21_likes";
let views=read(viewsKey), likes=read(likesKey);

function read(k){try{return JSON.parse(localStorage.getItem(k)||"{}")}catch{return{}}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function fmt(n){n=Number(n||0);return n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(1)+"K":String(n)}
function poster(src){return src.includes("res.cloudinary.com/")?src.replace("/video/upload/","/video/upload/so_0/").replace(/\.(mp4|webm|mov)(\?.*)?$/i,".jpg"):""}

function videoCard(v,i){
 const c=document.createElement("article"); c.className="reel"; c.dataset.id=v.id;
 c.innerHTML=`
  <video class="reel-video" playsinline webkit-playsinline preload="metadata" ${poster(v.src)?`poster="${esc(v.poster||poster(v.src))}"`:""}>
   <source src="${esc(v.src)}" type="video/mp4">
  </video>
  <div class="shade"></div>
  <div class="info"><h2>${esc(v.title||"Reel")}</h2><p>${esc(v.description||"")}</p></div>
  <div class="actions">
   <button class="like" type="button"><b>${likes[v.id]?"♥":"♡"}</b><small>${likes[v.id]?"Liked":"Like"}</small></button>
   <button class="share" type="button"><b>↗</b><small>Share</small></button>
   <button class="sound" type="button"><b>🔇</b><small>Sound</small></button>
   <span class="views"><b>◉</b><small>${fmt(views[v.id])}</small></span>
  </div>
  <button class="play" type="button">▶</button>`;
 const vid=c.querySelector("video"), play=c.querySelector(".play");
 vid.muted=true;

 play.onclick=()=>vid.paused?vid.play().catch(()=>{}):vid.pause();
 vid.onclick=()=>vid.paused?vid.play().catch(()=>{}):vid.pause();
 vid.onplay=()=>play.classList.add("hidden");
 vid.onpause=()=>play.classList.remove("hidden");

 c.querySelector(".sound").onclick=()=>{
   vid.muted=!vid.muted;
   c.querySelector(".sound b").textContent=vid.muted?"🔇":"🔊";
 };
 c.querySelector(".like").onclick=()=>{
   likes[v.id]=!likes[v.id]; write(likesKey,likes);
   const b=c.querySelector(".like b"), s=c.querySelector(".like small");
   b.textContent=likes[v.id]?"♥":"♡"; s.textContent=likes[v.id]?"Liked":"Like";
 };
 c.querySelector(".share").onclick=()=>{
   const u=new URL(location.href); u.searchParams.set("v",v.id);
   if(navigator.share) navigator.share({title:v.title||"Reelx21",url:u.href}).catch(()=>{});
   else if(navigator.clipboard) navigator.clipboard.writeText(u.href).then(()=>alert("Link disalin."));
 };

 /*
   V5 flow:
   VIDEO -> AD CARD -> NEXT VIDEO -> AD CARD -> ...
   The ad card is a normal scroll snap section. It does not cover the video.
 */
 vid.addEventListener("timeupdate",()=>{
   if(vid.duration && vid.currentTime >= vid.duration-0.15 && !vid.dataset.advancing){
     vid.dataset.advancing="1";
     vid.pause();
     const next=c.nextElementSibling;
     if(next) next.scrollIntoView({behavior:"smooth",block:"start"});
   }
 });
 vid.addEventListener("ended",()=>{
   if(!vid.dataset.advancing){
     vid.dataset.advancing="1";
     const next=c.nextElementSibling;
     if(next) next && next.scrollIntoView({behavior:"smooth",block:"start"});
   }
 });
 return c;
}

function adCard(kind,index){
 const c=document.createElement("section"); c.className="ad-slide";
 c.dataset.ad=kind;
 let html="";
 if(kind==="native") html=AD_CODES.native;
 else if(kind==="banner300") html=AD_CODES.banner300;
 else if(kind==="banner320") html=AD_CODES.banner320;
 c.innerHTML=`<div class="ad-inner"><div class="ad-label">ADVERTISEMENT</div><div class="ad-slot">${html}</div><button class="skip-ad" type="button">Lanjut ke video</button></div>`;
 c.querySelector(".skip-ad").onclick=()=>{
   const n=c.nextElementSibling; if(n)n.scrollIntoView({behavior:"smooth"});
 };
 return c;
}

if(!Array.isArray(VIDEOS)||!VIDEOS.length){
 feed.innerHTML='<div class="empty">Tambahkan video di js/videos.js</div>'; return;
}

/*
  For each video: video, then ad.
  Native is used after video 1, 300x250 after video 2, 320x50 after video 3,
  then the pattern repeats. Popunder script is loaded once in the page via
  ads.js only if the provider script is placed in the HTML by the owner.
*/
VIDEOS.forEach((v,i)=>{
 feed.appendChild(videoCard(v,i));
 const kind=["native","banner300","banner320"][i%3];
 feed.appendChild(adCard(kind,i));
});

const io=new IntersectionObserver(entries=>{
 entries.forEach(e=>{
  const el=e.target;
  if(!e.isIntersecting||e.intersectionRatio<.65)return;
  if(el.classList.contains("reel")){
   document.querySelectorAll(".reel-video").forEach(x=>{if(x!==el.querySelector("video"))x.pause()});
   const v=el.querySelector("video"); v.dataset.advancing="";
   v.play().catch(()=>{});
   const id=el.dataset.id;
   if(!el.dataset.viewed){el.dataset.viewed="1";views[id]=Number(views[id]||0)+1;write(viewsKey,views);el.querySelector(".views small").textContent=fmt(views[id])}
  }
 }
},{threshold:[0,.65,1]});

document.querySelectorAll(".reel,.ad-slide").forEach(x=>io.observe(x));

/* Inject the Popunder script once. The provider controls its own trigger/frequency. */
const pop=document.createElement("script");
pop.src="https://pl31219981.profitableratecpmnetwork.com/4b/c4/ab/4bc4ab60ca5e880efb21d062653454fa.js";
document.body.appendChild(pop);
})();