import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AppleProviderMark, FacebookProviderMark, GoogleProviderMark } from "./OnboardingProviderMarks";
import { ArrowRight, CaretLeft, CaretRight, Check, Plus, X } from "./design-system/PrototypeIcons";
import { KeyboardInput, MobileScroll, useKeyboard, useMobileDevice } from "./mobile";
import { SaverAvatar } from "./TodaySaversSheet";
import { PRIMARY_ACCOUNT_ID } from "./account-preview";
import "./switch-accounts.css";

type Locale = "en" | "pt-BR" | "it" | "es";
type AddMethod = "email" | "apple" | "google" | "facebook";
type Page = "chooser" | "add";

export type SwitchAccount = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  tone: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
};

type SwitchAccountsFlowProps = {
  open: boolean;
  locale: Locale;
  accounts: readonly SwitchAccount[];
  activeAccountId: string;
  onClose: () => void;
  onSelectAccount: (id: string) => void;
  onAddAccount: (method: AddMethod, email?: string) => void;
};

const COPY = {
  en: {
    switchTitle: "Switch accounts",
    addTitle: "Add account",
    close: "Close switch accounts",
    back: "Back to accounts",
    accounts: "Accounts on this device",
    current: "Current",
    sample: "Preview account",
    addAccount: "Add account",
    empty: "No accounts on this device yet.",
    email: "Email address",
    continueEmail: "Continue with email",
    invalidEmail: "Enter a valid email address.",
    orContinue: "Or continue with",
    apple: "Continue with Apple",
    google: "Continue with Google",
    facebook: "Continue with Facebook",
    addNote: "This preview does not sign in, send email, or connect to Apple, Google, or Facebook.",
  },
  "pt-BR": {
    switchTitle: "Trocar de conta",
    addTitle: "Adicionar conta",
    close: "Fechar troca de contas",
    back: "Voltar às contas",
    accounts: "Contas neste dispositivo",
    current: "Atual",
    sample: "Conta de prévia",
    addAccount: "Adicionar conta",
    empty: "Ainda não há contas neste dispositivo.",
    email: "Endereço de e-mail",
    continueEmail: "Continuar com e-mail",
    invalidEmail: "Digite um endereço de e-mail válido.",
    orContinue: "Ou continue com",
    apple: "Continuar com a Apple",
    google: "Continuar com o Google",
    facebook: "Continuar com o Facebook",
    addNote: "Esta prévia não faz login, envia e-mails nem se conecta à Apple, ao Google ou ao Facebook.",
  },
  it: {
    switchTitle: "Cambia account",
    addTitle: "Aggiungi account",
    close: "Chiudi il cambio account",
    back: "Torna agli account",
    accounts: "Account su questo dispositivo",
    current: "Attuale",
    sample: "Account di anteprima",
    addAccount: "Aggiungi account",
    empty: "Non ci sono ancora account su questo dispositivo.",
    email: "Indirizzo email",
    continueEmail: "Continua con email",
    invalidEmail: "Inserisci un indirizzo email valido.",
    orContinue: "Oppure continua con",
    apple: "Continua con Apple",
    google: "Continua con Google",
    facebook: "Continua con Facebook",
    addNote: "Questa anteprima non effettua l'accesso, non invia email e non si collega ad Apple, Google o Facebook.",
  },
  es: {
    switchTitle: "Cambiar de cuenta",
    addTitle: "Añadir cuenta",
    close: "Cerrar cambio de cuentas",
    back: "Volver a las cuentas",
    accounts: "Cuentas en este dispositivo",
    current: "Actual",
    sample: "Cuenta de prueba",
    addAccount: "Añadir cuenta",
    empty: "Todavía no hay cuentas en este dispositivo.",
    email: "Correo electrónico",
    continueEmail: "Continuar con correo electrónico",
    invalidEmail: "Introduce un correo electrónico válido.",
    orContinue: "O continúa con",
    apple: "Continuar con Apple",
    google: "Continuar con Google",
    facebook: "Continuar con Facebook",
    addNote: "Esta vista previa no inicia sesión, no envía correos ni se conecta con Apple, Google o Facebook.",
  },
} as const;

const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function SwitchAccountsFlow({
  open, locale, accounts, activeAccountId, onClose, onSelectAccount, onAddAccount,
}: SwitchAccountsFlowProps) {
  const copy = COPY[locale];
  const keyboard = useKeyboard();
  const { device } = useMobileDevice();
  const reduceMotion = useReducedMotion() === true;
  const [page, setPage] = useState<Page>("chooser");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const chooserHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const addBackRef = useRef<HTMLButtonElement | null>(null);
  const addTriggerRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const orderedAccounts = useMemo(() => [
    ...accounts.filter(account => account.id === activeAccountId),
    ...accounts.filter(account => account.id !== activeAccountId),
  ], [accounts, activeAccountId]);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPage("chooser");
      setEmail("");
      setEmailError(false);
      const frame = window.requestAnimationFrame(() => chooserHeadingRef.current?.focus({ preventScroll: true }));
      wasOpenRef.current = true;
      return () => window.cancelAnimationFrame(frame);
    }
    wasOpenRef.current = open;
  }, [open]);

  function close() {
    keyboard.hide();
    onClose();
  }

  function openAdd() {
    keyboard.hide();
    setEmailError(false);
    setPage("add");
    window.requestAnimationFrame(() => addBackRef.current?.focus({ preventScroll: true }));
  }

  function back() {
    keyboard.hide();
    setPage("chooser");
    window.requestAnimationFrame(() => addTriggerRef.current?.focus({ preventScroll: true }));
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!EMAIL_PATTERN.test(address)) {
      setEmailError(true);
      return;
    }
    keyboard.hide();
    onAddAccount("email", address);
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (page === "add") back(); else close();
      return;
    }
    if (event.key !== "Tab") return;
    const currentPage = dialogRef.current?.querySelector<HTMLElement>(`.switch-accounts-page[data-page="${page}"]`);
    const focusables = [...(currentPage?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && (document.activeElement === first || !focusables.includes(document.activeElement as HTMLElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !focusables.includes(document.activeElement as HTMLElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  const pageTransition = { duration: reduceMotion ? 0 : 0.18, ease: EASE_OUT };
  return <AnimatePresence initial={false} onExitComplete={() => {
    if (!open && returnFocusRef.current?.isConnected) returnFocusRef.current.focus({ preventScroll: true });
  }}>
    {open && <motion.div
      key="switch-accounts-flow"
      ref={dialogRef}
      className="switch-accounts-flow"
      style={{ "--switch-accounts-top": `${Math.max(60, device.geometry.safeArea.top) + 8}px` } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-label={page === "chooser" ? copy.switchTitle : copy.addTitle}
      onKeyDown={onDialogKeyDown}
      initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduceMotion ? 0 : 18 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
    >
      <motion.section
        className="switch-accounts-page"
        data-page="chooser"
        inert={page !== "chooser"}
        aria-hidden={page !== "chooser"}
        initial={false}
        animate={{ opacity: page === "chooser" ? 1 : 0, x: page === "chooser" ? 0 : -8 }}
        transition={pageTransition}
      >
        <MobileScroll className="switch-accounts-scroll">
          <main className="switch-accounts-content">
            <header className="switch-accounts-nav switch-accounts-nav--chooser">
              <button type="button" className="switch-accounts-nav-button" onClick={close} aria-label={copy.close}><X size={18} aria-hidden="true" /></button>
            </header>

            <div className="switch-accounts-intro">
              <h2 ref={chooserHeadingRef} tabIndex={-1}>{copy.accounts}</h2>
            </div>

            <ul className="switch-accounts-list">
              {orderedAccounts.map(account => {
                const isActive = account.id === activeAccountId;
                return <li key={account.id}>
                  <button type="button" className="switch-accounts-account" data-active={isActive}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => isActive ? close() : onSelectAccount(account.id)}>
                    <SaverAvatar person={account} />
                    <span className="switch-accounts-identity">
                      <strong>{account.name}</strong>
                      <span>@{account.handle}</span>
                      {(isActive || account.id !== PRIMARY_ACCOUNT_ID) && <small>{isActive ? copy.current : copy.sample}</small>}
                    </span>
                    <span className="switch-accounts-status">{isActive ? <Check size={17} aria-hidden="true" /> : <CaretRight size={17} aria-hidden="true" />}</span>
                  </button>
                </li>;
              })}
            </ul>
            {!accounts.length && <p className="switch-accounts-empty">{copy.empty}</p>}

            <button ref={addTriggerRef} type="button" className="switch-accounts-add-row" onClick={openAdd}>
              <span className="switch-accounts-add-icon"><Plus size={17} aria-hidden="true" /></span>
              <span>{copy.addAccount}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>

          </main>
        </MobileScroll>
      </motion.section>

      <motion.section
        className="switch-accounts-page"
        data-page="add"
        inert={page !== "add"}
        aria-hidden={page !== "add"}
        initial={false}
        animate={{ opacity: page === "add" ? 1 : 0, x: page === "add" ? 0 : 14 }}
        transition={pageTransition}
      >
        <MobileScroll className="switch-accounts-scroll">
          <main className="switch-accounts-content">
            <header className="switch-accounts-nav switch-accounts-nav--add">
              <button ref={addBackRef} type="button" className="switch-accounts-nav-button switch-accounts-back-button" onClick={back} aria-label={copy.back}><CaretLeft size={18} aria-hidden="true" /></button>
              <button type="button" className="switch-accounts-nav-button" onClick={close} aria-label={copy.close}><X size={18} aria-hidden="true" /></button>
            </header>

            <form className="switch-accounts-email-form" onSubmit={submitEmail} noValidate>
              <label htmlFor="switch-accounts-email">{copy.email}</label>
              <KeyboardInput id="switch-accounts-email" type="email" inputMode="email" autoComplete="off"
                value={email} onChange={event => { setEmail(event.currentTarget.value); setEmailError(false); }}
                aria-invalid={emailError} aria-describedby={emailError ? "switch-accounts-email-error" : undefined} />
              {emailError && <p id="switch-accounts-email-error" className="switch-accounts-error" role="alert">{copy.invalidEmail}</p>}
              <button type="submit" className="switch-accounts-email-continue">{copy.continueEmail}<ArrowRight size={17} aria-hidden="true" /></button>
            </form>

            <p className="switch-accounts-or">{copy.orContinue}</p>
            <div className="switch-accounts-providers">
              <button type="button" onClick={() => { keyboard.hide(); onAddAccount("apple"); }}><span className="switch-accounts-provider-icon"><AppleProviderMark /></span><span>{copy.apple}</span></button>
              <button type="button" onClick={() => { keyboard.hide(); onAddAccount("google"); }}><span className="switch-accounts-provider-icon"><GoogleProviderMark /></span><span>{copy.google}</span></button>
              <button type="button" onClick={() => { keyboard.hide(); onAddAccount("facebook"); }}><span className="switch-accounts-provider-icon"><FacebookProviderMark /></span><span>{copy.facebook}</span></button>
            </div>

            <p className="switch-accounts-note switch-accounts-add-note">{copy.addNote}</p>
          </main>
        </MobileScroll>
      </motion.section>
    </motion.div>}
  </AnimatePresence>;
}
