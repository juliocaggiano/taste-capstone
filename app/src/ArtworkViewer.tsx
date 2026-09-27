import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { DownloadSimple as DownloadSimpleIcon, X as XIcon } from "./design-system/PrototypeIcons";
import { useKeyboard, useMobileDevice, useScreenPortal } from "./mobile";
import { artworkTileSets } from "./artwork-tiles";
import { ArtworkDetailTiles } from "./ArtworkDetailTiles";
import "./artwork-viewer.css";

type Locale = "en" | "pt-BR" | "it" | "es";
type Point = { x: number; y: number };
type Transform = Point & { scale: number };
type Size = { width: number; height: number };

export type ArtworkViewerProps = {
  open: boolean;
  onClose: () => void;
  image: string;
  title: string;
  creator: string;
  year?: string;
  initialFocus?: Point;
  locale: Locale;
  downloadName?: string;
};

const copy = {
  en: { close: "Close image", download: "Download image", zoomIn: "Zoom in", zoomOut: "Zoom out", reset: "Fit image", loading: "Loading image…", error: "This image could not load.", retry: "Try again", help: "Tap a detail to zoom. Pinch or scroll to adjust. Drag to explore.", keyboard: "Use + and − to zoom, arrow keys to move, and 0 to fit the image.", view: "Artwork image", imageLabel: "Image", unavailable: "Download unavailable for this image." },
  "pt-BR": { close: "Fechar imagem", download: "Baixar imagem", zoomIn: "Ampliar", zoomOut: "Reduzir", reset: "Ajustar imagem", loading: "Carregando imagem…", error: "Não foi possível carregar esta imagem.", retry: "Tentar novamente", help: "Toque em um detalhe para ampliar. Ajuste com dois dedos ou rolando. Arraste para explorar.", keyboard: "Use + e − para ampliar, as setas para mover e 0 para ajustar a imagem.", view: "Imagem da obra", imageLabel: "Imagem", unavailable: "Download indisponível para esta imagem." },
  it: { close: "Chiudi immagine", download: "Scarica immagine", zoomIn: "Ingrandisci", zoomOut: "Riduci", reset: "Adatta immagine", loading: "Caricamento immagine…", error: "Impossibile caricare questa immagine.", retry: "Riprova", help: "Tocca un dettaglio per ingrandire. Regola pizzicando o scorrendo. Trascina per esplorare.", keyboard: "Usa + e − per lo zoom, le frecce per spostarti e 0 per adattare l'immagine.", view: "Immagine dell’opera", imageLabel: "Immagine", unavailable: "Download non disponibile per questa immagine." },
  es: { close: "Cerrar imagen", download: "Descargar imagen", zoomIn: "Ampliar", zoomOut: "Reducir", reset: "Ajustar imagen", loading: "Cargando imagen…", error: "No se pudo cargar esta imagen.", retry: "Intentar de nuevo", help: "Toca un detalle para ampliar. Ajusta pellizcando o desplazándote. Arrastra para explorar.", keyboard: "Usa + y − para ampliar, las flechas para moverte y 0 para ajustar la imagen.", view: "Imagen de la obra", imageLabel: "Imagen", unavailable: "Descarga no disponible para esta imagen." },
} satisfies Record<Locale, Record<string, string>>;

const INITIAL: Transform = { scale: 1, x: 0, y: 0 };
const MAX_ZOOM = 8;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** Full-resolution viewing stays app-owned and inside the protected phone portal. */
export function ArtworkViewer({ open, onClose, image, title, creator, year, initialFocus, locale, downloadName }: ArtworkViewerProps) {
  const labels = copy[locale];
  const tileSet = artworkTileSets[image];
  const preview = tileSet?.preview ?? image;
  const { screenRef } = useScreenPortal();
  const { device } = useMobileDevice();
  const keyboard = useKeyboard();
  const hideKeyboard = useRef(keyboard.hide);
  hideKeyboard.current = keyboard.hide;
  const viewportRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const transformRef = useRef<Transform>(INITIAL);
  const fitRef = useRef<Size>({ width: 0, height: 0 });
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef({ start: { x: 0, y: 0 }, startScale: 1, moved: false, multiple: false });
  const lastTap = useRef({ time: 0, point: { x: 0, y: 0 }, startScale: 1 });
  const animationFrame = useRef<number | null>(null);
  const openingApplied = useRef(false);
  const [transform, setTransform] = useState(INITIAL);
  const [motionTarget, setMotionTarget] = useState<Transform | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [viewportNode, setViewportNode] = useState<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState<Size>({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState<Size>({ width: 0, height: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [dragging, setDragging] = useState(false);

  const bindViewport = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    setViewportNode(node);
  }, []);

  const fitRatio = naturalSize.width && naturalSize.height
    ? Math.min(viewportSize.width / naturalSize.width, viewportSize.height / naturalSize.height)
    : 0;
  const fitted = { width: naturalSize.width * fitRatio, height: naturalSize.height * fitRatio };
  fitRef.current = fitted;

  const bound = useCallback((next: Transform): Transform => {
    const viewport = viewportRef.current;
    if (!viewport) return next;
    const scale = clamp(next.scale, 1, MAX_ZOOM);
    const limitX = Math.max(0, (fitRef.current.width * scale - viewport.clientWidth) / 2);
    const limitY = Math.max(0, (fitRef.current.height * scale - viewport.clientHeight) / 2);
    return { scale, x: clamp(next.x, -limitX, limitX), y: clamp(next.y, -limitY, limitY) };
  }, []);

  const apply = useCallback((next: Transform) => {
    const bounded = bound(next);
    transformRef.current = bounded;
    setTransform(bounded);
  }, [bound]);

  const stopMotion = useCallback(() => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
    setMotionTarget(null);
  }, []);

  const localPoint = useCallback((clientX: number, clientY: number): Point => {
    const viewport = viewportRef.current;
    if (!viewport) return { x: 0, y: 0 };
    const rect = viewport.getBoundingClientRect();
    // The phone preview scales as a whole; gestures must use its unscaled coordinates.
    return {
      x: (clientX - rect.left) * viewport.clientWidth / rect.width - viewport.clientWidth / 2,
      y: (clientY - rect.top) * viewport.clientHeight / rect.height - viewport.clientHeight / 2,
    };
  }, []);

  const zoomTo = useCallback((requestedScale: number, anchor: Point = { x: 0, y: 0 }, animated = false) => {
    stopMotion();
    const previous = transformRef.current;
    const scale = clamp(requestedScale, 1, MAX_ZOOM);
    const atScale = (value: number) => ({ scale: value, x: anchor.x - (anchor.x - previous.x) * value / previous.scale, y: anchor.y - (anchor.y - previous.y) * value / previous.scale });
    if (!animated || reducedMotion || Math.abs(scale - previous.scale) < .001) { apply(atScale(scale)); return; }
    setMotionTarget(bound(atScale(scale)));
    const start = performance.now();
    const advance = (now: number) => {
      const progress = clamp((now - start) / 340, 0, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentScale = Math.exp(Math.log(previous.scale) + Math.log(scale / previous.scale) * ease);
      apply(atScale(currentScale));
      if (progress < 1) animationFrame.current = requestAnimationFrame(advance);
      else { animationFrame.current = null; setMotionTarget(null); }
    };
    animationFrame.current = requestAnimationFrame(advance);
  }, [apply, bound, reducedMotion, stopMotion]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => () => { if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current); }, []);

  useEffect(() => {
    if (reducedMotion && motionTarget) { stopMotion(); apply(motionTarget); }
  }, [reducedMotion, motionTarget, stopMotion, apply]);

  useLayoutEffect(() => {
    stopMotion();
    if (open) hideKeyboard.current();
    transformRef.current = INITIAL;
    setTransform(INITIAL);
    setStatus("loading");
    setNaturalSize({ width: 0, height: 0 });
    openingApplied.current = false;
    pointers.current.clear();
    lastTap.current.time = 0;
    setDragging(false);
  }, [open, image, stopMotion]);

  useEffect(() => {
    if (!open || !viewportNode) return;
    const viewport = viewportNode;
    const updateSize = () => setViewportSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [open, viewportNode]);

  useLayoutEffect(() => {
    stopMotion();
    if (!open || !fitted.width || !fitted.height) return;
    if (!openingApplied.current) {
      openingApplied.current = true;
      const scale = clamp(viewportSize.height * .72 / fitted.height, 1, MAX_ZOOM);
      apply({ scale, x: (.5 - (initialFocus?.x ?? .5)) * fitted.width * scale, y: (.5 - (initialFocus?.y ?? .5)) * fitted.height * scale });
    } else apply(transformRef.current);
  }, [open, fitted.width, fitted.height, viewportSize.height, initialFocus?.x, initialFocus?.y, apply, stopMotion]);

  useEffect(() => {
    const viewport = viewportNode;
    if (!open || !viewport || status !== "ready") return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1);
      zoomTo(transformRef.current.scale * Math.exp(-delta * 0.002), localPoint(event.clientX, event.clientY));
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [open, viewportNode, status, zoomTo, localPoint]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (status !== "ready" || event.button !== 0) return;
    stopMotion();
    event.preventDefault();
    event.stopPropagation();
    const point = localPoint(event.clientX, event.clientY);
    if (!pointers.current.size) gesture.current = { start: point, startScale: transformRef.current.scale, moved: false, multiple: false };
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size > 1) gesture.current.multiple = true;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    event.preventDefault();
    event.stopPropagation();
    const previousPoints = Array.from(pointers.current.values());
    const previousPoint = pointers.current.get(event.pointerId)!;
    const point = localPoint(event.clientX, event.clientY);
    pointers.current.set(event.pointerId, point);
    if (distance(point, gesture.current.start) > 6) gesture.current.moved = true;
    const nextPoints = Array.from(pointers.current.values());
    const previous = transformRef.current;
    if (nextPoints.length >= 2) {
      const oldDistance = distance(previousPoints[0], previousPoints[1]);
      if (oldDistance < 1) return;
      const oldCenter = midpoint(previousPoints[0], previousPoints[1]);
      const newCenter = midpoint(nextPoints[0], nextPoints[1]);
      const scale = clamp(previous.scale * distance(nextPoints[0], nextPoints[1]) / oldDistance, 1, MAX_ZOOM);
      const ratio = scale / previous.scale;
      apply({ scale, x: newCenter.x - (oldCenter.x - previous.x) * ratio, y: newCenter.y - (oldCenter.y - previous.y) * ratio });
    } else {
      apply({ ...previous, x: previous.x + point.x - previousPoint.x, y: previous.y + point.y - previousPoint.y });
    }
  }

  function finishPointer(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (!pointers.current.has(event.pointerId)) return;
    event.stopPropagation();
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (pointers.current.size) return;
    setDragging(false);
    if (cancelled || gesture.current.moved || gesture.current.multiple) { lastTap.current.time = 0; return; }
    const now = performance.now();
    const point = localPoint(event.clientX, event.clientY);
    if (lastTap.current.time > 0 && now - lastTap.current.time < 320 && distance(point, lastTap.current.point) < 28) {
      zoomTo(lastTap.current.startScale > 1.1 ? 1 : 2.5, point, true);
      lastTap.current.time = 0;
    } else {
      lastTap.current = { time: now, point, startScale: gesture.current.startScale };
      zoomTo(gesture.current.startScale >= MAX_ZOOM ? 1 : gesture.current.startScale * 1.6, point, true);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (status !== "ready") return;
    stopMotion();
    lastTap.current.time = 0;
    const current = transformRef.current;
    switch (event.key) {
      case "+": case "=": zoomTo(current.scale * 1.4, undefined, true); break;
      case "-": case "−": zoomTo(current.scale / 1.4, undefined, true); break;
      case "0": case "Home": zoomTo(1, undefined, true); break;
      case "ArrowLeft": apply({ ...current, x: current.x + 48 }); break;
      case "ArrowRight": apply({ ...current, x: current.x - 48 }); break;
      case "ArrowUp": apply({ ...current, y: current.y + 48 }); break;
      case "ArrowDown": apply({ ...current, y: current.y - 48 }); break;
      default: return;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  let downloadHref: string | undefined;
  try {
    const url = new URL(image, window.location.href);
    if (url.origin === window.location.origin && /^(https?:)$/.test(url.protocol)) downloadHref = url.href;
  } catch { /* Invalid image URLs use the image loading/error state. */ }

  const safeAreaStyle = {
    "--viewer-safe-top": `${device.geometry.safeArea.top}px`,
    "--viewer-safe-bottom": `${device.platform === "ios" ? device.geometry.safeArea.bottom : 0}px`,
    bottom: device.platform === "android" ? device.geometry.safeArea.bottom : 0,
  } as CSSProperties;

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <Dialog.Portal container={screenRef.current ?? undefined}>
        <Dialog.Overlay className="artwork-viewer-overlay" style={safeAreaStyle} />
        <Dialog.Content
          className="artwork-viewer"
          lang={locale}
          style={safeAreaStyle}
          data-testid="artwork-viewer"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            closeRef.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Dialog.Description className="artwork-viewer-sr-only">{labels.help} {labels.keyboard}</Dialog.Description>
          <div
              ref={bindViewport}
              className="artwork-viewer-canvas"
              data-testid="artwork-viewer-canvas"
              data-zoomed={transform.scale > 1.01}
              data-dragging={dragging}
              data-zoom={transform.scale.toFixed(2)}
              data-animating={motionTarget !== null}
              role="region"
              aria-label={`${labels.view}: ${title}`}
              tabIndex={0}
              onKeyDown={onKeyDown}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={(event) => finishPointer(event)}
              onPointerCancel={(event) => finishPointer(event, true)}
              onLostPointerCapture={(event) => finishPointer(event, true)}
          >
            <div
              className="artwork-viewer-plane"
              data-source-width={naturalSize.width}
              data-source-height={naturalSize.height}
              style={{
                width: fitted.width * transform.scale || undefined,
                height: fitted.height * transform.scale || undefined,
                marginLeft: -fitted.width * transform.scale / 2,
                marginTop: -fitted.height * transform.scale / 2,
                visibility: status === "ready" && fitted.width ? "visible" : "hidden",
                transform: `translate(${transform.x}px, ${transform.y}px)`,
              }}
            >
              <img
                key={`${image}-${retry}`}
                className="artwork-viewer-image"
                src={preview}
                alt={title}
                draggable={false}
                decoding="async"
                onLoad={(event) => {
                  setNaturalSize(tileSet ? { width: tileSet.width, height: tileSet.height } : { width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight });
                  setStatus("ready");
                }}
                onError={() => setStatus("error")}
              />
              {tileSet ? <ArtworkDetailTiles key={image} source={tileSet} view={motionTarget && motionTarget.scale > transform.scale ? motionTarget : transform} viewport={viewportSize} fitWidth={fitted.width} active={status === "ready"} /> : null}
            </div>
            {status === "loading" ? <p className="artwork-viewer-message" role="status">{labels.loading}</p> : null}
            {status === "error" ? <div className="artwork-viewer-message" role="status"><p>{labels.error}</p><button type="button" className="artwork-viewer-button" onClick={() => { setStatus("loading"); setRetry((value) => value + 1); }}>{labels.retry}</button></div> : null}
          </div>
          <Dialog.Close asChild>
            <button ref={closeRef} type="button" className="artwork-viewer-button artwork-viewer-icon artwork-viewer-close" aria-label={labels.close} title={labels.close}><XIcon aria-hidden="true" size={22} weight="light" /></button>
          </Dialog.Close>
          <div className="artwork-viewer-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <p>{creator}{year ? `, ${year}` : ""}</p>
          </div>
          {downloadHref && status === "ready" ? <a className="artwork-viewer-button artwork-viewer-icon artwork-viewer-download" href={downloadHref} download={downloadName || undefined} aria-label={labels.download} title={labels.download}><DownloadSimpleIcon size={21} weight="light" aria-hidden="true" /></a> : <button type="button" className="artwork-viewer-button artwork-viewer-icon artwork-viewer-download" disabled aria-label={labels.download} title={downloadHref ? labels.download : labels.unavailable}><DownloadSimpleIcon size={21} weight="light" aria-hidden="true" /></button>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
