
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  let idx=0;
  if(slides.length){
    slides[0].classList.add('active');
    setInterval(()=>{ slides[idx].classList.remove('active'); idx=(idx+1)%slides.length; slides[idx].classList.add('active'); }, 3000);
  }

  const serviceSelect = document.getElementById('service-select');
  if(serviceSelect){
    serviceSelect.addEventListener('change',(e)=>{
      const map = {
        'Sofa Cleaning':'Deep-clean sofa fabrics: vacuuming, spot treatment, extraction, drying.',
        'Carpet Cleaning':'Hot-water extraction & deodorizing for carpets.',
        'Curtain Cleaning':'Gentle cleaning for curtains, on-site/off-site.',
        'Steam Cleaning':'High-temp steam sanitization to kill germs.',
        'Nano Coating':'Hydrophobic coating to repel spills.',
        'Glass Coating':'Anti-fog and protective glass coating.'
      };
      document.getElementById('service-details').innerText = map[e.target.value]||'Select a service';
    });
  }

  // review submission and booking handled in other scripts or inline
});
