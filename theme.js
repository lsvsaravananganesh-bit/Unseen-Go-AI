/* UnseenGo USA Editorial Theme — persistent across every page. */
(function(){'use strict';
function addCss(href,key){if(document.querySelector('link[data-'+key+']'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.dataset[key]='1';document.head.appendChild(l)}
function load(){addCss('/Unseen-Go-AI/unseengo-usa-theme.css?v=20260827','ug-usa-theme');if(document.body&&document.body.classList.contains('discover-page'))addCss('/Unseen-Go-AI/discover-usa-theme.css?v=20260827','ug-discover-theme')}
const KEY='unseengo_theme';function saved(){try{return localStorage.getItem(KEY)||'dark'}catch(e){return'dark'}}
function apply(mode){document.documentElement.dataset.theme=mode;document.documentElement.classList.toggle('ug-light',mode==='light');const b=document.querySelector('.ug-theme-toggle');if(b){b.querySelector('.ug-theme-icon').textContent=mode==='light'?'☀':'☾';b.querySelector('.ug-theme-label').textContent=mode==='light'?'Light':'Dark'}}
function addToggle(){if(document.querySelector('.ug-theme-toggle'))return;const host=document.querySelector('.nav')||document.querySelector('header');if(!host)return;const b=document.createElement('button');b.type='button';b.className='ug-theme-toggle';b.innerHTML='<span class="ug-theme-icon"></span><span class="ug-theme-label"></span>';b.onclick=function(){const n=document.documentElement.classList.contains('ug-light')?'dark':'light';try{localStorage.setItem(KEY,n)}catch(e){}apply(n)};host.appendChild(b);apply(saved())}
load();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){load();addToggle()});else addToggle();
})();
