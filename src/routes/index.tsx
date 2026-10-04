import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Mic, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HydrogelScene } from "@/components/HydrogelScene";
import heroImage from "@/assets/hydrogel-hero.jpg";
import materialImage from "@/assets/hydrogel-material.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "TERA-WET | Water, engineered for life" },
    { name: "description", content: "Explore Tera-Wet hydrogel technology, agricultural applications, product grades, and an indicative dosage calculator." },
    { property: "og:title", content: "TERA-WET | Water, engineered for life" },
    { property: "og:description", content: "Hydrogel technology for a more water-resilient growing future." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

type Language = "EN" | "UA" | "RU";
const copy = {
  EN: { science: "The science", products: "Products", calculator: "Calculator", contact: "Contact", heroLabel: "THE FUTURE OF WATER IN SOIL", heroA: "TERAWET.", heroB: "REVOLUTIONIZED.", heroText: "Superabsorbent polymer hydrogel technology that transforms drought-prone soil into fertile water reservoirs for 7–10 years.", explore: "Explore products", discover: "Discover the science", scroll: "SCROLL TO EXPLORE", scienceEyebrow: "01 / UNDER THE SURFACE", scienceTitle: "THE SCIENCE OF\nCELLULAR HYDRATION", scienceIntro: "A microscopic change with a field-scale impact. Cross-linked superabsorbent matrices can retain up to 400 times their weight in water.", productEyebrow: "02 / PRODUCT MATRIX", productTitle: "ENGINEERED FOR\nEVERY ROOT.", productIntro: "Two precise formats. One purpose: make every drop work harder, where it matters most.", quote: "Request a quote", calculate: "Calculate application", calcEyebrow: "03 / APPLICATION PLANNER", calcTitle: "PLAN YOUR\nIMPACT.", calcIntro: "Find an indicative starting point for your growing area. Final dosage depends on soil, crop, climate, and application method.", crop: "CROP / APPLICATION", area: "TREATED AREA", result: "ESTIMATED PRODUCT", water: "POTENTIAL WATER SAVINGS", contactEyebrow: "04 / LET’S GROW", contactTitle: "MAKE WATER\nGO FURTHER.", contactIntro: "Tell us about your project. We’ll help you find the right grade, format, and application approach.", name: "Your name", email: "Email address", message: "Tell us about your project", send: "Compose inquiry", voice: "Voice consultant", voiceUnavailable: "Voice consultation is not connected yet. Send us an inquiry instead.", getInTouch: "Get in touch", menu: "Open menu", close: "Close" },
  UA: { science: "Наука", products: "Продукти", calculator: "Калькулятор", contact: "Контакти", heroLabel: "МАЙБУТНЄ ВОДИ В ҐРУНТІ", heroA: "TERAWET.", heroB: "РЕВОЛЮЦІЯ.", heroText: "Суперабсорбентний гідрогель допомагає ґрунту зберігати воду для рослин протягом 7–10 років.", explore: "Продукти", discover: "Дізнатись про науку", scroll: "ГОРТАЙТЕ ВНИЗ", scienceEyebrow: "01 / ПІД ПОВЕРХНЕЮ", scienceTitle: "НАУКА КЛІТИННОГО\nЗВОЛОЖЕННЯ", scienceIntro: "Мікроскопічна зміна з великим впливом. Матриці суперабсорбенту утримують до 400 разів більше води за власну вагу.", productEyebrow: "02 / ПРОДУКТОВА ЛІНІЙКА", productTitle: "СТВОРЕНО ДЛЯ\nКОЖНОГО КОРЕНЯ.", productIntro: "Два точних формати. Одна мета: більше користі від кожної краплі.", quote: "Запитати ціну", calculate: "Розрахувати норму", calcEyebrow: "03 / ПЛАНУВАННЯ", calcTitle: "ПЛАНУЙТЕ\nРЕЗУЛЬТАТ.", calcIntro: "Орієнтовний розрахунок для вашої площі. Остаточна норма залежить від ґрунту, культури, клімату та способу внесення.", crop: "КУЛЬТУРА / ЗАСТОСУВАННЯ", area: "ПЛОЩА ОБРОБКИ", result: "ОРІЄНТОВНА КІЛЬКІСТЬ", water: "МОЖЛИВА ЕКОНОМІЯ ВОДИ", contactEyebrow: "04 / ЗРОСТАЙМО РАЗОМ", contactTitle: "БІЛЬШЕ ВІД\nКОЖНОЇ КРАПЛІ.", contactIntro: "Розкажіть про ваш проєкт. Ми допоможемо обрати продукт та спосіб застосування.", name: "Ваше ім’я", email: "Електронна пошта", message: "Розкажіть про проєкт", send: "Створити лист", voice: "Голосовий консультант", voiceUnavailable: "Голосова консультація поки не підключена. Напишіть нам.", getInTouch: "Зв’язатися", menu: "Відкрити меню", close: "Закрити" },
  RU: { science: "Наука", products: "Продукты", calculator: "Калькулятор", contact: "Контакты", heroLabel: "БУДУЩЕЕ ВОДЫ В ПОЧВЕ", heroA: "TERAWET.", heroB: "РЕВОЛЮЦИЯ.", heroText: "Суперабсорбирующий гидрогель помогает почве сохранять воду для растений в течение 7–10 лет.", explore: "Продукты", discover: "Изучить технологию", scroll: "ЛИСТАЙТЕ ВНИЗ", scienceEyebrow: "01 / ПОД ПОВЕРХНОСТЬЮ", scienceTitle: "НАУКА КЛЕТОЧНОГО\nУВЛАЖНЕНИЯ", scienceIntro: "Микроскопическое изменение с большим эффектом. Матрицы суперабсорбента удерживают до 400 раз больше воды собственного веса.", productEyebrow: "02 / ПРОДУКТОВАЯ ЛИНЕЙКА", productTitle: "СОЗДАНО ДЛЯ\nКАЖДОГО КОРНЯ.", productIntro: "Два точных формата. Одна цель: больше пользы от каждой капли.", quote: "Запросить цену", calculate: "Рассчитать норму", calcEyebrow: "03 / ПЛАНИРОВАНИЕ", calcTitle: "ПЛАНИРУЙТЕ\nРЕЗУЛЬТАТ.", calcIntro: "Ориентировочный расчет для вашей площади. Итоговая норма зависит от почвы, культуры, климата и способа внесения.", crop: "КУЛЬТУРА / ПРИМЕНЕНИЕ", area: "ПЛОЩАДЬ ОБРАБОТКИ", result: "ОРИЕНТИРОВОЧНОЕ КОЛИЧЕСТВО", water: "ВОЗМОЖНАЯ ЭКОНОМИЯ ВОДЫ", contactEyebrow: "04 / ДАВАЙТЕ РАСТИ", contactTitle: "БОЛЬШЕ ОТ\nКАЖДОЙ КАПЛИ.", contactIntro: "Расскажите о вашем проекте. Мы поможем выбрать продукт и способ применения.", name: "Ваше имя", email: "Электронная почта", message: "Расскажите о проекте", send: "Составить письмо", voice: "Голосовой консультант", voiceUnavailable: "Голосовая консультация пока не подключена. Напишите нам.", getInTouch: "Связаться", menu: "Открыть меню", close: "Закрыть" },
};

const stages = [
  { number: "01", title: "ABSORPTION MATRIX", body: "Dry crystals take up water and swell, forming a hydrated matrix around the root zone.", metric: "UP TO 400×", sub: "WATER RETENTION CAPACITY" },
  { number: "02", title: "MOISTURE RESERVOIR", body: "Water stays in the soil profile instead of draining straight through or disappearing from the surface.", metric: "IN THE ROOT ZONE", sub: "WHERE WATER IS NEEDED" },
  { number: "03", title: "ROOT EXCHANGE", body: "The hydrated matrix releases moisture as the surrounding soil dries, making water accessible to roots.", metric: "ON DEMAND", sub: "ROOT ACCESS TO MOISTURE" },
  { number: "04", title: "LONG-TERM CYCLE", body: "Repeated wetting and drying cycles support a multi-year soil water-management strategy.", metric: "7–10 YEARS", sub: "STATED PRODUCT LIFESPAN" },
];

const crops = [
  { name: "Trees", rate: 12, unit: "ha" },
  { name: "Vineyards", rate: 20, unit: "ha" },
  { name: "Wheat / Corn", rate: 25, unit: "ha" },
  { name: "Vegetables", rate: 30, unit: "ha" },
  { name: "Lawn", rate: 2, unit: "ha" },
];

function Home() {
  const [lang, setLang] = useState<Language>("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const [crop, setCrop] = useState(2);
  const [area, setArea] = useState("1");
  const [unit, setUnit] = useState<"ha" | "m²">("ha");
  const [quoteProduct, setQuoteProduct] = useState<string | null>(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const t = copy[lang];
  const hectares = (Number(area) || 0) * (unit === "ha" ? 1 : 0.0001);
  const activeCrop = crops[crop] ?? { name: "Trees", rate: 12, unit: "ha" };
  const activeStage = stages[stage] ?? { number: "01", title: "ABSORPTION MATRIX", body: "Dry crystals absorb water.", metric: "UP TO 400×", sub: "WATER RETENTION CAPACITY" };
  const kilograms = hectares * activeCrop.rate;
  const formatKg = kilograms < 10 ? kilograms.toFixed(2).replace(/\.00$/, "") : Math.round(kilograms).toLocaleString();
  const nav = [[t.science, "#science"], [t.products, "#products"], [t.calculator, "#calculator"], [t.contact, "#contact"]];

  const sendInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = quoteProduct ? `Tera-Wet quote request — ${quoteProduct}` : "Tera-Wet inquiry";
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:info@terawet.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Tera-Wet home"><span className="brand-symbol"><span /></span><span>TERA<span className="brand-hyphen">-</span>WET<span className="brand-dot">.</span></span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">{(["UA", "EN", "RU"] as Language[]).map(option => <Button key={option} variant="ghost" type="button" aria-pressed={lang === option} className={lang === option ? "active" : ""} onClick={() => setLang(option)}>{option}</Button>)}</div>
          <Button variant="ghost" size="icon" className="menu-trigger" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </header>

      {menuOpen && <div className="mobile-nav">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={20} /></a>)}</div>}

      <main>
        <section className="hero" id="top">
          <img src={heroImage} alt="Water-filled hydrogel crystals surrounded by plant roots in rich soil" className="hero-image" width={1920} height={1080} fetchPriority="high" />
          <div className="hero-shade" />
          <HydrogelScene />
          <div className="hero-content page-width">
            <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" />{t.heroLabel}</div>
            <h1><span>{t.heroA}</span><span className="outline-word">{t.heroB}</span></h1>
            <p>{t.heroText}</p>
            <div className="hero-buttons"><Button asChild className="button-bright"><a href="#products">{t.explore}<ArrowUpRight /></a></Button><Button asChild variant="outline" className="button-outline"><a href="#science">{t.discover}<ArrowRight /></a></Button></div>
          </div>
          <div className="hero-bottom page-width"><span>01 / 04 <span className="separator">—</span> TERA-WET</span><a href="#science">{t.scroll}<ArrowDown size={16} /></a><span className="hero-coordinate">38° 13′ N / 122° 15′ W</span></div>
        </section>

        <section className="science-section section-space" id="science">
          <div className="page-width">
            <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" />{t.scienceEyebrow}</span><h2 className="display-title">{t.scienceTitle}</h2></div><p>{t.scienceIntro}</p></div>
            <div className="science-experience">
              <div className="science-image-wrap"><img src={materialImage} loading="lazy" width={1536} height={1024} alt="Dry hydrogel granules beside a hydrated crystal" /><div className="image-corner top-left">FIG. 0{stage + 1} / HYDROGEL MATRIX</div><div className="science-reticle" aria-hidden="true"><span>+</span></div><div className="image-corner bottom-right">MICROSTRUCTURE / TERA-WET</div></div>
              <div className="science-panel"><div className="science-panel-top"><span>THE HYDRATION CYCLE</span><span>{activeStage.number} / 04</span></div><div className="stage-copy"><span className="stage-count">{activeStage.number}</span><h3>{activeStage.title}</h3><p>{activeStage.body}</p><div className="stage-metric"><strong>{activeStage.metric}</strong><span>{activeStage.sub}</span></div></div><div className="stage-controls"><div className="stage-progress">{stages.map((item, index) => <Button key={item.number} variant="ghost" className={index === stage ? "selected" : ""} aria-label={`Stage ${index + 1}: ${item.title}`} aria-pressed={index === stage} onClick={() => setStage(index)} />)}</div><div className="stage-arrows"><Button variant="outline" size="icon" aria-label="Previous stage" onClick={() => setStage((stage + 3) % 4)}><ArrowLeft /></Button><Button variant="outline" size="icon" aria-label="Next stage" onClick={() => setStage((stage + 1) % 4)}><ArrowRight /></Button></div></div></div>
            </div>
            <div className="stats-strip"><div><strong>400<span>×</span></strong><span>WATER ABSORPTION<br />CAPACITY*</span></div><div><strong>50<span>%</span></strong><span>POTENTIAL IRRIGATION<br />REDUCTION*</span></div><div><strong>7–10<span>YR</span></strong><span>STATED APPLICATION<br />LIFESPAN*</span></div></div>
            <p className="fine-print">*Indicative product claims supplied for this concept. Performance varies by soil, crop, climate, and application; request technical documentation before use.</p>
          </div>
        </section>

        <section className="products-section section-space" id="products"><div className="page-width"><div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" />{t.productEyebrow}</span><h2 className="display-title">{t.productTitle}</h2></div><p>{t.productIntro}</p></div><div className="product-grid">
          {[{ code: "T-400", category: "AGRICULTURAL GRADE", desc: "Granular hydrogel for field-scale soil incorporation, planting beds, and root-zone water retention.", image: materialImage, imageClass: "product-image-a", applications: "FIELDS / ORCHARDS / LANDSCAPES" }, { code: "T-100", category: "FINE POWDER", desc: "Fine-format hydrogel for targeted applications including seed coating and root dipping.", image: materialImage, imageClass: "product-image-b", applications: "SEEDS / ROOT DIPPING / NURSERIES" }].map(product => <article className="product-card" key={product.code}><div className="product-visual"><img className={product.imageClass} src={product.image} loading="lazy" width={1536} height={1024} alt={`${product.code} hydrogel material close-up`} /><span className="product-visual-label">TERA-WET / {product.code}</span></div><div className="product-info"><span className="eyebrow small">{product.category}</span><h3>TERA-WET <em>{product.code}</em></h3><p>{product.desc}</p><div className="product-spec"><span>APPLICATION</span><strong>{product.applications}</strong></div><div className="product-spec"><span>PACKAGING</span><strong>1 KG / 5 KG / 25 KG*</strong></div><Button className="product-action" onClick={() => setQuoteProduct(`Tera-Wet ${product.code}`)}>{t.quote}<ArrowUpRight /></Button></div></article>)}</div><p className="fine-print">*Packaging availability and product specifications are subject to confirmation.</p></div></section>

        <section className="calculator-section section-space" id="calculator"><div className="page-width"><div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-line" />{t.calcEyebrow}</span><h2 className="display-title">{t.calcTitle}</h2></div><p>{t.calcIntro}</p></div><div className="calculator-layout"><div className="calculator-inputs"><label htmlFor="crop-select" className="input-label">{t.crop}</label><div className="select-wrap"><select id="crop-select" value={crop} onChange={event => setCrop(Number(event.target.value))}>{crops.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select><ChevronDown /></div><label htmlFor="area-input" className="input-label area-label">{t.area}</label><div className="area-row"><div className="area-field"><input id="area-input" type="number" min="0" step="any" value={area} onChange={event => setArea(event.target.value)} /><div className="stepper"><Button variant="ghost" size="icon" aria-label="Increase area" onClick={() => setArea(String(Math.max(0, Number(area) + (unit === "ha" ? 1 : 100))))}><Plus /></Button><Button variant="ghost" size="icon" aria-label="Decrease area" onClick={() => setArea(String(Math.max(0, Number(area) - (unit === "ha" ? 1 : 100))))}><Minus /></Button></div></div><div className="unit-toggle"><Button variant="ghost" aria-pressed={unit === "ha"} className={unit === "ha" ? "active" : ""} onClick={() => setUnit("ha")}>ha</Button><Button variant="ghost" aria-pressed={unit === "m²"} className={unit === "m²" ? "active" : ""} onClick={() => setUnit("m²")}>m²</Button></div></div><p className="calculator-note">Indicative rate: {activeCrop.rate} kg / ha. Confirm a tailored application rate with a specialist.</p></div><div className="calculator-results"><span className="eyebrow small">YOUR ESTIMATE / TERA-WET</span><div className="result-number"><strong>{formatKg}</strong><span>KG</span></div><span className="input-label">{t.result}</span><div className="result-divider" /><div className="saving-row"><div><span className="input-label">{t.water}</span><strong>UP TO 50%</strong></div><span className="saving-icon">↗</span></div><p>Potential reduction versus standard irrigation; not a guaranteed outcome. Water volume cannot be estimated without your baseline usage.</p><Button asChild className="button-bright"><a href="#contact">{t.getInTouch}<ArrowUpRight /></a></Button></div></div></div></section>

        <section className="contact-section section-space" id="contact"><div className="page-width contact-layout"><div className="contact-left"><span className="eyebrow"><span className="eyebrow-line" />{t.contactEyebrow}</span><h2 className="display-title">{t.contactTitle}</h2><p>{t.contactIntro}</p><a className="contact-email" href="mailto:info@terawet.com">info@terawet.com <ArrowUpRight size={24} /></a><div className="contact-social"><a href="https://wa.me/16195160130" target="_blank" rel="noreferrer">WHATSAPP <ArrowUpRight size={15} /></a><a href="mailto:info@terawet.com" >EMAIL <ArrowUpRight size={15} /></a><span title="Telegram contact not supplied">TELEGRAM / CONTACT REQUEST</span></div></div><form className="contact-form" onSubmit={sendInquiry}><span className="form-kicker">START A CONVERSATION <span>↗</span></span><label htmlFor="contact-name">01 / {t.name}</label><input id="contact-name" name="name" placeholder="Name" required minLength={2} /><label htmlFor="contact-email">02 / {t.email}</label><input id="contact-email" name="email" type="email" placeholder="you@company.com" required /><label htmlFor="contact-message">03 / {t.message}</label><textarea id="contact-message" name="message" placeholder="Crop, area, location, and what you need..." rows={3} required minLength={10} /><Button type="submit" className="button-bright form-submit">{t.send}<ArrowUpRight /></Button><p className="fine-print">Opens your email app with the inquiry prepared. No information is submitted on this page.</p></form></div></section>
      </main>

      <footer className="site-footer"><div className="page-width"><a href="#top" className="brand"><span className="brand-symbol"><span /></span><span>TERA-WET<span className="brand-dot">.</span></span></a><span>WATER, ENGINEERED FOR LIFE.</span><span>© {new Date().getFullYear()} TERA-WET</span><a href="#top">BACK TO TOP ↑</a></div></footer>

      <div className="voice-widget"><Button className="voice-trigger" aria-label={t.voice} aria-expanded={voiceOpen} onClick={() => setVoiceOpen(!voiceOpen)}><span className="voice-pulse" /><Mic /></Button>{voiceOpen && <div className="voice-popover"><Button variant="ghost" size="icon" aria-label={t.close} onClick={() => setVoiceOpen(false)}><X /></Button><span className="eyebrow small">TERA-WET / ASSISTANT</span><h3>{t.voice}</h3><p>{t.voiceUnavailable}</p><Button asChild className="button-bright"><a href="#contact" onClick={() => setVoiceOpen(false)}>{t.getInTouch}<ArrowUpRight /></a></Button></div>}</div>

      {quoteProduct && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setQuoteProduct(null); }}><div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title"><Button variant="ghost" size="icon" className="modal-close" aria-label="Close request" onClick={() => setQuoteProduct(null)}><X /></Button><span className="eyebrow small">TERA-WET / PRODUCT INQUIRY</span><h2 id="quote-title">REQUEST A QUOTE<span className="brand-dot">.</span></h2><p>{quoteProduct} · Available packaging: 1 kg / 5 kg / 25 kg, subject to confirmation.</p><form onSubmit={sendInquiry}><label htmlFor="quote-name">NAME</label><input id="quote-name" name="name" required minLength={2} placeholder="Your name" /><label htmlFor="quote-email">EMAIL</label><input id="quote-email" name="email" type="email" required placeholder="you@company.com" /><label htmlFor="quote-message">PROJECT DETAILS</label><textarea id="quote-message" name="message" required minLength={10} rows={3} placeholder="Quantity, crop, location, and timing..." /><Button type="submit" className="button-bright">COMPOSE REQUEST <ArrowUpRight /></Button><p className="fine-print">Opens your email app. No request is saved on this page.</p></form></div></div>}
    </div>
  );
}