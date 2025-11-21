// site.js - slider, services popup, booking & reviews to Firestore (expects window.MF)
document.addEventListener('DOMContentLoaded', () => {
  // Slider
  const slides = document.querySelectorAll('.slide');
  let idx = 0;
  if(slides.length){
    slides[0].classList.add('active');
    setInterval(()=>{
      slides[idx].classList.remove('active');
      idx = (idx+1)%slides.length;
      slides[idx].classList.add('active');
    }, 3500);
  }

  // Service details mapping (used by services page)
  window.SERVICE_DETAILS = {
    sofa:{title:"Sofa Cleaning", description:"Deep-cleaning: vacuum, stain treatment, hot-water extraction, deodorize, fast drying."},
    carpet:{title:"Carpet Cleaning", description:"Hot-water extraction, shampooing, deep stain removal and odor control."},
    steam:{title:"Steam Cleaning", description:"High-temperature steam sanitization removes germs and dust mites."},
    nano:{title:"Nano Coating", description:"Hydrophobic coating for long-lasting stain resistance and easy cleaning."}
  };

  window.openService = function(key){
    const d = window.SERVICE_DETAILS[key];
    if(!d) return;
    document.getElementById('popupTitle').innerText = d.title;
    document.getElementById('popupBody').innerText = d.description;
    document.getElementById('servicePopup').style.display = 'flex';
  };
  window.closeService = function(){ document.getElementById('servicePopup').style.display = 'none'; };

  // Booking form submission to Firestore
  const bookingForm = document.getElementById('booking-form');
  if(bookingForm && window.MF){
    bookingForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const data = {
        name: bookingForm.name.value,
        phone: bookingForm.phone.value,
        email: bookingForm.email.value,
        service: bookingForm.service.value,
        date: bookingForm.date.value,
        status: 'Pending',
        balance: 0,
        createdAt: new Date().toISOString()
      };
      try{
        await window.MF.addDoc(window.MF.collection(window.MF.db,'bookings'), data);
        window.location.href = 'thanks.html';
      }catch(err){ console.error(err); alert('Unable to create booking'); }
    });
  }

  // Review form
  const reviewForm = document.getElementById('review-form');
  if(reviewForm && window.MF){
    reviewForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      try{
        await window.MF.addDoc(window.MF.collection(window.MF.db,'reviews'), {
          name: reviewForm.name.value,
          rating: Number(reviewForm.rating.value),
          message: reviewForm.message.value,
          createdAt: new Date().toISOString()
        });
        alert('Thanks for your review!');
        reviewForm.reset();
      }catch(err){ console.error(err); alert('Unable to save review'); }
    });
  }

  // Admin real-time listeners
  if(document.getElementById('bookings-list') && window.MF){
    window.MF.onSnapshot(window.MF.collection(window.MF.db,'bookings'), snap=>{
      const el = document.getElementById('bookings-list'); el.innerHTML='';
      snap.forEach(doc=>{
        const d = doc.data();
        const item = document.createElement('div'); item.className='card'; item.style.marginBottom='10px';
        item.innerHTML = `<strong>${d.name}</strong> — ${d.service} — ${d.status} — ₹${d.balance}<p>${d.phone} ${d.email? '| '+d.email:''}</p>`;
        el.prepend(item);
      });
    });
  }
});


