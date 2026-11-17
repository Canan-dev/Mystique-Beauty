/**
 * MYSTIQUE BEAUTY UNISEX SALON - INTERACTIVE SCRIPTS
 * Location: Nkizi Rd, Wandegeya, Kampala | Phone: +256 786 716564
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });
  }

  // 2. Sticky Navbar Glassmorphism on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Highlight Active Navigation Item Based on Scroll Position
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const updateActiveNavLink = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // 4. Set Minimum Date on Booking Input (Cannot pick dates before today)
  const appointmentDateInput = document.getElementById('appointmentDate');
  if (appointmentDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    appointmentDateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  // 5. Connect "Book Service" buttons to the appointment form & auto-select dropdown
  const selectServiceButtons = document.querySelectorAll('.select-service-btn');
  const serviceCategorySelect = document.getElementById('serviceCategory');

  selectServiceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const chosenService = btn.getAttribute('data-service');
      if (chosenService && serviceCategorySelect) {
        for (let i = 0; i < serviceCategorySelect.options.length; i++) {
          if (serviceCategorySelect.options[i].value === chosenService) {
            serviceCategorySelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // 6. Interactive Appointment Form -> Direct WhatsApp Booking
  const bookingForm = document.getElementById('bookingForm');
  const formAlert = document.getElementById('formAlert');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceCategory').value;
      const specificTreatment = document.getElementById('specificTreatment').value.trim();
      const date = document.getElementById('appointmentDate').value;
      const time = document.getElementById('appointmentTime').value;
      const notes = document.getElementById('additionalNotes').value.trim();

      // Basic validation
      if (!name || !service || !date || !time) {
        showFormAlert('Please fill in all required fields (Name, Service, Date, and Time).', 'error');
        return;
      }

      // Format clean date string (e.g. Wednesday, Nov 18, 2026)
      let formattedDate = date;
      try {
        const dateObj = new Date(date + 'T00:00:00');
        formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (err) {
        // Fallback to raw string
      }

      // Build structured WhatsApp message
      let message = `✨ *APPOINTMENT REQUEST* ✨\n`;
      message += `*Mystique Beauty Unisex Salon*\n`;
      message += `📍 Nkizi Rd, Wandegeya, Kampala\n\n`;
      message += `👤 *Client Name:* ${name}\n`;
      if (phone) {
        message += `📞 *Client Phone:* ${phone}\n`;
      }
      message += `💇 *Service:* ${service}\n`;
      if (specificTreatment) {
        message += `💅 *Treatment/Style:* ${specificTreatment}\n`;
      }
      message += `📅 *Preferred Date:* ${formattedDate}\n`;
      message += `⏰ *Time Slot:* ${time}\n`;
      if (notes) {
        message += `📝 *Notes/Requests:* ${notes}\n`;
      }
      message += `\n_Sent via Mystique Salon website appointment form_`;

      const salonWhatsAppNumber = '256786716564';
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${salonWhatsAppNumber}?text=${encodedMessage}`;

      showFormAlert('✅ Redirecting to WhatsApp with your appointment details...', 'success');

      // Open WhatsApp after a short delay for smooth UX
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    });
  }

  function showFormAlert(text, type) {
    if (!formAlert) return;
    formAlert.textContent = text;
    formAlert.className = `form-alert ${type}`;
    formAlert.style.display = 'block';
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // 7. Photo Gallery Category Filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 8. Gallery Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg && lightboxClose) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title')?.textContent || 'Mystique Beauty Unisex Salon';
        const cat = item.querySelector('.gallery-cat')?.textContent || '';

        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        lightboxCaption.innerHTML = `<strong>${title}</strong>${cat ? ` &bull; <span>${cat}</span>` : ''}`;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent background scroll
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 9. Dynamic Current Year in Footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
