/* ==========================================================================
   Limpu! — Main Application Script
   ========================================================================== */

import { initKanbanDemo } from './kanban-demo.js';
import { initSimulator } from './simulator.js';
import { initFAQ } from './faq.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Modules
  initKanbanDemo();
  initSimulator();
  initFAQ();

  // 2. Sticky Navbar & Active Scrollspy
  const navbar = document.querySelector('.navbar');
  const desktopNavLinks = Array.from(document.querySelectorAll('.nav-links .nav-link'));
  const mobileNavLinksList = Array.from(document.querySelectorAll('.mobile-nav-drawer .mobile-nav-link'));
  const allNavLinks = [...desktopNavLinks, ...mobileNavLinksList];

  const navSectionIds = desktopNavLinks
    .map(link => link.getAttribute('href')?.replace('#', ''))
    .filter(Boolean);

  const navSections = navSectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function updateNavbarScrollspy() {
    const scrollY = window.scrollY;

    // Sticky navbar shadow
    if (scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Determine current section in viewport
    const headerOffset = 140;
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    let activeId = '';

    if (isAtBottom && navSectionIds.length > 0) {
      activeId = navSectionIds[navSectionIds.length - 1];
    } else if (scrollY < 180) {
      activeId = '';
    } else {
      for (let i = navSections.length - 1; i >= 0; i--) {
        const section = navSections[i];
        if (section && scrollY >= (section.offsetTop - headerOffset)) {
          activeId = section.id;
          break;
        }
      }
    }

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (activeId && href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbarScrollspy, { passive: true });
  window.addEventListener('resize', updateNavbarScrollspy, { passive: true });
  updateNavbarScrollspy();

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        allNavLinks.filter(l => l.getAttribute('href') === href).forEach(l => l.classList.add('active'));
      }
    });
  });

  // 3. Mobile Navigation Toggle
  const navToggleBtn = document.getElementById('navToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (navToggleBtn && mobileNavDrawer) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = navToggleBtn.classList.toggle('open');
      mobileNavDrawer.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggleBtn.classList.remove('open');
        mobileNavDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. Audience Tabs (Casais / Roommates / Famílias)
  const tabButtons = document.querySelectorAll('.audience-tab-btn');
  const tabPanels = document.querySelectorAll('.audience-content-card');

  function switchAudienceTab(targetTab) {
    if (!targetTab) return;

    tabButtons.forEach(b => {
      if (b.dataset.tab === targetTab) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabPanels.forEach(p => p.classList.remove('active'));

    const activePanel = document.getElementById(`tabContent-${targetTab}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchAudienceTab(btn.dataset.tab);
    });
  });

  // Footer Audience Deep Links
  const footerAudienceLinks = document.querySelectorAll('[data-audience-target]');
  footerAudienceLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetTab = link.dataset.audienceTarget;
      if (targetTab) {
        switchAudienceTab(targetTab);
      }
    });
  });

  // 5. Scroll Animations & Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealElements = document.querySelectorAll('.card, .flow-step-card, .comparison-card, .achievement-card');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0.9';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

  // 6. Dynamic App CTA Link Resolver (Localhost Dev vs Production)
  function resolveAppUrl() {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocalhost) {
      const currentPort = parseInt(window.location.port, 10);
      // Mapeamento inteligente de portas do Vite (3000 -> 5174, 3002 -> 5175, etc.)
      let appPort = 5174;
      if (!isNaN(currentPort)) {
        if (currentPort === 3002) {
          appPort = 5175;
        } else if (currentPort >= 3000 && currentPort < 4000) {
          appPort = 5174 + (currentPort - 3000);
        }
      }
      return `http://${hostname}:${appPort}?start=1`;
    }

    // Em produção ou hospedagem relativa
    return '../AplicationWeb/?start=1';
  }

  const appCtaButtons = document.querySelectorAll('.btn-app-cta');
  appCtaButtons.forEach(btn => {
    btn.setAttribute('href', resolveAppUrl());
    btn.addEventListener('click', () => {
      btn.setAttribute('href', resolveAppUrl());
    });
  });
});
