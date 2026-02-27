const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

window.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 820px)").matches;
  const ENQUIRY_EMAIL = "thiteswapnil1212@gmail.com";

  initLoader();
  initMediaFallbacks();
  initMediaOptimization();
  initMenu();
  initLanguageMenu();
  initScrollProgress();
  initScrollSpy();
  initSmartNav();
  initBackToTop();
  initParallax(prefersReducedMotion || isMobile);
  initParallaxCards(prefersReducedMotion || isMobile);
  initRevealAndTyping(prefersReducedMotion);
  initScrollDrift(prefersReducedMotion);
  initCompareSlider();
  initGalleryFilter();
  initLightbox();
  initInspiration();
  initFaq();
  initQuiz();
  initEstimator();
  initPlanner();
  initEnquiryForm();
  initConsultModal();
  initCallNotice();
  initCounter(prefersReducedMotion);
  initTestimonials();
  initCanvas(prefersReducedMotion || isMobile);
  initSubmitGuards();

  function initMediaFallbacks() {
    const imageFallback =
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80";
    const videoPosterFallback =
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80";

    $$("img").forEach((img) => {
      img.addEventListener("error", () => {
        if (img.dataset.fallbackApplied === "true") return;
        img.dataset.fallbackApplied = "true";
        img.src = imageFallback;
      });
    });

    $$("video").forEach((video) => {
      video.addEventListener("error", () => {
        if (video.dataset.fallbackApplied === "true") return;
        video.dataset.fallbackApplied = "true";
        video.removeAttribute("autoplay");
        video.removeAttribute("loop");
        video.controls = false;
        video.poster = videoPosterFallback;
        video.style.background =
          "url('" + videoPosterFallback + "') center/cover no-repeat";
      });
    });
  }

  function initMediaOptimization() {
    const eagerImages = [$(".hero img"), $(".gallery .featured-card img")].filter(Boolean);
    eagerImages.forEach((img) => {
      img.loading = "eager";
      img.decoding = "sync";
      img.fetchPriority = "high";
    });

    $$("img").forEach((img) => {
      if (eagerImages.includes(img)) return;
      img.loading = "lazy";
      img.decoding = "async";
    });
  }

  function initLoader() {
    const loader = $("#page-loader");
    if (!loader) return;

    loader.classList.add("show");
    const hide = () => {
      loader.classList.remove("show");
      setTimeout(() => {
        loader.style.display = "none";
      }, 300);
    };

    window.addEventListener("load", () => setTimeout(hide, 500), { once: true });
    setTimeout(hide, 1500);
  }

  function initMenu() {
    const menuToggle = $(".menu-toggle");
    const navLinks = $(".nav-links");
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$("a", navLinks).forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initLanguageMenu() {
    const toggle = $("#lang-toggle");
    const dropdown = $("#lang-dropdown");
    if (!toggle || !dropdown) return;

    toggle.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("#lang-menu")) dropdown.classList.remove("open");
    });
  }

  function initScrollProgress() {
    const scrollBar = $("#scroll-progress-bar");
    const sectionFill = $("#section-progress-fill");
    const sections = $$(".scroll-section");

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      if (scrollBar) scrollBar.style.width = `${Math.min(100, scrollPercent)}%`;

      if (sectionFill && sections.length) {
        let currentSection = 0;
        for (let i = 0; i < sections.length; i += 1) {
          if (sections[i].getBoundingClientRect().top <= window.innerHeight * 0.45) {
            currentSection = i + 1;
          }
        }
        sectionFill.style.width = `${(currentSection / sections.length) * 100}%`;
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function initScrollSpy() {
    const navLinks = $$(".nav-links a[href^='#']");
    if (!navLinks.length) return;

    const sectionMap = navLinks
      .map((link) => {
        const id = link.getAttribute("href");
        if (!id) return null;
        const section = $(id);
        if (!section) return null;
        return { link, section };
      })
      .filter(Boolean);

    if (!sectionMap.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const found = sectionMap.find((item) => item.section === visible.target);
        if (!found) return;

        navLinks.forEach((link) => link.classList.remove("active-link"));
        found.link.classList.add("active-link");
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-35% 0px -45% 0px" }
    );

    sectionMap.forEach((item) => observer.observe(item.section));
  }

  function initSmartNav() {
    const nav = $("nav");
    if (!nav) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastY + 6;
      const closeToTop = currentY < 80;
      nav.classList.toggle("nav-hidden", goingDown && !closeToTop);
      nav.classList.toggle("nav-solid", currentY > 24);
      lastY = currentY;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
  }

  function initBackToTop() {
    const button = $(".back-to-top");
    if (!button) return;

    const toggleVisibility = () => {
      button.classList.toggle("show", window.scrollY > 400);
    };

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
  }

  function initParallax(disable) {
    const targets = $$(".parallax-target");
    if (!targets.length) return;

    if (disable) {
      targets.forEach((el) => {
        el.style.transform = "none";
      });
      return;
    }

    let ticking = false;
    const update = () => {
      const viewportH = window.innerHeight;
      targets.forEach((el) => {
        const intensity = Number(el.getAttribute("data-parallax") || 0.08);
        const rect = el.getBoundingClientRect();
        const distance = rect.top - viewportH / 2;
        const translate = distance * intensity * -0.22;
        el.style.transform = `translate3d(0, ${translate.toFixed(2)}px, 0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  function initParallaxCards(disable) {
    const cards = $$(".service-card, .process-card, .package-card, .quiz-block, .gallery .card");
    if (!cards.length) return;

    cards.forEach((card) => card.classList.add("parallax-hover"));
    if (disable) return;

    cards.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        const rx = (0.5 - py) * 8;
        const ry = (px - 0.5) * 8;
        card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        card.style.setProperty("--tz", "7px");
      });

      const reset = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--tz", "0px");
      };

      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointerup", reset);
      reset();
    });
  }

  function initRevealAndTyping(reducedMotion) {
    const revealTargets = $$(".reveal-up, .depth-scroll, .scroll-section, .service-card, .process-card, .package-card, .quiz-block, .gallery .card, .gallery .featured-card");
    revealTargets.forEach((el) => el.classList.add("pre-reveal"));

    const typedTargets = $$(".type-on-view");
    typedTargets.forEach((el) => {
      const sourceText = el.getAttribute("data-text") || el.textContent || "";
      el.setAttribute("data-source", sourceText);
      if (!reducedMotion) el.textContent = "";
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("in-view");
          el.classList.remove("pre-reveal");

          if (
            el.matches(
              ".service-card, .process-card, .quiz-block, .package-card, .gallery .card, .gallery .featured-card"
            )
          ) {
            el.classList.remove("blink-on-scroll");
            // Reflow ensures animation retriggers consistently.
            void el.offsetWidth;
            el.classList.add("blink-on-scroll");
          }

          if (el.classList.contains("type-on-view") && !reducedMotion) {
            runTypewriter(el);
          }

          obs.unobserve(el);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -5% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
    typedTargets.forEach((el) => observer.observe(el));

    if (reducedMotion) {
      typedTargets.forEach((el) => {
        el.textContent = el.getAttribute("data-source") || "";
      });
    }
  }

  function runTypewriter(el) {
    if (el.dataset.typedDone === "true") return;

    const fullText = el.getAttribute("data-source") || "";
    const speed = Math.max(12, Number(el.getAttribute("data-speed") || 34));
    let index = 0;
    el.textContent = "";

    const tick = () => {
      index += 1;
      el.textContent = fullText.slice(0, index);
      if (index < fullText.length) {
        window.setTimeout(tick, speed);
      } else {
        el.dataset.typedDone = "true";
      }
    };

    tick();
  }

  function initScrollDrift(disable) {
    const driftTargets = $$(".scroll-drift");
    if (!driftTargets.length) return;

    if (disable) {
      driftTargets.forEach((el) => {
        el.style.transform = "none";
        el.style.opacity = "1";
      });
      return;
    }

    let ticking = false;
    const update = () => {
      driftTargets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerOffset = rect.top - window.innerHeight * 0.52;
        const shift = Math.max(-26, Math.min(26, centerOffset * -0.04));
        const opacity = Math.max(0.4, Math.min(1, 1 - Math.abs(centerOffset) / window.innerHeight));
        el.style.transform = `translate3d(${shift.toFixed(2)}px, 0, 0)`;
        el.style.opacity = opacity.toFixed(2);
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  function initCompareSlider() {
    const section = $(".before-after");
    const compareWrap = $("#compare-wrap");
    const compareRange = $("#compare-range");
    const compareOverlay = $("#compare-overlay");
    const baseImage = $(".compare-base", compareWrap || document);
    const afterImage = $("#compare-overlay img");

    const removeSection = () => {
      if (section && section.parentNode) section.parentNode.removeChild(section);
    };

    try {
      if (!section || !compareWrap || !compareRange || !compareOverlay || !baseImage || !afterImage) {
        removeSection();
        return;
      }

      const onImageError = () => removeSection();
      baseImage.addEventListener("error", onImageError, { once: true });
      afterImage.addEventListener("error", onImageError, { once: true });

      let dragging = false;

      const setPercent = (value) => {
        const safe = Math.max(0, Math.min(100, Number(value) || 50));
        compareRange.value = String(safe);
        compareOverlay.style.width = `${safe}%`;
      };

      const setFromClientX = (clientX) => {
        const rect = compareWrap.getBoundingClientRect();
        if (!rect.width) return;
        const percent = ((clientX - rect.left) / rect.width) * 100;
        setPercent(percent);
      };

      compareRange.addEventListener("input", () => setPercent(compareRange.value));

      compareWrap.addEventListener("pointerdown", (e) => {
        if (!(e.target instanceof Element)) return;
        dragging = true;
        compareWrap.classList.add("dragging");
        setFromClientX(e.clientX);
        compareWrap.setPointerCapture(e.pointerId);
      });

      compareWrap.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        setFromClientX(e.clientX);
      });

      const stopDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        compareWrap.classList.remove("dragging");
        if (e?.pointerId !== undefined) compareWrap.releasePointerCapture(e.pointerId);
      };

      compareWrap.addEventListener("pointerup", stopDrag);
      compareWrap.addEventListener("pointercancel", stopDrag);

      setPercent(compareRange.value || 50);
    } catch (err) {
      removeSection();
    }
  }

  function initGalleryFilter() {
    const filterButtons = $$(".filter-btn");
    const cards = $$(".gallery .card");
    const featured = $(".gallery .featured-card");
    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter") || "all";
        cards.forEach((card) => {
          const show = filter === "all" || card.getAttribute("data-category") === filter;
          card.style.display = show ? "block" : "none";
        });

        if (featured) {
          const showFeatured =
            filter === "all" || featured.getAttribute("data-category") === filter;
          featured.style.display = showFeatured ? "block" : "none";
        }
      });
    });
  }

  function initLightbox() {
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightbox-image");
    const closeBtn = $("#lightbox-close");
    const galleryImages = $$(".gallery img");

    if (!lightbox || !lightboxImage || !galleryImages.length) return;

    const open = (src, alt) => {
      lightboxImage.src = src;
      lightboxImage.alt = alt || "Project preview";
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    };

    const close = () => {
      lightbox.classList.remove("show");
      lightbox.setAttribute("aria-hidden", "true");
    };

    galleryImages.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => open(img.src, img.alt));
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("show")) close();
    });
  }

  function initInspiration() {
    const data = {
      modern: {
        title: "Modern Minimal",
        text: "Clean lines, muted palette, smart storage and balanced lighting for clutter-free premium living.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
      },
      luxury: {
        title: "Luxury Premium",
        text: "Rich finishes, layered lighting and statement decor for a sophisticated, high-end home atmosphere.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80",
      },
      warm: {
        title: "Warm Elegant",
        text: "Natural textures, warm tones and soft forms that create inviting, timeless comfort.",
        image: "https://images.unsplash.com/photo-1616594039964-8b9f8b58f8d6?auto=format&fit=crop&w=1400&q=80",
      },
    };

    const buttons = $$("#inspo-controls button");
    const image = $("#inspo-image");
    const title = $("#inspo-title");
    const text = $("#inspo-text");
    if (!buttons.length || !image || !title || !text) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const key = btn.getAttribute("data-style") || "modern";
        const item = data[key] || data.modern;

        image.style.opacity = "0.2";
        window.setTimeout(() => {
          image.src = item.image;
          image.alt = `${item.title} interior style`;
          title.textContent = item.title;
          text.textContent = item.text;
          image.style.opacity = "1";
        }, 160);
      });
    });
  }

  function initFaq() {
    $$(".faq-item").forEach((item) => {
      const question = $(".faq-question", item);
      if (!question) return;

      question.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open");
        question.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  function initQuiz() {
    const quizResult = $("#quiz-result");
    if (!quizResult) return;

    const answers = {};
    const output = {
      modern: [
        "Your recommended style: Modern Minimal",
        "Go for neutral tones, streamlined furniture and hidden storage.",
      ],
      luxury: [
        "Your recommended style: Luxury Premium",
        "Choose bold accents, premium finishes and dramatic lighting.",
      ],
      warm: [
        "Your recommended style: Warm Elegant",
        "Use earthy colors, curved forms and layered textures.",
      ],
    };

    const render = () => {
      const values = Object.values(answers);
      if (values.length < 3) {
        quizResult.innerHTML = "<strong>Your style recommendation appears here.</strong><p>Complete all 3 answers to get your suggested design style.</p>";
        return;
      }

      const score = { modern: 0, luxury: 0, warm: 0 };
      values.forEach((v) => {
        if (score[v] !== undefined) score[v] += 1;
      });

      const best = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
      const [heading, desc] = output[best] || output.modern;
      quizResult.innerHTML = `<strong>${heading}</strong><p>${desc}</p>`;
    };

    $$(".quiz-options").forEach((group) => {
      const key = group.getAttribute("data-question") || "";
      const buttons = $$("button", group);
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          if (key) answers[key] = btn.getAttribute("data-value") || "modern";
          render();
        });
      });
    });
  }

  function initEstimator() {
    const form = $("#estimate-form");
    const result = $("#estimate-result");
    if (!form || !result) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const room = $("#room-type")?.value || "";
      const area = Number($("#room-area")?.value || 0);
      const finish = $("#finish-level")?.value || "";

      if (!room || !area || !finish || area < 50) {
        result.textContent = "Please enter valid details (minimum area: 50 sq ft).";
        return;
      }

      const roomRate = { living: 1800, bedroom: 1500, kitchen: 2200, fullhome: 2000 };
      const finishFactor = { basic: 1, premium: 1.35, luxury: 1.8 };
      const perSqft = roomRate[room] || 1600;
      const total = Math.round(area * perSqft * (finishFactor[finish] || 1));

      result.textContent = `Estimated budget: Rs ${total.toLocaleString("en-IN")} (approx.)`;
    });
  }

  function initPlanner() {
    const plannerGenerate = $("#planner-generate");
    const plannerCopy = $("#planner-copy");
    const plannerWhatsApp = $("#planner-whatsapp");
    const plannerSummary = $("#planner-summary");
    const plannerMessage = $("#planner-message");

    if (!plannerGenerate || !plannerSummary) return;

    const buildText = () => {
      const spaces = $$('input[name="space"]:checked').map((el) => el.value);
      const style = $("#planner-style")?.value || "";
      const timeline = $("#planner-timeline")?.value || "";
      const budget = $("#planner-budget")?.value || "";

      return [
        "Interior Project Requirement:",
        `Spaces: ${spaces.join(", ") || "None"}`,
        `Style: ${style || "Not selected"}`,
        `Timeline: ${timeline || "Not selected"}`,
        `Budget: ${budget || "Not selected"}`,
      ].join("\n");
    };

    const validatePlanner = () => {
      const spaces = $$('input[name="space"]:checked').length;
      const style = $("#planner-style")?.value || "";
      const timeline = $("#planner-timeline")?.value || "";
      const budget = $("#planner-budget")?.value || "";

      if (!spaces) return "Select at least one space.";
      if (!style || !timeline || !budget) return "Please choose style, timeline, and budget.";
      return "";
    };

    plannerGenerate.addEventListener("click", () => {
      const error = validatePlanner();
      if (error) {
        plannerSummary.value = "";
        if (plannerMessage) plannerMessage.textContent = error;
        return;
      }

      const text = buildText();
      plannerSummary.value = text;

      if (plannerWhatsApp) {
        plannerWhatsApp.href = `https://wa.me/919921260926?text=${encodeURIComponent(text)}`;
      }

      if (plannerMessage) plannerMessage.textContent = "Summary generated.";
    });

    if (plannerCopy) {
      plannerCopy.addEventListener("click", async () => {
        if (!plannerSummary.value) {
          if (plannerMessage) plannerMessage.textContent = "Generate summary first.";
          return;
        }

        try {
          await navigator.clipboard.writeText(plannerSummary.value);
          if (plannerMessage) plannerMessage.textContent = "Summary copied.";
        } catch (err) {
          if (plannerMessage) plannerMessage.textContent = "Copy failed. Please copy manually.";
        }
      });
    }
  }

  function initEnquiryForm() {
    const form = $("#enquiry-form");
    const message = $("#form-message");
    if (!form || !message) return;

    form.method = "POST";
    form.action = `https://formsubmit.co/${ENQUIRY_EMAIL}`;
    form.target = "_blank";

    const ensureHidden = (name, value) => {
      let input = $(`input[name='${name}']`, form);
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
    };

    // Keep request provider-friendly and less likely to be rejected.
    ensureHidden("_subject", "New Interior Enquiry");
    ensureHidden("_template", "table");
    ensureHidden("_honey", "");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("#name")?.value?.trim() || "";
      const phone = $("#phone")?.value?.trim() || "";
      const requirement = $("#requirement")?.value?.trim() || "";
      const sendBtn = $("button[type='submit']", form);

      if (!name || !phone || !requirement) {
        message.textContent = "Please fill all required fields.";
        return;
      }

      const digitsOnly = phone.replace(/\D/g, "");
      let normalizedPhone = digitsOnly;
      if (normalizedPhone.length === 11 && normalizedPhone.startsWith("0")) {
        normalizedPhone = normalizedPhone.slice(1);
      }
      if (normalizedPhone.length === 12 && normalizedPhone.startsWith("91")) {
        normalizedPhone = normalizedPhone.slice(2);
      }

      if (!/^\d{10}$/.test(normalizedPhone)) {
        message.textContent = "Please enter a valid phone (10 digits, or +91 format).";
        return;
      }

      const phoneField = $("#phone");
      if (phoneField) phoneField.value = normalizedPhone;

      if (/(https?:\/\/|www\.)/i.test(requirement)) {
        message.textContent = "Please remove links from requirement text and submit again.";
        return;
      }

      const safeRequirement = requirement.replace(/[<>]/g, "").slice(0, 900);
      const requirementField = $("#requirement");
      if (requirementField) requirementField.value = safeRequirement;

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.dataset.prevText = sendBtn.textContent || "SEND ENQUIRY";
        sendBtn.textContent = "SENDING...";
      }

      message.textContent = `Opening secure submit for ${ENQUIRY_EMAIL}...`;
      form.submit();
      message.textContent = `Enquiry submitted. If this is first time, confirm activation email sent to ${ENQUIRY_EMAIL}.`;

      window.setTimeout(() => {
        form.reset();
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.textContent = sendBtn.dataset.prevText || "SEND ENQUIRY";
        }
      }, 800);
    });
  }

  function initSubmitGuards() {
    const forms = ["#consult-form", "#estimate-form"]
      .map((id) => $(id))
      .filter(Boolean);

    forms.forEach((form) => {
      form.addEventListener("submit", () => {
        const submit = $("button[type='submit']", form);
        if (!submit) return;
        if (submit.dataset.locked === "true") return;
        submit.dataset.locked = "true";
        const original = submit.textContent;
        submit.textContent = "Please wait...";
        submit.disabled = true;
        window.setTimeout(() => {
          submit.disabled = false;
          submit.dataset.locked = "false";
          submit.textContent = original;
        }, 2500);
      });
    });
  }

  function initConsultModal() {
    const modal = $("#consult-modal");
    const openBtn = $("#open-consult");
    const closeBtn = $("#consult-close");
    const form = $("#consult-form");
    const message = $("#consult-message");

    if (!modal) return;

    const setVisible = (visible) => {
      modal.classList.toggle("show", visible);
      modal.setAttribute("aria-hidden", String(!visible));
      document.body.style.overflow = visible ? "hidden" : "";
    };

    if (openBtn) openBtn.addEventListener("click", () => setVisible(true));
    if (closeBtn) closeBtn.addEventListener("click", () => setVisible(false));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) setVisible(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        setVisible(false);
      }
    });

    if (form && message) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const values = ["#consult-name", "#consult-phone", "#consult-city", "#consult-date", "#consult-time"].map(
          (id) => $(id)?.value?.trim() || ""
        );

        if (values.some((v) => !v)) {
          message.textContent = "Please complete all details.";
          return;
        }

        message.textContent = "Consultation request submitted successfully.";
        form.reset();
        setTimeout(() => setVisible(false), 900);
      });
    }
  }

  function initCallNotice() {
    const callNotice = $("#call-notice");
    const close = $("#call-close");
    if (!callNotice || !close) return;

    callNotice.classList.remove("show");

    let hideTimer = null;

    const closePopup = () => {
      callNotice.classList.remove("show");
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
    };

    const openPopup = () => {
      callNotice.classList.add("show");
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(closePopup, 3000);
    };

    const popupTimer = window.setTimeout(openPopup, 5000);

    callNotice.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".call-close")) return;
      if (!callNotice.classList.contains("show")) openPopup();
    });

    close.addEventListener("click", () => {
      window.clearTimeout(popupTimer);
      closePopup();
      callNotice.style.display = "none";
    });
  }

  function initCounter(reducedMotion) {
    const counter = $(".stat");
    if (!counter) return;

    const target = Number(counter.getAttribute("data-target") || 0);
    if (!target) return;

    const animate = () => {
      if (reducedMotion) {
        counter.textContent = String(target);
        return;
      }

      let value = 0;
      const duration = 1100;
      const start = performance.now();

      const step = (time) => {
        const progress = Math.min(1, (time - start) / duration);
        value = Math.floor(progress * target);
        counter.textContent = String(value);
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate();
          obs.disconnect();
        });
      },
      { threshold: 0.45 }
    );

    observer.observe(counter);
  }

  function initTestimonials() {
    const textNode = $("#testimonial-text");
    const dotsWrap = $("#testimonial-dots");
    if (!textNode || !dotsWrap) return;

    const testimonials = [
      "Every room now feels premium and perfectly planned.",
      "The execution quality and timeline commitment were excellent.",
      "From concept to handover, the process felt smooth and professional.",
    ];

    let current = 0;
    dotsWrap.innerHTML = "";

    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Testimonial ${index + 1}`);
      dot.addEventListener("click", () => render(index));
      dotsWrap.appendChild(dot);
    });

    const dots = $$(".dot", dotsWrap);

    const render = (index) => {
      current = index;
      textNode.style.opacity = "0";
      setTimeout(() => {
        textNode.textContent = testimonials[current];
        textNode.style.opacity = "1";
      }, 170);
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    };

    let timer = null;
    const start = () => {
      stop();
      timer = setInterval(() => {
        render((current + 1) % testimonials.length);
      }, 4200);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
    };

    start();
    dotsWrap.addEventListener("mouseenter", stop);
    dotsWrap.addEventListener("mouseleave", start);
  }

  function initCanvas(disable) {
    const canvas = $("#studio-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const particles = [];
    const baseCount = disable ? 16 : 32;
    for (let i = 0; i < baseCount; i += 1) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0016,
        vy: (Math.random() - 0.5) * 0.0016,
        r: Math.random() * 2 + 1,
      });
    }

    const pointer = { x: 0.5, y: 0.5, active: false };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(5,5,5,0.7)";
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        const px = p.x * w;
        const py = p.y * h;

        if (pointer.active) {
          const dx = pointer.x * w - px;
          const dy = pointer.y * h - py;
          const dist = Math.max(40, Math.hypot(dx, dy));
          p.x -= (dx / dist) * 0.00008;
          p.y -= (dy / dist) * 0.00008;
        }

        ctx.beginPath();
        ctx.fillStyle = "rgba(212,175,55,0.8)";
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const qx = q.x * w;
          const qy = q.y * h;
          const d = Math.hypot(px - qx, py - qy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(212,175,55,${(1 - d / 120) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(qx, qy);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    canvas.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    });

    canvas.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    setSize();
    draw();
    window.addEventListener("resize", setSize);
  }
});

