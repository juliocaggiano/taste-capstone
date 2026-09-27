import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { ArtworkTileSet } from "./artwork-tiles";

type Tile = { src: string; left: number; top: number; width: number; height: number; distance: number; delay: number };

function DetailTile({ tile }: { tile: Tile }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [revealDelay] = useState(tile.delay);
  const mounted = useRef(true);
  const revealFrame = useRef<number | null>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
    };
  }, []);
  return <div
    className="artwork-viewer-tile-cell"
    data-ready={ready}
    data-failed={failed}
    aria-hidden="true"
    style={{ left: `${tile.left}%`, top: `${tile.top}%`, width: `${tile.width}%`, height: `${tile.height}%`, "--tile-reveal-delay": `${revealDelay}ms` } as CSSProperties}
  ><img
    className="artwork-viewer-tile"
    src={tile.src}
    alt=""
    aria-hidden="true"
    draggable={false}
    decoding="async"
    data-ready={ready}
    onLoad={async (event) => {
      const image = event.currentTarget;
      try { await image.decode(); } catch { if (mounted.current) setFailed(true); return; }
      if (!mounted.current) return;
      // Even cached images need one transparent paint before the CSS fade can run.
      revealFrame.current = requestAnimationFrame(() => {
        revealFrame.current = requestAnimationFrame(() => {
          revealFrame.current = null;
          if (mounted.current) setReady(true);
        });
      });
    }}
    onError={() => setFailed(true)}
  /></div>;
}

/** Real, visible source tiles refine the preview; missing detail never leaves a hole. */
export function ArtworkDetailTiles({ source, view, viewport, fitWidth, active }: {
  source: ArtworkTileSet;
  view: { scale: number; x: number; y: number };
  viewport: { width: number; height: number };
  fitWidth: number;
  active: boolean;
}) {
  const tiles = useMemo(() => {
    if (!active || !fitWidth) return [];
    const pixelScale = fitWidth / source.width * view.scale;
    const centerX = source.width / 2 - view.x / pixelScale;
    const centerY = source.height / 2 - view.y / pixelScale;
    const halfWidth = viewport.width / (2 * pixelScale);
    const halfHeight = viewport.height / (2 * pixelScale);
    // One neighboring tile prefetches the edge of the next pan.
    const firstColumn = Math.max(0, Math.floor((centerX - halfWidth) / source.tileSize) - 1);
    const lastColumn = Math.min(source.columns - 1, Math.floor((centerX + halfWidth) / source.tileSize) + 1);
    const firstRow = Math.max(0, Math.floor((centerY - halfHeight) / source.tileSize) - 1);
    const lastRow = Math.min(source.rows - 1, Math.floor((centerY + halfHeight) / source.tileSize) + 1);
    const visible: Tile[] = [];
    for (let row = firstRow; row <= lastRow; row += 1) {
      for (let column = firstColumn; column <= lastColumn; column += 1) {
        const left = Math.max(0, column * source.tileSize - source.overlap);
        const top = Math.max(0, row * source.tileSize - source.overlap);
        const right = Math.min(source.width, (column + 1) * source.tileSize + source.overlap);
        const bottom = Math.min(source.height, (row + 1) * source.tileSize + source.overlap);
        const fromCenter = Math.hypot((left + right) / 2 - centerX, (top + bottom) / 2 - centerY);
        visible.push({
          src: `${source.basePath}/${column}_${row}.${source.extension}`,
          left: left / source.width * 100, top: top / source.height * 100,
          width: (right - left) / source.width * 100, height: (bottom - top) / source.height * 100,
          distance: fromCenter,
          delay: Math.min(180, Math.floor(fromCenter / source.tileSize) * 45),
        });
      }
    }
    // Request central detail first, then fill the surrounding region as it arrives.
    return visible.sort((a, b) => a.distance - b.distance);
  }, [source, view.scale, view.x, view.y, viewport.width, viewport.height, fitWidth, active]);
  return tiles.map(tile => <DetailTile key={tile.src} tile={tile} />);
}
