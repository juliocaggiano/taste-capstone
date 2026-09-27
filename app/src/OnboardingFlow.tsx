import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { APP_NAME } from "./brand";
import { approvedPieces } from "./approved-catalog";
import { ArrowRight, CaretLeft, Check } from "./design-system/PrototypeIcons";
import { AppleProviderMark, FacebookProviderMark, GoogleProviderMark } from "./OnboardingProviderMarks";
import { BottomSheet, FlowStack, KeyboardInput, MobileScroll, useKeyboard, type FlowControls, type FlowScreen } from "./mobile";
import "./onboarding.css";

export type OnboardingReminderTime = "08:00" | "09:00" | "18:00";
export type OnboardingInterest = { id: string; label: string; image: string };
type Locale = "en" | "pt-BR" | "it" | "es";
type Step = "welcome" | "reminder" | "interests" | "ready";
type ReminderChoice = OnboardingReminderTime | "off" | null;

const COPY = {
  en: {
    welcomeTitle: "One artwork. A little more to see.",
    welcomeBody: "Read the story behind a work of art, one day at a time.",
    authTitle: "Sign up or log in",
    email: "Email",
    continueEmail: "Continue with email",
    invalidEmail: "Enter a valid email address.",
    orContinue: "Or continue with",
    continueApple: "Continue with Apple",
    continueGoogle: "Continue with Google",
    continueFacebook: "Continue with Facebook",
    legalBefore: "Preview only. Sign-in is not connected. Taste’s ",
    legalBetween: " and ",
    legalAfter: " are in progress.",
    terms: "Terms and Conditions",
    privacy: "Privacy Policy",
    policyPending: "This document is being prepared. No account is created in this preview.",
    back: "Back",
    skip: "Skip",
    next: "Continue",
    finish: "Finish",
    step: (number: number) => `Step ${number} of 3`,
    reminderTitle: "Save your notification preferences.",
    reminderBody: "Taste is built through everyday practice.",
    reminderInstruction: "Select a notification that fits your schedule.",
    reminderPreviewLabel: "DAILY ARTWORK",
    reminderPreviewTitle: "The Death of Socrates",
    reminderQuestion: "Remind me at",
    times: { "08:00": "Early morning", "09:00": "Morning", "18:00": "Evening" },
    noReminder: "Not now",
    chooseReminder: "Choose a time or Not now to continue.",
    interestsTitle: "Favorite art forms",
    interestCount: (count: number) => `${count} of 7 selected`,
    chooseInterest: "Choose at least one category to continue.",
    readyEyebrow: "YOU'RE ALL SET",
    readyTitle: "Your daily look starts here.",
    readyBody: "Your reminder and interests are saved in this preview.",
    openPrototype: "Open today's artwork",
    startAgain: "Start again",
  },
  "pt-BR": {
    welcomeTitle: "Uma obra. Um pouco mais para ver.",
    welcomeBody: "Leia a história por trás de uma obra de arte, um dia de cada vez.",
    authTitle: "Crie uma conta ou entre",
    email: "E-mail",
    continueEmail: "Continuar com e-mail",
    invalidEmail: "Digite um e-mail válido.",
    orContinue: "Ou continue com",
    continueApple: "Continuar com a Apple",
    continueGoogle: "Continuar com o Google",
    continueFacebook: "Continuar com o Facebook",
    legalBefore: "Apenas uma prévia. O acesso não está conectado. Os ",
    legalBetween: " e a ",
    legalAfter: " do Taste estão em preparação.",
    terms: "Termos e Condições",
    privacy: "Política de Privacidade",
    policyPending: "Este documento está em preparação. Nenhuma conta é criada nesta prévia.",
    back: "Voltar",
    skip: "Pular",
    next: "Continuar",
    finish: "Concluir",
    step: (number: number) => `Etapa ${number} de 3`,
    reminderTitle: "Salve suas preferências de notificação.",
    reminderBody: "O Taste se constrói com a prática diária.",
    reminderInstruction: "Escolha uma notificação que se encaixe na sua rotina.",
    reminderPreviewLabel: "OBRA DO DIA",
    reminderPreviewTitle: "A Morte de Sócrates",
    reminderQuestion: "Lembrar às",
    times: { "08:00": "Cedo", "09:00": "De manhã", "18:00": "À noite" },
    noReminder: "Agora não",
    chooseReminder: "Escolha um horário ou Agora não para continuar.",
    interestsTitle: "Artes favoritas",
    interestCount: (count: number) => `${count} de 7 selecionadas`,
    chooseInterest: "Escolha pelo menos uma categoria para continuar.",
    readyEyebrow: "TUDO PRONTO",
    readyTitle: "Sua descoberta diária começa aqui.",
    readyBody: "Seu lembrete e seus interesses foram salvos nesta prévia.",
    openPrototype: "Abrir a obra de hoje",
    startAgain: "Recomeçar",
  },
  it: {
    welcomeTitle: "Un'opera. Qualcosa in più da vedere.",
    welcomeBody: "Leggi la storia dietro un'opera d'arte, un giorno alla volta.",
    authTitle: "Registrati o accedi",
    email: "Email",
    continueEmail: "Continua con email",
    invalidEmail: "Inserisci un indirizzo email valido.",
    orContinue: "Oppure continua con",
    continueApple: "Continua con Apple",
    continueGoogle: "Continua con Google",
    continueFacebook: "Continua con Facebook",
    legalBefore: "Solo un'anteprima. L'accesso non è collegato. I ",
    legalBetween: " e l'",
    legalAfter: " di Taste sono in preparazione.",
    terms: "Termini e Condizioni",
    privacy: "Informativa sulla privacy",
    policyPending: "Questo documento è in preparazione. Nessun account viene creato in questa anteprima.",
    back: "Indietro",
    skip: "Salta",
    next: "Continua",
    finish: "Fine",
    step: (number: number) => `Passo ${number} di 3`,
    reminderTitle: "Salva le tue preferenze di notifica.",
    reminderBody: "Taste si costruisce con la pratica quotidiana.",
    reminderInstruction: "Scegli una notifica adatta ai tuoi orari.",
    reminderPreviewLabel: "OPERA DEL GIORNO",
    reminderPreviewTitle: "La morte di Socrate",
    reminderQuestion: "Ricordamelo alle",
    times: { "08:00": "Mattina presto", "09:00": "Mattina", "18:00": "Sera" },
    noReminder: "Non ora",
    chooseReminder: "Scegli un orario o Non ora per continuare.",
    interestsTitle: "Arti preferite",
    interestCount: (count: number) => `${count} di 7 selezionate`,
    chooseInterest: "Scegli almeno una categoria per continuare.",
    readyEyebrow: "TUTTO PRONTO",
    readyTitle: "La tua scoperta quotidiana inizia qui.",
    readyBody: "Il promemoria e i tuoi interessi sono salvati in questa anteprima.",
    openPrototype: "Apri l'opera di oggi",
    startAgain: "Ricomincia",
  },
  es: {
    welcomeTitle: "Una obra. Algo más por descubrir.",
    welcomeBody: "Lee la historia detrás de una obra de arte, un día a la vez.",
    authTitle: "Regístrate o inicia sesión",
    email: "Correo electrónico",
    continueEmail: "Continuar con correo electrónico",
    invalidEmail: "Introduce un correo válido.",
    orContinue: "O continúa con",
    continueApple: "Continuar con Apple",
    continueGoogle: "Continuar con Google",
    continueFacebook: "Continuar con Facebook",
    legalBefore: "Solo una vista previa. El acceso no está conectado. Los ",
    legalBetween: " y la ",
    legalAfter: " de Taste están en preparación.",
    terms: "Términos y Condiciones",
    privacy: "Política de Privacidad",
    policyPending: "Este documento se está preparando. No se crea ninguna cuenta en esta vista previa.",
    back: "Volver",
    skip: "Omitir",
    next: "Continuar",
    finish: "Terminar",
    step: (number: number) => `Paso ${number} de 3`,
    reminderTitle: "Guarda tus preferencias de notificación.",
    reminderBody: "Taste se construye con la práctica diaria.",
    reminderInstruction: "Elige una notificación que se adapte a tu horario.",
    reminderPreviewLabel: "OBRA DEL DÍA",
    reminderPreviewTitle: "La muerte de Sócrates",
    reminderQuestion: "Recuérdamelo a las",
    times: { "08:00": "Temprano", "09:00": "Por la mañana", "18:00": "Por la tarde" },
    noReminder: "Ahora no",
    chooseReminder: "Elige una hora o Ahora no para continuar.",
    interestsTitle: "Artes favoritas",
    interestCount: (count: number) => `${count} de 7 seleccionadas`,
    chooseInterest: "Elige al menos una categoría para continuar.",
    readyEyebrow: "TODO LISTO",
    readyTitle: "Tu descubrimiento diario empieza aquí.",
    readyBody: "Tu recordatorio y tus intereses se guardaron en esta vista previa.",
    openPrototype: "Abrir la obra de hoy",
    startAgain: "Empezar de nuevo",
  },
} as const;

type FlowContextValue = {
  copy: (typeof COPY)[Locale];
  categories: readonly OnboardingInterest[];
  reminder: ReminderChoice;
  setReminder: (choice: ReminderChoice) => void;
  interests: readonly string[];
  toggleInterest: (id: string) => void;
  setStep: (step: Step) => void;
  finish: () => void;
  openPrototype: () => void;
  restart: () => void;
};
const OnboardingContext = createContext<FlowContextValue | null>(null);
const TIMES = ["08:00", "09:00", "18:00"] as const;
const WELCOME_ARTWORKS = [
  { src: "/assets/content/girl-pearl.jpg", position: "50% 41%" },
  { src: "/assets/content/the-kiss.jpg", position: "50% 50%" },
  { src: "/assets/content/dante-portrait.jpg", position: "50% 40%" },
] as const;
const reminderArtwork = approvedPieces[0];

function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("Onboarding screen needs OnboardingFlow");
  return context;
}

function useStepFocus(flow: FlowControls, step: Step) {
  const heading = useRef<HTMLHeadingElement>(null);
  const { setStep } = useOnboarding();
  useEffect(() => {
    if (flow.current.id !== step) return;
    setStep(step);
    const frame = requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [flow.current.id, setStep, step]);
  return heading;
}

function Progress({ number }: { number: 2 | 3 }) {
  const { copy } = useOnboarding();
  return <div className="onboarding-progress" aria-label={copy.step(number)}><span>{copy.step(number)}</span><span className="onboarding-progress-track" aria-hidden="true"><i style={{ width: `${number / 3 * 100}%` }} /></span></div>;
}

function StepTop({ flow, number, onSkip }: { flow: FlowControls; number: 2 | 3; onSkip: () => void }) {
  const { copy } = useOnboarding();
  return <div className="onboarding-step-top">
    <button type="button" className="onboarding-back" onClick={() => flow.pop()} aria-label={copy.back}><span className="onboarding-back-disc"><CaretLeft size={14} aria-hidden="true" /></span></button>
    <Progress number={number} />
    <button type="button" className="onboarding-skip" onClick={onSkip}>{copy.skip}</button>
  </div>;
}

function PrimaryAction({ children, onClick, disabled = false }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className="onboarding-primary" onClick={onClick} disabled={disabled}>{children}<ArrowRight size={18} aria-hidden="true" /></button>;
}

function WelcomeScreen({ flow }: { flow: FlowControls }) {
  const { copy } = useOnboarding();
  const heading = useStepFocus(flow, "welcome");
  const keyboard = useKeyboard();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [policy, setPolicy] = useState<"terms" | "privacy" | null>(null);
  const [artworkIndex, setArtworkIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setArtworkIndex(0);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || flow.current.id !== "welcome" || policy !== null || keyboard.visible) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) setArtworkIndex(index => (index + 1) % WELCOME_ARTWORKS.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, [flow.current.id, keyboard.visible, policy, reducedMotion]);

  const continuePreview = () => {
    keyboard.hide();
    flow.push(reminderScreen);
  };

  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(true);
      return;
    }
    continuePreview();
  };

  return <MobileScroll className="onboarding-scroll">
    <main className="onboarding-welcome" aria-labelledby="onboarding-welcome-title">
      <div className="onboarding-welcome-gallery" aria-hidden="true">
        {WELCOME_ARTWORKS.map((artwork, index) => <img key={artwork.src} className="onboarding-welcome-art" data-active={artworkIndex === index} src={artwork.src} alt="" style={{ objectPosition: artwork.position }} />)}
      </div>
      <div className="onboarding-welcome-shade" aria-hidden="true" />
      <div className="onboarding-welcome-content">
        <span className="onboarding-wordmark">{APP_NAME}</span>
        <div className="onboarding-welcome-message">
          <h1 ref={heading} tabIndex={-1} id="onboarding-welcome-title">{copy.welcomeTitle}</h1>
          <p>{copy.welcomeBody}</p>
        </div>
        <div className="onboarding-signin-card">
          <h2>{copy.authTitle}</h2>
          <form onSubmit={submitEmail} noValidate>
            <label className="sr-only" htmlFor="onboarding-email">{copy.email}</label>
            <div className="onboarding-email-field">
              <KeyboardInput id="onboarding-email" type="email" inputMode="email" autoComplete="off" placeholder={copy.email} value={email} onChange={event => { setEmail(event.currentTarget.value); setEmailError(false); }} aria-invalid={emailError} aria-describedby={emailError ? "onboarding-email-error" : undefined} />
              <button type="submit" aria-label={copy.continueEmail} title={copy.continueEmail}><ArrowRight size={18} aria-hidden="true" /></button>
            </div>
            {emailError && <p className="onboarding-email-error" id="onboarding-email-error" role="alert">{copy.invalidEmail}</p>}
          </form>
          <p className="onboarding-or-continue">{copy.orContinue}</p>
          <div className="onboarding-provider-options">
            <button type="button" onClick={continuePreview} aria-label={copy.continueApple} title={copy.continueApple}><AppleProviderMark /></button>
            <button type="button" onClick={continuePreview} aria-label={copy.continueGoogle} title={copy.continueGoogle}><GoogleProviderMark /></button>
            <button type="button" onClick={continuePreview} aria-label={copy.continueFacebook} title={copy.continueFacebook}><FacebookProviderMark /></button>
          </div>
          <p className="onboarding-legal-copy">{copy.legalBefore}<button type="button" onClick={() => setPolicy("terms")}>{copy.terms}</button>{copy.legalBetween}<button type="button" onClick={() => setPolicy("privacy")}>{copy.privacy}</button>{copy.legalAfter}</p>
        </div>
      </div>
    </main>
    <BottomSheet open={policy !== null} onOpenChange={open => { if (!open) setPolicy(null); }} title={policy === "privacy" ? copy.privacy : copy.terms} snap={0.35}>
      <p className="onboarding-policy-note">{copy.policyPending}</p>
    </BottomSheet>
  </MobileScroll>;
}

function ReminderScreen({ flow }: { flow: FlowControls }) {
  const { copy, reminder, setReminder } = useOnboarding();
  const heading = useStepFocus(flow, "reminder");
  return <MobileScroll className="onboarding-scroll">
    <main className="onboarding-step onboarding-reminder" aria-labelledby="onboarding-reminder-title">
      <StepTop flow={flow} number={2} onSkip={() => { setReminder("off"); flow.push(interestsScreen); }} />
      <div className="onboarding-step-heading"><h1 ref={heading} tabIndex={-1} id="onboarding-reminder-title">{copy.reminderTitle}</h1><p>{copy.reminderBody}</p><p>{copy.reminderInstruction}</p></div>
      <div className="onboarding-notification-preview" aria-label={`${reminderArtwork.title} (${reminderArtwork.year})`}>
        <img src={reminderArtwork.image} alt="" />
        <div><span>{copy.reminderPreviewLabel}</span><strong>{reminderArtwork.title} ({reminderArtwork.year})</strong></div>
      </div>
      <section className="onboarding-options" aria-label={copy.reminderQuestion}>
        <h2>{copy.reminderQuestion}</h2>
        {TIMES.map(time => <button key={time} type="button" className="onboarding-time-option" aria-pressed={reminder === time} onClick={() => setReminder(time)}><span><strong>{copy.times[time]}</strong><small>{time}</small></span><span className="onboarding-option-check" aria-hidden="true">{reminder === time && <Check size={16} />}</span></button>)}
        <button type="button" className="onboarding-time-option onboarding-no-reminder" aria-pressed={reminder === "off"} onClick={() => setReminder("off")}><span><strong>{copy.noReminder}</strong></span><span className="onboarding-option-check" aria-hidden="true">{reminder === "off" && <Check size={16} />}</span></button>
      </section>
    </main>
  </MobileScroll>;
}

function ReminderFooter({ flow }: { flow: FlowControls }) {
  const { copy, reminder } = useOnboarding();
  return <div className="onboarding-footer"><PrimaryAction disabled={reminder === null} onClick={() => flow.push(interestsScreen)}>{copy.next}</PrimaryAction><span className="sr-only" role="status">{reminder === null ? copy.chooseReminder : ""}</span></div>;
}

function InterestsScreen({ flow }: { flow: FlowControls }) {
  const { copy, categories, interests, toggleInterest, finish } = useOnboarding();
  const heading = useStepFocus(flow, "interests");
  return <MobileScroll className="onboarding-scroll">
    <main className="onboarding-step onboarding-interests" aria-labelledby="onboarding-interests-title">
      <StepTop flow={flow} number={3} onSkip={() => { finish(); flow.push(readyScreen); }} />
      <div className="onboarding-step-heading"><h1 ref={heading} tabIndex={-1} id="onboarding-interests-title">{copy.interestsTitle}</h1></div>
      <p className="onboarding-interest-count" aria-live="polite">{copy.interestCount(interests.length)}</p>
      <div className="onboarding-category-grid" aria-label={copy.interestsTitle}>
        {categories.map((item, index) => <button key={item.id} type="button" className="onboarding-category" data-wide={index === categories.length - 1} aria-pressed={interests.includes(item.id)} onClick={() => toggleInterest(item.id)}>
          <img src={item.image} alt="" /><span className="onboarding-category-label">{item.label}</span><span className="onboarding-category-check" aria-hidden="true">{interests.includes(item.id) && <Check size={16} />}</span>
        </button>)}
      </div>
    </main>
  </MobileScroll>;
}

function InterestsFooter({ flow }: { flow: FlowControls }) {
  const { copy, interests, finish } = useOnboarding();
  return <div className="onboarding-footer"><PrimaryAction disabled={interests.length === 0} onClick={() => { finish(); flow.push(readyScreen); }}>{copy.finish}</PrimaryAction><span className="sr-only" role="status">{interests.length === 0 ? copy.chooseInterest : ""}</span></div>;
}

function ReadyScreen({ flow }: { flow: FlowControls }) {
  const { copy, openPrototype, restart } = useOnboarding();
  const heading = useStepFocus(flow, "ready");
  return <MobileScroll className="onboarding-scroll">
    <main className="onboarding-ready" aria-labelledby="onboarding-ready-title">
      <div className="onboarding-ready-art"><img src={WELCOME_ARTWORKS[0].src} alt="" /></div>
      <div className="onboarding-ready-copy"><span>{copy.readyEyebrow}</span><h1 ref={heading} tabIndex={-1} id="onboarding-ready-title">{copy.readyTitle}</h1><p>{copy.readyBody}</p></div>
      <div className="onboarding-ready-actions"><PrimaryAction onClick={openPrototype}>{copy.openPrototype}</PrimaryAction><button type="button" className="onboarding-restart" onClick={restart}>{copy.startAgain}</button></div>
    </main>
  </MobileScroll>;
}

function Route({ id, flow, children }: { id: Step; flow: FlowControls; children: ReactNode }) {
  const covered = flow.current.id !== id;
  return <div className="onboarding-route" aria-hidden={covered} inert={covered}>{children}</div>;
}

const welcomeScreen: FlowScreen = { id: "welcome", render: flow => <Route id="welcome" flow={flow}><WelcomeScreen flow={flow} /></Route> };
const reminderScreen: FlowScreen = { id: "reminder", footerHeight: 116, footer: flow => <ReminderFooter flow={flow} />, render: flow => <Route id="reminder" flow={flow}><ReminderScreen flow={flow} /></Route> };
const interestsScreen: FlowScreen = { id: "interests", footerHeight: 116, footer: flow => <InterestsFooter flow={flow} />, render: flow => <Route id="interests" flow={flow}><InterestsScreen flow={flow} /></Route> };
const readyScreen: FlowScreen = { id: "ready", render: flow => <Route id="ready" flow={flow}><ReadyScreen flow={flow} /></Route> };

function OnboardingSession({ locale, categories, onComplete, onOpenPrototype, onRestart }: {
  locale: Locale;
  categories: readonly OnboardingInterest[];
  onComplete: (reminder: OnboardingReminderTime | "off", interests: readonly string[]) => void;
  onOpenPrototype: () => void;
  onRestart: () => void;
}) {
  const [step, setStep] = useState<Step>("welcome");
  const [reminder, setReminder] = useState<ReminderChoice>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const toggleInterest = (id: string) => setInterests(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const finish = () => onComplete(reminder ?? "off", interests);
  return <OnboardingContext.Provider value={{ copy: COPY[locale], categories, reminder, setReminder, interests, toggleInterest, setStep, finish, openPrototype: onOpenPrototype, restart: onRestart }}>
    <div className="onboarding-flow" data-step={step}><FlowStack initial={welcomeScreen} /></div>
  </OnboardingContext.Provider>;
}

export function OnboardingFlow({ locale, categories, onComplete, onOpenPrototype }: {
  locale: Locale;
  categories: readonly OnboardingInterest[];
  onComplete: (reminder: OnboardingReminderTime | "off", interests: readonly string[]) => void;
  onOpenPrototype: () => void;
}) {
  const [session, setSession] = useState(0);
  return <OnboardingSession key={session} locale={locale} categories={categories} onComplete={onComplete} onOpenPrototype={onOpenPrototype} onRestart={() => setSession(current => current + 1)} />;
}
