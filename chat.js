/* Portfolio chat widget.
   Answers from a built-in knowledge base (English + Arabic). Anything it can't answer is forwarded to Amr's Telegram
   through the Cloudflare Worker in /chat-backend, and his reply shows up here. */
(() => {
  "use strict";
  const CHAT_API = "https://amr-portfolio-chat.amrt6509.workers.dev"; // Cloudflare Worker (empty string = no live backend, falls back to email)
  const EMAIL = "amrt6509@gmail.com";
  const KEY = "amr_chat_v1",
    DAY = 864e5;
  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- UI strings (other site languages fall back to English) ---------- */
  const STR = {
    en: {
      title: "Ask Amr",
      open: "Open chat",
      close: "Close chat",
      placeholder: "Ask anything",
      send: "Send",
      more: "Suggested questions",
      on: "Online · replies live",
      off: "Offline · replies later",
      bot: "Assistant · instant answers",
      note: "Questions I can’t answer are sent to Amr. Nothing else leaves your browser.",
      hello:
        "Hi! I’m the assistant on Amr’s portfolio. Ask me about his projects, skills, certificates, or how to work with him.",
      sugg: [
        "What do you build?",
        "Show me the projects",
        "How can I hire you?",
        "Get the CV",
      ],
      unsure:
        "I’m not sure about that one, so Amr should answer it himself. Want his reply by email or WhatsApp too? Add it below (optional), then send.",
      contact: "Email or WhatsApp (optional)",
      sendAmr: "Send to Amr",
      no: "No thanks",
      sent: "Sent! Amr will answer right here. Your chat is saved in this browser, so you can close the page and come back.",
      sentOff:
        "Sent! Amr is offline right now, he’ll see it when he’s back. Your chat is saved in this browser.",
      fail: "I couldn’t reach Amr’s inbox. You can email him instead:",
      mailBtn: "Email Amr",
      fromAmr: "AMR REPLIED",
      skip: "No problem. Ask me anything else about the portfolio.",
      short:
        "Could you say a bit more? I answer questions about Amr’s work, skills and contact details.",
    },
    ar: {
      title: "اسأل عمرو",
      open: "فتح الشات",
      close: "إغلاق الشات",
      placeholder: "اسأل أي حاجة",
      send: "إرسال",
      more: "أسئلة مقترحة",
      on: "متصل · بيرد مباشرة",
      off: "غير متصل · هيرد لاحقًا",
      bot: "مساعد · ردود فورية",
      note: "الأسئلة اللي مقدرش أجاوب عليها بتتبعت لعمرو. غير كده مفيش حاجة بتخرج من متصفحك.",
      hello:
        "أهلاً! أنا مساعد بورتفوليو عمرو. اسألني عن مشاريعه ومهاراته وشهاداته، أو إزاي تشتغل معاه.",
      sugg: [
        "بتعمل إيه؟",
        "وريني المشاريع",
        "أقدر أوظفك إزاي؟",
        "حمّل السيرة الذاتية",
      ],
      unsure:
        "مش متأكد من الإجابة دي، فعمرو نفسه هو اللي لازم يرد. تحب يوصلك رده على الإيميل أو الواتساب كمان؟ سيبه تحت (اختياري) وابعت.",
      contact: "إيميل أو واتساب (اختياري)",
      sendAmr: "ابعت لعمرو",
      no: "لا شكرًا",
      sent: "اتبعت! عمرو هيرد هنا. المحادثة محفوظة في متصفحك، تقدر تقفل الصفحة وترجع.",
      sentOff:
        "اتبعت! عمرو أوفلاين دلوقتي وهيشوفها أول ما يرجع. المحادثة محفوظة في متصفحك.",
      fail: "معرفتش أوصّل لعمرو. ابعتله إيميل بدل كده:",
      mailBtn: "ابعت إيميل",
      fromAmr: "عمرو رد",
      skip: "ولا يهمك. اسألني أي حاجة تانية عن البورتفوليو.",
      short:
        "ممكن توضّح أكتر؟ أنا بجاوب عن شغل عمرو ومهاراته وطرق التواصل معاه.",
    },
  };

  /* ---------- Knowledge base (facts taken from the portfolio itself) ---------- */
  const go = (id, en, ar) => ({ go: id, en, ar });
  const KB = [
    {
      id: "greet",
      max: 5,
      k: [
        "hi",
        "hello",
        "hey",
        "salam",
        "good morning",
        "مرحبا",
        "اهلا",
        "السلام",
        "هاي",
        "صباح الخير",
        "مساء الخير",
      ],
      en: "Hello! Ask me about Amr’s projects, skills, certificates or how to hire him.",
      ar: "أهلاً بيك! اسألني عن مشاريع عمرو ومهاراته وشهاداته أو إزاي توظفه.",
    },
    {
      id: "thanks",
      max: 6,
      k: [
        "thanks",
        "thank you",
        "thx",
        "bye",
        "great",
        "شكرا",
        "تسلم",
        "مع السلامه",
        "ممتاز",
      ],
      en: "You’re welcome! Anything else?",
      ar: "العفو! في حاجة تانية؟",
    },
    {
      id: "bot",
      k: [
        "are you a bot",
        "are you human",
        "are you ai",
        "chatgpt",
        "انت بوت",
        "انت انسان",
        "انت ذكاء",
      ],
      en: "I’m an automated assistant that answers from Amr’s portfolio. When I can’t, I forward your question to Amr and his reply appears here.",
      ar: "أنا مساعد آلي بجاوب من محتوى بورتفوليو عمرو. لو مقدرتش، بابعت سؤالك لعمرو ورده بيظهر هنا.",
    },
    {
      id: "about",
      k: [
        "who is amr",
        "who are you",
        "about amr",
        "about you",
        "tell me about you",
        "tell me about amr",
        "introduce",
        "مين عمرو",
        "مين انت",
        "نبذه",
        "عرفني",
        "عن عمرو",
      ],
      en: "Amr Essam is a Software Engineering student from Kafr El Dawar, Egypt. He builds web apps and 2D games, is growing in cybersecurity, and also does graphic design (logos and car posters).",
      ar: "عمرو عصام طالب هندسة برمجيات من كفر الدوار، مصر. بيبني تطبيقات ويب وألعاب 2D، وبيتعمق في الأمن السيبراني، وبيشتغل تصميم جرافيك (لوجوهات وبوسترات سيارات).",
    },
    {
      id: "skills",
      k: [
        "skill",
        "stack",
        "technolog",
        "language",
        "python",
        "javascript",
        "php",
        "mysql",
        "sql",
        "godot",
        "gdscript",
        "tools",
        "what do you build",
        "what can you do",
        "مهارات",
        "تقنيات",
        "لغات",
        "بتعمل",
        "بيعمل",
        "تعرف",
      ],
      en: "Languages: Python, JavaScript, HTML/CSS, GDScript and PHP, with MySQL. Tools: Godot Engine, Git, Linux and Kali Linux. Security: Penetration Testing, Nmap, Burp Suite and Metasploit.",
      ar: "اللغات: Python وJavaScript وHTML/CSS وGDScript وPHP مع MySQL. الأدوات: Godot Engine وGit وLinux وKali Linux. الأمن: Penetration Testing وNmap وBurp Suite وMetasploit.",
      acts: [go("skills", "See skills", "شوف المهارات")],
    },
    {
      id: "projects",
      k: [
        "project",
        "work",
        "portfolio",
        "built",
        "app",
        "website",
        "مشاريع",
        "مشروع",
        "اعمال",
        "شغل",
        "موقع",
      ],
      en: "Six projects: ANDERMAGIC (2D platformer in Godot), HIDE AND SINK (multiplayer game), CAR-WASH BOOKING (PHP + MySQL), SALAH STORE (gaming top-up store), AGE CALCULATOR (Arabic Hijri/Gregorian tool) and HAND PLATFORMER (a game you control with your hand).",
      ar: "ست مشاريع: ANDERMAGIC (لعبة منصات 2D بـ Godot) وHIDE AND SINK (لعبة جماعية) وCAR-WASH BOOKING (PHP وMySQL) وSALAH STORE (متجر شحن ألعاب) وAGE CALCULATOR (حاسبة عمر هجري/ميلادي) وHAND PLATFORMER (لعبة بتلعبها بإيدك).",
      acts: [go("projects", "View projects", "شوف المشاريع")],
    },
    {
      id: "game",
      k: [
        "hand platformer",
        "hand tracking",
        "platformer",
        "mediapipe",
        "webcam",
        "game",
        "لعبه",
        "العاب",
        "ايد",
        "كاميرا",
      ],
      en: "Hand Platformer runs in your browser and uses your webcam: move your hand to run, close your fist to jump. 5 levels, a local leaderboard, and no video is ever uploaded. You can play it from its project card.",
      ar: "Hand Platformer بتشتغل في المتصفح وبتستخدم الكاميرا: حرّك إيدك عشان تجري واقفل قبضتك عشان تنط. 5 مستويات ولوحة متصدرين محلية، ولا فيديو بيتم رفعه. تقدر تلعبها من كارت المشروع.",
      acts: [go("game-project", "Open the game", "افتح اللعبة")],
    },
    {
      id: "cyber",
      k: [
        "cyber",
        "security",
        "pentest",
        "penetration",
        "hack",
        "nmap",
        "burp",
        "metasploit",
        "kali",
        "امن",
        "اختراق",
        "سيبراني",
      ],
      en: "Amr is growing in cybersecurity: IBM SkillsBuild Cybersecurity Fundamentals and Cisco Networking Basics, plus hands-on tools like Nmap, Burp Suite, Metasploit and Kali Linux.",
      ar: "عمرو بيتعمق في الأمن السيبراني: شهادة IBM SkillsBuild Cybersecurity Fundamentals وCisco Networking Basics، وأدوات زي Nmap وBurp Suite وMetasploit وKali Linux.",
      acts: [go("certificates", "See certificates", "شوف الشهادات")],
    },
    {
      id: "certs",
      k: [
        "cert",
        "tofas",
        "cisco",
        "ibm",
        "ef set",
        "credential",
        "verify",
        "شهاده",
        "شهادات",
      ],
      en: "TOFAS JavaScript Level 1 (Apr 2026) and Level 2 (Jun 2026), Cisco Networking Basics (May 2026), EF SET English B1 (Jun 2026) and IBM SkillsBuild Cybersecurity Fundamentals (Oct 2026). Each one has a verify link.",
      ar: "TOFAS JavaScript المستوى 1 (أبريل 2026) والمستوى 2 (يونيو 2026)، وCisco Networking Basics (مايو 2026)، وEF SET إنجليزي B1 (يونيو 2026)، وIBM SkillsBuild Cybersecurity Fundamentals (أكتوبر 2026). وكل واحدة ليها رابط تحقق.",
      acts: [go("certificates", "See certificates", "شوف الشهادات")],
    },
    {
      id: "edu",
      k: [
        "school",
        "education",
        "study",
        "student",
        "university",
        "degree",
        "مدرسه",
        "تعليم",
        "دراسه",
        "طالب",
        "جامعه",
      ],
      en: "Amr attends Salah Salem High School (General Secondary Education, 2026–2028).",
      ar: "عمرو في مدرسة صلاح سالم الثانوية (التعليم الثانوي العام، 2026–2028).",
    },
    {
      id: "where",
      k: [
        "where",
        "location",
        "country",
        "egypt",
        "kafr",
        "city",
        "فين",
        "مكان",
        "مصر",
        "كفر",
        "بلد",
      ],
      en: "Amr is based in Kafr El Dawar, Egypt.",
      ar: "عمرو موجود في كفر الدوار، مصر.",
    },
    {
      id: "cv",
      k: ["cv", "resume", "curriculum", "سيره", "سي في"],
      en: "There are two CV versions: a plain ATS/HR one and a designed one.",
      ar: "في نسختين من السيرة الذاتية: نسخة ATS/HR بسيطة ونسخة مصممة.",
      acts: [{ cv: 1, en: "Download CV", ar: "حمّل السيرة الذاتية" }],
    },
    {
      id: "design",
      k: [
        "design",
        "logo",
        "poster",
        "graphic",
        "designer",
        "تصميم",
        "لوجو",
        "بوستر",
        "جرافيك",
      ],
      en: "Amr also does graphic design: 6 logos, 8 automotive posters and client projects, all in the gallery sections.",
      ar: "عمرو بيشتغل تصميم جرافيك كمان: 6 لوجوهات و8 بوسترات سيارات ومشاريع لعملاء، كلها في أقسام المعرض.",
      acts: [go("logo-projects", "See the designs", "شوف التصميمات")],
    },
    {
      id: "contact",
      k: [
        "hire",
        "contact",
        "email",
        "reach",
        "telegram",
        "instagram",
        "discord",
        "whatsapp",
        "collaborate",
        "work with",
        "تواصل",
        "ايميل",
        "توظيف",
        "اوظف",
        "اشتغل معاك",
        "واتساب",
        "تليجرام",
      ],
      en: `The quickest way is the Hire me button or ${EMAIL}. He’s also on Telegram, Instagram, Discord and X (links in the Contact section).`,
      ar: `أسرع طريقة زرار Hire me أو الإيميل ${EMAIL}. وموجود كمان على تليجرام وإنستجرام وديسكورد وX (الروابط في قسم التواصل).`,
      acts: [
        {
          href: `mailto:${EMAIL}?subject=Project%20inquiry%20from%20your%20portfolio`,
          en: "Email Amr",
          ar: "ابعت إيميل",
          p: 1,
        },
        go("contact", "Contact section", "قسم التواصل"),
      ],
    },
  ];
  // Questions that need Amr personally (prices, dates, availability) always get forwarded
  const ESC = [
    "price",
    "cost",
    "rate",
    "rates",
    "charge",
    "quote",
    "budget",
    "how much",
    "deadline",
    "timeline",
    "available",
    "availability",
    "when can",
    "freelance rate",
    "discount",
    "سعر",
    "اسعار",
    "تكلفه",
    "بكام",
    "كام",
    "ميزانيه",
    "ميعاد",
    "متاح",
    "تسليم",
    "خصم",
  ];

  /* ---------- matching ---------- */
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0640]/g, "")
      .replace(/[إأآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  const hit = (q, kw) => {
    const k = norm(kw);
    return k.includes(" ") || k.length <= 3
      ? (" " + q + " ").includes(" " + k + " ")
      : (" " + q).includes(" " + k);
  };
  const tokens = (s) =>
    new Set(
      norm(s)
        .split(" ")
        .filter((w) => w.length >= 3),
    );
  let learned = [];

  function answerFor(text) {
    const q = norm(text),
      words = q ? q.split(" ").length : 0;
    // 1. answers Amr taught the bot himself
    const tq = tokens(text);
    for (const f of learned) {
      const tf = tokens(f.q);
      let n = 0;
      tq.forEach((w) => {
        if (tf.has(w)) n++;
      });
      if (n >= 2 && n / Math.min(tq.size, tf.size) >= 0.7)
        return { text: f.a, learned: true };
    }
    // 2. things only Amr can answer
    if (ESC.some((k) => hit(q, k))) return { esc: true };
    // 3. knowledge base: best score wins
    let best = null,
      bs = 0;
    for (const e of KB) {
      if (e.max && words > e.max) continue;
      const s = e.k.reduce(
        (n, k) => n + (hit(q, k) ? (norm(k).length > 3 ? 2 : 1) : 0),
        0,
      );
      if (s > bs) {
        bs = s;
        best = e;
      }
    }
    if (best && bs >= 1) return { entry: best };
    return q.length < 4 ? { short: true } : { esc: true };
  }

  /* ---------- state ---------- */
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  };
  const st = Object.assign({ sid: "", msgs: [], after: 0, until: 0 }, load());
  const save = () => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          sid: st.sid,
          msgs: st.msgs.slice(-60),
          after: st.after,
          until: st.until,
        }),
      );
    } catch (e) {}
  };
  if (!st.sid) {
    st.sid = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) =>
      (b % 36).toString(36),
    ).join("");
    save();
  }
  const lang = () => (document.documentElement.lang === "ar" ? "ar" : "en");
  const S = (k) => STR[lang()][k];
  const T = (l, k) => STR[l][k];
  const qLang = (t) =>
    /[\u0600-\u06FF]/.test(t) ? "ar" : /[a-z]/i.test(t) ? "en" : lang();

  /* ---------- DOM ---------- */
  const root = document.createElement("div");
  root.id = "chat";
  root.innerHTML = `
    <section class="chat-panel" id="chatPanel" role="dialog" aria-labelledby="chatTtl" hidden>
      <header class="chat-head">
        <span class="chat-av" aria-hidden="true">A</span>
        <div class="chat-ttl"><b id="chatTtl"></b><small><i id="chatI"></i><span id="chatSt"></span></small></div>
        <button class="chat-x" type="button" id="chatX">✕</button>
      </header>
      <div class="chat-log" id="chatLog" aria-live="polite"></div>
      <div class="chat-sugg" id="chatSugg"></div>
      <form class="chat-bar" id="chatForm" autocomplete="off">
        <button class="chat-plus" type="button" id="chatPlus" aria-expanded="false">+</button>
        <input id="chatIn" type="text" maxlength="500" enterkeyhint="send">
        <button class="chat-send" type="submit" id="chatSend">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><g id="bars"><rect x="3" y="9" width="3" height="6" rx="1.5"/><rect x="8" y="5" width="3" height="14" rx="1.5"/><rect x="13" y="8" width="3" height="8" rx="1.5"/><rect x="18" y="10" width="3" height="4" rx="1.5"/></g><path id="arrow" d="M4 12l16-8-6 16-3-7z" hidden/></svg>
        </button>
      </form>
      <p class="chat-note" id="chatNote"></p>
    </section>
    <button class="chat-fab" type="button" id="chatFab" aria-expanded="false" aria-controls="chatPanel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>
      <span class="chat-dot" id="chatDot"></span><span class="chat-badge" id="chatBadge" hidden></span>
    </button>`;
  document.body.appendChild(root);
  const $$id = (id) => root.querySelector("#" + id);
  const panel = $$id("chatPanel"),
    log = $$id("chatLog"),
    input = $$id("chatIn"),
    fab = $$id("chatFab"),
    sugg = $$id("chatSugg"),
    badge = $$id("chatBadge");
  let online = null,
    unread = 0,
    pollTimer = 0,
    busy = false;

  function labels() {
    $$id("chatTtl").textContent = S("title");
    $$id("chatX").setAttribute("aria-label", S("close"));
    fab.setAttribute("aria-label", S("open"));
    input.placeholder = S("placeholder");
    input.setAttribute("aria-label", S("placeholder"));
    $$id("chatSend").setAttribute("aria-label", S("send"));
    $$id("chatPlus").setAttribute("aria-label", S("more"));
    $$id("chatNote").textContent = S("note");
    sugg.innerHTML = "";
    S("sugg").forEach((t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cchip";
      b.textContent = t;
      b.onclick = () => ask(t);
      sugg.appendChild(b);
    });
    const h = log.querySelector("[data-hello]");
    if (h) h.firstChild.textContent = S("hello");
    status();
  }
  function status() {
    const on = CHAT_API && online === true;
    $$id("chatI").className = on ? "on" : "";
    $$id("chatDot").className = "chat-dot" + (on ? " on" : "");
    $$id("chatSt").textContent =
      !CHAT_API || online === null ? S("bot") : S(online ? "on" : "off");
  }

  function addActions(box, acts, L) {
    if (!acts || !acts.length) return;
    const row = document.createElement("div");
    row.className = "cacts";
    acts.forEach((a) => {
      const el = document.createElement(a.href ? "a" : "button");
      el.className = "cact" + (a.p ? " p" : "");
      el.textContent = a[L || lang()] || a.en;
      if (a.href) {
        el.href = a.href;
      } else {
        el.type = "button";
      }
      el.onclick = () => {
        if (a.go) {
          const t = document.getElementById(a.go);
          if (t) {
            if (t.tagName === "DETAILS") t.open = true;
            t.scrollIntoView({
              behavior: reduce ? "auto" : "smooth",
              block: "start",
            });
          }
          if (matchMedia("(max-width:700px)").matches) close();
        }
        if (a.cv) {
          const b = document.querySelector("[data-cv-choose]");
          if (b) {
            b.click();
            close();
          }
        }
      };
      row.appendChild(el);
    });
    box.appendChild(row);
  }

  function render(m, isNew) {
    const d = document.createElement("div");
    d.className =
      "cm " + (m.from === "you" ? "me" : m.from === "amr" ? "amr" : "bot");
    d.dir = "auto";
    if (m.hello) d.dataset.hello = "1";
    if (m.from === "amr") {
      const s = document.createElement("small");
      s.textContent = S("fromAmr");
      d.appendChild(s);
    }
    d.appendChild(document.createTextNode(m.text));
    if (m.acts)
      addActions(
        d,
        m.acts.map((a) => Object.assign({}, a)),
        m.l,
      );
    if (m.ask && !m.done) askCard(d, m);
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function push(m) {
    m.t = Date.now();
    st.msgs.push(m);
    save();
    return render(m, true);
  }
  function typing(ms, fn) {
    if (reduce) return fn();
    const d = document.createElement("div");
    d.className = "cm typing";
    d.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    setTimeout(() => {
      d.remove();
      fn();
    }, ms);
  }

  function askCard(box, m) {
    const wrap = document.createElement("div");
    wrap.className = "cask";
    const inp = document.createElement("input");
    inp.type = "text";
    inp.maxLength = 120;
    const L = m.l || lang();
    inp.placeholder = T(L, "contact");
    inp.setAttribute("aria-label", T(L, "contact"));
    const row = document.createElement("div");
    row.className = "cacts";
    const yes = document.createElement("button");
    yes.type = "button";
    yes.className = "cact p";
    yes.textContent = T(L, "sendAmr");
    const no = document.createElement("button");
    no.type = "button";
    no.className = "cact";
    no.textContent = T(L, "no");
    const finish = () => {
      m.done = true;
      save();
      wrap.remove();
    };
    yes.onclick = () => {
      finish();
      forward(m.q, inp.value.trim(), L);
    };
    no.onclick = () => {
      finish();
      push({ from: "bot", text: T(L, "skip"), l: L });
    };
    row.append(yes, no);
    wrap.append(inp, row);
    box.appendChild(wrap);
  }

  async function api(path, opt) {
    const r = await fetch(CHAT_API + path, opt);
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }
  async function forward(q, contact, L) {
    if (!CHAT_API) return mailFallback(q, L);
    try {
      const r = await api("/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sid: st.sid, q, contact, lang: L || lang() }),
      });
      online = !!r.online;
      status();
      st.until = Date.now() + DAY;
      st.after = Math.max(st.after, Date.now() - 2000);
      save();
      schedule();
      push({ from: "bot", text: T(L, online ? "sent" : "sentOff"), l: L });
    } catch (e) {
      mailFallback(q, L);
    }
  }
  function mailFallback(q, L) {
    L = L || lang();
    push({
      from: "bot",
      l: L,
      text: T(L, "fail"),
      acts: [
        {
          href: `mailto:${EMAIL}?subject=${encodeURIComponent("Question from your portfolio")}&body=${encodeURIComponent(q)}`,
          en: T(L, "mailBtn"),
          ar: T(L, "mailBtn"),
          p: 1,
        },
      ],
    });
  }

  function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    st.msgs.forEach((x) => {
      if (x.ask) x.done = true;
    });
    log.querySelectorAll(".cask").forEach((e) => e.remove());
    push({ from: "you", text });
    sugg.hidden = true;
    $$id("chatPlus").setAttribute("aria-expanded", "false");
    const a = answerFor(text),
      L = qLang(text);
    busy = true;
    typing(550, () => {
      busy = false;
      if (a.esc)
        push({ from: "bot", text: T(L, "unsure"), ask: true, q: text, l: L });
      else if (a.short) push({ from: "bot", text: T(L, "short"), l: L });
      else if (a.text) push({ from: "bot", text: a.text, l: L });
      else push({ from: "bot", text: a.entry[L], acts: a.entry.acts, l: L });
    });
  }

  /* ---------- polling for Amr's replies ---------- */
  function schedule() {
    clearTimeout(pollTimer);
    if (!CHAT_API || Date.now() > st.until) return;
    pollTimer = setTimeout(poll, panel.hidden ? 45000 : 6000);
  }
  async function poll() {
    try {
      const r = await api(`/poll?sid=${st.sid}&after=${st.after}`);
      online = !!r.online;
      status();
      r.msgs.forEach((m) => {
        st.after = Math.max(st.after, m.t);
        const x = { from: "amr", text: m.text, t: m.t };
        st.msgs.push(x);
        render(x);
        if (panel.hidden) {
          unread++;
          badge.textContent = unread;
          badge.hidden = false;
        }
      });
      if (r.msgs.length) save();
    } catch (e) {
      /* offline, try again later */
    }
    schedule();
  }

  /* ---------- open / close ---------- */
  async function open() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    unread = 0;
    badge.hidden = true;
    log.scrollTop = log.scrollHeight;
    setTimeout(() => input.focus(), 50);
    if (CHAT_API) {
      api("/status")
        .then((r) => {
          online = !!r.online;
          status();
        })
        .catch(() => {});
      if (!learned.length)
        api("/faq")
          .then((r) => {
            learned = r.faq || [];
          })
          .catch(() => {});
      if (Date.now() < st.until) poll();
    }
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    schedule();
  }
  fab.onclick = () => (panel.hidden ? open() : close());
  $$id("chatX").onclick = () => {
    close();
    fab.focus();
  };
  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) {
      close();
      fab.focus();
    }
  });
  $$id("chatPlus").onclick = () => {
    sugg.hidden = !sugg.hidden;
    $$id("chatPlus").setAttribute("aria-expanded", String(!sugg.hidden));
  };
  const arrow = $$id("arrow"),
    bars = $$id("bars"),
    sendBtn = $$id("chatSend");
  input.addEventListener("input", () => {
    const h = input.value.trim().length > 0;
    arrow.hidden = !h;
    bars.style.display = h ? "none" : "";
    sendBtn.classList.toggle("has", h);
  });
  $$id("chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    input.dispatchEvent(new Event("input"));
    ask(v);
  });

  /* ---------- boot ---------- */
  labels();
  new MutationObserver(labels).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
  if (!st.msgs.length) {
    st.msgs.push({ from: "bot", text: STR.en.hello, hello: 1, t: Date.now() });
  }
  st.msgs.forEach((m) => {
    if (m.hello) m.text = S("hello");
    render(m);
  });
  if (st.msgs.length > 1) sugg.hidden = true;
  schedule();
})();
