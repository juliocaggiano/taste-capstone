import { APP_FILE_PREFIX } from "../brand";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Copy } from "@phosphor-icons/react";
import { downloadFile } from "./assets";
import "./preview-code.css";

export type PreviewCodeProps = {
  id: string;
  label: string;
  code: string;
  children: ReactNode;
  theme?: "light" | "dark";
  controls?: ReactNode;
  onStatus: (message: string) => void;
};

const tabs = ["Preview", "Code"] as const;
type ExampleTab = typeof tabs[number];

/** Keep previews mounted so switching tabs preserves their interactive state. */
export function PreviewCode({ id, label, code, children, theme = "light", controls, onStatus }: PreviewCodeProps) {
  const instanceId = useId();
  const [activeTab, setActiveTab] = useState<ExampleTab>("Preview");
  const tabButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const prefix = `${id}-${instanceId}`;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    setActiveTab(tabs[nextIndex]);
    tabButtons.current[nextIndex]?.focus();
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      onStatus("Copied usage example. Connect callbacks in your screen.");
    } catch {
      downloadFile(`${APP_FILE_PREFIX}-${id}.tsx`, code);
      onStatus("Clipboard unavailable. Example downloaded instead.");
    }
  }

  return (
    <section id={id} className="dsc-frame" aria-label={`${label} example`}>
      <div className="dsc-toolbar">
        <div className="dsc-tabs" role="tablist" aria-label={`${label} example view`}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={element => { tabButtons.current[index] = element; }}
              id={`${prefix}-${tab.toLowerCase()}-tab`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`${prefix}-${tab.toLowerCase()}-panel`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={event => moveTab(event, index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button type="button" className="ds-text-action dsc-copy" onClick={copyCode} aria-label={`Copy ${label} code`}>
          <Copy size={15} aria-hidden="true" />Copy code
        </button>
      </div>
      <div
        id={`${prefix}-preview-panel`}
        className="dsc-panel dsc-preview ds-example dc-system"
        role="tabpanel"
        aria-labelledby={`${prefix}-preview-tab`}
        data-preview-theme={theme}
        hidden={activeTab !== "Preview"}
      >
        {children}
      </div>
      <div
        id={`${prefix}-code-panel`}
        className="dsc-panel dsc-code-panel"
        role="tabpanel"
        aria-labelledby={`${prefix}-code-tab`}
        hidden={activeTab !== "Code"}
      >
        <pre className="dsc-code" tabIndex={0} aria-label={`${label} usage code`}><code>{code}</code></pre>
      </div>
      {controls ? <div className="dsc-controls">{controls}</div> : null}
    </section>
  );
}
