import { useState } from "react";
import { MorphingSelect } from "./MorphingSelect";
import { SelectionPill } from "./SelectionPill";
import { PreviewCode } from "./PreviewCode";

const areas = [
  { value: "all", label: "All areas" },
  { value: "design", label: "Design" },
  { value: "research", label: "Research" },
  { value: "product", label: "Product" },
];
const views = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "plan", label: "Sprint plan" },
];

export function SelectionShowcase({ theme, onStatus }: {
  theme: "light" | "dark";
  onStatus: (message: string) => void;
}) {
  const [area, setArea] = useState("all");
  const [referenceArea, setReferenceArea] = useState("all");
  const [view, setView] = useState("board");
  return <>
    <div className="ds-section-heading" id="ds-morphing-select"><h2>Morphing select</h2></div>
    <p className="ds-section-copy">The menu grows from its trigger. Selection takes effect immediately. Reduced motion removes the animation.</p>
    <PreviewCode id="morphing-select" label="Morphing select" theme={theme} onStatus={onStatus} code={'import { MorphingSelect } from "./design-system/MorphingSelect";\n\n<MorphingSelect\n  ariaLabel="Area"\n  value={area}\n  options={areas}\n  onChange={setArea}\n/>'}>
      <div className="ds-selection-examples">
        <div><span>Everyday · 420ms</span><MorphingSelect ariaLabel="Everyday area" value={area} options={areas} onChange={setArea} variant={theme === "dark" ? "dark" : "surface"} /></div>
        <div><span>Reference motion · 800ms</span><MorphingSelect ariaLabel="Reference area" value={referenceArea} options={areas} onChange={setReferenceArea} duration={800} variant={theme === "dark" ? "dark" : "surface"} /></div>
      </div>
    </PreviewCode>
    <div className="ds-section-heading" id="ds-selection-pills"><h2>Selection pills</h2></div>
    <p className="ds-section-copy">One gray surface follows the selected option. Use arrows to move through the group.</p>
    <PreviewCode id="selection-pills" label="Selection pills" theme={theme} onStatus={onStatus} code={'import { SelectionPill } from "./design-system/SelectionPill";\n\n<SelectionPill\n  ariaLabel="View"\n  value={view}\n  options={views}\n  onChange={setView}\n/>'}>
      <div className="ds-selection-pill-example"><SelectionPill ariaLabel="Example view" value={view} options={views} onChange={setView} /></div>
    </PreviewCode>
    <div className="ds-section-heading" id="ds-rounded-surfaces"><h2>Rounded surfaces</h2></div>
    <p className="ds-section-copy">Pale gray groups, darker selected surfaces, and compact spacing. Artwork keeps its own proportions.</p>
    <PreviewCode id="rounded-surfaces" label="Rounded surfaces" theme={theme} onStatus={onStatus} code={'<button className="ds-rounded-card" onClick={openCollection}>\n  <span><small>Collection</small><strong>Ways of seeing</strong></span>\n  <img src="/assets/content/great-wave.jpg" alt="" />\n</button>'}>
      <button type="button" className="ds-rounded-card" onClick={() => onStatus("Collection selected.")}><span><small>Collection</small><strong>Ways of seeing</strong></span><img src="/assets/content/great-wave.jpg" alt="" /></button>
    </PreviewCode>
  </>;
}
