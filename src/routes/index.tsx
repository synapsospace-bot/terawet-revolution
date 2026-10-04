import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Mic, Minus, Plus, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HydrogelScene } from "@/components/HydrogelScene";
import { ElevenLabsWidget, triggerElevenLabsCall, closeElevenLabsCall } from "@/components/ElevenLabsWidget";
import heroImage from "@/assets/hydrogel-hero.jpg";
import materialImage from "@/assets/hydrogel-material.jpg";
import stageAbsorptionImg from "@/assets/stage-absorption.jpg";
import stageReservoirImg from "@/assets/stage-reservoir.jpg";
import stageOsmosisImg from "@/assets/stage-osmosis.jpg";
import stageLifecycleImg from "@/assets/stage-lifecycle.jpg";
import productT400Img from "@/assets/product-t400.jpg";
import productT100Img from "@/assets/product-t100.jpg";
import WovenGlassButton from "@/components/ui/woven-glass-button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TERA-WET | Water, engineered for life" },
      { name: "description", content: "Explore Tera-Wet superabsorbent polymer hydrogel technology, agricultural applications, product grades, and dosage calculator." },
      { property: "og:title", content: "TERA-WET | Water, engineered for life" },
      { property: "og:description", content: "Hydrogel technology for a more water-resilient growing future. Retains 400x water for 7-10 years." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type Language = "UA" | "EN" | "BG";

const copy = {
  UA: {
    science: "Наука",
    products: "Продукти",
    calculator: "Калькулятор",
    contact: "Контакти",
    heroLabel: "МАЙБУТНЄ ВОДИ В ҐРУНТІ",
    heroA: "TERAWET.",
    heroB: "РЕВОЛЮЦІЯ.",
    heroText: "Суперабсорбентний полімерний гідрогель перетворює посушливий ґрунт на родючий водяний резервуар, що живить коріння рослин протягом 7–10 років.",
    explore: "Каталог продукції",
    discover: "Наука гідрогелю",
    scroll: "ГОРТАЙТЕ ВНИЗ",
    scienceEyebrow: "01 / ПІД ПОВЕРХНЕЮ",
    scienceTitle: "НАУКА КЛІТИННОГО\nЗВОЛОЖЕННЯ",
    scienceIntro: "Мікроскопічна зміна з колосальним впливом на врожайність. Просторова полімерна матриця утримує до 400 разів більше води за власну вагу.",
    productEyebrow: "02 / ПРОДУКТОВА ЛІНІЙКА",
    productTitle: "СТВОРЕНО ДЛЯ\nКОЖНОГО КОРЕНЯ.",
    productIntro: "Два високоточних формати суперабсорбенту. Одна мета: змусити кожну краплину води працювати на максимальний результат.",
    quote: "Замовити розрахунок",
    calculate: "Розрахувати норму",
    calcEyebrow: "03 / ПЛАНУВАННЯ ВНЕСЕННЯ",
    calcTitle: "ПЛАНУЙТЕ\nВАШ ВРОЖАЙ.",
    calcIntro: "Орієнтовний розрахунок для вашої площі. Точна норма залежить від типу ґрунту, культури, кліматичної зони та способу внесення.",
    crop: "КУЛЬТУРА / СФЕРА ЗАСТОСУВАННЯ",
    area: "ПЛОЩА ОБРОБКИ",
    result: "НЕОБХІДНА КІЛЬКІСТЬ ТЕРАВЕТ",
    water: "ПОТЕНЦІЙНА ЕКОНОМІЯ ВОДИ",
    contactEyebrow: "04 / ЗРОСТАЙМО РАЗОМ",
    contactTitle: "ЗБЕРЕЖІТЬ ВОДУ\nТА ПРИМНОЖТЕ ВРОЖАЙ.",
    contactIntro: "Розкажіть про ваше господарство або ділянку. Наші спеціалісти підберуть оптимальну фракцію та схему застосування.",
    name: "Ваше ім’я",
    email: "Електронна пошта",
    message: "Культура, площа, регіон та ваші завдання...",
    send: "Надіслати запит",
    voice: "ШІ-Агроном TERA-WET (Голос)",
    voiceDesc: "Натисніть для прямої голосової консультації з нашим інтелектуальним асистентом.",
    voiceCallAction: "Почати голосову розмову",
    getInTouch: "Зв’язатися з нами",
    photoView: "ФОТО МАТРИЦЯ",
    videoView: "ВІДЕО ТЕСТ НАБРЯКАННЯ",
    menu: "Меню",
    close: "Закрити",
    stages: [
      { number: "01", title: "МИТТЄВА АБСОРБАЦІЯ", body: "Сухі кристали вбирають вологу під час поливу чи дощу та набрякають лише за 15 хвилин, фіксуючи водний буфер прямо в кореневій зоні.", metric: "ДО 400×", sub: "ЗБІЛЬШЕННЯ ВЛАСНОЇ ВАГИ" },
      { number: "02", title: "КАПІЛЯРНИЙ РЕЗЕРВУАР", body: "Волога надійно утримується в ґрунті, усуваючи гравітаційне стікання у нижні горизонти та випаровування з поверхні.", metric: "У ЗОНІ КОРЕНЯ", sub: "ДЕ ВОДА НАЙБІЛЬШЕ ПОТРІБНА" },
      { number: "03", title: "ОСМОТИЧНЕ ЖИВЛЕННЯ", body: "Гідрогель віддає вологу кореневим волоскам рослини за осмотичним принципом — строго за потребою, знижуючи поливи на 50%.", metric: "ЗА ПОТРЕБОЮ", sub: "БЕЗПЕРЕРВНИЙ ДОСТУП ДО ВОДИ" },
      { number: "04", title: "7–10 РОКІВ ДІЇ", body: "Сотні циклів набрякання та віддачі вологи. Повністю біорозкладний, екологічно безпечний полімер для довготривалої стійкості.", metric: "7–10 РОКІВ", sub: "ТЕРМІН РОБОТИ В ҐРУНТІ" },
    ],
    crops: [
      { name: "Плодові дерева / Сади", rate: 12 },
      { name: "Виноградники", rate: 20 },
      { name: "Зернові / Кукурудза", rate: 25 },
      { name: "Овочеві та ягідні культури", rate: 30 },
      { name: "Газони та ландшафтний дизайн", rate: 2 },
    ]
  },
  EN: {
    science: "The Science",
    products: "Products",
    calculator: "Calculator",
    contact: "Contact",
    heroLabel: "THE FUTURE OF WATER IN SOIL",
    heroA: "TERAWET.",
    heroB: "REVOLUTIONIZED.",
    heroText: "Superabsorbent polymer hydrogel technology that transforms drought-prone soil into fertile water reservoirs for 7–10 years.",
    explore: "Product Catalog",
    discover: "Discover The Science",
    scroll: "SCROLL TO EXPLORE",
    scienceEyebrow: "01 / UNDER THE SURFACE",
    scienceTitle: "THE SCIENCE OF\nCELLULAR HYDRATION",
    scienceIntro: "A microscopic change with a field-scale impact. Cross-linked superabsorbent matrices retain up to 400 times their weight in water.",
    productEyebrow: "02 / PRODUCT MATRIX",
    productTitle: "ENGINEERED FOR\nEVERY ROOT.",
    productIntro: "Two precise formats. One purpose: make every single drop work harder where plants need it most.",
    quote: "Request a Quote",
    calculate: "Calculate Application",
    calcEyebrow: "03 / APPLICATION PLANNER",
    calcTitle: "PLAN YOUR\nYIELD IMPACT.",
    calcIntro: "Indicative starting point for your growing area. Dosage depends on soil type, crop, climate, and application method.",
    crop: "CROP / APPLICATION FIELD",
    area: "TREATED AREA",
    result: "REQUIRED TERA-WET",
    water: "POTENTIAL WATER SAVINGS",
    contactEyebrow: "04 / LET’S GROW",
    contactTitle: "MAKE WATER\nGO FURTHER.",
    contactIntro: "Tell us about your agricultural project. We'll help you select the exact grade, dosage, and deployment method.",
    name: "Your name",
    email: "Email address",
    message: "Crop, acreage, region, and target goals...",
    send: "Send Inquiry",
    voice: "AI Agronomist TERA-WET (Voice)",
    voiceDesc: "Tap to initiate real-time conversational voice consultation with our AI agronomist.",
    voiceCallAction: "Start Voice Consultation",
    getInTouch: "Get in Touch",
    photoView: "PHOTO MATRIX",
    videoView: "LAB SWELLING VIDEO",
    menu: "Menu",
    close: "Close",
    stages: [
      { number: "01", title: "RAPID ABSORPTION", body: "Dry crystals rapidly swell with irrigation or rain, locking in moisture within 15 minutes right at the plant root zone.", metric: "UP TO 400×", sub: "WATER RETENTION CAPACITY" },
      { number: "02", title: "MOISTURE RESERVOIR", body: "Water stays trapped in the soil profile instead of draining straight through to bedrock or evaporating into thin air.", metric: "IN ROOT ZONE", sub: "WHERE WATER IS NEEDED" },
      { number: "03", title: "ROOT OSMOTIC EXCHANGE", body: "The hydrated polymer matrix releases moisture through root osmosis on demand, cutting irrigation needs by up to 50%.", metric: "ON DEMAND", sub: "ROOT ACCESS TO HYDRATION" },
      { number: "04", title: "10-YEAR SOIL LIFECYCLE", body: "Thousands of swell-and-release cycles. Non-toxic, environmentally neutral polymer that revitalizes soil structure.", metric: "7–10 YEARS", sub: "EFFECTIVE SOIL LIFESPAN" },
    ],
    crops: [
      { name: "Orchards & Fruit Trees", rate: 12 },
      { name: "Vineyards", rate: 20 },
      { name: "Wheat & Field Crops", rate: 25 },
      { name: "Vegetables & Berries", rate: 30 },
      { name: "Lawns & Landscaping", rate: 2 },
    ]
  },
  BG: {
    science: "Наука",
    products: "Продукти",
    calculator: "Калкулатор",
    contact: "Контакти",
    heroLabel: "БЪДЕЩЕТО НА ВОДАТА В ПОЧВАТА",
    heroA: "TERAWET.",
    heroB: "РЕВОЛЮЦИЯ.",
    heroText: "Суперабсорбиращ полимерен хидрогел, който превръща сухата почва в дълготраен воден резервоар, подхранващ корените в продължение на 7–10 години.",
    explore: "Продуктов каталог",
    discover: "Открийте науката",
    scroll: "ПРЕВЪРТЕТЕ НАДОЛУ",
    scienceEyebrow: "01 / ПОД ПОВЪРХНОСТТА",
    scienceTitle: "НАУКАТА ЗА КЛЕТЪЧНАТА\nХИДРАТАЦИЯ",
    scienceIntro: "Микроскопична промяна с колосално въздействие върху полето. Кръстосано свързаните полимерни матрици задържат до 400 пъти повече вода от собственото си тегло.",
    productEyebrow: "02 / ПРОДУКТОВА ЛИНИЯ",
    productTitle: "СЪЗДАДЕНО ЗА\nВСЕКИ КОРЕН.",
    productIntro: "Два високопрецизни формата. Една цел: максимална полза от всяка капка вода там, където е най-необходима.",
    quote: "Запитване за цена",
    calculate: "Изчислете нормата",
    calcEyebrow: "03 / ПЛАНИРАНЕ НА ПРИЛОЖЕНИЕТО",
    calcTitle: "ПЛАНИРАЙТЕ\nВАШАТА РЕКОЛТА.",
    calcIntro: "Ориентировъчно изчисление за вашата площ. Окончателната доза зависи от почвата, културата, климата и метода на внасяне.",
    crop: "КУЛТУРА / ОБЛАСТ НА ПРИЛОЖЕНИЕ",
    area: "ОБРАБОТВАЕМА ПЛОЩ",
    result: "НЕОБХОДИМО КОЛИЧЕСТВО TERA-WET",
    water: "ПОТЕНЦИАЛНО СПЕСТЯВАНЕ НА ВОДА",
    contactEyebrow: "04 / ДА РАСТЕМ ЗАЕДНО",
    contactTitle: "НАПРАВЕТЕ ВОДАТА\nПО-ЕФЕКТИВНА.",
    contactIntro: "Разкажете ни за вашето стопанство. Нашите специалисти ще ви помогнат да изберете правилния продукт и схема на приложение.",
    name: "Вашето име",
    email: "Имейл адрес",
    message: "Култура, площ, регион и вашите цели...",
    send: "Изпратете запитване",
    voice: "ШИ Агроном TERA-WET (Глас)",
    voiceDesc: "Натиснете за директна гласова консултация в реално време с нашия изкуствен интелект.",
    voiceCallAction: "Започнете гласов разговор",
    getInTouch: "Свържете се с нас",
    photoView: "ФОТО МАТРИЦА",
    videoView: "ВИДЕО ТЕСТ НАБЪБВАНЕ",
    menu: "Меню",
    close: "Затворете",
    stages: [
      { number: "01", title: "МОМЕНТАЛНА АБСОРБЦИЯ", body: "Сухите кристали поемат влага при напояване или дъжд и набъбват само за 15 минути, образувайки воден буфер в кореновата зона.", metric: "ДО 400×", sub: "УВЕЛИЧАВАНЕ НА СОБСТВЕНОТО ТЕГЛО" },
      { number: "02", title: "РЕЗЕРВОАР ЗА ВЛАГА", body: "Водата се задържа надеждно в почвения слой, елиминирайки гравитационното оттичане и изпарението от повърхността.", metric: "В КОРЕНОВАТА ЗОНА", sub: "ТАМ, КЪДЕТО Е НЕОБХОДИМА" },
      { number: "03", title: "ОСМОТИЧЕН ОБМЕН", body: "Хидрогелът отдава влага на коренчетата по осмотичен път строго при нужда, намалявайки поливанията с до 50%.", metric: "ПРИ ПОИСКВАНЕ", sub: "ПОСТОЯНЕН ДОСТЪП ДО ВОДА" },
      { number: "04", title: "7–10 ГОДИНИ ДЕЙСТВИЕ", body: "Стотици цикли на набъбване и отдаване на вода. Напълно биоразградим и екологично чист полимер за дълготрайна стабилност.", metric: "7–10 ГОДИНИ", sub: "ЕФЕКТИВЕН ЖИВОТ В ПОЧВАТА" },
    ],
    crops: [
      { name: "Овощни градини и дървета", rate: 12 },
      { name: "Лозя", rate: 20 },
      { name: "Пшеница, царевица и полски култури", rate: 25 },
      { name: "Зеленчуци и ягодоплодни", rate: 30 },
      { name: "Тревни площи и озеленяване", rate: 2 },
    ]
  }
};

function Home() {
  const [lang, setLang] = useState<Language>("UA");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [crop, setCrop] = useState(2);
  const [area, setArea] = useState("1");
  const [unit, setUnit] = useState<"ha" | "m²">("ha");
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isAgentActive, setIsAgentActive] = useState(false);

  useEffect(() => {
    const handleOpened = () => setIsAgentActive(true);
    const handleClosed = () => setIsAgentActive(false);
    window.addEventListener("terawet:agent-opened", handleOpened);
    window.addEventListener("terawet:agent-closed", handleClosed);
    return () => {
      window.removeEventListener("terawet:agent-opened", handleOpened);
      window.removeEventListener("terawet:agent-closed", handleClosed);
    };
  }, []);

  const stageMedia = [
    {
      image: stageAbsorptionImg,
      video: "/videos/terawet-care.mp4",
      fig: "FIG. 01 // DRY CRYSTAL MATRIX",
      tag: "CRYSTAL GRANULOMETRY // 0.1–2.0 MM",
      alt: "Microstructure of dry superabsorbent Terawet crystal granules",
      reticle: { top: "42%", left: "48%" },
      metricTag: "SWELL VELOCITY: < 15 MIN",
    },
    {
      image: stageReservoirImg,
      video: "/videos/terawet-gel.mp4",
      fig: "FIG. 02 // CAPILLARY WATER RESERVOIR",
      tag: "CROSS-LINKED HYDROGEL // 400X EXPANSION",
      alt: "Hydrated Terawet polymer holding water in soil capillary reservoir",
      reticle: { top: "52%", left: "50%" },
      metricTag: "RETENTION: 400 L / 1 KG",
    },
    {
      image: stageOsmosisImg,
      video: "/videos/terawet-care.mp4",
      fig: "FIG. 03 // ROOT OSMOTIC EXCHANGE",
      tag: "CAPILLARY ROOT-HAIR JUNCTION",
      alt: "Plant root system drawing moisture directly from Terawet hydrogel",
      reticle: { top: "38%", left: "54%" },
      metricTag: "WATER STRESS: -50% IRRIGATION",
    },
    {
      image: stageLifecycleImg,
      video: "/videos/terawet-gel.mp4",
      fig: "FIG. 04 // 7-10 YEAR PERENNIAL MATRIX",
      tag: "SOIL STRUCTURE & MICROBIOME BUFFER",
      alt: "Long-term soil ecosystem and deep root resilience with Terawet",
      reticle: { top: "48%", left: "46%" },
      metricTag: "SOIL LIFECYCLE: 7–10 YRS",
    },
  ];

  const t = copy[lang];
  const activeCropList = t.crops;
  const activeStageList = t.stages;

  const hectares = (Number(area) || 0) * (unit === "ha" ? 1 : 0.0001);
  const activeCrop = activeCropList[crop] ?? activeCropList[0];
  const activeStage = activeStageList[stage] ?? activeStageList[0];
  const kilograms = hectares * activeCrop.rate;
  const formatKg = kilograms < 10 ? kilograms.toFixed(2).replace(/\.00$/, "") : Math.round(kilograms).toLocaleString();
  const estimatedWaterSavedLiters = Math.round(kilograms * 400).toLocaleString();

  const nav = [
    [t.science, "#science"],
    [t.products, "#products"],
    [t.calculator, "#calculator"],
    [t.contact, "#contact"]
  ];

  const sendInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = quoteProduct ? `TERA-WET Inquiry — ${quoteProduct}` : "TERA-WET Official Inquiry";
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nLanguage: ${lang}\n\nProject Details:\n${data.get("message")}`;
    window.location.href = `mailto:terawet.original@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="site-shell">
      {/* Hidden/Mounted ElevenLabs Widget */}
      <ElevenLabsWidget agentId="agent_4401kpn73yzzfjjr8pg03cvr322w" />

      {/* Futuristic Header */}
      <header className="site-header">
        <a href="#top" className="brand" aria-label="TERA-WET Home">
          <span className="brand-symbol"><span /></span>
          <span>TERA<span className="brand-hyphen">-</span>WET<span className="brand-dot">.</span></span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language-switch" aria-label="Language selection">
            {(["UA", "EN", "BG"] as Language[]).map(option => (
              <Button
                key={option}
                variant="ghost"
                type="button"
                aria-pressed={lang === option}
                className={lang === option ? "active font-bold" : "opacity-70"}
                onClick={() => setLang(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="menu-trigger"
            aria-label={menuOpen ? t.close : t.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="mobile-nav">
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
              <ArrowUpRight size={22} />
            </a>
          ))}
        </div>
      )}

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="top">
          <img
            src={heroImage}
            alt="Hydrated Terawet polymer crystals in rich soil matrix"
            className="hero-image"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="hero-shade" />

          {/* Interactive 3D Three.js Scene */}
          <HydrogelScene />

          <div className="hero-content page-width">
            <div className="eyebrow hero-eyebrow">
              <span className="eyebrow-line" />
              {t.heroLabel}
            </div>

            <h1>
              <span>{t.heroA}</span>
              <span className="outline-word">{t.heroB}</span>
            </h1>

            <p>{t.heroText}</p>

            <div className="hero-buttons">
              <Button asChild className="button-bright">
                <a href="#products">
                  {t.explore}
                  <ArrowUpRight />
                </a>
              </Button>
              <Button asChild variant="outline" className="button-outline">
                <a href="#science">
                  {t.discover}
                  <ArrowRight />
                </a>
              </Button>
            </div>
          </div>

          <div className="hero-bottom page-width">
            <span>01 / 04 <span className="separator">—</span> TERA-WET BIO-TECH</span>
            <a href="#science">
              {t.scroll}
              <ArrowDown size={16} />
            </a>
            <span className="hero-coordinate">42° 30′ N / 27° 28′ E</span>
          </div>
        </section>

        {/* 01. THE SCIENCE SECTION */}
        <section className="science-section section-space" id="science">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {t.scienceEyebrow}
                </span>
                <h2 className="display-title">{t.scienceTitle}</h2>
              </div>
              <p>{t.scienceIntro}</p>
            </div>

            <div className="science-experience">
              <div className="science-image-wrap">
                {stageMedia.map((item, idx) => (
                  <div
                    key={idx}
                    className={`science-slide ${idx === stage ? "active" : ""}`}
                    aria-hidden={idx !== stage}
                  >
                    {item.video && showVideo ? (
                      <video
                        src={item.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="science-slide-media"
                      />
                    ) : (
                      <img
                        src={item.image}
                        loading={idx === 0 ? "eager" : "lazy"}
                        width={1536}
                        height={1024}
                        alt={item.alt}
                        className="science-slide-media"
                      />
                    )}
                  </div>
                ))}

                {/* Pioneer-style Dynamic Scanline and CRT Overlay */}
                <div className="science-scanline" aria-hidden="true" />
                <div className="science-grid-overlay" aria-hidden="true" />

                {/* HUD Corner Indicators */}
                <div className="image-corner top-left">
                  {stageMedia[stage].fig}
                </div>

                <div className="science-telemetry-badge">
                  <span className="science-telemetry-dot" />
                  <span>{stageMedia[stage].metricTag}</span>
                  {stageMedia[stage].video && (
                    <button
                      type="button"
                      className="science-video-toggle"
                      onClick={() => setShowVideo(!showVideo)}
                      aria-label="Toggle video / 3D photo"
                    >
                      {showVideo ? `🔬 3D HUD VIEW` : `▶ LIVE BIO-VIDEO`}
                    </button>
                  )}
                </div>

                <div
                  className="science-reticle"
                  style={{
                    top: stageMedia[stage].reticle.top,
                    left: stageMedia[stage].reticle.left,
                    transition: "top 0.7s cubic-bezier(0.16, 1, 0.3, 1), left 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  aria-hidden="true"
                >
                  <span>+</span>
                </div>

                <div className="image-corner bottom-right">
                  {stageMedia[stage].tag}
                </div>
              </div>

              <div className="science-panel">
                <div className="science-panel-top">
                  <span>THE CELLULAR HYDRATION CYCLE</span>
                  <span>{activeStage.number} / 04</span>
                </div>

                <div className="stage-copy">
                  <span className="stage-count">{activeStage.number}</span>
                  <h3>{activeStage.title}</h3>
                  <p>{activeStage.body}</p>
                  <div className="stage-metric">
                    <strong>{activeStage.metric}</strong>
                    <span>{activeStage.sub}</span>
                  </div>
                </div>

                <div className="stage-controls">
                  <div className="stage-progress">
                    {activeStageList.map((item, index) => (
                      <Button
                        key={item.number}
                        variant="ghost"
                        className={index === stage ? "selected" : ""}
                        aria-label={`Stage ${index + 1}: ${item.title}`}
                        aria-pressed={index === stage}
                        onClick={() => {
                          setStage(index);
                          setShowVideo(false);
                        }}
                      />
                    ))}
                  </div>

                  <div className="stage-arrows">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Previous stage"
                      onClick={() => {
                        setStage((stage + 3) % 4);
                        setShowVideo(false);
                      }}
                    >
                      <ArrowLeft />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Next stage"
                      onClick={() => {
                        setStage((stage + 1) % 4);
                        setShowVideo(false);
                      }}
                    >
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific Telemetry Stats Strip */}
            <div className="stats-strip">
              <div>
                <strong>50<span>%</span></strong>
                <span>ПОТЕНЦІЙНЕ ЗНИЖЕННЯ ПОЛИВІВ<br />POTENTIAL WATER REDUCTION</span>
              </div>
              <div>
                <strong>25–40<span>%</span></strong>
                <span>ПРИРІСТ ВРОЖАЙНОСТІ<br />DOCUMENTED YIELD BOOST</span>
              </div>
              <div>
                <strong>98<span>%</span></strong>
                <span>ПРИЖИВАНІСТЬ САДЖАНЦІВ<br />SEEDLING SURVIVAL RATE</span>
              </div>
            </div>
          </div>
        </section>

        {/* 02. PRODUCT MATRIX */}
        <section className="products-section section-space" id="products">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {t.productEyebrow}
                </span>
                <h2 className="display-title">{t.productTitle}</h2>
              </div>
              <p>{t.productIntro}</p>
            </div>

            <div className="product-grid">
              {[
                {
                  code: "T-400",
                  category: "AGRICULTURAL GRADE (GRANULES)",
                  desc: lang === "BG"
                    ? "Едри гранули за полски култури, лозя, овощни градини и запазване на водата в почвения слой."
                    : lang === "UA"
                    ? "Гранульований гідрогель фракції 1-4 мм для внесення у ґрунт, сади, виноградники та відкриті поля."
                    : "Granular hydrogel (1-4 mm) for open-field soil incorporation, orchards, vineyards, and root-zone retention.",
                  image: productT400Img,
                  imageClass: "product-image-a",
                  applications: "FIELDS / ORCHARDS / VINEYARDS / FORESTRY",
                  pack: "1 KG / 5 KG / 25 KG"
                },
                {
                  code: "T-100",
                  category: "FINE SEED & ROOT COATING POWDER",
                  desc: lang === "BG"
                    ? "Фин прахообразен хидрогел за дражиране на семена, потапяне на коренова система на разсад и дръвчета."
                    : lang === "UA"
                    ? "Дрібнодисперсний порошок для обволікання насіння, вмочування коріння саджанців та розсади."
                    : "Micro-powder formulation for seed coating, bare-root dipping, transplant nurseries, and hydroseeding.",
                  image: productT100Img,
                  imageClass: "product-image-b",
                  applications: "SEEDS / ROOT DIPPING / NURSERIES / HYDROPONICS",
                  pack: "1 KG / 5 KG / 25 KG"
                }
              ].map(product => (
                <article className="product-card" key={product.code}>
                  <div className="product-visual">
                    <img
                      className={product.imageClass}
                      src={product.image}
                      loading="lazy"
                      width={1536}
                      height={1024}
                      alt={`${product.code} hydrogel material close-up`}
                    />
                    <div className="product-scanline-overlay" aria-hidden="true" />
                    <span className="product-visual-label">TERA-WET / {product.code}</span>
                    <span className="product-video-badge">
                      <span className="product-video-dot" /> LIVE 3D TELEMETRY
                    </span>
                  </div>

                  <div className="product-info">
                    <span className="eyebrow small">{product.category}</span>
                    <h3>TERA-WET <em>{product.code}</em></h3>
                    <p>{product.desc}</p>

                    <div className="product-spec">
                      <span>APPLICATION</span>
                      <strong>{product.applications}</strong>
                    </div>

                    <div className="product-spec">
                      <span>PACKAGING</span>
                      <strong>{product.pack}</strong>
                    </div>

                    <div className="product-actions-group">
                      <a
                        href="https://t.me/Terawet_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-order-tg-btn"
                        aria-label={`Order TERA-WET ${product.code} via Telegram Bot`}
                      >
                        <span>Order-Terawet</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        className="product-action-secondary"
                        onClick={() => setQuoteProduct(`TERA-WET ${product.code}`)}
                      >
                        <span>{t.quote}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 03. APPLICATION PLANNER & WATER CALCULATOR */}
        <section className="calculator-section section-space" id="calculator">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="eyebrow-line" />
                  {t.calcEyebrow}
                </span>
                <h2 className="display-title">{t.calcTitle}</h2>
              </div>
              <p>{t.calcIntro}</p>
            </div>

            <div className="calculator-layout">
              <div className="calculator-inputs">
                <label htmlFor="crop-select" className="input-label">
                  {t.crop}
                </label>
                <div className="select-wrap">
                  <select
                    id="crop-select"
                    value={crop}
                    onChange={event => setCrop(Number(event.target.value))}
                  >
                    {activeCropList.map((item, index) => (
                      <option key={item.name} value={index}>
                        {item.name} ({item.rate} kg/ha)
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>

                <label htmlFor="area-input" className="input-label area-label">
                  {t.area}
                </label>
                <div className="area-row">
                  <div className="area-field">
                    <input
                      id="area-input"
                      type="number"
                      min="0"
                      step="any"
                      value={area}
                      onChange={event => setArea(event.target.value)}
                    />
                    <div className="stepper">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Increase area"
                        onClick={() => setArea(String(Math.max(0, Number(area) + (unit === "ha" ? 1 : 100))))}
                      >
                        <Plus />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Decrease area"
                        onClick={() => setArea(String(Math.max(0, Number(area) - (unit === "ha" ? 1 : 100))))}
                      >
                        <Minus />
                      </Button>
                    </div>
                  </div>

                  <div className="unit-toggle">
                    <Button
                      variant="ghost"
                      aria-pressed={unit === "ha"}
                      className={unit === "ha" ? "active" : ""}
                      onClick={() => setUnit("ha")}
                    >
                      ha
                    </Button>
                    <Button
                      variant="ghost"
                      aria-pressed={unit === "m²"}
                      className={unit === "m²" ? "active" : ""}
                      onClick={() => setUnit("m²")}
                    >
                      m²
                    </Button>
                  </div>
                </div>

                <p className="calculator-note">
                  Норма внесення: <strong>{activeCrop.rate} кг / га</strong>. Оптимізовано для утримання водного балансу без заболочування кореневої шийки.
                </p>
              </div>

              <div className="calculator-results">
                <span className="eyebrow small">TERA-WET / TELEMETRY ESTIMATE</span>
                <div className="result-number">
                  <strong>{formatKg}</strong>
                  <span>KG</span>
                </div>
                <span className="input-label">{t.result}</span>

                <div className="result-divider" />

                <div className="saving-row">
                  <div>
                    <span className="input-label">{t.water}</span>
                    <strong className="text-cyan-400">~{estimatedWaterSavedLiters} L</strong>
                  </div>
                  <span className="saving-icon">↗</span>
                </div>

                <p>
                  Потенційне зменшення витрат на іригацію до 50%. Розрахунок базується на середній ємності гідрогелю 400 л води на 1 кг препарату.
                </p>

                <Button asChild className="button-bright mt-4">
                  <a href="#contact">
                    {t.getInTouch}
                    <ArrowUpRight />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 04. CONTACT & CONSULTATION */}
        <section className="contact-section section-space" id="contact">
          <div className="page-width contact-layout">
            <div className="contact-left">
              <span className="eyebrow">
                <span className="eyebrow-line" />
                {t.contactEyebrow}
              </span>
              <h2 className="display-title">{t.contactTitle}</h2>
              <p>{t.contactIntro}</p>

              <a className="contact-email" href="mailto:terawet.original@gmail.com">
                terawet.original@gmail.com <ArrowUpRight size={24} />
              </a>

              <div className="contact-social">
                <a href="https://wa.me/16195160130" target="_blank" rel="noreferrer">
                  WHATSAPP <ArrowUpRight size={15} />
                </a>
                <a href="mailto:terawet.original@gmail.com">
                  EMAIL <ArrowUpRight size={15} />
                </a>
                <a href="https://www.youtube.com/channel/UCcZDTmKXF6Jl8sfHLbLUFBw" target="_blank" rel="noreferrer">
                  YOUTUBE <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            <form className="contact-form" onSubmit={sendInquiry}>
              <span className="form-kicker">START A CONVERSATION <span>↗</span></span>
              
              <label htmlFor="contact-name">01 / {t.name}</label>
              <input id="contact-name" name="name" placeholder={t.name} required minLength={2} />

              <label htmlFor="contact-email">02 / {t.email}</label>
              <input id="contact-email" name="email" type="email" placeholder="example@agri-corp.com" required />

              <label htmlFor="contact-message">03 / {t.message}</label>
              <textarea id="contact-message" name="message" placeholder={t.message} rows={3} required minLength={8} />

              <Button type="submit" className="button-bright form-submit">
                {t.send}
                <ArrowUpRight />
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="page-width">
          <a href="#top" className="brand">
            <span className="brand-symbol"><span /></span>
            <span>TERA-WET<span className="brand-dot">.</span></span>
          </a>
          <span>WATER, ENGINEERED FOR LIFE. 1998–{new Date().getFullYear()}</span>
          <span>© {new Date().getFullYear()} TERA-WET GLOBAL BIO-TECH</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>

      {/* Floating Woven Glass AI Consultation Trigger */}
      <div className="voice-widget">
        {isAgentActive && (
          <button
            type="button"
            className="voice-close-floating-pill"
            onClick={() => {
              closeElevenLabsCall();
              setIsAgentActive(false);
            }}
            aria-label="Закрити AI-Агента"
          >
            ✕ ЗАКРИТИ AI-АГЕНТА
          </button>
        )}
        <div className="voice-glass-wrapper">
          <WovenGlassButton
            className="voice-woven-btn"
            label={isAgentActive ? "ЗАКРИТИ" : "AI-Agent"}
            onActivate={() => {
              if (isAgentActive) {
                closeElevenLabsCall();
                setIsAgentActive(false);
              } else {
                triggerElevenLabsCall();
                setIsAgentActive(true);
              }
            }}
          />
        </div>
      </div>

      {/* Quote Inquiry Modal */}
      {quoteProduct && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setQuoteProduct(null);
          }}
        >
          <div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">
            <Button
              variant="ghost"
              size="icon"
              className="modal-close"
              aria-label="Close request"
              onClick={() => setQuoteProduct(null)}
            >
              <X />
            </Button>

            <span className="eyebrow small">TERA-WET / PRODUCT INQUIRY</span>
            <h2 id="quote-title">
              {t.quote}<span className="brand-dot">.</span>
            </h2>
            <p>{quoteProduct} · 1 kg / 5 kg / 25 kg industrial packages.</p>

            <form onSubmit={sendInquiry}>
              <label htmlFor="quote-name">{t.name}</label>
              <input id="quote-name" name="name" required minLength={2} placeholder={t.name} />

              <label htmlFor="quote-email">{t.email}</label>
              <input id="quote-email" name="email" type="email" required placeholder="you@company.com" />

              <label htmlFor="quote-message">{t.message}</label>
              <textarea
                id="quote-message"
                name="message"
                required
                minLength={8}
                rows={3}
                placeholder="Volume needed (kg), crop type, shipping destination..."
              />

              <Button type="submit" className="button-bright">
                {t.send}
                <ArrowUpRight />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}