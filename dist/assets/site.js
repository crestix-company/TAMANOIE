const menu=document.querySelector('#mobile-menu');
const toggle=document.querySelector('.menu-toggle');
if(menu&&toggle){
 const close=()=>{menu.close();toggle.setAttribute('aria-expanded','false');toggle.focus();};
 toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true');});
 menu.querySelector('.menu-close').addEventListener('click',close);
 menu.addEventListener('cancel',()=>toggle.setAttribute('aria-expanded','false'));
 menu.addEventListener('click',event=>{if(event.target===menu){const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.close();toggle.setAttribute('aria-expanded','false');}));
}
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 const elements=[...document.querySelectorAll('.reveal')];
 if(elements.length){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
  elements.forEach(element=>observer.observe(element));
  document.documentElement.classList.add('motion-ready');
 }
}
