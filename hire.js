"use strict";
/* HIRE ME → small chooser (WhatsApp / Email). Each option opens with a ready-made message in the page language.
   Without JS the Hire me button keeps its plain mailto link. */
(() => {
  const PHONE = "201551657717"; // +20 155 165 7717, international format without + or leading 0
  const EMAIL = "amrt6509@gmail.com";

  const WA = {
    en: "Hi Amr, I saw your portfolio and I really liked your work. I have a project in mind and I want to discuss it with you. Are you available?",
    ar: "ازيك يا عمرو، شفت البورتفوليو بتاعك وعجبني شغلك جدا. عندي مشروع وعايز نتكلم فيه، انت متاح؟",
    it: "Ciao Amr, ho visto il tuo portfolio e mi è piaciuto molto il tuo lavoro. Ho un progetto in mente e vorrei parlarne con te. Sei disponibile?",
    es: "Hola Amr, vi tu portafolio y me gustó mucho tu trabajo. Tengo un proyecto en mente y quiero hablarlo contigo. ¿Estás disponible?",
    de: "Hallo Amr, ich habe dein Portfolio gesehen und deine Arbeit hat mir sehr gut gefallen. Ich habe ein Projekt im Kopf und würde gerne mit dir darüber sprechen. Bist du verfügbar?",
    fr: "Salut Amr, j'ai vu ton portfolio et j'ai beaucoup aimé ton travail. J'ai un projet en tête et je veux en discuter avec toi. Tu es disponible ?",
    ru: "Привет, Амр, я посмотрел твое портфолио, и мне очень понравилась твоя работа. У меня есть проект, и я хочу обсудить его с тобой. Ты свободен?",
    ko: "안녕하세요 Amr, 포트폴리오를 봤는데 작업물이 정말 마음에 들었어요. 생각해 둔 프로젝트가 있어서 이야기해보고 싶어요. 시간 되시나요?",
    ja: "こんにちは Amr、ポートフォリオを見て、あなたの仕事がとても気に入りました。相談したいプロジェクトがあります。お時間ありますか？",
    zh: "你好 Amr，我看了你的作品集，非常喜欢你的作品。我有一个项目想和你聊聊，你现在有时间吗？",
  };

  /* email: subject + intro + the three blanks + closing line (each blank on its own line) */
  const MAIL = {
    en: ["New Project Inquiry from Your Portfolio", "Hi Amr, I visited your portfolio and I'm interested in working with you.", ["Project Type:", "Budget:", "Deadline:"], "Looking forward to your reply."],
    ar: ["طلب شغل جديد من البورتفوليو", "ازيك يا عمرو، شفت البورتفوليو بتاعك وحابب اشتغل معاك.", ["نوع المشروع:", "الميزانية:", "الميعاد المطلوب:"], "مستني ردك، وشكرا."],
    it: ["Richiesta di Nuovo Progetto dal Tuo Portfolio", "Ciao Amr, ho visitato il tuo portfolio e sono interessato a lavorare con te.", ["Tipo di progetto:", "Budget:", "Scadenza:"], "Aspetto la tua risposta."],
    es: ["Consulta de Nuevo Proyecto desde Tu Portafolio", "Hola Amr, visité tu portafolio y me interesa trabajar contigo.", ["Tipo de proyecto:", "Presupuesto:", "Fecha límite:"], "Espero tu respuesta."],
    de: ["Neue Projektanfrage aus Deinem Portfolio", "Hallo Amr, ich habe dein Portfolio besucht und bin daran interessiert, mit dir zu arbeiten.", ["Projekttyp:", "Budget:", "Frist:"], "Ich freue mich auf deine Antwort."],
    fr: ["Demande de Nouveau Projet depuis Ton Portfolio", "Salut Amr, j'ai visité ton portfolio et je suis intéressé pour travailler avec toi.", ["Type de projet :", "Budget :", "Délai :"], "J'attends ta réponse."],
    ru: ["Запрос на Новый Проект из Твоего Портфолио", "Привет, Амр, я посмотрел твое портфолио и хочу поработать с тобой.", ["Тип проекта:", "Бюджет:", "Срок:"], "Жду твоего ответа."],
    ko: ["포트폴리오를 보고 온 새로운 프로젝트 문의", "안녕하세요 Amr, 포트폴리오를 보고 함께 일하고 싶어서 연락드려요.", ["프로젝트 유형:", "예산:", "마감 기한:"], "답변 기다릴게요."],
    ja: ["ポートフォリオからの新規プロジェクトのご相談", "こんにちは Amr、ポートフォリオを拝見し、ぜひ一緒に仕事をしたいと思いました。", ["プロジェクトの種類：", "予算：", "納期："], "ご返信お待ちしています。"],
    zh: ["来自你作品集的新项目咨询", "你好 Amr，我看了你的作品集，很想和你合作。", ["项目类型：", "预算：", "截止时间："], "期待你的回复。"],
  };

  const modal = document.getElementById("hireModal");
  if (!modal) return;
  const waLink = document.getElementById("hm-wa");
  const mailLink = document.getElementById("hm-mail");
  const closeBtn = document.getElementById("hm-close");
  const background = () => document.querySelectorAll("nav, main, footer, #top");
  let opener = null;

  function links() {
    const code = document.documentElement.lang;
    const l = WA[code] ? code : "en";
    waLink.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(WA[l]);
    const [subject, intro, blanks, bye] = MAIL[l];
    const body = intro + "\r\n\r\n" + blanks.join("\r\n") + "\r\n\r\n" + bye;
    mailLink.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function open(from) {
    if (!modal.hidden) return;
    opener = from || document.activeElement;
    links(); // built at open time, so it always follows the current language
    modal.hidden = false;
    document.body.classList.add("game-open"); // same scroll lock as the CV / game overlays
    background().forEach((el) => { el.inert = true; });
    waLink.focus();
  }
  function close(restore = true) {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("game-open");
    background().forEach((el) => { el.inert = false; });
    if (restore && opener && opener.focus) opener.focus();
  }

  document.querySelectorAll("[data-hire]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      open(a);
    }),
  );
  // picking an option opens the app in a new tab; the chooser closes behind it
  [waLink, mailLink].forEach((a) => a.addEventListener("click", () => setTimeout(() => close(false), 80)));
  closeBtn.addEventListener("click", () => close());
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
})();
