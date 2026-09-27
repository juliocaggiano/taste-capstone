import { useState } from "react";
import { CreatorBiography, TechnicalInformation } from "./ArtworkInformation";
import { creatorBiographies } from "../artwork-information-data";
import { PreviewCode } from "./PreviewCode";

export function ArtworkInformationShowcase({ theme, onStatus }: { theme: "light" | "dark"; onStatus: (message: string) => void }) {
  const [following, setFollowing] = useState(false);
  return <section>
    <div id="ds-artwork-information" className="ds-section-heading"><h2>Artwork information</h2></div>
    <p className="ds-section-copy">Technical details followed by a short creator biography. Shared with Daily and artwork details.</p>
    <PreviewCode id="artwork-information" label="Artwork information" theme={theme} onStatus={onStatus} code={'import { TechnicalInformation, CreatorBiography } from "./design-system/ArtworkInformation";\n\n<TechnicalInformation title="Technical information" items={verifiedDetails} />\n<CreatorBiography\n  name={creator.name}\n  details={creator.details}\n  biography={creator.biography}\n  image={artwork.image}\n  following={following}\n  followLabel="Save" followingLabel="Saved"\n  followAriaLabel={following ? `Saved ${creator.name}. Remove from saved artists` : `Save ${creator.name}`}\n  onFollow={toggleFollow}\n/>'}>
      <div style={{ width: "100%", maxWidth: 393, display: "grid", gap: 16 }}>
        <TechnicalInformation title="Technical information" items={[
          { label: "Materials", value: "Oil on canvas" },
          { label: "Size", value: "129.5 × 196.2 cm" },
          { label: "Medium", value: "Painting" },
        ]} />
        <CreatorBiography name="Jacques-Louis David" details="France, 1748–1825" biography={creatorBiographies["jacques-louis-david"].en} image="/assets/content/death-of-socrates.jpg" following={following} followLabel="Save" followingLabel="Saved" followAriaLabel={following ? "Saved Jacques-Louis David. Remove from saved artists" : "Save Jacques-Louis David"} onFollow={() => setFollowing(!following)} />
      </div>
    </PreviewCode>
    <p className="ds-section-copy">Hover to highlight, press to compress, and save the artist for a quiet checkmark. Labels share one width and transitions reverse immediately. Reduced motion keeps the change instant. This example keeps its own saved state.</p>
  </section>;
}
