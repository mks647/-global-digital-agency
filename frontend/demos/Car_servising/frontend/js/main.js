(() => {
  "use strict";
  document.documentElement.classList.add("js-enabled");
  const cfg = window.DEMO_CONFIG || {};
  const toggle = document.querySelector("#menuToggle"), nav = document.querySelector("#navMenu");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open)); nav.classList.toggle("is-open", !open);
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open"); toggle?.setAttribute("aria-expanded","false");
  }));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }), {threshold:.12});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add("is-visible"));
  const phone = document.querySelector("#phoneLink"), phoneText = document.querySelector("#phoneText");
  const wa = document.querySelector("#waLink"), mail = document.querySelector("#emailLink"), mailText = document.querySelector("#emailText");
  if(cfg.phoneLink) phone.href = `tel:${cfg.phoneLink}`;
  if(cfg.phoneDisplay) phoneText.textContent = cfg.phoneDisplay;
  if(cfg.whatsapp) wa.href = `https://wa.me/${String(cfg.whatsapp).replace(/\\D/g,"")}`;
  if(cfg.email) {mail.href=`mailto:${cfg.email}`;mailText.textContent=cfg.email;}
  document.querySelector("#year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-package]").forEach(a=>a.addEventListener("click",()=>document.querySelector("#package").value=a.dataset.package));
  const form=document.querySelector("#enquiryForm"), status=document.querySelector("#formStatus");
  form?.addEventListener("submit",async ev=>{
    ev.preventDefault(); if(!form.reportValidity()) return;
    const data=Object.fromEntries(new FormData(form).entries()), btn=form.querySelector("button[type=submit]");
    btn.disabled=true;status.textContent="Sending…";
    try{
      if(cfg.backendEnabled){
        const r=await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
        const j=await r.json();if(!r.ok)throw Error(j.message||"Submission failed.");
        status.textContent="Thanks — your enquiry has been received.";
      }else status.textContent="Demo complete — nothing was sent or stored. Connect the optional backend to receive enquiries.";
      form.reset();
    }catch(e){status.textContent=e.message||"Something went wrong.";}
    finally{btn.disabled=false;}
  });
})();
