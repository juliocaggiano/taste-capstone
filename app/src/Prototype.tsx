import { APP_LABEL, APP_NAME } from "./brand";
import { approvedPieces, approvedCreators, approvedContext, type ApprovedPieceId, type ApprovedCreatorId } from "./approved-catalog";
import { attachDailyMotion } from "./daily-pager-motion";
import { EditorialStory } from "./EditorialStory";
import {
  ArrowRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CheckCircle,
  GlobeHemisphereWest,
  Heart,
  ImageSquare,
  MagnifyingGlass as SearchIcon,
  GridFour,
  PaperPlaneTilt,
  Plus,
  Share,
  Shuffle,
  Sparkle,
  SlidersHorizontal,
  TrashSimple,
  UploadSimple,
  X,
} from "./design-system/PrototypeIcons";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties, type FocusEvent as ReactFocusEvent, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { BottomSheet, Carousel, KeyboardInput, KeyboardTextarea, MobileScroll, useKeyboard, useKeyboardInsets } from "./mobile";

import { DesignSystemLauncher, readWorkspaceView, type WorkspaceView } from "./design-system/DesignSystem";
import { OnboardingFlow, type OnboardingReminderTime } from "./OnboardingFlow";
import { ArtworkCard, Toggle } from "./design-system/components";
import { SelectionPill } from "./design-system/SelectionPill";
import { LikeButton } from "./design-system/LikeButton";
import { NavigationIcon } from "./design-system/NavigationIcon";
import { FollowButton } from "./design-system/FollowButton";
import { creatorBiographies } from "./artwork-information-data";
import { editorialCreators } from "./editorial-information";
import "./discover.css";
import { GalleryControls, type GalleryLayout, type GallerySort } from "./GalleryControls";
import { ArtworkFilterSheet } from "./ArtworkFilterSheet";
import { createEmptyArtworkFilters, filterAndSortArtworks, hasArtworkFilters } from "./artwork-filters";
import { SearchArtistResults, SearchAccountResults, getSearchAccounts, normalizeSearch } from "./SearchEntities";
import { ExploreCollections, type ExploreStudyVariant } from "./ExploreCollections";
import { ExploreEditorial } from "./ExploreEditorial";
import { ExploreRooms } from "./ExploreRooms";
import { ExploreIndex } from "./ExploreIndex";
import { ExploreSwitchboard } from "./ExploreSwitchboard";
import { ExploreLenses } from "./ExploreLenses";
import { ExploreStream } from "./ExploreStream";
import "./creator-profile.css";
import { ArtworkViewer } from "./ArtworkViewer";
import { TodaySaveActions, type TodaySaveLabels } from "./TodaySaveActions";
import { TodaySearch, type TodaySearchVariant, type TodaySearchOrigin } from "./TodaySearch";
import { HomeSearchSurface } from "./HomeSearchSurface";
import { ArtworkListRow } from "./ArtworkListRow";
import { LibraryScreen, type LibraryStudyVariant } from "./LibraryStudyScreen";
import { createLibraryStudyState } from "./library-study-data";
import { RelatedWorks, RelatedWorksVariantContext, type RelatedWorksVariant } from "./RelatedWorks";
import { SaverAvatar } from "./TodaySaversSheet";
import { ProfileScreen } from "./ProfileScreen";
import { ScrollEdgeBlur, type ScrollEdgeVariant } from "./ScrollEdgeStudy";
import { FOLLOWED_PEOPLE_STORAGE_KEY, ReaderSessionProvider, useCurrentReader, type SavedPerson } from "./today-savers";
import { PRIMARY_ACCOUNT_ID, PREVIEW_ACCOUNT_ID, accountKey, accountStorage, addPreviewAccount, loadActivePreviewAccountId, loadPreviewAccounts, saveActivePreviewAccountId, type PreviewAccount } from "./account-preview";
import { SwitchAccountsFlow } from "./SwitchAccountsFlow";
import { loadLibraryNotes, saveLibraryNotes, setLibraryNote } from "./library-notes";
import { createBoard, DEFAULT_BOARD_ID, getSavedPieceIds, loadBoards, saveBoards, setPieceInBoard, setPieceSaved, type SavedBoard, type BoardOptions } from "./today-boards";
import { NewFolderSheet } from "./NewFolderSheet";
import { CreatorPageTransition, type CreatorMotionVariant } from "./CreatorPageTransition";
import { ArtworkInformationContext, ArtworkInformationSection, INFORMATION_COPY, useArtworkInformation } from "./ArtworkInformationSection";
import { loadArtworkImages, saveArtworkImages, type StoredArtworkImage } from "./create-artwork-storage";
import { CREATE_REFERENCE_ARTISTS, searchCreateArtists, type CreateArtistOption } from "./create-artist-directory";

type TabId = "daily" | "search" | "create" | "favourites" | "settings";
type MenuStudyVariant = "solid" | "light" | "outline";
type SheetId = "switchAccounts" | "language" | "cadence" | "notifications" | "widget" | "legal" | "about" | "contribution" | null;
type Locale = "en" | "pt-BR" | "it" | "es";
type NonEnglishLocale = Exclude<Locale, "en">;
type ThemePreference = "light" | "dark" | "system";
type TextSizePreference = "default" | "large" | "system";
type UnitsPreference = "metric" | "imperial";
const CADENCE_OPTIONS = ["weekly", "monthly", "sixMonths", "yearly", "never"] as const;
type CadencePreference = typeof CADENCE_OPTIONS[number];
type WidgetPreference = "storyAndImage" | "imageOnly";
type NotificationTime = "08:00" | "09:00" | "18:00";
type SearchFilter = "artworks" | "artists" | "accounts" | "medium";
type FormId = "Sculpture" | "Music" | "Architecture" | "Literature" | "Drawing" | "Print" | "Performance" | "Object" | "Photography" | "Film" | "Painting";
type ArtCategoryId = "architecture" | "sculpture" | "painting" | "music" | "literature" | "theater" | "cinema";
type DiscoverSelection = "all" | "loved" | "renaissance" | "photography" | "japan" | `category:${ArtCategoryId}`;
type DiscoverBrowseState = { query: string; filter: SearchFilter; form: "all" | FormId; selection: DiscoverSelection; layout: "grid" | "list" };
type DemoPieceId =
  | "death-of-socrates"
  | "divine-comedy"
  | "chart-of-hell"
  | "great-wave"
  | "noh-mask"
  | "arabic-bowl"
  | "migrant-mother"
  | "caligari"
  | "the-kiss"
  | "girl-pearl";
type DemoCreatorId =
  | "jacques-louis-david"
  | "dante-alighieri"
  | "sandro-botticelli"
  | "katsushika-hokusai"
  | "unknown-japanese-artist"
  | "unknown-iranian-potter"
  | "dorothea-lange"
  | "robert-wiene"
  | "gustav-klimt"
  | "johannes-vermeer";
type PieceId = DemoPieceId | ApprovedPieceId;
type CreatorId = DemoCreatorId | ApprovedCreatorId;
type CollectionId = "japan-motion" | "written-nation" | "objects-speak";

type Piece = {
  id: PieceId;
  creatorId: CreatorId;
  title: string;
  creator: string;
  creatorDates: string;
  year: string;
  // Numeric bounds preserve recorded periods when filtering localized artwork dates.
  dateStart: number;
  dateEnd: number;
  place: string;
  form: FormId;
  medium: string;
  image: string;
  imageAlt?: string;
  imageWidth: number;
  imageHeight: number;
  viewerImage?: string;
  viewerFocus?: { x: number; y: number };
  imagePosition?: string;
  kicker: string;
  story: string[];
  favoriteCount: number;
  source: string;
  // Editorial timestamps must come from the content record, never the device clock.
  lastEditedAt?: string;
};

type Creator = {
  id: CreatorId;
  canonicalName: string;
  dates: string;
  heroPieceId: PieceId;
  pieceIds: readonly PieceId[];
  profile?: Partial<Record<Locale, readonly string[]>>;
};

type Collection = {
  id: CollectionId;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  pieceIds: PieceId[];
};

type Preferences = {
  locale: Locale;
  theme: ThemePreference;
  textSize: TextSizePreference;
  units: UnitsPreference;
  cadence: CadencePreference;
  notifications: boolean;
  notificationTime: NotificationTime;
  widget: WidgetPreference;
};

const PREFERENCES_KEY = "daily-culture.preferences.v1";
const COLLECTIONS_KEY = "daily-culture.collections.v1";

const DEFAULT_COLLECTIONS: CollectionId[] = ["japan-motion"];
const DEFAULT_PREFERENCES: Preferences = {
  locale: "en",
  theme: "light",
  textSize: "default",
  units: "metric",
  cadence: "sixMonths",
  notifications: true,
  notificationTime: "09:00",
  widget: "storyAndImage",
};

const LOCALE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "pt-BR", label: "Português" },
  { value: "it", label: "Italiano" },
  { value: "es", label: "Español" },
] as const satisfies readonly { value: Locale; label: string }[];

const DESIGN_COPY: Record<Locale, { tagline: string; editorial: string }> = {
  en: { tagline: "One piece.\nEvery day.", editorial: "Editorial project by Julio Caggiano · Draft story" },
  "pt-BR": { tagline: "Uma obra.\nPor dia.", editorial: "Projeto editorial de Julio Caggiano · História em rascunho" },
  it: { tagline: "Un’opera.\nOgni giorno.", editorial: "Progetto editoriale di Julio Caggiano · Storia in bozza" },
  es: { tagline: "Una obra.\nCada día.", editorial: "Proyecto editorial de Julio Caggiano · Historia en borrador" },
};

function BrandMasthead({ locale }: { locale: Locale }) {
  return (
    <header className="brand-masthead">
      <span className="brand-wordmark" aria-label={APP_NAME}>{APP_NAME}</span>
      <span className="brand-promise">{DESIGN_COPY[locale].tagline}</span>
    </header>
  );
}

const demoPieces: Piece[] = [
  {
    id: "death-of-socrates",
    creatorId: "jacques-louis-david",
    title: "The Death of Socrates",
    creator: "Jacques-Louis David",
    creatorDates: "1748–1825",
    year: "1787",
    dateStart: 1787, dateEnd: 1787,
    place: "France",
    form: "Painting",
    medium: "Oil on canvas",
    image: "/assets/content/death-of-socrates.jpg",
    imageWidth: 1600,
    imageHeight: 1065,
    viewerImage: "/assets/content/viewer/death-of-socrates.jpg",
    viewerFocus: { x: .62, y: .5 },
    imagePosition: "52% 50%",
    kicker: "A scene from antiquity",
    story: [
      "In 399 BCE, an Athenian court condemned Socrates to death for rejecting the city’s gods and corrupting the young. Following Plato’s account, David shows him teaching that the soul survives death as he reaches for the poison.",
      "His steady posture amid his companions’ grief presents a man who holds to his convictions under threat of death. David includes Plato at the foot of the bed, despite his absence from the execution, to acknowledge the writer who preserved this account.",
    ],
    lastEditedAt: "2026-09-21T16:22:20Z",
    // Paper's social count is prototype sample content, not live user activity.
    favoriteCount: 65,
    source: "The Metropolitan Museum of Art · Public domain, Open Access",
  },
  {
    id: "divine-comedy",
    creatorId: "dante-alighieri",
    title: "The Divine Comedy",
    creator: "Dante Alighieri",
    creatorDates: "c. 1265–1321",
    year: "c. 1321",
    dateStart: 1321, dateEnd: 1321,
    place: "Italy",
    form: "Literature",
    medium: "Narrative poem in vernacular Italian",
    image: "/assets/content/dante-portrait.jpg",
    imageWidth: 850,
    imageHeight: 1296,
    imagePosition: "50% 22%",
    kicker: "A poem that helped shape a language",
    story: [
      "Dante chose to write his journey through Hell, Purgatory, and Paradise in the language people spoke. Serious literature was still commonly written in Latin.",
      "His Tuscan vernacular reached readers far beyond Florence. Together with Petrarch, Boccaccio, later institutions, and centuries of use, it strongly influenced standard Italian.",
      "The poem turned a local way of speaking into a vehicle for philosophy, politics, grief, and love. Its cultural power came from making the cosmic feel immediate.",
    ],
    favoriteCount: 18400,
    source: "Public-domain portrait after Sandro Botticelli",
  },
  {
    id: "chart-of-hell",
    creatorId: "sandro-botticelli",
    title: "Chart of Hell",
    creator: "Sandro Botticelli",
    creatorDates: "c. 1445–1510",
    year: "c. 1480",
    dateStart: 1480, dateEnd: 1480,
    place: "Italy",
    form: "Drawing",
    medium: "Silverpoint and ink on parchment",
    image: "/assets/content/chart-of-hell.jpg",
    imageWidth: 800,
    imageHeight: 559,
    kicker: "Giving Dante's underworld a geography",
    story: [
      "Botticelli translated Dante's imagined afterlife into a single descending structure. Each narrowing circle maps a moral category from the poem.",
      "The drawing is both illustration and information design. It makes an abstract system legible without losing its sense of dread.",
    ],
    favoriteCount: 9200,
    source: "Public-domain image via Wikimedia Commons",
  },
  {
    id: "great-wave",
    creatorId: "katsushika-hokusai",
    title: "The Great Wave off Kanagawa",
    creator: "Katsushika Hokusai",
    creatorDates: "1760–1849",
    year: "c. 1831",
    dateStart: 1831, dateEnd: 1831,
    place: "Japan",
    form: "Print",
    medium: "Woodblock print; ink and color on paper",
    image: "/assets/content/great-wave.jpg",
    imageWidth: 1920,
    imageHeight: 1354,
    viewerImage: "/assets/content/viewer/great-wave.jpg",
    kicker: "A moment of danger, built from rhythm",
    story: [
      "Three boats cut through a wave that seems larger than Mount Fuji. Hokusai turns foam into claw-like shapes while the mountain stays quiet in the distance.",
      "The print belonged to a commercial series. Its reach later helped shape how audiences abroad imagined Japanese art and design.",
    ],
    favoriteCount: 42800,
    source: "Public-domain image via Wikimedia Commons",
  },
  {
    id: "noh-mask",
    creatorId: "unknown-japanese-artist",
    title: "Noh Mask: Kojo",
    creator: "Unknown Japanese artist",
    creatorDates: "Edo period",
    year: "19th century",
    dateStart: 1801, dateEnd: 1900,
    place: "Japan",
    form: "Performance",
    medium: "Painted wood",
    image: "/assets/content/noh-mask.jpg",
    imageWidth: 472,
    imageHeight: 624,
    viewerImage: "/assets/content/viewer/noh-mask.jpg",
    imagePosition: "50% 38%",
    kicker: "A still face made to move",
    story: [
      "A Noh mask changes as the performer tilts it toward or away from light. A small shift can suggest grief, calm, or age.",
      "Kojo represents an old man. The mask does not replace performance. It gives the actor a precise surface through which emotion can emerge.",
    ],
    favoriteCount: 6100,
    source: "The Met Open Access, public domain",
  },
  {
    id: "arabic-bowl",
    creatorId: "unknown-iranian-potter",
    title: "Bowl with Arabic Inscription",
    creator: "Unknown Iranian potter",
    creatorDates: "Samanid period",
    year: "10th century",
    dateStart: 901, dateEnd: 1000,
    place: "Iran",
    form: "Object",
    medium: "Earthenware; slip-painted under transparent glaze",
    image: "/assets/content/arabic-bowl.jpg",
    imageWidth: 600,
    imageHeight: 600,
    viewerImage: "/assets/content/viewer/arabic-bowl.jpg",
    kicker: "A useful object carrying a moral idea",
    story: [
      "The bold band of Arabic script is the bowl's main decoration. The words turn the everyday act of serving food into an encounter with language.",
      "Samanid potters balanced generous empty space with monumental lettering. Function, belief, and graphic design meet on one surface.",
    ],
    favoriteCount: 7700,
    source: "The Met Open Access, public domain",
  },
  {
    id: "migrant-mother",
    creatorId: "dorothea-lange",
    title: "Migrant Mother",
    creator: "Dorothea Lange",
    creatorDates: "1895–1965",
    year: "1936",
    dateStart: 1936, dateEnd: 1936,
    place: "United States",
    form: "Photography",
    medium: "Gelatin silver photograph",
    image: "/assets/content/migrant-mother.jpg",
    imageWidth: 1280,
    imageHeight: 1578,
    viewerImage: "/assets/content/viewer/migrant-mother.jpg",
    imagePosition: "50% 32%",
    kicker: "One face came to represent a crisis",
    story: [
      "Lange photographed Florence Owens Thompson during the Great Depression. The image circulated through newspapers and government channels.",
      "Its emotional force helped make distant hardship visible. Its history also raises lasting questions about consent, authorship, and who controls a public image.",
    ],
    favoriteCount: 15900,
    source: "Public-domain image via Wikimedia Commons",
  },
  {
    id: "caligari",
    creatorId: "robert-wiene",
    title: "The Cabinet of Dr. Caligari",
    creator: "Robert Wiene",
    creatorDates: "1873–1938",
    year: "1920",
    dateStart: 1920, dateEnd: 1920,
    place: "Germany",
    form: "Film",
    medium: "Silent film and lithographic poster",
    image: "/assets/content/caligari-poster.jpg",
    imageWidth: 1206,
    imageHeight: 1800,
    imagePosition: "50% 18%",
    kicker: "When a city begins to look unstable",
    story: [
      "Painted shadows, tilted buildings, and impossible streets make the film's world feel psychologically fractured.",
      "Its visual language became central to German Expressionist cinema and still echoes through horror, noir, and production design.",
    ],
    favoriteCount: 11300,
    source: "Public-domain poster via Wikimedia Commons",
  },
  {
    id: "the-kiss",
    creatorId: "gustav-klimt",
    title: "The Kiss",
    creator: "Gustav Klimt",
    creatorDates: "1862–1918",
    year: "1907–1908",
    dateStart: 1907, dateEnd: 1908,
    place: "Austria",
    form: "Painting",
    medium: "Oil and gold leaf on canvas",
    image: "/assets/content/the-kiss.jpg",
    imageWidth: 1280,
    imageHeight: 1284,
    viewerImage: "/assets/content/viewer/the-kiss.jpg",
    kicker: "Intimacy wrapped in ornament",
    story: [
      "Klimt surrounds two bodies with gold, geometry, and flowers. Their embrace sits between physical tenderness and decorative abstraction.",
      "The work reflects Vienna's turn-of-the-century tension between tradition, sensuality, and modern design.",
    ],
    favoriteCount: 38500,
    source: "Public-domain image via Wikimedia Commons",
  },
  {
    id: "girl-pearl",
    creatorId: "johannes-vermeer",
    title: "Girl with a Pearl Earring",
    creator: "Johannes Vermeer",
    creatorDates: "1632–1675",
    year: "c. 1665",
    dateStart: 1665, dateEnd: 1665,
    place: "The Netherlands",
    form: "Painting",
    medium: "Oil on canvas",
    image: "/assets/content/girl-pearl.jpg",
    imageWidth: 1280,
    imageHeight: 1516,
    viewerImage: "/assets/content/viewer/girl-pearl.jpg",
    imagePosition: "50% 25%",
    kicker: "A face without a biography",
    story: [
      "This is a tronie: a study of expression and costume, not a commissioned portrait. The unknown sitter turns toward us as if interrupted.",
      "A few bright marks create the earring's illusion. Its mystery comes from how little Vermeer gives us and how present the figure feels.",
    ],
    favoriteCount: 51200,
    source: "Public-domain image via Wikimedia Commons",
  },
];

const demoCreators = [
  { id: "jacques-louis-david", canonicalName: "Jacques-Louis David", dates: "1748–1825", heroPieceId: "death-of-socrates", pieceIds: ["death-of-socrates"] },
  { id: "dante-alighieri", canonicalName: "Dante Alighieri", dates: "c. 1265–1321", heroPieceId: "divine-comedy", pieceIds: ["divine-comedy"] },
  { id: "sandro-botticelli", canonicalName: "Sandro Botticelli", dates: "c. 1445–1510", heroPieceId: "chart-of-hell", pieceIds: ["chart-of-hell"] },
  { id: "katsushika-hokusai", canonicalName: "Katsushika Hokusai", dates: "1760–1849", heroPieceId: "great-wave", pieceIds: ["great-wave"] },
  { id: "unknown-japanese-artist", canonicalName: "Unknown Japanese artist", dates: "Edo period", heroPieceId: "noh-mask", pieceIds: ["noh-mask"] },
  { id: "unknown-iranian-potter", canonicalName: "Unknown Iranian potter", dates: "Samanid period", heroPieceId: "arabic-bowl", pieceIds: ["arabic-bowl"] },
  { id: "dorothea-lange", canonicalName: "Dorothea Lange", dates: "1895–1965", heroPieceId: "migrant-mother", pieceIds: ["migrant-mother"] },
  { id: "robert-wiene", canonicalName: "Robert Wiene", dates: "1873–1938", heroPieceId: "caligari", pieceIds: ["caligari"] },
  { id: "gustav-klimt", canonicalName: "Gustav Klimt", dates: "1862–1918", heroPieceId: "the-kiss", pieceIds: ["the-kiss"] },
  { id: "johannes-vermeer", canonicalName: "Johannes Vermeer", dates: "1632–1675", heroPieceId: "girl-pearl", pieceIds: ["girl-pearl"] },
] as const satisfies readonly Creator[];

// Historical layout studies retain their original fixtures. The normal app uses only approved works.
const legacyStudy = ["library-study", "explore-study", "creator-motion-study", "related-study", "today-search-study", "edge-blur-study"]
  .some(key => new URLSearchParams(window.location.search).has(key));
const DEFAULT_FAVOURITES: PieceId[] = legacyStudy ? ["divine-comedy", "great-wave", "noh-mask", "migrant-mother", "the-kiss"] : [];
const pieces: Piece[] = legacyStudy ? demoPieces : approvedPieces;
const creators: readonly Creator[] = legacyStudy ? demoCreators : approvedCreators;
const activePieceIds = new Set(pieces.map(piece => piece.id));
// Keep retired sample references in saved data; show only current catalog works.
const retainedPieceIds: PieceId[] = [...new Set([...demoPieces, ...approvedPieces].map(piece => piece.id))];
const retainedCreatorIds: CreatorId[] = [...new Set([...demoCreators, ...approvedCreators].map(creator => creator.id))];

const CREATE_ARTIST_OPTIONS: readonly CreateArtistOption[] = [
  ...CREATE_REFERENCE_ARTISTS,
  ...creators.filter((creator) => !creator.id.startsWith("unknown-")).map((creator) => ({
    id: creator.id,
    name: creator.canonicalName,
    detail: creator.dates,
    inTaste: true,
  })),
];

const demoCollections: Collection[] = [
  {
    id: "japan-motion",
    title: "Japan in Motion",
    eyebrow: "4 stories · Japan",
    description: "How gesture, repetition, and controlled movement travel across print, theatre, and daily ritual.",
    image: "/assets/content/great-wave.jpg",
    pieceIds: ["great-wave", "noh-mask"],
  },
  {
    id: "written-nation",
    title: "Written into a Nation",
    eyebrow: "3 stories · Language",
    description: "Works that gave shared identities a voice, a visual system, and a public memory.",
    image: "/assets/content/chart-of-hell.jpg",
    pieceIds: ["divine-comedy", "chart-of-hell"],
  },
  {
    id: "objects-speak",
    title: "Objects That Speak",
    eyebrow: "5 stories · Material culture",
    description: "Everyday objects that preserve belief, etiquette, and the design intelligence of their makers.",
    image: "/assets/content/arabic-bowl.jpg",
    pieceIds: ["arabic-bowl", "noh-mask", "the-kiss"],
  },
];

const collections = legacyStudy ? demoCollections : demoCollections.filter(collection => collection.pieceIds.every(id => activePieceIds.has(id)));

const EN_UI = {
  appTitle: `${APP_LABEL} Prototype`,
  nav: { daily: "Daily", discover: "Discover", search: "Search", create: "Create", favourites: "Library", settings: "Settings" },
  aria: {
    mainNavigation: "Main navigation",
    dailyArchive: "Daily story archive",
    closeStory: "Close story",
    favouriteToggle: "Favourite story",
    addFavourite: "Add to favourites",
    removeFavourite: "Remove from favourites",
    shareStory: "Share story",
    closeCollection: "Close collection",
    saveCollection: "Save collection",
    removeCollection: "Remove collection",
    shareCollection: "Share collection",
  },
  daily: {
    sourceLabel: "IMAGE NOTE",
    signoff: "Come back tomorrow for another piece of culture.",
    moreTitle: "Check out more",
    moreCarouselAria: `More stories from ${APP_LABEL}`,
    openStoryAria: (title: string) => `Open ${title}`,
  },
  creator: {
    eyebrow: "CREATOR",
    archiveCount: (count: number) => `${count} ${count === 1 ? "story" : "stories"} in the archive`,
    connectionsTitle: "Archive connections",
    storiesTitle: `Stories in ${APP_LABEL}`,
    featuredStory: "FEATURED STORY",
    openAria: (name: string) => `Open creator profile for ${name}`,
    closeAria: "Close creator profile",
  },
  discover: {
    eyebrow: "CURATED FOR CURIOSITY",
    title: "Discover",
    collectionLabel: "COLLECTION",
    acrossCultures: "Across cultures",
    culturalStories: "Cultural stories",
    exploreByForm: "Explore by art form",
    curatedCollections: "Curated collections",
    storyCount: (count: number) => `${count} ${count === 1 ? "story" : "stories"}`,
  },
  search: {
    title: "Search",
    description: "Find a culture, creator, place, or art form.",
    inputAria: `Search ${APP_LABEL}`,
    placeholder: "Try Japan, film, or Dante",
    clearAria: "Clear search",
    filtersAria: "Search filters",
    filters: { artworks: "Artworks", artists: "Artists", accounts: "Accounts", medium: "Medium" },
    idleSummary: "Start with today's highlights",
    resultCount: (count: number) => `${count} ${count === 1 ? "result" : "results"}`,
    emptyTitle: "No artworks found",
    emptyBody: "Try another title, artist, or medium.",
  },
  favourites: {
    eyebrow: "YOUR CULTURAL LIBRARY",
    title: "Library",
    tabsAria: "Library sections",
    tabs: { pieces: "Artworks", folders: "Folders" },
    allWorks: "All artworks",
    emptyTitle: "No saved works yet",
    emptyBody: "Save a work to keep it here.",
    emptyBoard: "No saved artworks in this folder yet.",
  },
  settings: {
    title: "Settings",
    other: "Other",
    accountTitle: "Your account",
    viewProfile: "View profile",
    shareProfile: "Share profile",
    profileLinkCopied: "Profile preview link copied",
    profileShareFailed: "Could not share the profile. Please try again.",
    libraryCounts: (pieceCount: number, folderCount: number) => `${pieceCount} saved ${pieceCount === 1 ? "artwork" : "artworks"} · ${folderCount} ${folderCount === 1 ? "folder" : "folders"}`,
    switchAccounts: "Switch Accounts",
    language: "Language",
    notifications: "Notifications",
    widget: "Widget",
    storyRepeats: "Story repeats",
    legal: "Legal",
    units: "Units",
    centimeters: "Centimeters",
    inches: "Inches",
    textSize: "Text Size",
    defaultSize: "Default",
    largeSize: "Large",
    systemSize: "System",
    theme: "Theme",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System",
    on: "On",
    off: "Off",
    aboutProject: `About ${APP_NAME}`,
    versionLabel: "Version 1.2",
    rateApp: "Rate App",
  },
  sheets: {
    language: { title: "Switch language" },
    cadence: {
      title: "Story repeats",
      description: "Bring older stories back after enough time has passed.",
      weekly: "Every week",
      monthly: "Every month",
      sixMonths: "Every 6 months",
      yearly: "Every year",
      never: "Never repeat",
    },
    notifications: {
      title: "Notifications",
      enabled: "Daily notifications",
      time: "Reminder time",
    },
    widget: {
      title: "Widget",
      description: "Preview how today's story can appear on your Home Screen.",
      preview: "Widget preview",
      storyAndImage: "Story and image",
      imageOnly: "Image only",
      prototypeNote: "This preview saves your choice. A real Home Screen widget needs the native mobile build.",
    },
    legal: {
      title: "Legal",
      description: "Prototype rights and content notes.",
      body: `${APP_LABEL} is an independent clean-room prototype. Sample images are public-domain or open-access works. Editorial translations remain drafts until Julio reviews them.`,
    },
    about: {
      title: `About ${APP_LABEL}`,
      description: "A slow, human-curated way to discover the ideas inside culture.",
      paragraphOne: "One story arrives each day across art, film, photography, literature, and material culture.",
      paragraphTwo: "Every selection and text is curated by Julio Caggiano.",
      version: `${APP_NAME} · Version 1.2`,
    },
  },
  collection: {
    curatorNote: "CURATOR'S NOTE",
    intro: "Culture rarely stays inside one medium. This collection follows a shared idea across objects, images, and rituals.",
    signoff: "This collection will grow as new connections enter the archive.",
  },
  toasts: {
    favouriteRemoved: "Removed from saved stories",
    favouriteSaved: "Story saved",
    collectionRemoved: "Collection removed",
    collectionSaved: "Collection saved",
    shareCopied: "Share link copied",
    collectionLinkCopied: "Collection link copied",
    ratePrototype: "Rating will open in the native app",
  },
};

type UiCopy = typeof EN_UI;

const UI_COPY: Record<Locale, UiCopy> = {
  en: EN_UI,
  "pt-BR": {
    appTitle: `Protótipo ${APP_LABEL}`,
    nav: { daily: "Hoje", discover: "Descobrir", search: "Buscar", create: "Criar", favourites: "Biblioteca", settings: "Ajustes" },
    aria: {
      mainNavigation: "Navegação principal",
      dailyArchive: "Arquivo de histórias diárias",
      closeStory: "Fechar história",
      favouriteToggle: "História favorita",
      addFavourite: "Adicionar aos favoritos",
      removeFavourite: "Remover dos favoritos",
      shareStory: "Compartilhar história",
      closeCollection: "Fechar coleção",
      saveCollection: "Salvar coleção",
      removeCollection: "Remover coleção",
      shareCollection: "Compartilhar coleção",
    },
    daily: {
      sourceLabel: "NOTA SOBRE A IMAGEM",
      signoff: "Volte amanhã para descobrir outra peça cultural.",
      moreTitle: "Veja também",
      moreCarouselAria: `Mais histórias do ${APP_LABEL}`,
      openStoryAria: (title) => `Abrir ${title}`,
    },
    creator: {
      eyebrow: "PERFIL",
      archiveCount: (count) => `${count} ${count === 1 ? "história" : "histórias"} no arquivo`,
      connectionsTitle: "Conexões no arquivo",
      storiesTitle: `Histórias no ${APP_LABEL}`,
      featuredStory: "HISTÓRIA EM DESTAQUE",
      openAria: (name) => `Abrir perfil de ${name}`,
      closeAria: "Fechar perfil",
    },
    discover: {
      eyebrow: "CURADORIA PARA DESPERTAR A CURIOSIDADE",
      title: "Descobrir",
      collectionLabel: "COLEÇÃO",
      acrossCultures: "Entre culturas",
      culturalStories: "Histórias culturais",
      exploreByForm: "Explore por forma de arte",
      curatedCollections: "Coleções selecionadas",
      storyCount: (count) => `${count} ${count === 1 ? "história" : "histórias"}`,
    },
    search: {
      title: "Buscar",
      description: "Encontre uma cultura, um criador, um lugar ou uma forma de arte.",
      inputAria: `Buscar no ${APP_LABEL}`,
      placeholder: "Tente Japão, cinema ou Dante",
      clearAria: "Limpar busca",
      filtersAria: "Filtros de busca",
      filters: { artworks: "Obras", artists: "Artistas", accounts: "Contas", medium: "Técnica" },
      idleSummary: "Comece pelos destaques de hoje",
      resultCount: (count) => `${count} ${count === 1 ? "resultado" : "resultados"}`,
      emptyTitle: "Nenhuma obra encontrada",
      emptyBody: "Tente outro título, artista ou técnica.",
    },
    favourites: {
      eyebrow: "SUA BIBLIOTECA CULTURAL",
      title: "Biblioteca",
      tabsAria: "Seções da biblioteca",
      tabs: { pieces: "Obras de arte", folders: "Pastas" },
      allWorks: "Todas as obras",
      emptyTitle: "Ainda não há obras salvas",
      emptyBody: "Salve uma obra para encontrá-la aqui.",
      emptyBoard: "Ainda não há obras salvas nesta pasta.",
    },
    settings: {
      title: "Ajustes",
      other: "Outros",
      accountTitle: "Sua conta",
      viewProfile: "Ver perfil",
      shareProfile: "Compartilhar perfil",
      profileLinkCopied: "Link de prévia do perfil copiado",
      profileShareFailed: "Não foi possível compartilhar o perfil. Tente novamente.",
      libraryCounts: (pieceCount, folderCount) => `${pieceCount} ${pieceCount === 1 ? "obra salva" : "obras salvas"} · ${folderCount} ${folderCount === 1 ? "pasta" : "pastas"}`,
      switchAccounts: "Trocar de conta",
      language: "Idioma",
      notifications: "Notificações",
      widget: "Widget",
      storyRepeats: "Repetição das histórias",
      legal: "Informações legais",
      units: "Unidades",
      centimeters: "Centímetros",
      inches: "Polegadas",
      textSize: "Tamanho do texto",
      defaultSize: "Padrão",
      largeSize: "Grande",
      systemSize: "Sistema",
      theme: "Tema",
      lightTheme: "Claro",
      darkTheme: "Escuro",
      systemTheme: "Sistema",
      on: "Ativado",
      off: "Desativado",
      aboutProject: `Sobre o ${APP_NAME}`,
      versionLabel: "Versão 1.2",
      rateApp: "Avaliar o app",
    },
    sheets: {
      language: { title: "Trocar idioma" },
      cadence: {
        title: "Repetição das histórias",
        description: "Reapresente histórias antigas depois de um intervalo suficiente.",
        weekly: "Toda semana",
        monthly: "Todo mês",
        sixMonths: "A cada 6 meses",
        yearly: "Todo ano",
        never: "Nunca repetir",
      },
      notifications: {
        title: "Notificações",
        enabled: "Notificações diárias",
        time: "Horário do lembrete",
      },
      widget: {
        title: "Widget",
        description: "Veja como a história de hoje pode aparecer na tela de início.",
        preview: "Prévia do widget",
        storyAndImage: "História e imagem",
        imageOnly: "Apenas imagem",
        prototypeNote: "Esta prévia salva sua escolha. Um widget real exige o aplicativo móvel nativo.",
      },
      legal: {
        title: "Informações legais",
        description: "Direitos e notas de conteúdo do protótipo.",
        body: `${APP_LABEL} é um protótipo independente criado em clean-room. As imagens de exemplo são de domínio público ou acesso aberto. As traduções editoriais são rascunhos até a revisão de Julio.`,
      },
      about: {
        title: `Sobre o ${APP_LABEL}`,
        description: "Uma forma calma e humana de descobrir as ideias presentes na cultura.",
        paragraphOne: "Todos os dias chega uma história sobre arte, cinema, fotografia, literatura ou cultura material.",
        paragraphTwo: "Cada seleção e cada texto têm curadoria de Julio Caggiano.",
        version: `${APP_NAME} · Versão 1.2`,
      },
    },
    collection: {
      curatorNote: "NOTA DO CURADOR",
      intro: "A cultura raramente permanece dentro de um único meio. Esta coleção acompanha uma ideia compartilhada entre objetos, imagens e rituais.",
      signoff: "Esta coleção crescerá à medida que novas conexões entrarem no arquivo.",
    },
    toasts: {
      favouriteRemoved: "História removida dos itens salvos",
      favouriteSaved: "História salva",
      collectionRemoved: "Coleção removida",
      collectionSaved: "Coleção salva",
      shareCopied: "Link de compartilhamento copiado",
      collectionLinkCopied: "Link da coleção copiado",
      ratePrototype: "A avaliação abrirá no aplicativo nativo",
    },
  },
  it: {
    appTitle: `Prototipo ${APP_LABEL}`,
    nav: { daily: "Oggi", discover: "Scopri", search: "Cerca", create: "Crea", favourites: "Libreria", settings: "Impostazioni" },
    aria: {
      mainNavigation: "Navigazione principale",
      dailyArchive: "Archivio delle storie quotidiane",
      closeStory: "Chiudi la storia",
      favouriteToggle: "Storia preferita",
      addFavourite: "Aggiungi ai preferiti",
      removeFavourite: "Rimuovi dai preferiti",
      shareStory: "Condividi la storia",
      closeCollection: "Chiudi la collezione",
      saveCollection: "Salva la collezione",
      removeCollection: "Rimuovi la collezione",
      shareCollection: "Condividi la collezione",
    },
    daily: {
      sourceLabel: "NOTA SULL'IMMAGINE",
      signoff: "Torna domani per scoprire un altro frammento di cultura.",
      moreTitle: "Scopri anche",
      moreCarouselAria: `Altre storie di ${APP_LABEL}`,
      openStoryAria: (title) => `Apri ${title}`,
    },
    creator: {
      eyebrow: "PROFILO",
      archiveCount: (count) => `${count} ${count === 1 ? "storia" : "storie"} nell'archivio`,
      connectionsTitle: "Collegamenti nell'archivio",
      storiesTitle: `Storie in ${APP_LABEL}`,
      featuredStory: "STORIA IN EVIDENZA",
      openAria: (name) => `Apri il profilo di ${name}`,
      closeAria: "Chiudi il profilo",
    },
    discover: {
      eyebrow: "CURATO PER STIMOLARE LA CURIOSITÀ",
      title: "Scopri",
      collectionLabel: "COLLEZIONE",
      acrossCultures: "Tra culture",
      culturalStories: "Storie culturali",
      exploreByForm: "Esplora per forma d'arte",
      curatedCollections: "Collezioni curate",
      storyCount: (count) => `${count} ${count === 1 ? "storia" : "storie"}`,
    },
    search: {
      title: "Cerca",
      description: "Trova una cultura, un autore, un luogo o una forma d'arte.",
      inputAria: `Cerca in ${APP_LABEL}`,
      placeholder: "Prova Giappone, cinema o Dante",
      clearAria: "Cancella la ricerca",
      filtersAria: "Filtri di ricerca",
      filters: { artworks: "Opere", artists: "Artisti", accounts: "Account", medium: "Tecnica" },
      idleSummary: "Inizia dai contenuti in evidenza di oggi",
      resultCount: (count) => `${count} ${count === 1 ? "risultato" : "risultati"}`,
      emptyTitle: "Nessuna opera trovata",
      emptyBody: "Prova un altro titolo, artista o tecnica.",
    },
    favourites: {
      eyebrow: "LA TUA BIBLIOTECA CULTURALE",
      title: "Libreria",
      tabsAria: "Sezioni della libreria",
      tabs: { pieces: "Opere d’arte", folders: "Cartelle" },
      allWorks: "Tutte le opere",
      emptyTitle: "Nessuna opera salvata",
      emptyBody: "Salva un'opera per ritrovarla qui.",
      emptyBoard: "Non ci sono opere salvate in questa cartella.",
    },
    settings: {
      title: "Impostazioni",
      other: "Altro",
      accountTitle: "Il tuo account",
      viewProfile: "Vedi profilo",
      shareProfile: "Condividi profilo",
      profileLinkCopied: "Link di anteprima del profilo copiato",
      profileShareFailed: "Impossibile condividere il profilo. Riprova.",
      libraryCounts: (pieceCount, folderCount) => `${pieceCount} ${pieceCount === 1 ? "opera salvata" : "opere salvate"} · ${folderCount} ${folderCount === 1 ? "cartella" : "cartelle"}`,
      switchAccounts: "Cambia account",
      language: "Lingua",
      notifications: "Notifiche",
      widget: "Widget",
      storyRepeats: "Ripetizione delle storie",
      legal: "Note legali",
      units: "Unità",
      centimeters: "Centimetri",
      inches: "Pollici",
      textSize: "Dimensione testo",
      defaultSize: "Predefinita",
      largeSize: "Grande",
      systemSize: "Sistema",
      theme: "Tema",
      lightTheme: "Chiaro",
      darkTheme: "Scuro",
      systemTheme: "Sistema",
      on: "Attivo",
      off: "Disattivato",
      aboutProject: `Informazioni su ${APP_NAME}`,
      versionLabel: "Versione 1.2",
      rateApp: "Valuta l'app",
    },
    sheets: {
      language: { title: "Cambia lingua" },
      cadence: {
        title: "Ripetizione delle storie",
        description: "Ripropone le storie precedenti dopo un intervallo sufficiente.",
        weekly: "Ogni settimana",
        monthly: "Ogni mese",
        sixMonths: "Ogni 6 mesi",
        yearly: "Ogni anno",
        never: "Non ripetere mai",
      },
      notifications: {
        title: "Notifiche",
        enabled: "Notifiche giornaliere",
        time: "Orario del promemoria",
      },
      widget: {
        title: "Widget",
        description: "Visualizza come la storia di oggi può apparire sulla schermata Home.",
        preview: "Anteprima del widget",
        storyAndImage: "Storia e immagine",
        imageOnly: "Solo immagine",
        prototypeNote: "Questa anteprima salva la scelta. Un vero widget richiede l'app mobile nativa.",
      },
      legal: {
        title: "Note legali",
        description: "Diritti e note sui contenuti del prototipo.",
        body: `${APP_LABEL} è un prototipo indipendente creato in clean-room. Le immagini di esempio sono di pubblico dominio o ad accesso aperto. Le traduzioni editoriali restano bozze finché Julio non le revisiona.`,
      },
      about: {
        title: `Informazioni su ${APP_LABEL}`,
        description: "Un modo lento e umano per scoprire le idee racchiuse nella cultura.",
        paragraphOne: "Ogni giorno arriva una storia tra arte, cinema, fotografia, letteratura e cultura materiale.",
        paragraphTwo: "Ogni selezione e ogni testo sono curati da Julio Caggiano.",
        version: `${APP_NAME} · Versione 1.2`,
      },
    },
    collection: {
      curatorNote: "NOTA DEL CURATORE",
      intro: "La cultura raramente resta dentro un solo mezzo. Questa collezione segue un'idea condivisa attraverso oggetti, immagini e rituali.",
      signoff: "Questa collezione crescerà quando nuove connessioni entreranno nell'archivio.",
    },
    toasts: {
      favouriteRemoved: "Storia rimossa dai salvataggi",
      favouriteSaved: "Storia salvata",
      collectionRemoved: "Collezione rimossa",
      collectionSaved: "Collezione salvata",
      shareCopied: "Link di condivisione copiato",
      collectionLinkCopied: "Link della collezione copiato",
      ratePrototype: "La valutazione si aprirà nell'app nativa",
    },
  },
  es: {
    appTitle: `Prototipo de ${APP_LABEL}`,
    nav: { daily: "Hoy", discover: "Descubrir", search: "Buscar", create: "Crear", favourites: "Biblioteca", settings: "Ajustes" },
    aria: {
      mainNavigation: "Navegación principal",
      dailyArchive: "Archivo de historias diarias",
      closeStory: "Cerrar historia",
      favouriteToggle: "Historia favorita",
      addFavourite: "Añadir a favoritos",
      removeFavourite: "Quitar de favoritos",
      shareStory: "Compartir historia",
      closeCollection: "Cerrar colección",
      saveCollection: "Guardar colección",
      removeCollection: "Quitar colección",
      shareCollection: "Compartir colección",
    },
    daily: {
      sourceLabel: "NOTA SOBRE LA IMAGEN",
      signoff: "Vuelve mañana para descubrir otra pieza cultural.",
      moreTitle: "Descubre más",
      moreCarouselAria: `Más historias de ${APP_LABEL}`,
      openStoryAria: (title) => `Abrir ${title}`,
    },
    creator: {
      eyebrow: "PERFIL",
      archiveCount: (count) => `${count} ${count === 1 ? "historia" : "historias"} en el archivo`,
      connectionsTitle: "Conexiones del archivo",
      storiesTitle: `Historias en ${APP_LABEL}`,
      featuredStory: "HISTORIA DESTACADA",
      openAria: (name) => `Abrir el perfil de ${name}`,
      closeAria: "Cerrar el perfil",
    },
    discover: {
      eyebrow: "SELECCIONADO PARA DESPERTAR LA CURIOSIDAD",
      title: "Descubrir",
      collectionLabel: "COLECCIÓN",
      acrossCultures: "Entre culturas",
      culturalStories: "Historias culturales",
      exploreByForm: "Explora por forma artística",
      curatedCollections: "Colecciones seleccionadas",
      storyCount: (count) => `${count} ${count === 1 ? "historia" : "historias"}`,
    },
    search: {
      title: "Buscar",
      description: "Encuentra una cultura, un creador, un lugar o una forma artística.",
      inputAria: `Buscar en ${APP_LABEL}`,
      placeholder: "Prueba Japón, cine o Dante",
      clearAria: "Borrar búsqueda",
      filtersAria: "Filtros de búsqueda",
      filters: { artworks: "Obras", artists: "Artistas", accounts: "Cuentas", medium: "Técnica" },
      idleSummary: "Empieza por los destacados de hoy",
      resultCount: (count) => `${count} ${count === 1 ? "resultado" : "resultados"}`,
      emptyTitle: "No se encontraron obras",
      emptyBody: "Prueba otro título, artista o técnica.",
    },
    favourites: {
      eyebrow: "TU BIBLIOTECA CULTURAL",
      title: "Biblioteca",
      tabsAria: "Secciones de la biblioteca",
      tabs: { pieces: "Obras de arte", folders: "Carpetas" },
      allWorks: "Todas las obras",
      emptyTitle: "Aún no hay obras guardadas",
      emptyBody: "Guarda una obra para encontrarla aquí.",
      emptyBoard: "Aún no hay obras guardadas en esta carpeta.",
    },
    settings: {
      title: "Ajustes",
      other: "Otros",
      accountTitle: "Tu cuenta",
      viewProfile: "Ver perfil",
      shareProfile: "Compartir perfil",
      profileLinkCopied: "Enlace de vista previa del perfil copiado",
      profileShareFailed: "No se pudo compartir el perfil. Inténtalo de nuevo.",
      libraryCounts: (pieceCount, folderCount) => `${pieceCount} ${pieceCount === 1 ? "obra guardada" : "obras guardadas"} · ${folderCount} ${folderCount === 1 ? "carpeta" : "carpetas"}`,
      switchAccounts: "Cambiar de cuenta",
      language: "Idioma",
      notifications: "Notificaciones",
      widget: "Widget",
      storyRepeats: "Repetición de historias",
      legal: "Información legal",
      units: "Unidades",
      centimeters: "Centímetros",
      inches: "Pulgadas",
      textSize: "Tamaño del texto",
      defaultSize: "Predeterminado",
      largeSize: "Grande",
      systemSize: "Sistema",
      theme: "Tema",
      lightTheme: "Claro",
      darkTheme: "Oscuro",
      systemTheme: "Sistema",
      on: "Activado",
      off: "Desactivado",
      aboutProject: `Acerca de ${APP_NAME}`,
      versionLabel: "Versión 1.2",
      rateApp: "Calificar la app",
    },
    sheets: {
      language: { title: "Cambiar idioma" },
      cadence: {
        title: "Repetición de historias",
        description: "Recupera historias anteriores cuando haya pasado suficiente tiempo.",
        weekly: "Cada semana",
        monthly: "Cada mes",
        sixMonths: "Cada 6 meses",
        yearly: "Cada año",
        never: "No repetir nunca",
      },
      notifications: {
        title: "Notificaciones",
        enabled: "Notificaciones diarias",
        time: "Hora del recordatorio",
      },
      widget: {
        title: "Widget",
        description: "Observa cómo puede aparecer la historia de hoy en la pantalla de inicio.",
        preview: "Vista previa del widget",
        storyAndImage: "Historia e imagen",
        imageOnly: "Solo imagen",
        prototypeNote: "Esta vista previa guarda tu elección. Un widget real requiere la app móvil nativa.",
      },
      legal: {
        title: "Información legal",
        description: "Derechos y notas de contenido del prototipo.",
        body: `${APP_LABEL} es un prototipo independiente creado en clean-room. Las imágenes de ejemplo son de dominio público o acceso abierto. Las traducciones editoriales son borradores hasta que Julio las revise.`,
      },
      about: {
        title: `Acerca de ${APP_LABEL}`,
        description: "Una forma pausada y humana de descubrir las ideas dentro de la cultura.",
        paragraphOne: "Cada día llega una historia sobre arte, cine, fotografía, literatura o cultura material.",
        paragraphTwo: "Cada selección y cada texto están a cargo de Julio Caggiano.",
        version: `${APP_NAME} · Versión 1.2`,
      },
    },
    collection: {
      curatorNote: "NOTA DEL CURADOR",
      intro: "La cultura rara vez permanece dentro de un solo medio. Esta colección sigue una idea compartida a través de objetos, imágenes y rituales.",
      signoff: "Esta colección crecerá a medida que nuevas conexiones entren en el archivo.",
    },
    toasts: {
      favouriteRemoved: "Historia quitada de guardados",
      favouriteSaved: "Historia guardada",
      collectionRemoved: "Colección eliminada",
      collectionSaved: "Colección guardada",
      shareCopied: "Enlace para compartir copiado",
      collectionLinkCopied: "Enlace de la colección copiado",
      ratePrototype: "La valoración se abrirá en la app nativa",
    },
  },
};

type ContributionCopy = {
  banner: {
    eyebrow: string;
    title: string;
    body: string;
    button: string;
    hint: string;
    slideAria: string;
  };
  form: {
    title: string;
    description: string;
    topicLabel: string;
    topicPlaceholder: string;
    contextLabel: string;
    contextPlaceholder: string;
    sourcesLabel: string;
    sourcesPlaceholder: string;
    imagesLabel: string;
    imagesHelp: string;
    addImages: string;
    imageRights: string;
    prototypeNote: string;
    submit: string;
    topicRequiredError: string;
    contextRequiredError: string;
    imageTypeError: string;
    imageSizeError: string;
    imageLimitError: string;
    imageRightsError: string;
    removeImage: (name: string) => string;
    successEyebrow: string;
    successTitle: string;
    successBody: string;
    submitAnother: string;
  };
};

const CONTRIBUTION_COPY: Record<Locale, ContributionCopy> = {
  en: {
    banner: {
      eyebrow: "OPEN CALL",
      title: `Help shape a future ${APP_LABEL}`,
      body: "Know an object, film, ritual, or story worth sharing? Send what you know.",
      button: "Suggest a story",
      hint: "Swipe right to return to today",
      slideAria: `Contribute a future ${APP_LABEL} story`,
    },
    form: {
      title: "Suggest a story",
      description: "Share the idea, why it matters, and any sources or images you have.",
      topicLabel: "Art piece, person, or cultural practice",
      topicPlaceholder: "Name the piece, person, or practice",
      contextLabel: "Why does it matter?",
      contextPlaceholder: "Tell us the connection, history, or question behind your idea.",
      sourcesLabel: "Sources or links (optional)",
      sourcesPlaceholder: "Add museum pages, articles, books, or other references",
      imagesLabel: "Images (optional)",
      imagesHelp: "Add up to 3 JPG, PNG, or WebP files. 10 MB each.",
      addImages: "Add images",
      imageRights: "I have permission to share these images for editorial review.",
      prototypeNote: "Prototype only: this form does not send or upload your information yet.",
      submit: "Send suggestion",
      topicRequiredError: "Add an art piece, person, or cultural practice.",
      contextRequiredError: "Explain why this idea matters.",
      imageTypeError: "Use JPG, PNG, or WebP images.",
      imageSizeError: "Each image must be smaller than 10 MB.",
      imageLimitError: "You can add up to 3 images.",
      imageRightsError: "Confirm image rights before submitting.",
      removeImage: (name) => `Remove ${name}`,
      successEyebrow: "READY FOR REVIEW",
      successTitle: "Your suggestion is ready",
      successBody: "This prototype captured the complete flow. A connected service can send it to Julio for review.",
      submitAnother: "Suggest another story",
    },
  },
  "pt-BR": {
    banner: {
      eyebrow: "CHAMADA ABERTA",
      title: `Ajude a criar um futuro ${APP_LABEL}`,
      body: "Conhece um objeto, filme, ritual ou história que merece ser compartilhado? Envie o que você sabe.",
      button: "Sugerir uma história",
      hint: "Deslize para a direita para voltar a hoje",
      slideAria: `Contribua com uma futura história do ${APP_LABEL}`,
    },
    form: {
      title: "Sugira uma história",
      description: "Compartilhe a ideia, por que ela importa e as fontes ou imagens que você tiver.",
      topicLabel: "Obra de arte, pessoa ou prática cultural",
      topicPlaceholder: "Nomeie a obra, pessoa ou prática",
      contextLabel: "Por que isso importa?",
      contextPlaceholder: "Conte a conexão, a história ou a pergunta por trás da ideia.",
      sourcesLabel: "Fontes ou links (opcional)",
      sourcesPlaceholder: "Adicione páginas de museus, artigos, livros ou outras referências",
      imagesLabel: "Imagens (opcional)",
      imagesHelp: "Adicione até 3 arquivos JPG, PNG ou WebP. 10 MB cada.",
      addImages: "Adicionar imagens",
      imageRights: "Tenho permissão para compartilhar estas imagens para revisão editorial.",
      prototypeNote: "Apenas um protótipo: este formulário ainda não envia nem carrega suas informações.",
      submit: "Enviar sugestão",
      topicRequiredError: "Adicione uma obra de arte, pessoa ou prática cultural.",
      contextRequiredError: "Explique por que esta ideia importa.",
      imageTypeError: "Use imagens JPG, PNG ou WebP.",
      imageSizeError: "Cada imagem deve ter menos de 10 MB.",
      imageLimitError: "Você pode adicionar até 3 imagens.",
      imageRightsError: "Confirme os direitos das imagens antes de enviar.",
      removeImage: (name) => `Remover ${name}`,
      successEyebrow: "PRONTO PARA REVISÃO",
      successTitle: "Sua sugestão está pronta",
      successBody: "Este protótipo registrou o fluxo completo. Um serviço conectado poderá enviá-la para Julio revisar.",
      submitAnother: "Sugerir outra história",
    },
  },
  it: {
    banner: {
      eyebrow: "INVITO APERTO",
      title: `Aiuta a creare un futuro ${APP_LABEL}`,
      body: "Conosci un oggetto, un film, un rito o una storia da condividere? Invia ciò che sai.",
      button: "Suggerisci una storia",
      hint: "Scorri a destra per tornare a oggi",
      slideAria: `Contribuisci a una futura storia di ${APP_LABEL}`,
    },
    form: {
      title: "Suggerisci una storia",
      description: "Condividi l'idea, perché è importante e le fonti o immagini che hai.",
      topicLabel: "Opera d'arte, persona o pratica culturale",
      topicPlaceholder: "Indica l'opera, la persona o la pratica",
      contextLabel: "Perché è importante?",
      contextPlaceholder: "Racconta il legame, la storia o la domanda dietro la tua idea.",
      sourcesLabel: "Fonti o link (facoltativi)",
      sourcesPlaceholder: "Aggiungi pagine di musei, articoli, libri o altri riferimenti",
      imagesLabel: "Immagini (facoltative)",
      imagesHelp: "Aggiungi fino a 3 file JPG, PNG o WebP. 10 MB ciascuno.",
      addImages: "Aggiungi immagini",
      imageRights: "Ho il permesso di condividere queste immagini per la revisione editoriale.",
      prototypeNote: "Solo prototipo: questo modulo non invia né carica ancora le tue informazioni.",
      submit: "Invia suggerimento",
      topicRequiredError: "Aggiungi un'opera d'arte, una persona o una pratica culturale.",
      contextRequiredError: "Spiega perché questa idea è importante.",
      imageTypeError: "Usa immagini JPG, PNG o WebP.",
      imageSizeError: "Ogni immagine deve essere inferiore a 10 MB.",
      imageLimitError: "Puoi aggiungere fino a 3 immagini.",
      imageRightsError: "Conferma i diritti delle immagini prima di inviare.",
      removeImage: (name) => `Rimuovi ${name}`,
      successEyebrow: "PRONTO PER LA REVISIONE",
      successTitle: "Il tuo suggerimento è pronto",
      successBody: "Questo prototipo ha completato il flusso. Un servizio collegato potrà inviarlo a Julio per la revisione.",
      submitAnother: "Suggerisci un'altra storia",
    },
  },
  es: {
    banner: {
      eyebrow: "CONVOCATORIA ABIERTA",
      title: `Ayuda a crear un futuro ${APP_LABEL}`,
      body: "¿Conoces un objeto, una película, un ritual o una historia que debamos compartir? Envíanos lo que sabes.",
      button: "Sugerir una historia",
      hint: "Desliza a la derecha para volver a hoy",
      slideAria: `Contribuye a una futura historia de ${APP_LABEL}`,
    },
    form: {
      title: "Sugiere una historia",
      description: "Comparte la idea, por qué importa y las fuentes o imágenes que tengas.",
      topicLabel: "Obra de arte, persona o práctica cultural",
      topicPlaceholder: "Indica la obra, la persona o la práctica",
      contextLabel: "¿Por qué importa?",
      contextPlaceholder: "Cuenta la conexión, historia o pregunta detrás de tu idea.",
      sourcesLabel: "Fuentes o enlaces (opcional)",
      sourcesPlaceholder: "Añade páginas de museos, artículos, libros u otras referencias",
      imagesLabel: "Imágenes (opcional)",
      imagesHelp: "Añade hasta 3 archivos JPG, PNG o WebP. 10 MB cada uno.",
      addImages: "Añadir imágenes",
      imageRights: "Tengo permiso para compartir estas imágenes para revisión editorial.",
      prototypeNote: "Solo prototipo: este formulario todavía no envía ni carga tu información.",
      submit: "Enviar sugerencia",
      topicRequiredError: "Añade una obra de arte, persona o práctica cultural.",
      contextRequiredError: "Explica por qué esta idea importa.",
      imageTypeError: "Usa imágenes JPG, PNG o WebP.",
      imageSizeError: "Cada imagen debe pesar menos de 10 MB.",
      imageLimitError: "Puedes añadir hasta 3 imágenes.",
      imageRightsError: "Confirma los derechos de las imágenes antes de enviar.",
      removeImage: (name) => `Eliminar ${name}`,
      successEyebrow: "LISTA PARA REVISIÓN",
      successTitle: "Tu sugerencia está lista",
      successBody: "Este prototipo registró el flujo completo. Un servicio conectado podrá enviarla a Julio para revisión.",
      submitAnother: "Sugerir otra historia",
    },
  },
};

type LocalizedPieceCopy = Pick<Piece, "title" | "place" | "medium" | "kicker" | "story" | "source"> &
  Partial<Pick<Piece, "creator" | "creatorDates" | "year">>;

// Prototype translations. Julio reviews editorial copy before publication.
const PIECE_TRANSLATIONS: Record<NonEnglishLocale, Partial<Record<PieceId, LocalizedPieceCopy>>> = {
  "pt-BR": {
    "death-of-socrates": {
      title: "A Morte de Sócrates", place: "França", medium: "Óleo sobre tela", kicker: "Uma cena da Antiguidade",
      story: [
        "Em 399 a.C., um tribunal ateniense condenou Sócrates à morte por rejeitar os deuses da cidade e corromper os jovens. Seguindo o relato de Platão, David o mostra ensinando que a alma sobrevive à morte enquanto estende a mão para o veneno.",
        "Sua postura firme em meio à dor dos companheiros apresenta um homem que mantém suas convicções diante da ameaça de morte. David inclui Platão aos pés da cama, embora ele não estivesse na execução, para reconhecer o escritor que preservou esse relato.",
      ],
      source: "The Metropolitan Museum of Art · Domínio público, acesso aberto",
    },
    "divine-comedy": {
      title: "A Divina Comédia",
      place: "Itália",
      medium: "Poema narrativo em italiano vernáculo",
      kicker: "Um poema que ajudou a moldar uma língua",
      story: [
        "Dante escolheu narrar sua jornada pelo Inferno, Purgatório e Paraíso na língua falada pelo povo. A literatura de prestígio ainda era frequentemente escrita em latim.",
        "Seu vernáculo toscano alcançou leitores muito além de Florença. Junto com Petrarca, Boccaccio, instituições posteriores e séculos de uso, influenciou fortemente o italiano padrão.",
        "O poema transformou um modo local de falar em veículo para filosofia, política, luto e amor. Sua força cultural veio de tornar o cósmico imediato.",
      ],
      source: "Retrato de domínio público, baseado em Sandro Botticelli",
    },
    "chart-of-hell": {
      title: "Mapa do Inferno",
      place: "Itália",
      medium: "Ponta de prata e tinta sobre pergaminho",
      kicker: "Uma geografia para o Inferno de Dante",
      story: [
        "Botticelli traduziu a vida após a morte imaginada por Dante em uma única estrutura descendente. Cada círculo, mais estreito que o anterior, representa uma categoria moral do poema.",
        "O desenho é tanto ilustração quanto design da informação. Ele torna legível um sistema abstrato sem perder sua sensação de pavor.",
      ],
      source: "Imagem em domínio público via Wikimedia Commons",
    },
    "great-wave": {
      title: "A Grande Onda de Kanagawa",
      place: "Japão",
      medium: "Xilogravura; tinta e cor sobre papel",
      kicker: "Um instante de perigo construído pelo ritmo",
      story: [
        "Três barcos atravessam uma onda que parece maior que o Monte Fuji. Hokusai transforma a espuma em formas semelhantes a garras, enquanto a montanha permanece serena ao fundo.",
        "A gravura fazia parte de uma série comercial. Sua circulação mais tarde ajudou a moldar como públicos estrangeiros imaginavam a arte e o design japoneses.",
      ],
      source: "Imagem em domínio público via Wikimedia Commons",
    },
    "noh-mask": {
      title: "Máscara Nō: Kojo",
      creator: "Artista japonês desconhecido",
      creatorDates: "Período Edo",
      year: "século XIX",
      place: "Japão",
      medium: "Madeira pintada",
      kicker: "Um rosto imóvel feito para se mover",
      story: [
        "Uma máscara Nō muda conforme o intérprete a inclina em direção à luz ou para longe dela. Um pequeno movimento pode sugerir luto, serenidade ou idade.",
        "Kojo representa um homem idoso. A máscara não substitui a atuação. Ela oferece ao ator uma superfície precisa por meio da qual a emoção pode surgir.",
      ],
      source: "The Met Open Access, domínio público",
    },
    "arabic-bowl": {
      title: "Tigela com inscrição árabe",
      creator: "Ceramista iraniano desconhecido",
      creatorDates: "Período samânida",
      year: "século X",
      place: "Irã",
      medium: "Cerâmica; pintura com engobe sob vidrado transparente",
      kicker: "Um objeto útil que carrega uma ideia moral",
      story: [
        "A faixa marcante de escrita árabe é a principal decoração da tigela. As palavras transformam o ato cotidiano de servir comida em um encontro com a linguagem.",
        "Os ceramistas samânidas equilibraram amplos espaços vazios com letras monumentais. Função, crença e design gráfico encontram-se em uma única superfície.",
      ],
      source: "The Met Open Access, domínio público",
    },
    "migrant-mother": {
      title: "Mãe Migrante",
      place: "Estados Unidos",
      medium: "Fotografia em gelatina de prata",
      kicker: "Um rosto passou a representar uma crise",
      story: [
        "Lange fotografou Florence Owens Thompson durante a Grande Depressão. A imagem circulou por jornais e canais governamentais.",
        "Sua força emocional ajudou a tornar visível um sofrimento distante. Sua história também levanta questões duradouras sobre consentimento, autoria e quem controla uma imagem pública.",
      ],
      source: "Imagem em domínio público via Wikimedia Commons",
    },
    caligari: {
      title: "O Gabinete do Dr. Caligari",
      place: "Alemanha",
      medium: "Filme mudo e cartaz litográfico",
      kicker: "Quando uma cidade começa a parecer instável",
      story: [
        "Sombras pintadas, edifícios inclinados e ruas impossíveis fazem o mundo do filme parecer psicologicamente fraturado.",
        "Sua linguagem visual tornou-se central para o cinema expressionista alemão e ainda ecoa no terror, no noir e no design de produção.",
      ],
      source: "Cartaz em domínio público via Wikimedia Commons",
    },
    "the-kiss": {
      title: "O Beijo",
      place: "Áustria",
      medium: "Óleo e folha de ouro sobre tela",
      kicker: "Intimidade envolta em ornamento",
      story: [
        "Klimt envolve dois corpos em ouro, geometria e flores. O abraço fica entre a ternura física e a abstração decorativa.",
        "A obra reflete a tensão da Viena da virada do século entre tradição, sensualidade e design moderno.",
      ],
      source: "Imagem em domínio público via Wikimedia Commons",
    },
    "girl-pearl": {
      title: "Moça com Brinco de Pérola",
      place: "Países Baixos",
      medium: "Óleo sobre tela",
      kicker: "Um rosto sem biografia",
      story: [
        "Este é um tronie: um estudo de expressão e figurino, não um retrato encomendado. A modelo desconhecida se volta para nós como se tivesse sido interrompida.",
        "Algumas pinceladas luminosas criam a ilusão do brinco. O mistério vem de quanto Vermeer omite e de quão presente a figura parece.",
      ],
      source: "Imagem em domínio público via Wikimedia Commons",
    },
  },
  it: {
    "death-of-socrates": {
      title: "La morte di Socrate", place: "Francia", medium: "Olio su tela", kicker: "Una scena dell’antichità",
      story: [
        "Nel 399 a.C., un tribunale ateniese condannò Socrate a morte per aver rifiutato gli dèi della città e corrotto i giovani. Seguendo il racconto di Platone, David lo mostra mentre insegna che l’anima sopravvive alla morte e tende la mano verso il veleno.",
        "La sua postura salda, tra i compagni addolorati, presenta un uomo che mantiene le proprie convinzioni davanti alla minaccia di morte. David include Platone ai piedi del letto, sebbene fosse assente all’esecuzione, per riconoscere lo scrittore che ne ha tramandato il racconto.",
      ],
      source: "The Metropolitan Museum of Art · Pubblico dominio, accesso aperto",
    },
    "divine-comedy": {
      title: "Divina Commedia",
      place: "Italia",
      medium: "Poema narrativo in volgare italiano",
      kicker: "Un poema che contribuì a plasmare una lingua",
      story: [
        "Dante scelse di raccontare il suo viaggio attraverso Inferno, Purgatorio e Paradiso nella lingua parlata dalla gente. La letteratura colta era ancora comunemente scritta in latino.",
        "Il suo volgare toscano raggiunse lettori ben oltre Firenze. Insieme a Petrarca, a Boccaccio, alle istituzioni successive e a secoli d'uso, influenzò profondamente l'italiano standard.",
        "Il poema trasformò un modo di parlare locale in un veicolo per la filosofia, la politica, il lutto e l'amore. La sua forza culturale nacque dal rendere immediato ciò che è cosmico.",
      ],
      source: "Ritratto di pubblico dominio da Sandro Botticelli",
    },
    "chart-of-hell": {
      title: "Mappa dell'Inferno",
      place: "Italia",
      medium: "Punta d'argento e inchiostro su pergamena",
      kicker: "Una geografia per l'oltretomba di Dante",
      story: [
        "Botticelli tradusse l'aldilà immaginato da Dante in un'unica struttura discendente. Ogni cerchio, sempre più stretto, rappresenta una categoria morale del poema.",
        "Il disegno è insieme illustrazione e progetto informativo. Rende leggibile un sistema astratto senza perderne il senso di terrore.",
      ],
      source: "Immagine di pubblico dominio tramite Wikimedia Commons",
    },
    "great-wave": {
      title: "La grande onda di Kanagawa",
      place: "Giappone",
      medium: "Xilografia; inchiostro e colore su carta",
      kicker: "Un momento di pericolo costruito sul ritmo",
      story: [
        "Tre barche attraversano un'onda che sembra più grande del Monte Fuji. Hokusai trasforma la schiuma in forme simili ad artigli, mentre la montagna resta quieta sullo sfondo.",
        "La stampa apparteneva a una serie commerciale. La sua diffusione contribuì in seguito a plasmare il modo in cui il pubblico straniero immaginava l'arte e il design giapponesi.",
      ],
      source: "Immagine di pubblico dominio tramite Wikimedia Commons",
    },
    "noh-mask": {
      title: "Maschera Nō: Kojo",
      creator: "Artista giapponese sconosciuto",
      creatorDates: "Periodo Edo",
      year: "XIX secolo",
      place: "Giappone",
      medium: "Legno dipinto",
      kicker: "Un volto immobile creato per muoversi",
      story: [
        "Una maschera Nō cambia quando l'interprete la inclina verso la luce o lontano da essa. Un piccolo movimento può suggerire dolore, calma o vecchiaia.",
        "Kojo rappresenta un uomo anziano. La maschera non sostituisce la recitazione. Offre all'attore una superficie precisa attraverso cui può emergere l'emozione.",
      ],
      source: "The Met Open Access, pubblico dominio",
    },
    "arabic-bowl": {
      title: "Coppa con iscrizione araba",
      creator: "Ceramista iraniano sconosciuto",
      creatorDates: "Periodo samanide",
      year: "X secolo",
      place: "Iran",
      medium: "Terracotta; dipinta a ingobbio sotto vetrina trasparente",
      kicker: "Un oggetto utile che porta con sé un'idea morale",
      story: [
        "L'ampia fascia di scrittura araba è la decorazione principale della coppa. Le parole trasformano il gesto quotidiano di servire il cibo in un incontro con il linguaggio.",
        "I ceramisti samanidi equilibrarono ampi spazi vuoti e caratteri monumentali. Funzione, fede e progetto grafico si incontrano su un'unica superficie.",
      ],
      source: "The Met Open Access, pubblico dominio",
    },
    "migrant-mother": {
      title: "Madre migrante",
      place: "Stati Uniti",
      medium: "Fotografia alla gelatina ai sali d'argento",
      kicker: "Un volto finì per rappresentare una crisi",
      story: [
        "Lange fotografò Florence Owens Thompson durante la Grande Depressione. L'immagine circolò attraverso giornali e canali governativi.",
        "La sua forza emotiva contribuì a rendere visibile una sofferenza lontana. La sua storia solleva anche domande durature sul consenso, sull'autorialità e su chi controlla un'immagine pubblica.",
      ],
      source: "Immagine di pubblico dominio tramite Wikimedia Commons",
    },
    caligari: {
      title: "Il gabinetto del dottor Caligari",
      place: "Germania",
      medium: "Film muto e manifesto litografico",
      kicker: "Quando una città comincia a sembrare instabile",
      story: [
        "Ombre dipinte, edifici inclinati e strade impossibili fanno apparire il mondo del film psicologicamente frantumato.",
        "Il suo linguaggio visivo divenne centrale nel cinema espressionista tedesco e riecheggia ancora nell'horror, nel noir e nella scenografia.",
      ],
      source: "Manifesto di pubblico dominio tramite Wikimedia Commons",
    },
    "the-kiss": {
      title: "Il bacio",
      place: "Austria",
      medium: "Olio e foglia d'oro su tela",
      kicker: "Intimità avvolta nell'ornamento",
      story: [
        "Klimt circonda due corpi di oro, geometrie e fiori. Il loro abbraccio si colloca tra la tenerezza fisica e l'astrazione decorativa.",
        "L'opera riflette la tensione della Vienna di fine secolo tra tradizione, sensualità e design moderno.",
      ],
      source: "Immagine di pubblico dominio tramite Wikimedia Commons",
    },
    "girl-pearl": {
      title: "La ragazza con l'orecchino di perla",
      place: "Paesi Bassi",
      medium: "Olio su tela",
      kicker: "Un volto senza biografia",
      story: [
        "Si tratta di una tronie: uno studio di espressione e costume, non di un ritratto commissionato. La modella sconosciuta si volta verso di noi come se fosse stata interrotta.",
        "Pochi tocchi luminosi creano l'illusione dell'orecchino. Il mistero nasce da quanto poco Vermeer ci offre e da quanto la figura sembri presente.",
      ],
      source: "Immagine di pubblico dominio tramite Wikimedia Commons",
    },
  },
  es: {
    "death-of-socrates": {
      title: "La muerte de Sócrates", place: "Francia", medium: "Óleo sobre lienzo", kicker: "Una escena de la Antigüedad",
      story: [
        "En 399 a. C., un tribunal ateniense condenó a Sócrates a muerte por rechazar a los dioses de la ciudad y corromper a los jóvenes. Siguiendo el relato de Platón, David lo muestra enseñando que el alma sobrevive a la muerte mientras extiende la mano hacia el veneno.",
        "Su postura firme entre sus compañeros afligidos presenta a un hombre que mantiene sus convicciones ante la amenaza de muerte. David incluye a Platón a los pies de la cama, pese a su ausencia de la ejecución, para reconocer al escritor que conservó este relato.",
      ],
      source: "The Metropolitan Museum of Art · Dominio público, acceso abierto",
    },
    "divine-comedy": {
      title: "La Divina Comedia",
      place: "Italia",
      medium: "Poema narrativo en italiano vernáculo",
      kicker: "Un poema que ayudó a dar forma a una lengua",
      story: [
        "Dante eligió narrar su viaje por el Infierno, el Purgatorio y el Paraíso en la lengua que hablaba la gente. La literatura culta todavía se escribía habitualmente en latín.",
        "Su lengua vernácula toscana llegó a lectores mucho más allá de Florencia. Junto con Petrarca, Boccaccio, instituciones posteriores y siglos de uso, influyó profundamente en el italiano estándar.",
        "El poema convirtió una forma local de hablar en un vehículo para la filosofía, la política, el duelo y el amor. Su fuerza cultural surgió de hacer que lo cósmico pareciera inmediato.",
      ],
      source: "Retrato de dominio público basado en Sandro Botticelli",
    },
    "chart-of-hell": {
      title: "Mapa del Infierno",
      place: "Italia",
      medium: "Punta de plata y tinta sobre pergamino",
      kicker: "Una geografía para el inframundo de Dante",
      story: [
        "Botticelli tradujo la vida después de la muerte imaginada por Dante en una única estructura descendente. Cada círculo, más estrecho que el anterior, representa una categoría moral del poema.",
        "El dibujo es a la vez ilustración y diseño de información. Hace legible un sistema abstracto sin perder su sensación de terror.",
      ],
      source: "Imagen de dominio público vía Wikimedia Commons",
    },
    "great-wave": {
      title: "La gran ola de Kanagawa",
      place: "Japón",
      medium: "Xilografía; tinta y color sobre papel",
      kicker: "Un momento de peligro construido a partir del ritmo",
      story: [
        "Tres barcas atraviesan una ola que parece mayor que el monte Fuji. Hokusai convierte la espuma en formas semejantes a garras, mientras la montaña permanece serena al fondo.",
        "El grabado pertenecía a una serie comercial. Su difusión ayudó después a dar forma a la manera en que el público extranjero imaginaba el arte y el diseño japoneses.",
      ],
      source: "Imagen de dominio público vía Wikimedia Commons",
    },
    "noh-mask": {
      title: "Máscara Nō: Kojo",
      creator: "Artista japonés desconocido",
      creatorDates: "Período Edo",
      year: "siglo XIX",
      place: "Japón",
      medium: "Madera pintada",
      kicker: "Un rostro inmóvil creado para moverse",
      story: [
        "Una máscara Nō cambia cuando el intérprete la inclina hacia la luz o se aleja de ella. Un pequeño movimiento puede sugerir dolor, calma o edad.",
        "Kojo representa a un hombre anciano. La máscara no sustituye la actuación. Ofrece al actor una superficie precisa a través de la cual puede surgir la emoción.",
      ],
      source: "The Met Open Access, dominio público",
    },
    "arabic-bowl": {
      title: "Cuenco con inscripción árabe",
      creator: "Ceramista iraní desconocido",
      creatorDates: "Período samánida",
      year: "siglo X",
      place: "Irán",
      medium: "Loza de barro; pintura con engobe bajo vidriado transparente",
      kicker: "Un objeto útil que transmite una idea moral",
      story: [
        "La marcada franja de escritura árabe es la decoración principal del cuenco. Las palabras convierten el acto cotidiano de servir comida en un encuentro con el lenguaje.",
        "Los ceramistas samánidas equilibraron amplios espacios vacíos con letras monumentales. Función, creencia y diseño gráfico se encuentran en una sola superficie.",
      ],
      source: "The Met Open Access, dominio público",
    },
    "migrant-mother": {
      title: "Madre migrante",
      place: "Estados Unidos",
      medium: "Fotografía en gelatina de plata",
      kicker: "Un rostro llegó a representar una crisis",
      story: [
        "Lange fotografió a Florence Owens Thompson durante la Gran Depresión. La imagen circuló por periódicos y canales gubernamentales.",
        "Su fuerza emocional ayudó a hacer visible un sufrimiento lejano. Su historia también plantea preguntas duraderas sobre el consentimiento, la autoría y quién controla una imagen pública.",
      ],
      source: "Imagen de dominio público vía Wikimedia Commons",
    },
    caligari: {
      title: "El gabinete del doctor Caligari",
      place: "Alemania",
      medium: "Película muda y cartel litográfico",
      kicker: "Cuando una ciudad empieza a parecer inestable",
      story: [
        "Sombras pintadas, edificios inclinados y calles imposibles hacen que el mundo de la película parezca psicológicamente fracturado.",
        "Su lenguaje visual se volvió central en el cine expresionista alemán y todavía resuena en el terror, el cine negro y el diseño de producción.",
      ],
      source: "Cartel de dominio público vía Wikimedia Commons",
    },
    "the-kiss": {
      title: "El beso",
      place: "Austria",
      medium: "Óleo y pan de oro sobre lienzo",
      kicker: "Intimidad envuelta en ornamento",
      story: [
        "Klimt rodea dos cuerpos con oro, geometría y flores. Su abrazo se sitúa entre la ternura física y la abstracción decorativa.",
        "La obra refleja la tensión de la Viena de fin de siglo entre tradición, sensualidad y diseño moderno.",
      ],
      source: "Imagen de dominio público vía Wikimedia Commons",
    },
    "girl-pearl": {
      title: "La joven de la perla",
      place: "Países Bajos",
      medium: "Óleo sobre lienzo",
      kicker: "Un rostro sin biografía",
      story: [
        "Esta es una tronie: un estudio de expresión y vestuario, no un retrato encargado. La modelo desconocida se vuelve hacia nosotros como si la hubieran interrumpido.",
        "Unos pocos toques luminosos crean la ilusión del pendiente. El misterio surge de lo poco que Vermeer ofrece y de lo presente que parece la figura.",
      ],
      source: "Imagen de dominio público vía Wikimedia Commons",
    },
  },
};

type LocalizedCollectionCopy = Pick<Collection, "title" | "eyebrow" | "description">;

const COLLECTION_TRANSLATIONS: Record<NonEnglishLocale, Record<CollectionId, LocalizedCollectionCopy>> = {
  "pt-BR": {
    "japan-motion": { title: "Japão em movimento", eyebrow: "4 histórias · Japão", description: "Como gesto, repetição e movimento controlado atravessam a gravura, o teatro e o ritual cotidiano." },
    "written-nation": { title: "Uma nação escrita", eyebrow: "3 histórias · Língua", description: "Obras que deram voz, um sistema visual e uma memória pública a identidades compartilhadas." },
    "objects-speak": { title: "Objetos que falam", eyebrow: "5 histórias · Cultura material", description: "Objetos cotidianos que preservam crenças, costumes e a inteligência de design de seus criadores." },
  },
  it: {
    "japan-motion": { title: "Giappone in movimento", eyebrow: "4 storie · Giappone", description: "Come il gesto, la ripetizione e il movimento controllato attraversano la stampa, il teatro e il rito quotidiano." },
    "written-nation": { title: "Una nazione scritta", eyebrow: "3 storie · Lingua", description: "Opere che hanno dato alle identità condivise una voce, un sistema visivo e una memoria pubblica." },
    "objects-speak": { title: "Oggetti che parlano", eyebrow: "5 storie · Cultura materiale", description: "Oggetti quotidiani che conservano credenze, consuetudini e l'intelligenza progettuale dei loro creatori." },
  },
  es: {
    "japan-motion": { title: "Japón en movimiento", eyebrow: "4 historias · Japón", description: "Cómo el gesto, la repetición y el movimiento controlado recorren el grabado, el teatro y el ritual cotidiano." },
    "written-nation": { title: "Una nación escrita", eyebrow: "3 historias · Lengua", description: "Obras que dieron a identidades compartidas una voz, un sistema visual y una memoria pública." },
    "objects-speak": { title: "Objetos que hablan", eyebrow: "5 historias · Cultura material", description: "Objetos cotidianos que conservan creencias, costumbres y la inteligencia de diseño de sus creadores." },
  },
};

const FORM_LABELS: Record<Locale, Record<FormId, string>> = {
  en: { Sculpture: "Sculpture", Music: "Music", Architecture: "Architecture", Literature: "Literature", Drawing: "Drawing", Print: "Print", Performance: "Theater", Object: "Object", Photography: "Photography", Film: "Film", Painting: "Painting" },
  "pt-BR": { Sculpture: "Escultura", Music: "Música", Architecture: "Arquitetura", Literature: "Literatura", Drawing: "Desenho", Print: "Gravura", Performance: "Teatro", Object: "Objeto", Photography: "Fotografia", Film: "Cinema", Painting: "Pintura" },
  it: { Sculpture: "Scultura", Music: "Musica", Architecture: "Architettura", Literature: "Letteratura", Drawing: "Disegno", Print: "Stampa", Performance: "Teatro", Object: "Oggetto", Photography: "Fotografia", Film: "Cinema", Painting: "Pittura" },
  es: { Sculpture: "Escultura", Music: "Música", Architecture: "Arquitectura", Literature: "Literatura", Drawing: "Dibujo", Print: "Grabado", Performance: "Teatro", Object: "Objeto", Photography: "Fotografía", Film: "Cine", Painting: "Pintura" },
};

const navItems: TabId[] = ["daily", "search", "create", "favourites", "settings"];

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === "string" && options.includes(value as T);
}

function loadPreferences(accountId: string = PRIMARY_ACCOUNT_ID): Preferences {
  try {
    const saved = JSON.parse(window.localStorage.getItem(accountKey(accountId, PREFERENCES_KEY)) ?? "{}") as Partial<Preferences>;
    return {
      locale: isOneOf(saved.locale, ["en", "pt-BR", "it", "es"] as const) ? saved.locale : DEFAULT_PREFERENCES.locale,
      theme: isOneOf(saved.theme, ["light", "dark", "system"] as const) ? saved.theme : DEFAULT_PREFERENCES.theme,
      textSize: isOneOf(saved.textSize, ["default", "large", "system"] as const) ? saved.textSize : DEFAULT_PREFERENCES.textSize,
      units: isOneOf(saved.units, ["metric", "imperial"] as const) ? saved.units : DEFAULT_PREFERENCES.units,
      cadence: isOneOf(saved.cadence, CADENCE_OPTIONS) ? saved.cadence : DEFAULT_PREFERENCES.cadence,
      notifications: typeof saved.notifications === "boolean" ? saved.notifications : DEFAULT_PREFERENCES.notifications,
      notificationTime: isOneOf(saved.notificationTime, ["08:00", "09:00", "18:00"] as const) ? saved.notificationTime : DEFAULT_PREFERENCES.notificationTime,
      widget: isOneOf(saved.widget, ["storyAndImage", "imageOnly"] as const) ? saved.widget : DEFAULT_PREFERENCES.widget,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function loadStoredSet<Value extends string>(key: string, validValues: readonly Value[], fallback: readonly Value[]) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? "null");
    if (!Array.isArray(saved)) return new Set(fallback);
    return new Set(saved.filter((value): value is Value => isOneOf(value, validValues)));
  } catch {
    return new Set(fallback);
  }
}

function localizePiece(piece: Piece, locale: Locale): Piece {
  const localized = locale === "en" ? piece : { ...piece, ...PIECE_TRANSLATIONS[locale][piece.id] };
  if (!piece.creatorId.startsWith("unknown-")) return localized;
  const unknown = { en: "Unknown", "pt-BR": "Desconhecido", it: "Sconosciuto", es: "Desconocido" };
  return { ...localized, creator: unknown[locale] };
}

function localizeCollection(collection: Collection, locale: Locale): Collection {
  return locale === "en" ? collection : { ...collection, ...COLLECTION_TRANSLATIONS[locale][collection.id] };
}

function getPiece(list: Piece[], id: PieceId) {
  return list.find((piece) => piece.id === id) ?? list[0];
}

function getCreator(id: CreatorId) {
  return creators.find((creator) => creator.id === id) ?? creators[0];
}

function getRelatedPieces(piece: Piece, list: Piece[], limit = 5) {
  const curatedIds = collections
    .filter((collection) => collection.pieceIds.includes(piece.id))
    .flatMap((collection) => collection.pieceIds);
  const candidateIds = [...curatedIds, ...list.map((item) => item.id)];
  const seen = new Set<PieceId>([piece.id]);
  const related: Piece[] = [];

  for (const id of candidateIds) {
    if (seen.has(id)) continue;
    const match = list.find((item) => item.id === id);
    if (!match) continue;
    seen.add(id);
    related.push(match);
    if (related.length === limit) break;
  }

  return related;
}

function formatDailyDate(index: number, locale: Locale) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - index);
  const parts = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("day")} ${part("month").replace(".", "")} ${part("year")}`.toLocaleUpperCase(locale);
}

function formatDailyHeaderDate(index: number, locale: Locale) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - index);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function formatCompactCount(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function cadenceLabel(value: CadencePreference, copy: UiCopy) {
  return copy.sheets.cadence[value];
}

function widgetLabel(value: WidgetPreference, copy: UiCopy) {
  return value === "storyAndImage" ? copy.sheets.widget.storyAndImage : copy.sheets.widget.imageOnly;
}

function isTemporaryAccountRoute() {
  const query = new URLSearchParams(window.location.search);
  return ["menu-study", "creator-motion-study", "today-search-study", "related-study", "explore-study", "edge-blur-study", "library-study"].some(key => query.has(key));
}

export default function Prototype() {
  const [accounts, setAccounts] = useState(loadPreviewAccounts);
  const [activeAccountId, setActiveAccountId] = useState(() => {
    if (isTemporaryAccountRoute()) return PRIMARY_ACCOUNT_ID;
    const linkedProfile = new URLSearchParams(window.location.search).get("profile");
    return linkedProfile && loadPreviewAccounts().some(account => account.id === linkedProfile)
      ? linkedProfile : loadActivePreviewAccountId();
  });
  const [landOnSettings, setLandOnSettings] = useState(false);
  const activeAccount = accounts.find(account => account.id === activeAccountId) ?? accounts[0];
  const temporary = isTemporaryAccountRoute();

  function switchAccount(id: string) {
    if (!accounts.some(account => account.id === id)) return;
    if (id === activeAccountId) return;
    if (!temporary) saveActivePreviewAccountId(id);
    setLandOnSettings(true);
    setActiveAccountId(id);
  }

  function addAccount(method: "email" | "apple" | "google" | "facebook", email?: string) {
    const localPart = method === "email" ? email?.trim().split("@")[0] ?? "" : "";
    const proposedName = localPart.replace(/[._-]+/g, " ").replace(/\b\p{L}/gu, letter => letter.toLocaleUpperCase()).trim();
    const account = addPreviewAccount(
      { name: proposedName.slice(0, 60) || "Preview account", email: method === "email" ? email : undefined },
      temporary ? null : undefined,
    );
    setAccounts(current => [...current, account]);
    if (!temporary) saveActivePreviewAccountId(account.id);
    setLandOnSettings(true);
    setActiveAccountId(account.id);
  }

  return <ReaderSessionProvider key={activeAccount.id} person={activeAccount} storage={accountStorage(activeAccount.id)}
    storageKey={accountKey(activeAccount.id, FOLLOWED_PEOPLE_STORAGE_KEY)} temporary={temporary}>
    <PrototypeSession key={activeAccount.id} account={activeAccount} accounts={accounts} initialTab={landOnSettings ? "settings" : undefined}
      onSwitchAccount={switchAccount} onAddAccount={addAccount} />
  </ReaderSessionProvider>;
}

function PrototypeSession({ account, accounts, initialTab, onSwitchAccount, onAddAccount }: {
  account: PreviewAccount;
  accounts: PreviewAccount[];
  initialTab?: TabId;
  onSwitchAccount: (id: string) => void;
  onAddAccount: (method: "email" | "apple" | "google" | "facebook", email?: string) => void;
}) {
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>(readWorkspaceView);
  const changeWorkspaceView = (next: WorkspaceView) => {
    const url = new URL(window.location.href);
    if (next === "app") url.searchParams.delete("view"); else url.searchParams.set("view", next);
    if (url.href !== window.location.href) window.history.pushState({}, "", url);
    setWorkspaceView(next);
  };
  useEffect(() => {
    const update = () => setWorkspaceView(readWorkspaceView());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  // Light glass is the selected menu; the other query variants remain in the comparison study.
  const [menuStudy] = useState<MenuStudyVariant>(() => {
    const variant = new URLSearchParams(window.location.search).get("menu-study");
    return variant === "solid" || variant === "outline" ? variant : "light";
  });
  const [motionStudy] = useState<CreatorMotionVariant | null>(() => {
    const variant = new URLSearchParams(window.location.search).get("creator-motion-study");
    return variant === "slide" || variant === "glide" || variant === "dissolve" ? variant : null;
  });
  const [searchStudy] = useState<TodaySearchVariant | null>(() => {
    const variant = new URLSearchParams(window.location.search).get("today-search-study");
    return variant === "inline" || variant === "focus" || variant === "sheet" ? variant : null;
  });
  const [relatedStudy] = useState<RelatedWorksVariant | null>(() => {
    const variant = new URLSearchParams(window.location.search).get("related-study");
    return variant === "gallery" || variant === "grid" || variant === "list" ? variant : null;
  });
  const [exploreStudy] = useState<ExploreStudyVariant | null>(() => {
    const variant = new URLSearchParams(window.location.search).get("explore-study");
    return variant === "gallery-first" || variant === "collections-first" || variant === "compact-browse" || variant === "editorial" || variant === "rooms" || variant === "index" || variant === "switchboard" || variant === "lenses" || variant === "stream" ? variant : null;
  });
  const [libraryStudy] = useState<LibraryStudyVariant | null>(() => {
    const variant = new URLSearchParams(window.location.search).get("library-study");
    return variant === "compact" || variant === "switcher" || variant === "overview" ? variant : null;
  });
  const [edgeStudy] = useState<ScrollEdgeVariant | null>(() => {
    const variant = new URLSearchParams(window.location.search).get("edge-blur-study");
    return variant === "off" || variant === "soft" || variant === "strong" ? variant : null;
  });
  const [edgeStudyPage] = useState<"profile" | "daily" | "search" | "settings">(() => {
    const page = new URLSearchParams(window.location.search).get("edge-blur-page");
    return page === "daily" || page === "search" || page === "settings" ? page : "profile";
  });
  const [exploreFocus, setExploreFocus] = useState<{ section: "top" | "gallery" | "collections" | "categories"; request: number }>({ section: "top", request: 0 });
  const [relatedFocusRequest, setRelatedFocusRequest] = useState(0);
  const [homeSearchOpen, setHomeSearchOpen] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [homeSearchBrowse, setHomeSearchBrowse] = useState<DiscoverBrowseState>({ query: "", filter: "artworks", form: "all", selection: "all", layout: "grid" });
  const [homeSearchOrigin, setHomeSearchOrigin] = useState<TodaySearchOrigin | null>(null);
  const homeSearchTrigger = useRef<HTMLButtonElement | null>(null);
  const restoreHomeSearchFocus = useRef(false);
  const reduceMotion = useReducedMotion() === true;
  const [profileLinkEntry] = useState(() => new URLSearchParams(window.location.search).get("profile") === account.id);
  const [activeTab, setActiveTab] = useState<TabId>(initialTab ?? (libraryStudy ? "favourites" : edgeStudy ? (edgeStudyPage === "profile" ? "settings" : edgeStudyPage) : exploreStudy ? "search" : profileLinkEntry ? "settings" : "daily"));
  useEffect(() => {
    if (initialTab !== "settings") return;
    const frame = window.requestAnimationFrame(() => document.querySelector<HTMLElement>(".settings-account-card")?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [initialTab]);
  const createExitTab = useRef<TabId>("daily");
  const createExitPending = useRef(false);
  const [createLeaving, setCreateLeaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(libraryStudy ? false : edgeStudy ? edgeStudyPage === "profile" : profileLinkEntry);
  const [accountProfile, setAccountProfile] = useState<SavedPerson | null>(null);
  const accountProfileLayer = useRef<HTMLDivElement | null>(null);
  const accountProfileReturnFocus = useRef<HTMLElement | null>(null);
  const restoreAccountProfileFocus = useRef(false);
  const [sharingProfile, setSharingProfile] = useState(false);
  const profileSharePending = useRef(false);
  const [discoverBrowse, setDiscoverBrowse] = useState<DiscoverBrowseState>({ query: "", filter: "artworks", form: "all", selection: "all", layout: "grid" });
  const [dailyIndex, setDailyIndex] = useState(0);
  const [detailId, setDetailId] = useState<PieceId | null>(null);
  const [viewerId, setViewerId] = useState<PieceId | null>(null);
  const [creatorId, setCreatorId] = useState<CreatorId | null>(motionStudy ? "jacques-louis-david" : null);
  const [creatorClosing, setCreatorClosing] = useState(false);
  const [creatorOrigin, setCreatorOrigin] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const creatorReturnFocus = useRef<HTMLElement | null>(null);
  const restoreCreatorFocus = useRef(false);
  const creatorActivationTarget = useRef<HTMLElement | null>(null);
  const [collectionId, setCollectionId] = useState<CollectionId | null>(null);
  const detailReturnFocus = useRef<HTMLElement | null>(null);
  const collectionReturnFocus = useRef<HTMLElement | null>(null);
  const navigationReturnFocus = useRef<HTMLElement | null>(null);
  const [boardsState, setBoardsState] = useState(() => libraryStudy ? createLibraryStudyState(pieces.map(piece => piece.id)) : loadBoards(
    retainedPieceIds,
    account.id === PRIMARY_ACCOUNT_ID ? DEFAULT_FAVOURITES : account.id === PREVIEW_ACCOUNT_ID ? ["chart-of-hell", "girl-pearl"] : [],
    accountStorage(account.id),
  ));
  const favourites = useMemo(() => new Set([...getSavedPieceIds(boardsState)].filter(id => activePieceIds.has(id))), [boardsState]);
  const visibleBoards = useMemo(() => boardsState.boards.map(board => ({ ...board,
    pieceIds: board.pieceIds.filter(id => activePieceIds.has(id)),
    coverPieceId: board.coverPieceId && activePieceIds.has(board.coverPieceId) ? board.coverPieceId : undefined,
  })), [boardsState]);
  const [libraryNotes, setLibraryNotes] = useState(() => loadLibraryNotes(retainedPieceIds, libraryStudy ? null : accountStorage(account.id)));
  const [savedCollections, setSavedCollections] = useState(() => libraryStudy ? new Set<CollectionId>() : loadStoredSet(accountKey(account.id, COLLECTIONS_KEY), demoCollections.map((collection) => collection.id), account.id === PRIMARY_ACCOUNT_ID ? DEFAULT_COLLECTIONS : []));
  const [preferences, setPreferences] = useState<Preferences>(() => motionStudy || exploreStudy || edgeStudy || libraryStudy
    ? { ...loadPreferences(account.id), locale: "en", theme: edgeStudy && new URLSearchParams(window.location.search).get("edge-blur-theme") === "dark" ? "dark" : "light", textSize: "default" } : loadPreferences(account.id));
  const [followedCreators, setFollowedCreators] = useState(() => libraryStudy ? new Set<CreatorId>() : loadStoredSet(accountKey(account.id, "daily-culture-followed-creators-v1"), retainedCreatorIds.filter(id => !id.startsWith("unknown-")), []));

  useEffect(() => {
    if (motionStudy || searchStudy || relatedStudy || exploreStudy || edgeStudy || libraryStudy) return;
    try { window.localStorage.setItem(accountKey(account.id, "daily-culture-followed-creators-v1"), JSON.stringify([...followedCreators])); }
    catch { /* The current session still works if browser storage is unavailable. */ }
  }, [account.id, followedCreators, motionStudy, searchStudy, relatedStudy, exploreStudy, edgeStudy, libraryStudy]);

  useEffect(() => {
    if (motionStudy || searchStudy || relatedStudy || exploreStudy || edgeStudy || libraryStudy) return;
    saveLibraryNotes(libraryNotes, accountStorage(account.id));
  }, [account.id, libraryNotes, motionStudy, searchStudy, relatedStudy, exploreStudy, edgeStudy, libraryStudy]);

  function toggleFollow(id: string) {
    if (!creators.some(creator => creator.id === id && !creator.id.startsWith("unknown-"))) return;
    setFollowedCreators(current => {
      const next = new Set(current);
      if (next.has(id as CreatorId)) next.delete(id as CreatorId); else next.add(id as CreatorId);
      return next;
    });
  }
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true);
  const [sheet, setSheet] = useState<SheetId>(null);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const contributionTriggerRef = useRef<HTMLButtonElement>(null);
  const contributionFormState = useContributionFormState();
  const keyboard = useKeyboard();
  const { bottomInset, isKeyboardVisible } = useKeyboardInsets();
  const copy = UI_COPY[preferences.locale];
  const contributionCopy = CONTRIBUTION_COPY[preferences.locale];
  const localizedPieces = useMemo(() => pieces.map((piece) => localizePiece(piece, preferences.locale)), [preferences.locale]);
  const localizedCollections = useMemo(() => collections.map((collection) => localizeCollection(collection, preferences.locale)), [preferences.locale]);
  const resolvedTheme = preferences.theme === "system" ? (systemDark ? "dark" : "light") : preferences.theme;

  useEffect(() => {
    document.title = workspaceView === "onboarding" ? `${APP_LABEL} · Onboarding` : copy.appTitle;
    document.documentElement.lang = preferences.locale;
    if (motionStudy || searchStudy || relatedStudy || exploreStudy || edgeStudy || libraryStudy) return;
    try {
      window.localStorage.setItem(accountKey(account.id, PREFERENCES_KEY), JSON.stringify(preferences));
    } catch {
      // The prototype remains usable when browser storage is unavailable.
    }
  }, [account.id, copy.appTitle, preferences, motionStudy, searchStudy, relatedStudy, exploreStudy, edgeStudy, libraryStudy, workspaceView]);

  useEffect(() => {
    if (motionStudy || searchStudy || relatedStudy || exploreStudy || edgeStudy || libraryStudy) return;
    try {
      saveBoards(boardsState, accountStorage(account.id));
    } catch {
      // Saving is best-effort in private or storage-blocked browser contexts.
    }
  }, [account.id, boardsState, motionStudy, searchStudy, relatedStudy, exploreStudy, edgeStudy, libraryStudy]);

  useEffect(() => {
    if (motionStudy || searchStudy || relatedStudy || exploreStudy || edgeStudy || libraryStudy) return;
    try {
      window.localStorage.setItem(accountKey(account.id, COLLECTIONS_KEY), JSON.stringify([...savedCollections]));
    } catch {
      // Saving is best-effort in private or storage-blocked browser contexts.
    }
  }, [account.id, savedCollections, motionStudy, searchStudy, relatedStudy, exploreStudy, edgeStudy, libraryStudy]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const updatePreference = <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const notify = (message: string) => {
    setToast(message);
    setToastVisible(true);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    // Keep the message in place while the toast fades out.
    toastTimer.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimer.current = null;
    }, 1800);
  };

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  async function shareProfile() {
    if (profileSharePending.current) return;
    profileSharePending.current = true;
    setSharingProfile(true);
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set("profile", account.id);
    try {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title: `${account.name} · ${APP_NAME}`, url: url.href });
          return;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }
      await navigator.clipboard.writeText(url.href);
      notify(copy.settings.profileLinkCopied);
    } catch {
      notify(copy.settings.profileShareFailed);
    } finally {
      profileSharePending.current = false;
      setSharingProfile(false);
    }
  }

  const toggleFavourite = (id: PieceId) => {
    const removing = favourites.has(id);
    setBoardsState((current) => setPieceSaved(current, id, !removing));
    notify(removing ? copy.toasts.favouriteRemoved : copy.toasts.favouriteSaved);
  };

  const togglePieceBoard = (id: PieceId, boardId: string, selected: boolean) => {
    setBoardsState((current) => setPieceInBoard(current, id, boardId, selected));
  };

  const createPieceBoard = (id: PieceId, name: string, options?: BoardOptions<PieceId>) => {
    setBoardsState((current) => {
      const created = createBoard(current, name, options);
      return setPieceInBoard(created.state, id, created.boardId, true);
    });
  };

  const createLibraryFolder = (name: string, options?: BoardOptions<PieceId>) => {
    const created = createBoard(boardsState, name, options);
    setBoardsState(created.state);
    return created.boardId;
  };

  const toggleCollection = (id: CollectionId) => {
    const removing = savedCollections.has(id);
    setSavedCollections((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    notify(removing ? copy.toasts.collectionRemoved : copy.toasts.collectionSaved);
  };

  function openHomeSearch() {
    const trigger = document.querySelector<HTMLButtonElement>('.daily-slide[data-active="true"] .today-search');
    const screen = trigger?.closest<HTMLElement>("[data-phone-screen]");
    if (trigger && screen) {
      const bounds = trigger.getBoundingClientRect();
      const screenBounds = screen.getBoundingClientRect();
      const scale = screenBounds.width / screen.offsetWidth;
      setHomeSearchOrigin({ left: (bounds.left - screenBounds.left) / scale, top: (bounds.top - screenBounds.top) / scale, width: bounds.width / scale, screenWidth: screen.offsetWidth });
      homeSearchTrigger.current = trigger;
    }
    keyboard.hide();
    setHomeSearchOpen(true);
  }

  function closeHomeSearch() {
    keyboard.hide();
    restoreHomeSearchFocus.current = true;
    setHomeSearchOpen(false);
  }

  useEffect(() => {
    if (homeSearchOpen || !restoreHomeSearchFocus.current) return;
    let frame: number;
    function finishClosing() {
      const trigger = homeSearchTrigger.current;
      if (!trigger?.isConnected) { restoreHomeSearchFocus.current = false; return; }
      // Wait for the dialog focus trap to leave, including immediate reduced-motion exits.
      if (document.querySelector(".today-home-search, .today-home-search-sheet") || getComputedStyle(trigger).visibility !== "visible" || trigger.closest("[inert]")) {
        frame = requestAnimationFrame(finishClosing);
        return;
      }
      restoreHomeSearchFocus.current = false;
      setHomeSearchQuery("");
      setHomeSearchBrowse({ query: "", filter: "artworks", form: "all", selection: "all", layout: "grid" });
      trigger.focus({ preventScroll: true });
    }
    frame = requestAnimationFrame(finishClosing);
    return () => cancelAnimationFrame(frame);
  }, [homeSearchOpen]);

  useEffect(() => {
    if (!searchStudy) return;
    const onCommand = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "daily-culture-today-search-command") return;
      if (event.data.variant && event.data.variant !== searchStudy) return;
      if (event.data.action === "open") openHomeSearch();
      else if (event.data.action === "close") { setDetailId(null); setCreatorId(null); closeHomeSearch(); }
    };
    window.addEventListener("message", onCommand);
    return () => window.removeEventListener("message", onCommand);
  }, [searchStudy, keyboard]);

  useEffect(() => {
    if (!relatedStudy) return;
    let frame = 0;
    let cancelled = false;
    // Wait for type metrics and the retained Daily page's measured height.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const section = document.querySelector<HTMLElement>('.daily-slide[data-active="true"] .today-more');
          const scroll = section?.closest<HTMLElement>(".mobile-scroll");
          if (!section || !scroll) return;
          const bounds = scroll.getBoundingClientRect();
          const scale = bounds.width / scroll.clientWidth;
          // Leave some of the creator card visible so the section gap can be reviewed.
          scroll.scrollTop += (section.getBoundingClientRect().top - bounds.top) / scale - 200;
        });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [relatedStudy, relatedFocusRequest]);

  useEffect(() => {
    if (!relatedStudy) return;
    const onCommand = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "daily-culture-related-study-command") return;
      if (event.data.variant && event.data.variant !== relatedStudy) return;
      if (event.data.action === "reset") { window.location.reload(); return; }
      if (event.data.action !== "focus") return;
      keyboard.hide();
      setHomeSearchOpen(false);
      setDetailId(null);
      setCreatorId(null);
      setCreatorClosing(false);
      setCollectionId(null);
      setViewerId(null);
      setSheet(null);
      setActiveTab("daily");
      setRelatedFocusRequest(value => value + 1);
    };
    window.addEventListener("message", onCommand);
    return () => window.removeEventListener("message", onCommand);
  }, [relatedStudy, keyboard]);

  useEffect(() => {
    if (!exploreStudy) return;
    const onCommand = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "daily-culture-explore-study-command" || event.data.variant !== exploreStudy) return;
      if (event.data.action === "reset") { window.location.reload(); return; }
      if (event.data.action === "theme") {
        if (event.data.theme === "light" || event.data.theme === "dark") setPreferences(current => ({ ...current, theme: event.data.theme }));
        return;
      }
      const section = event.data.action;
      if (section !== "top" && section !== "gallery" && section !== "collections" && section !== "categories") return;
      keyboard.hide();
      setHomeSearchOpen(false);
      setDetailId(null);
      setCreatorId(null);
      setCreatorClosing(false);
      setCollectionId(null);
      setViewerId(null);
      setSheet(null);
      setProfileOpen(false);
      setAccountProfile(null);
      setActiveTab("search");
      setDiscoverBrowse({ query: "", filter: "artworks", form: "all", selection: "all", layout: "grid" });
      setExploreFocus(current => ({ section, request: current.request + 1 }));
    };
    window.addEventListener("message", onCommand);
    return () => window.removeEventListener("message", onCommand);
  }, [exploreStudy, keyboard]);

  useEffect(() => {
    if (!exploreStudy) return;
    let frame = 0;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        const page = document.querySelector<HTMLElement>(".discover-page");
        const scroll = page?.closest<HTMLElement>(".mobile-scroll");
        if (!page || !scroll) return;
        if (exploreFocus.section === "top") { scroll.scrollTop = 0; return; }
        const section = page.querySelector<HTMLElement>(exploreFocus.section === "collections" ? ".discover-featured" : `.discover-${exploreFocus.section}`);
        if (!section) return;
        const bounds = scroll.getBoundingClientRect();
        const scale = bounds.width / scroll.clientWidth;
        scroll.scrollTop += (section.getBoundingClientRect().top - bounds.top) / scale - 64;
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [exploreStudy, exploreFocus]);

  useEffect(() => {
    if (!edgeStudy) return;
    const onCommand = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent
        || event.data?.type !== "taste-edge-blur-command" || event.data.variant !== edgeStudy) return;
      if (event.data.action === "theme") {
        const theme = event.data.theme;
        if (theme === "light" || theme === "dark") setPreferences(current => ({ ...current, theme }));
        return;
      }
      const page = event.data.page;
      if (event.data.action !== "page" || !["profile", "daily", "search", "settings"].includes(page)) return;
      keyboard.hide();
      setHomeSearchOpen(false);
      setDetailId(null);
      setCreatorId(null);
      setCreatorClosing(false);
      setCollectionId(null);
      setViewerId(null);
      setSheet(null);
      setAccountProfile(null);
      setProfileOpen(page === "profile");
      setActiveTab(page === "profile" ? "settings" : page);
    };
    window.addEventListener("message", onCommand);
    return () => window.removeEventListener("message", onCommand);
  }, [edgeStudy, keyboard]);

  const navigateTab = (id: TabId) => {
    if (id === "create" && activeTab !== "create") {
      createExitTab.current = activeTab;
      createExitPending.current = false;
      setCreateLeaving(false);
    }
    keyboard.hide();
    setHomeSearchOpen(false);
    setHomeSearchQuery("");
    setProfileOpen(false);
    setAccountProfile(null);
    setDetailId(null);
    setCreatorId(null);
    setCreatorClosing(false);
    setCollectionId(null);
    setActiveTab(id);
  };

  const exitCreate = () => {
    if (createExitPending.current) return;
    createExitPending.current = true;
    setCreateLeaving(true);
    navigateTab(createExitTab.current);
  };

  const closeProfile = () => {
    setProfileOpen(false);
    window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".settings-view-profile")?.focus({ preventScroll: true }));
  };

  const openAccountProfile = (id: string) => {
    const person = getSearchAccounts("").find(item => item.id === id);
    if (!person || person.isCurrentUser) return;
    accountProfileReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    keyboard.hide();
    setAccountProfile(person);
  };

  const closeAccountProfile = () => {
    restoreAccountProfileFocus.current = true;
    setAccountProfile(null);
  };

  useLayoutEffect(() => {
    if (accountProfile) {
      accountProfileLayer.current?.querySelector<HTMLButtonElement>(".taste-profile-nav button")?.focus({ preventScroll: true });
      return;
    }
    if (!restoreAccountProfileFocus.current) return;
    restoreAccountProfileFocus.current = false;
    const target = accountProfileReturnFocus.current;
    if (target?.isConnected) target.focus({ preventScroll: true });
    else document.querySelector<HTMLButtonElement>('.profile-retained-page .taste-profile-stats [aria-selected="true"]')?.focus({ preventScroll: true });
  }, [accountProfile]);

  useEffect(() => {
    if (!accountProfile) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      event.stopPropagation();
      closeAccountProfile();
    };
    document.addEventListener("keydown", onEscape, true);
    return () => document.removeEventListener("keydown", onEscape, true);
  }, [accountProfile]);

  const openPiece = (id: PieceId) => {
    detailReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    keyboard.hide();
    setCreatorId(null);
    setCreatorClosing(false);
    setDetailId(id);
  };

  const openImage = (id: PieceId) => {
    keyboard.hide();
    setViewerId(id);
  };

  const openCreator = (id: CreatorId) => {
    const trigger = creatorActivationTarget.current
      ?? (document.activeElement instanceof HTMLElement && document.activeElement.closest(".app-page-surface")
        ? document.activeElement : null);
    keyboard.hide();
    creatorReturnFocus.current = trigger;
    const bounds = trigger?.getBoundingClientRect();
    setCreatorOrigin(bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height } : null);
    setCreatorClosing(false);
    setCreatorId(id);
  };

  const openCollection = (id: CollectionId) => {
    collectionReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    keyboard.hide();
    setDetailId(null);
    setCreatorId(null);
    setCreatorClosing(false);
    setCollectionId(id);
  };

  const closeDetail = () => {
    keyboard.hide();
    navigationReturnFocus.current = detailId ? detailReturnFocus.current : collectionReturnFocus.current;
    if (detailId) setDetailId(null);
    else setCollectionId(null);
    setCreatorId(null);
    setCreatorClosing(false);
  };

  useLayoutEffect(() => {
    const target = navigationReturnFocus.current;
    if (!target) return;
    navigationReturnFocus.current = null;
    if (target.isConnected && !target.closest("[inert]") && getComputedStyle(target).visibility === "visible") {
      target.focus({ preventScroll: true });
    } else if (activeTab === "favourites") {
      document.querySelector<HTMLButtonElement>('.library-retained-page .favourites-tabs [aria-selected="true"]')?.focus({ preventScroll: true });
    } else if (activeTab === "settings" && profileOpen) {
      document.querySelector<HTMLButtonElement>('.profile-retained-page .taste-profile-stats [aria-selected="true"]')?.focus({ preventScroll: true });
    }
  }, [detailId, collectionId, activeTab, profileOpen]);

  useEffect(() => {
    if ((!detailId && !collectionId) || creatorId || viewerId || sheet) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || document.querySelector('[role="dialog"], .today-save-popover')) return;
      event.preventDefault();
      closeDetail();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [detailId, collectionId, creatorId, viewerId, sheet, keyboard]);

  useEffect(() => {
    if (!profileOpen || detailId || creatorId || viewerId || sheet) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      closeProfile();
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [profileOpen, detailId, creatorId, viewerId, sheet]);

  const closeCreator = () => {
    keyboard.hide();
    const trigger = creatorReturnFocus.current;
    const bounds = trigger?.isConnected ? trigger.getBoundingClientRect() : null;
    setCreatorOrigin(bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height } : null);
    setCreatorClosing(true);
  };

  const finishClosingCreator = () => {
    restoreCreatorFocus.current = true;
    setCreatorId(null);
    setCreatorClosing(false);
  };

  // Restore after React removes inert; reduced-motion completion can precede that commit.
  useLayoutEffect(() => {
    if (creatorId !== null || !restoreCreatorFocus.current) return;
    restoreCreatorFocus.current = false;
    const trigger = creatorReturnFocus.current;
    const target = trigger?.isConnected ? trigger : document.querySelector<HTMLElement>('.app-page-surface [role="tab"][aria-selected="true"], .app-page-surface .bottom-nav [aria-current="page"]');
    if (target && !target.closest("[inert]")) target.focus({ preventScroll: true });
  }, [creatorId]);

  // Comparison controls only affect an explicitly opened, same-origin study frame.
  useEffect(() => {
    if (!motionStudy || window.parent === window) return;
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent
        || event.data?.type !== "daily-culture-motion-study") return;
      if (event.data.action === "open" && !creatorId) {
        creatorActivationTarget.current = document.querySelector<HTMLElement>('.app-page-surface .today-creator button');
        openCreator("jacques-louis-david");
      } else if (event.data.action === "close" && creatorId && !creatorClosing) closeCreator();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [motionStudy, creatorId, creatorClosing, keyboard]);

  useEffect(() => {
    if (!motionStudy || window.parent === window) return;
    window.parent.postMessage({ type: "daily-culture-motion-study-state", variant: motionStudy,
      phase: creatorId ? (creatorClosing ? "closing" : "open") : "closed" }, window.location.origin);
  }, [motionStudy, creatorId, creatorClosing]);

  const creatorMotion = motionStudy ?? "slide";
  const creatorCovered = creatorId && !creatorClosing;
  const creatorReturning = creatorId && creatorClosing && !reduceMotion;
  const parentMotion = {
    x: creatorCovered && creatorMotion === "slide" && !reduceMotion ? "-6%" : "0%",
    opacity: creatorCovered && creatorMotion !== "slide" && !reduceMotion ? 0 : 1,
    transition: {
      duration: reduceMotion || !creatorId ? 0
        : creatorMotion === "slide" ? .32 : creatorReturning && creatorMotion === "glide" ? .16 : .08,
      delay: creatorReturning && creatorMotion !== "slide" ? (creatorMotion === "glide" ? .06 : .08) : 0,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };

  const viewerPiece = getPiece(localizedPieces, viewerId ?? localizedPieces[0].id);
  const showingDetail = detailId !== null || collectionId !== null;
  const showBottomNavigation = !showingDetail && !homeSearchOpen && !profileOpen && activeTab !== "create";

  const dailyScreen = (
    <RelatedWorksVariantContext.Provider value={relatedStudy ?? "gallery"}>
      <DailyPager
        pieces={localizedPieces}
        initialIndex={dailyIndex}
        favourites={favourites}
        locale={preferences.locale}
        copy={copy}
        contributionCopy={contributionCopy.banner}
        contributionTriggerRef={contributionTriggerRef}
        onIndexChange={setDailyIndex}
        onViewImage={openImage}
        onOpenPiece={openPiece}
        onOpenCreator={openCreator}
        onFavourite={toggleFavourite}
        boards={visibleBoards}
        onToggleBoard={togglePieceBoard}
        onCreateBoard={createPieceBoard}
        onSearch={openHomeSearch}
        onShare={() => notify(copy.toasts.shareCopied)}
        onContribute={() => setSheet("contribution")}
      />
    </RelatedWorksVariantContext.Provider>
    );

  const backgroundTab = activeTab === "create" ? createExitTab.current : activeTab;
  const discoverScreen = backgroundTab === "search" ? <DiscoverScreen variant={exploreStudy} pieces={localizedPieces} collections={localizedCollections} locale={preferences.locale} copy={copy} browse={discoverBrowse} onBrowse={setDiscoverBrowse} onOpenPiece={openPiece} onOpenCollection={openCollection} onOpenCreator={openCreator} onOpenProfile={openAccountProfile} /> : null;
  const libraryScreen = backgroundTab === "favourites" ? <LibraryScreen variant={libraryStudy} pieces={localizedPieces} locale={preferences.locale} favourites={favourites} boards={visibleBoards} onOpenPiece={openPiece} onCreateFolder={createLibraryFolder} galleryCopy={galleryControlCopy(preferences.locale, copy.favourites.tabs.pieces)} /> : null;
  const profileScreen = backgroundTab === "settings" && profileOpen ? <ProfileScreen locale={preferences.locale} person={account} artworks={localizedPieces} savedIds={[...favourites]} folders={visibleBoards} followers={[]} onBack={closeProfile} onOpenArtwork={openPiece} onShareProfile={shareProfile} sharingProfile={sharingProfile} shareLabel={copy.settings.shareProfile} onOpenProfile={openAccountProfile} /> : null;
  const activeCollection = collectionId ? localizedCollections.find(item => item.id === collectionId) ?? localizedCollections[0] : null;
  const collectionScreen = activeCollection ? <CollectionDetail
    key={activeCollection.id}
    collection={activeCollection} pieces={localizedPieces}
    isSaved={savedCollections.has(activeCollection.id)} onClose={closeDetail} onOpenPiece={openPiece}
    onSave={() => toggleCollection(activeCollection.id)} onShare={() => notify(copy.toasts.collectionLinkCopied)}
    locale={preferences.locale} copy={copy}
  /> : null;

  let screen: ReactNode;
  if (detailId) {
    screen = (
      <PieceDetail
        key={detailId}
        piece={getPiece(localizedPieces, detailId)}
        isFavourite={favourites.has(detailId)}
        onClose={closeDetail}
        onFavourite={() => toggleFavourite(detailId)}
        boards={visibleBoards}
        selectedBoardIds={boardsState.boards.filter(board => board.pieceIds.includes(detailId)).map(board => board.id)}
        onToggleBoard={(boardId, selected) => togglePieceBoard(detailId, boardId, selected)}
        onCreateBoard={(name, options) => createPieceBoard(detailId, name, options)}
        onViewImage={() => openImage(detailId)}
        allowEdit={activeTab === "favourites" || (activeTab === "settings" && profileOpen)}
        personalNote={libraryNotes[detailId] ?? ""}
        onSaveNote={note => setLibraryNotes(current => setLibraryNote(current, detailId, note))}
        locale={preferences.locale}
        copy={copy}
        onOpenCreator={openCreator}
      />
    );
  } else if (collectionId) {
    screen = null;
  } else if (backgroundTab === "daily") {
    screen = null;
  } else if (backgroundTab === "search") {
    screen = null;
  } else if (backgroundTab === "favourites") {
    screen = null;
  } else if (backgroundTab === "settings" && profileOpen) {
    screen = null;
  } else {
    screen = (
      <SettingsScreen
        preferences={preferences}
        favouritesCount={favourites.size}
        folderCount={boardsState.boards.length}
        currentReader={account}
        copy={copy}
        onPreference={updatePreference}
        onOpenSheet={setSheet}
        onViewProfile={() => setProfileOpen(true)}
        onShareProfile={shareProfile}
        sharingProfile={sharingProfile}
        onRate={() => notify(copy.toasts.ratePrototype)}
      />
    );
  }

  if (workspaceView === "onboarding" && !motionStudy && !searchStudy && !relatedStudy && !exploreStudy && !edgeStudy && !libraryStudy) {
    const onboardingCategories = DISCOVER_ART_CATEGORIES.map(item => ({
      id: item.id,
      label: ART_CATEGORY_COPY[preferences.locale].names[item.id],
      image: item.image,
    }));
    const completeOnboarding = (reminder: OnboardingReminderTime | "off", interests: readonly string[]) => {
      setPreferences(current => ({
        ...current,
        notifications: reminder !== "off",
        notificationTime: reminder === "off" ? current.notificationTime : reminder,
      }));
      try { window.localStorage.setItem(accountKey(account.id, "taste.onboarding.interests.v1"), JSON.stringify(interests)); }
      catch { /* The flow still works for this session when storage is unavailable. */ }
    };
    return <div className="daily-culture-app" data-theme={resolvedTheme} lang={preferences.locale}>
      <DesignSystemLauncher view={workspaceView} onViewChange={changeWorkspaceView} />
      <OnboardingFlow locale={preferences.locale} categories={onboardingCategories} onComplete={completeOnboarding} onOpenPrototype={() => changeWorkspaceView("app")} />
    </div>;
  }

  return (
    <div className="daily-culture-app" data-theme={resolvedTheme} data-theme-preference={preferences.theme} data-text-size={preferences.textSize} data-tab={activeTab} data-menu-study={menuStudy} data-home-search-open={homeSearchOpen} data-related-study={relatedStudy ?? undefined} data-edge-blur-study={edgeStudy ?? undefined} data-library-study={libraryStudy ?? undefined} lang={preferences.locale}>
      {!motionStudy && !searchStudy && !relatedStudy && !exploreStudy && !edgeStudy && !libraryStudy && <DesignSystemLauncher view={workspaceView} onViewChange={changeWorkspaceView} />}
      <ArtworkInformationContext.Provider value={{ locale: preferences.locale, units: preferences.units, followedCreators, toggleFollow }}>
      <motion.div className="app-page-surface" initial={false} animate={parentMotion}
        inert={creatorId !== null || accountProfile !== null || sheet === "switchAccounts"} aria-hidden={creatorId !== null || accountProfile !== null || sheet === "switchAccounts" ? true : undefined}
        onClickCapture={event => {
          creatorActivationTarget.current = event.target instanceof Element ? event.target.closest<HTMLElement>("button, a") : null;
        }}>
      <div className="app-tab-content" inert={activeTab === "create" || createLeaving} aria-hidden={activeTab === "create" || createLeaving || undefined}>
      {backgroundTab === "daily" && <div className="today-retained-page" data-covered={showingDetail} aria-hidden={showingDetail || homeSearchOpen} inert={showingDetail || homeSearchOpen}>{dailyScreen}</div>}
      {discoverScreen && <div className="discover-retained-page" data-covered={showingDetail} aria-hidden={showingDetail} inert={showingDetail}>{discoverScreen}</div>}
      {libraryScreen && <div className="library-retained-page" data-covered={showingDetail} aria-hidden={showingDetail} inert={showingDetail}>{libraryScreen}</div>}
      {profileScreen && <div className="library-retained-page profile-retained-page" data-covered={showingDetail} aria-hidden={showingDetail} inert={showingDetail}>{profileScreen}</div>}
      {collectionScreen && <div className="collection-retained-page" data-covered={detailId !== null} aria-hidden={detailId !== null} inert={detailId !== null}>{collectionScreen}</div>}
      {screen}
      {showBottomNavigation ? (
        <nav
          className="bottom-nav"
          aria-label={copy.aria.mainNavigation}
          data-keyboard-open={isKeyboardVisible}
          style={{ bottom: isKeyboardVisible ? 12 : bottomInset + 12 }}
        >
          <span className="bottom-nav-selection" aria-hidden="true" style={{ transform: `translateX(${navItems.indexOf(activeTab) * 100}%)` }} />
          {navItems.map((id) => (
            <button
              key={id}
              type="button"
              className="bottom-nav-item"
              data-active={activeTab === id}
              onClick={() => navigateTab(id)}
              aria-current={activeTab === id ? "page" : undefined}
              aria-label={copy.nav[id]}
            >
              <NavigationIcon name={id} active={activeTab === id} />
            </button>
          ))}
        </nav>
      ) : null}
      </div>
      <AnimatePresence initial={false} onExitComplete={() => {
        if (!createExitPending.current) return;
        createExitPending.current = false;
        setCreateLeaving(false);
        window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.bottom-nav-item[data-active="true"]')?.focus({ preventScroll: true }));
      }}>
        {activeTab === "create" ? <CreateFlowLayer key="create" reducedMotion={reduceMotion}>
          <CreateArtworkFlow locale={preferences.locale} accountId={account.id}
            temporary={Boolean(motionStudy || searchStudy || relatedStudy || exploreStudy || edgeStudy || libraryStudy || new URLSearchParams(window.location.search).has("menu-study"))}
            onExit={exitCreate} />
        </CreateFlowLayer> : null}
      </AnimatePresence>
      </motion.div>
      {accountProfile && <div ref={accountProfileLayer} className="taste-account-profile-layer">
        <ProfileScreen key={accountProfile.id} person={accountProfile} idPrefix="account-profile" locale={preferences.locale}
          artworks={[]} savedIds={[]} folders={[]} followingPeople={[]} followers={[]}
          onBack={closeAccountProfile} onOpenArtwork={openPiece} />
      </div>}
      <TodaySearch open={Boolean(searchStudy && homeSearchOpen && !showingDetail && !creatorId)} variant={searchStudy ?? "inline"}
        origin={homeSearchOrigin} locale={preferences.locale} query={homeSearchQuery} onQuery={setHomeSearchQuery}
        onClose={closeHomeSearch} onOpenPiece={id => openPiece(id as PieceId)}
        items={localizedPieces.map(piece => ({ ...piece, searchText: [piece.title, piece.creator, piece.place, FORM_LABELS[preferences.locale][piece.form], PIECE_CONTEXT[piece.id][preferences.locale], piece.kicker, ...piece.story].join(" ") }))} />
      {homeSearchOpen && !searchStudy && <HomeSearchSurface covered={showingDetail || creatorId !== null || accountProfile !== null}
        label={copy.search.title} onClose={closeHomeSearch}>
        <DiscoverScreen variant={null} pieces={localizedPieces} collections={localizedCollections} locale={preferences.locale} copy={copy}
          browse={homeSearchBrowse} onBrowse={setHomeSearchBrowse} homeSearch={{ origin: homeSearchOrigin, onClose: closeHomeSearch, onActivate: target => { creatorActivationTarget.current = target; } }}
          onOpenPiece={openPiece} onOpenCollection={openCollection} onOpenCreator={openCreator} onOpenProfile={openAccountProfile} />
      </HomeSearchSurface>}
      {creatorId ? <CreatorPageTransition
        key={creatorId}
        variant={creatorMotion}
        closing={creatorClosing}
        origin={creatorOrigin}
        onRequestClose={closeCreator}
        onCloseComplete={finishClosingCreator}
      >
        <CreatorDetail
          creator={getCreator(creatorId)}
          pieces={localizedPieces}
          locale={preferences.locale}
          copy={copy}
          onClose={closeCreator}
          onOpenPiece={openPiece}
          favourites={favourites}
        />
      </CreatorPageTransition> : null}
      </ArtworkInformationContext.Provider>
      <ArtworkViewer
        open={viewerId !== null}
        onClose={() => setViewerId(null)}
        image={viewerPiece.viewerImage ?? viewerPiece.image}
        initialFocus={viewerPiece.viewerFocus}
        year={viewerPiece.year}
        title={viewerPiece.title}
        creator={viewerPiece.creator}
        downloadName={`${viewerId ?? localizedPieces[0].id}-image.jpg`}
        locale={preferences.locale}
      />

      <ScrollEdgeBlur variant={edgeStudy ?? "strong"} edges={edgeStudy ? "both" : "bottom"} studyControls={edgeStudy !== null}
        disabled={!showBottomNavigation || isKeyboardVisible || sheet !== null || viewerId !== null
          || creatorId !== null || accountProfile !== null || createLeaving} />

      <div className="toast" data-visible={toastVisible} aria-hidden="true">
        {toast}
      </div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{toastVisible ? toast : ""}</div>

      <SwitchAccountsFlow open={sheet === "switchAccounts"} locale={preferences.locale} accounts={accounts} activeAccountId={account.id}
        onClose={() => setSheet(null)} onSelectAccount={id => { setSheet(null); onSwitchAccount(id); }}
        onAddAccount={(method, email) => { setSheet(null); onAddAccount(method, email); }} />

      <BottomSheet open={sheet === "language"} onOpenChange={(open) => setSheet(open ? "language" : null)} title={copy.sheets.language.title}>
        <SheetOptions
          ariaLabel={copy.sheets.language.title}
          options={LOCALE_OPTIONS}
          selected={preferences.locale}
          onSelect={(value) => updatePreference("locale", value)}
          onCommit={() => setSheet(null)}
        />
      </BottomSheet>

      <BottomSheet open={sheet === "cadence"} onOpenChange={(open) => setSheet(open ? "cadence" : null)} title={copy.sheets.cadence.title} description={copy.sheets.cadence.description}>
        <SheetOptions
          ariaLabel={copy.sheets.cadence.title}
          options={CADENCE_OPTIONS.map((value) => ({ value, label: cadenceLabel(value, copy) }))}
          selected={preferences.cadence}
          onSelect={(value) => updatePreference("cadence", value)}
          onCommit={() => setSheet(null)}
        />
      </BottomSheet>

      <BottomSheet open={sheet === "notifications"} onOpenChange={(open) => setSheet(open ? "notifications" : null)} title={copy.sheets.notifications.title} snap={0.5}>
        <div className="preference-sheet">
          <div className="sheet-toggle-row">
            <strong>{copy.sheets.notifications.enabled}</strong>
            <Switch ariaLabel={copy.sheets.notifications.enabled} checked={preferences.notifications} onChange={() => updatePreference("notifications", !preferences.notifications)} />
          </div>
          <span className="sheet-section-label">{copy.sheets.notifications.time}</span>
          <SegmentedControl
            label={copy.sheets.notifications.time}
            value={preferences.notificationTime}
            options={(["08:00", "09:00", "18:00"] as const).map((value) => ({ value, label: value }))}
            onChange={(value) => updatePreference("notificationTime", value)}
          />
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "widget"} onOpenChange={(open) => setSheet(open ? "widget" : null)} title={copy.sheets.widget.title} description={copy.sheets.widget.description} snap={0.64}>
        <div className="preference-sheet widget-sheet">
          <span className="sheet-section-label">{copy.sheets.widget.preview}</span>
          <div className="widget-preview" data-widget-style={preferences.widget}>
            <img src={localizedPieces[0].image} alt="" />
            <span className="widget-preview-shade" />
            <span className="widget-preview-date">{formatDailyDate(0, preferences.locale)}</span>
            {preferences.widget === "storyAndImage" ? <strong>{localizedPieces[0].title}</strong> : null}
          </div>
          <SheetOptions
            ariaLabel={copy.sheets.widget.title}
            options={[
              { value: "storyAndImage", label: copy.sheets.widget.storyAndImage },
              { value: "imageOnly", label: copy.sheets.widget.imageOnly },
            ] as const}
            selected={preferences.widget}
            onSelect={(value) => updatePreference("widget", value)}
          />
          <p className="prototype-note">{copy.sheets.widget.prototypeNote}</p>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "legal"} onOpenChange={(open) => setSheet(open ? "legal" : null)} title={copy.sheets.legal.title} description={copy.sheets.legal.description} snap={0.42}>
        <div className="about-sheet-copy"><p>{copy.sheets.legal.body}</p></div>
      </BottomSheet>

      <BottomSheet open={sheet === "about"} onOpenChange={(open) => setSheet(open ? "about" : null)} title={copy.sheets.about.title} description={copy.sheets.about.description} snap={0.46}>
        <div className="about-sheet-copy">
          <p>{copy.sheets.about.paragraphOne}</p>
          <p>{copy.sheets.about.paragraphTwo}</p>
          <p className="settings-version">{copy.sheets.about.version}</p>
        </div>
      </BottomSheet>

      <BottomSheet
        open={sheet === "contribution"}
        onOpenChange={(open) => {
          keyboard.hide();
          setSheet(open ? "contribution" : null);
          if (!open) window.requestAnimationFrame(() => contributionTriggerRef.current?.focus());
        }}
        title={contributionCopy.form.title}
        description={contributionCopy.form.description}
        snap={0.9}
      >
        <ContributionForm copy={contributionCopy.form} state={contributionFormState} />
      </BottomSheet>
    </div>
  );
}

function DailyPager({ pieces: dailyPieces, initialIndex, favourites, boards, locale, copy, contributionCopy, contributionTriggerRef, onIndexChange, onViewImage, onOpenPiece, onOpenCreator, onFavourite, onToggleBoard, onCreateBoard, onSearch, onShare, onContribute }: { pieces: Piece[]; initialIndex: number; favourites: Set<PieceId>; boards: SavedBoard<PieceId>[]; locale: Locale; copy: UiCopy; contributionCopy: ContributionCopy["banner"]; contributionTriggerRef: RefObject<HTMLButtonElement | null>; onIndexChange: (index: number) => void; onViewImage: (id: PieceId) => void; onOpenPiece: (id: PieceId) => void; onOpenCreator: (id: CreatorId) => void; onFavourite: (id: PieceId) => void; onToggleBoard: (id: PieceId, boardId: string, selected: boolean) => void; onCreateBoard: (id: PieceId, name: string, options?: BoardOptions<PieceId>) => void; onSearch: () => void; onShare: () => void; onContribute: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() === true;
  const shuffleFrame = useRef(0);
  const shuffleAnimation = useRef<Animation | null>(null);
  useEffect(() => () => {
    window.cancelAnimationFrame(shuffleFrame.current);
    shuffleAnimation.current?.cancel();
  }, []);
  const dailyMotionRef = useRef<ReturnType<typeof attachDailyMotion> | null>(null);
  // A leftward drag reveals the next DOM slide. Keep older | Today | Suggestion
  // so pointer/finger movement right opens past editions and left opens Suggestion.
  const slideCount = dailyPieces.length + 1;
  const startingEditionIndex = Math.max(0, Math.min(dailyPieces.length - 1, initialIndex));
  const startingSlideIndex = dailyPieces.length - 1 - startingEditionIndex;
  const slideIndexRef = useRef(startingSlideIndex);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startingSlideIndex);
  const [activeHeight, setActiveHeight] = useState<number | null>(null);
  const contributionImage = dailyPieces.find((piece) => piece.id === "arabic-bowl")?.image ?? dailyPieces[0].image;

  const measureActiveHeight = (slideIndex: number) => {
    const slide = rootRef.current?.querySelector<HTMLElement>(`.daily-slide[data-index="${slideIndex}"]`);
    if (!slide) return;
    const nextHeight = Math.ceil(slide.scrollHeight);
    setActiveHeight((current) => current === nextHeight ? current : nextHeight);
  };

  const moveToSlide = (slideIndex: number, behavior: ScrollBehavior = "smooth") => {
    dailyMotionRef.current?.move(Math.max(0, Math.min(slideCount - 1, slideIndex)), behavior !== "smooth");
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const carousel = root?.querySelector<HTMLElement>(".daily-pager");
    const verticalScroll = root?.querySelector<HTMLElement>(".mobile-scroll");
    if (!root || !carousel || !verticalScroll) return;
    let previousWidth = carousel.clientWidth;
    const motion = attachDailyMotion(carousel, {
      count: slideCount, index: () => slideIndexRef.current, reducedMotion,
      commit: (index) => {
        const changed = index !== slideIndexRef.current;
        slideIndexRef.current = index;
        setCurrentSlideIndex(index);
        if (index < dailyPieces.length) onIndexChange(dailyPieces.length - 1 - index);
        if (changed) verticalScroll.scrollTop = 0;
        measureActiveHeight(index);
      },
    });
    dailyMotionRef.current = motion;
    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = carousel.clientWidth;
      if (Math.abs(nextWidth - previousWidth) > .25) {
        previousWidth = nextWidth;
        motion.move(slideIndexRef.current, true);
      }
      measureActiveHeight(slideIndexRef.current);
    });
    resizeObserver.observe(carousel);
    root.querySelectorAll<HTMLElement>(".daily-slide").forEach(slide => resizeObserver.observe(slide));
    carousel.scrollLeft = slideIndexRef.current * carousel.clientWidth;
    measureActiveHeight(slideIndexRef.current);
    return () => {
      motion.dispose();
      resizeObserver.disconnect();
      if (dailyMotionRef.current === motion) dailyMotionRef.current = null;
    };
  }, [dailyPieces, onIndexChange, slideCount, reducedMotion]);

  const shuffleArtwork = () => {
    // Sample only other featured editions, never the contribution invitation.
    const candidates = Array.from({ length: dailyPieces.length }, (_, index) => index)
      .filter(index => index !== slideIndexRef.current);
    if (!candidates.length) return;
    const nextSlideIndex = candidates[Math.floor(Math.random() * candidates.length)];
    window.cancelAnimationFrame(shuffleFrame.current);
    shuffleAnimation.current?.cancel();
    moveToSlide(nextSlideIndex, "instant");
    shuffleFrame.current = window.requestAnimationFrame(() => {
      const slide = rootRef.current?.querySelector<HTMLElement>(`.daily-slide[data-index="${nextSlideIndex}"]`);
      slide?.querySelector<HTMLButtonElement>(".today-shuffle")?.focus({ preventScroll: true });
      if (!reducedMotion && slide) {
        shuffleAnimation.current = slide.animate([{ opacity: .55 }, { opacity: 1 }], {
          duration: 180, easing: "cubic-bezier(.22, 1, .36, 1)",
        });
      }
    });
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    // Match the named swipe directions: Left = newer / Suggestion; Right = older.
    const direction = event.key === "ArrowLeft" ? 1 : -1;
    const nextSlideIndex = Math.max(0, Math.min(slideCount - 1, slideIndexRef.current + direction));
    if (nextSlideIndex !== slideIndexRef.current) moveToSlide(nextSlideIndex);
  };

  const activeEditionIndex = dailyPieces.length - 1 - currentSlideIndex;
  const activePiece = activeEditionIndex >= 0 ? dailyPieces[activeEditionIndex] : null;
  const activeLabel = activePiece ? `${formatDailyDate(activeEditionIndex, locale)}: ${activePiece.title}` : contributionCopy.slideAria;

  return (
    <div
      className="daily-screen"
      ref={rootRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ "--daily-count": slideCount, "--daily-active-height": activeHeight ? `${activeHeight}px` : "auto" } as CSSProperties}
    >
      <span className="sr-only" aria-live="polite">{activeLabel}</span>
      <MobileScroll className="piece-scroll daily-scroll">
        <Carousel draggingEnabled={false} className="daily-pager" contentClassName="daily-pager-track" ariaLabel={copy.aria.dailyArchive}>
          {[...dailyPieces].reverse().map((piece, slideIndex) => {
            const editionIndex = dailyPieces.length - 1 - slideIndex;
            return (
            <div
              key={piece.id}
              className="daily-slide"
              data-index={slideIndex}
              data-active={slideIndex === currentSlideIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${formatDailyDate(editionIndex, locale)}: ${piece.title}`}
              aria-hidden={slideIndex !== currentSlideIndex}
              inert={slideIndex !== currentSlideIndex}
            >
              <PieceArticle
                daily
                piece={piece}
                date={formatDailyDate(editionIndex, locale)}
                headerDate={formatDailyHeaderDate(editionIndex, locale)}
                locale={locale}
                copy={copy}
                isFavourite={favourites.has(piece.id)}
                boards={boards}
                selectedBoardIds={boards.filter(board => board.pieceIds.includes(piece.id)).map(board => board.id)}
                relatedPieces={getRelatedPieces(piece, dailyPieces)}
                onOpenPiece={onOpenPiece}
                onViewImage={() => onViewImage(piece.id)}
                onOpenCreator={() => onOpenCreator(piece.creatorId)}
                onFavourite={() => onFavourite(piece.id)}
                onToggleBoard={(boardId, selected) => onToggleBoard(piece.id, boardId, selected)}
                onCreateBoard={(name, options) => onCreateBoard(piece.id, name, options)}
                onSearch={onSearch}
                onShuffle={dailyPieces.length > 1 ? shuffleArtwork : undefined}
                onShare={onShare}
              />
            </div>
            );
          })}
          <div
            className="daily-slide"
            data-index={dailyPieces.length}
            data-active={currentSlideIndex === dailyPieces.length}
            role="group"
            aria-roledescription="slide"
            aria-label={contributionCopy.slideAria}
            aria-hidden={currentSlideIndex !== dailyPieces.length}
            inert={currentSlideIndex !== dailyPieces.length}
          >
            <ContributionBanner image={contributionImage} locale={locale} copy={contributionCopy} triggerRef={contributionTriggerRef} onContribute={onContribute} />
          </div>
        </Carousel>
      </MobileScroll>
    </div>
  );
}

function ContributionBanner({ image, locale, copy, triggerRef, onContribute }: { image: string; locale: Locale; copy: ContributionCopy["banner"]; triggerRef: RefObject<HTMLButtonElement | null>; onContribute: () => void }) {
  return (
    <section className="contribution-banner" aria-labelledby="contribution-banner-title">
      <BrandMasthead locale={locale} />
      <div className="contribution-visual" aria-hidden="true">
        <img src={image} alt="" />
        <span className="contribution-visual-shade" />
      </div>
      <div className="contribution-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="contribution-banner-title">{copy.title}</h1>
        <p className="contribution-body">{copy.body}</p>
        <button ref={triggerRef} type="button" className="contribution-cta" onClick={onContribute}>
          <span>{copy.button}</span>
          <PaperPlaneTilt size={18} weight="regular" />
        </button>
        <p className="contribution-hint"><CaretRight size={14} weight="regular" />{copy.hint}</p>
      </div>
    </section>
  );
}

type SubmissionDraft = {
  topic: string;
  context: string;
  sources: string;
  imageRights: boolean;
};

type UploadPreview = {
  id: string;
  name: string;
  url: string;
};

const EMPTY_SUBMISSION: SubmissionDraft = { topic: "", context: "", sources: "", imageRights: false };
const CONTRIBUTION_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CONTRIBUTION_IMAGE_LIMIT = 3;
const CONTRIBUTION_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

function useContributionFormState() {
  const uploadsRef = useRef<UploadPreview[]>([]);
  const [draft, setDraft] = useState<SubmissionDraft>(EMPTY_SUBMISSION);
  const [uploads, setUploads] = useState<UploadPreview[]>([]);
  const [formError, setFormError] = useState<{ message: string; field: keyof SubmissionDraft | "images" } | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => () => {
    uploadsRef.current.forEach((upload) => URL.revokeObjectURL(upload.url));
  }, []);

  return { draft, setDraft, uploads, setUploads, uploadsRef, formError, setFormError, complete, setComplete };
}

type ContributionFormState = ReturnType<typeof useContributionFormState>;

function ContributionForm({ copy, state }: { copy: ContributionCopy["form"]; state: ContributionFormState }) {
  const keyboard = useKeyboard();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const { draft, setDraft, uploads, setUploads, uploadsRef, formError, setFormError, complete, setComplete } = state;

  useEffect(() => {
    setFormError(null);
  }, [copy, setFormError]);

  useEffect(() => {
    if (complete) window.requestAnimationFrame(() => successHeadingRef.current?.focus());
  }, [complete]);

  const updateDraft = <Key extends keyof SubmissionDraft>(key: Key, value: SubmissionDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (formError?.field === key) setFormError(null);
  };

  const focusField = (field: keyof SubmissionDraft | "images") => {
    const selector = field === "images" ? ".contribution-upload-button" : `[name="${field}"]`;
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(selector)?.focus());
  };

  const fail = (message: string, field: keyof SubmissionDraft | "images") => {
    setFormError({ message, field });
    focusField(field);
  };

  const handleTextBlur = (event: ReactFocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = event.relatedTarget as HTMLElement | null;
    if (!next?.matches('input[type="text"], textarea')) keyboard.hide();
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (!files.length) return;
    if (uploadsRef.current.length + files.length > CONTRIBUTION_IMAGE_LIMIT) {
      fail(copy.imageLimitError, "images");
      return;
    }
    if (files.some((file) => !CONTRIBUTION_IMAGE_TYPES.has(file.type))) {
      fail(copy.imageTypeError, "images");
      return;
    }
    if (files.some((file) => file.size > CONTRIBUTION_IMAGE_MAX_BYTES)) {
      fail(copy.imageSizeError, "images");
      return;
    }
    const nextUploads = [
      ...uploadsRef.current,
      ...files.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}-${window.crypto.randomUUID?.() ?? Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ];
    uploadsRef.current = nextUploads;
    setUploads(nextUploads);
    setFormError(null);
  };

  const removeUpload = (id: string) => {
    const removed = uploadsRef.current.find((upload) => upload.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    const nextUploads = uploadsRef.current.filter((upload) => upload.id !== id);
    uploadsRef.current = nextUploads;
    setUploads(nextUploads);
    if (!nextUploads.length) updateDraft("imageRights", false);
  };

  const resetForm = () => {
    uploadsRef.current.forEach((upload) => URL.revokeObjectURL(upload.url));
    uploadsRef.current = [];
    setUploads([]);
    setDraft(EMPTY_SUBMISSION);
    setFormError(null);
    setComplete(false);
    window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[name="topic"]')?.focus());
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.topic.trim()) {
      fail(copy.topicRequiredError, "topic");
      return;
    }
    if (!draft.context.trim()) {
      fail(copy.contextRequiredError, "context");
      return;
    }
    if (uploads.length && !draft.imageRights) {
      fail(copy.imageRightsError, "imageRights");
      return;
    }
    keyboard.hide();
    setFormError(null);
    setComplete(true);
  };

  if (complete) {
    return (
      <div className="contribution-success" role="status">
        <CheckCircle size={36} weight="fill" aria-hidden="true" />
        <p className="eyebrow">{copy.successEyebrow}</p>
        <h3 ref={successHeadingRef} tabIndex={-1}>{copy.successTitle}</h3>
        <p>{copy.successBody}</p>
        <button type="button" className="contribution-secondary-button" onClick={resetForm}>{copy.submitAnother}</button>
      </div>
    );
  }

  const errorId = "contribution-form-error";

  return (
    <form ref={formRef} className="contribution-form" aria-label={copy.title} tabIndex={0} onSubmit={submit} noValidate>
      <div className="contribution-field">
        <label htmlFor="contribution-topic">{copy.topicLabel}<span aria-hidden="true"> *</span></label>
        <KeyboardInput id="contribution-topic" name="topic" type="text" value={draft.topic} placeholder={copy.topicPlaceholder} onChange={(event) => updateDraft("topic", event.currentTarget.value)} onBlur={handleTextBlur} required aria-invalid={formError?.field === "topic"} aria-describedby={formError?.field === "topic" ? errorId : undefined} />
      </div>
      <div className="contribution-field">
        <label htmlFor="contribution-context">{copy.contextLabel}<span aria-hidden="true"> *</span></label>
        <KeyboardTextarea id="contribution-context" name="context" value={draft.context} placeholder={copy.contextPlaceholder} onChange={(event) => updateDraft("context", event.currentTarget.value)} onBlur={handleTextBlur} required aria-invalid={formError?.field === "context"} aria-describedby={formError?.field === "context" ? errorId : undefined} rows={5} />
      </div>
      <div className="contribution-field">
        <label htmlFor="contribution-sources">{copy.sourcesLabel}</label>
        <KeyboardTextarea id="contribution-sources" name="sources" value={draft.sources} placeholder={copy.sourcesPlaceholder} onChange={(event) => updateDraft("sources", event.currentTarget.value)} onBlur={handleTextBlur} rows={3} />
      </div>
      <fieldset className="contribution-images">
        <legend>{copy.imagesLabel}</legend>
        <p>{copy.imagesHelp}</p>
        <input ref={fileInputRef} className="contribution-file-input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} tabIndex={-1} />
        <button type="button" className="contribution-upload-button" onClick={() => { keyboard.hide(); fileInputRef.current?.click(); }} aria-invalid={formError?.field === "images"} aria-describedby={formError?.field === "images" ? errorId : undefined}>
          <UploadSimple size={18} weight="regular" />
          <span>{copy.addImages}</span>
        </button>
        {uploads.length ? (
          <div className="contribution-upload-list">
            {uploads.map((upload) => (
              <div key={upload.id} className="contribution-upload-preview">
                <img src={upload.url} alt="" />
                <span className="contribution-upload-name"><ImageSquare size={15} /><span>{upload.name}</span></span>
                <button type="button" onClick={() => removeUpload(upload.id)} aria-label={copy.removeImage(upload.name)}><TrashSimple size={17} /></button>
              </div>
            ))}
          </div>
        ) : null}
      </fieldset>
      {uploads.length ? (
        <label className="contribution-rights">
          <input name="imageRights" type="checkbox" checked={draft.imageRights} onChange={(event) => updateDraft("imageRights", event.currentTarget.checked)} aria-invalid={formError?.field === "imageRights"} aria-describedby={formError?.field === "imageRights" ? errorId : undefined} />
          <span>{copy.imageRights}</span>
        </label>
      ) : null}
      {formError ? <p id={errorId} className="contribution-error" role="alert">{formError.message}</p> : null}
      <p className="contribution-prototype-note">{copy.prototypeNote}</p>
      <button type="submit" className="contribution-submit"><span>{copy.submit}</span><PaperPlaneTilt size={18} weight="regular" /></button>
    </form>
  );
}

type CreateArtworkDraft = {
  artist: string;
  artistId: string;
  artistUnknown: boolean;
  title: string;
  titleUnknown: boolean;
  category: ArtCategoryId | "";
  year: string;
  medium: string;
  context: string;
  sources: string;
  imageRights: boolean;
};

type CreateFlowCopy = {
  steps: readonly [string, string, string, string];
  stepCount: (step: number) => string;
  close: string;
  back: string;
  continue: string;
  finish: string;
  headings: readonly [string, string, string, string];
  intro: string;
  artist: string;
  artistPlaceholder: string;
  artistUnknown: string;
  artistUnknownSummary: string;
  suggestedArtists: string;
  matchingArtists: string;
  noArtistMatch: string;
  inTaste: string;
  selectedArtist: string;
  title: string;
  titlePlaceholder: string;
  titleUnknown: string;
  titleUnknownSummary: string;
  imageHelp: string;
  addImages: string;
  removeImage: (name: string) => string;
  year: string;
  yearPlaceholder: string;
  artForm: string;
  selectArtForm: string;
  medium: string;
  mediumPlaceholder: string;
  context: string;
  contextPlaceholder: string;
  sources: string;
  sourcesPlaceholder: string;
  edit: string;
  noImages: string;
  optional: string;
  storageError: string;
  artistError: string;
  titleError: string;
  categoryError: string;
  contextError: string;
  successEyebrow: string;
  successTitle: string;
  successBody: string;
  another: string;
  done: string;
};

const CREATE_FLOW_COPY: Record<Locale, CreateFlowCopy> = {
  en: {
    steps: ["Artwork", "Images", "Details", "Review"],
    stepCount: (step) => "Step " + step + " of 4",
    close: "Close Create", back: "Back", continue: "Continue", finish: "Finish preview",
    headings: ["Tell us about the artwork", "Add images", "Details", "Review your artwork"],
    intro: "Search for an artist or enter a name. Add the title if you know it.",
    artist: "Artist", artistPlaceholder: "Search artists, e.g. Caravaggio", artistUnknown: "I don't know the artist",
    artistUnknownSummary: "Artist unknown", suggestedArtists: "Suggested artists", matchingArtists: "Matching artists",
    noArtistMatch: "No artist in this preview directory matches. You can use the name you entered.", inTaste: "In Taste", selectedArtist: "Selected artist",
    title: "Title", titlePlaceholder: "e.g. Starry Night", titleUnknown: "I don't know the title", titleUnknownSummary: "Title unknown",
    imageHelp: "Up to 3 JPG, PNG, or WebP files. 10 MB each.", addImages: "Add images",
    removeImage: (name) => "Remove " + name,
    year: "Year or period", yearPlaceholder: "If known", artForm: "Art form", selectArtForm: "Choose an art form",
    medium: "Material or format", mediumPlaceholder: "For example, oil on canvas",
    context: "Why does this work matter?", contextPlaceholder: "Share the story, context, or question behind it",
    sources: "Sources or links", sourcesPlaceholder: "Museum pages, books, articles, or other references",
    edit: "Edit", noImages: "No images added", optional: "Optional",
    storageError: "This draft could not be saved on this device. Keep this page open or try again.",
    artistError: "Add an artist or select 'I don't know the artist.'", titleError: "Add a title or select 'I don't know the title.'",
    categoryError: "Choose an art form.", contextError: "Add a short explanation of why this work matters.",
    successEyebrow: "LOCAL PREVIEW", successTitle: "Artwork preview complete",
    successBody: "You reached the end of the Create preview. Nothing was sent or added to the Library.",
    another: "Add another artwork", done: "Back to Taste",
  },
  "pt-BR": {
    steps: ["Obra", "Imagens", "Detalhes", "Revisão"],
    stepCount: (step) => "Etapa " + step + " de 4",
    close: "Fechar Criar", back: "Voltar", continue: "Continuar", finish: "Concluir prévia",
    headings: ["Conte sobre a obra", "Adicione imagens", "Detalhes", "Revise sua obra"],
    intro: "Busque um artista ou digite um nome. Adicione o título se souber.",
    artist: "Artista", artistPlaceholder: "Busque artistas, ex.: Caravaggio", artistUnknown: "Não sei quem é o artista",
    artistUnknownSummary: "Artista desconhecido", suggestedArtists: "Artistas sugeridos", matchingArtists: "Artistas encontrados",
    noArtistMatch: "Nenhum artista deste diretório de prévia corresponde à busca. Você pode usar o nome digitado.", inTaste: "No Taste", selectedArtist: "Artista selecionado",
    title: "Título", titlePlaceholder: "Ex.: A Noite Estrelada", titleUnknown: "Não sei o título", titleUnknownSummary: "Título desconhecido",
    imageHelp: "Até 3 arquivos JPG, PNG ou WebP. 10 MB cada.", addImages: "Adicionar imagens",
    removeImage: (name) => "Remover " + name,
    year: "Ano ou período", yearPlaceholder: "Se souber", artForm: "Forma de arte", selectArtForm: "Escolha uma forma de arte",
    medium: "Material ou formato", mediumPlaceholder: "Por exemplo, óleo sobre tela",
    context: "Por que esta obra importa?", contextPlaceholder: "Conte a história, o contexto ou a questão por trás dela",
    sources: "Fontes ou links", sourcesPlaceholder: "Museus, livros, artigos ou outras referências",
    edit: "Editar", noImages: "Nenhuma imagem adicionada", optional: "Opcional",
    storageError: "Não foi possível salvar este rascunho no dispositivo. Mantenha a página aberta ou tente novamente.",
    artistError: "Adicione um artista ou marque 'Não sei quem é o artista'.", titleError: "Adicione um título ou marque 'Não sei o título'.",
    categoryError: "Escolha uma forma de arte.", contextError: "Explique brevemente por que esta obra importa.",
    successEyebrow: "PRÉVIA LOCAL", successTitle: "Prévia da obra concluída",
    successBody: "Você concluiu a prévia de Criar. Nada foi enviado ou adicionado à Biblioteca.",
    another: "Adicionar outra obra", done: "Voltar ao Taste",
  },
  it: {
    steps: ["Opera", "Immagini", "Dettagli", "Riepilogo"],
    stepCount: (step) => "Passaggio " + step + " di 4",
    close: "Chiudi Crea", back: "Indietro", continue: "Continua", finish: "Termina anteprima",
    headings: ["Parlaci dell'opera", "Aggiungi immagini", "Dettagli", "Rivedi la tua opera"],
    intro: "Cerca un artista o inserisci un nome. Aggiungi il titolo se lo conosci.",
    artist: "Artista", artistPlaceholder: "Cerca artisti, es. Caravaggio", artistUnknown: "Non conosco l'artista",
    artistUnknownSummary: "Artista sconosciuto", suggestedArtists: "Artisti suggeriti", matchingArtists: "Artisti trovati",
    noArtistMatch: "Nessun artista in questa directory di anteprima corrisponde. Puoi usare il nome inserito.", inTaste: "In Taste", selectedArtist: "Artista selezionato",
    title: "Titolo", titlePlaceholder: "Es. La notte stellata", titleUnknown: "Non conosco il titolo", titleUnknownSummary: "Titolo sconosciuto",
    imageHelp: "Fino a 3 file JPG, PNG o WebP. 10 MB ciascuno.", addImages: "Aggiungi immagini",
    removeImage: (name) => "Rimuovi " + name,
    year: "Anno o periodo", yearPlaceholder: "Se noto", artForm: "Forma d'arte", selectArtForm: "Scegli una forma d'arte",
    medium: "Materiale o formato", mediumPlaceholder: "Per esempio, olio su tela",
    context: "Perché quest'opera è importante?", contextPlaceholder: "Racconta la storia, il contesto o la domanda che suscita",
    sources: "Fonti o link", sourcesPlaceholder: "Musei, libri, articoli o altri riferimenti",
    edit: "Modifica", noImages: "Nessuna immagine aggiunta", optional: "Facoltativo",
    storageError: "Impossibile salvare la bozza su questo dispositivo. Tieni aperta la pagina o riprova.",
    artistError: "Aggiungi un artista o scegli 'Non conosco l'artista'.", titleError: "Aggiungi un titolo o scegli 'Non conosco il titolo'.",
    categoryError: "Scegli una forma d'arte.", contextError: "Spiega brevemente perché quest'opera è importante.",
    successEyebrow: "ANTEPRIMA LOCALE", successTitle: "Anteprima dell'opera completata",
    successBody: "Hai completato l'anteprima di Crea. Nulla è stato inviato o aggiunto alla Libreria.",
    another: "Aggiungi un'altra opera", done: "Torna a Taste",
  },
  es: {
    steps: ["Obra", "Imágenes", "Detalles", "Revisión"],
    stepCount: (step) => "Paso " + step + " de 4",
    close: "Cerrar Crear", back: "Volver", continue: "Continuar", finish: "Terminar vista previa",
    headings: ["Cuéntanos sobre la obra", "Añade imágenes", "Detalles", "Revisa tu obra"],
    intro: "Busca un artista o escribe un nombre. Añade el título si lo conoces.",
    artist: "Artista", artistPlaceholder: "Busca artistas, p. ej. Caravaggio", artistUnknown: "No sé quién es el artista",
    artistUnknownSummary: "Artista desconocido", suggestedArtists: "Artistas sugeridos", matchingArtists: "Artistas encontrados",
    noArtistMatch: "No hay coincidencias en este directorio de prueba. Puedes usar el nombre escrito.", inTaste: "En Taste", selectedArtist: "Artista seleccionado",
    title: "Título", titlePlaceholder: "Ej.: La noche estrellada", titleUnknown: "No conozco el título", titleUnknownSummary: "Título desconocido",
    imageHelp: "Hasta 3 archivos JPG, PNG o WebP. 10 MB cada uno.", addImages: "Añadir imágenes",
    removeImage: (name) => "Eliminar " + name,
    year: "Año o período", yearPlaceholder: "Si se conoce", artForm: "Forma de arte", selectArtForm: "Elige una forma de arte",
    medium: "Material o formato", mediumPlaceholder: "Por ejemplo, óleo sobre lienzo",
    context: "¿Por qué importa esta obra?", contextPlaceholder: "Comparte la historia, el contexto o la pregunta que plantea",
    sources: "Fuentes o enlaces", sourcesPlaceholder: "Museos, libros, artículos u otras referencias",
    edit: "Editar", noImages: "No se añadieron imágenes", optional: "Opcional",
    storageError: "No se pudo guardar el borrador en este dispositivo. Mantén la página abierta o inténtalo de nuevo.",
    artistError: "Añade un artista o marca 'No sé quién es el artista'.", titleError: "Añade un título o marca 'No conozco el título'.",
    categoryError: "Elige una forma de arte.", contextError: "Explica brevemente por qué importa esta obra.",
    successEyebrow: "VISTA PREVIA LOCAL", successTitle: "Vista previa de la obra completa",
    successBody: "Terminaste la vista previa de Crear. No se envió nada ni se añadió a la Biblioteca.",
    another: "Añadir otra obra", done: "Volver a Taste",
  },
};

const CREATE_ARTWORK_DRAFT_KEY = "daily-culture.create-artwork-draft.v1";
const CREATE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CREATE_IMAGE_LIMIT = 3;
const CREATE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

function emptyCreateArtworkDraft(): CreateArtworkDraft {
  return {
    artist: "", artistId: "", artistUnknown: false, title: "", titleUnknown: false,
    category: "", year: "", medium: "", context: "", sources: "",
    imageRights: false,
  };
}

function loadCreateArtworkDraft(accountId: string): { draft: CreateArtworkDraft; step: number } {
  const empty = emptyCreateArtworkDraft();
  try {
    const saved = JSON.parse(window.localStorage.getItem(accountKey(accountId, CREATE_ARTWORK_DRAFT_KEY)) ?? "{}") as {
      draft?: Partial<CreateArtworkDraft>; step?: number;
    };
    const draft = saved.draft ?? {};
    const text = (value: unknown) => typeof value === "string" ? value : "";
    return {
      draft: {
        artist: text(draft.artist), artistId: text(draft.artistId), artistUnknown: draft.artistUnknown === true,
        title: text(draft.title), titleUnknown: draft.titleUnknown === true,
        category: isOneOf(draft.category, ["architecture", "sculpture", "painting", "music", "literature", "theater", "cinema"] as const) ? draft.category : "",
        year: text(draft.year), medium: text(draft.medium), context: text(draft.context), sources: text(draft.sources),
        imageRights: draft.imageRights === true,
      },
      step: Number.isInteger(saved.step) && Number(saved.step) >= 0 && Number(saved.step) <= 3 ? Number(saved.step) : 0,
    };
  } catch {
    return { draft: empty, step: 0 };
  }
}

type CreateArtworkPhoto = StoredArtworkImage & { url: string };

const CREATE_MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const CREATE_STEP_EASE = "cubic-bezier(.22, 1, .36, 1)";

function CreateFlowLayer({ children, reducedMotion }: { children: ReactNode; reducedMotion: boolean }) {
  const isPresent = useIsPresent();
  return <motion.div className="create-flow-layer" inert={!isPresent} aria-hidden={!isPresent || undefined}
    initial={reducedMotion ? false : { x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
    exit={reducedMotion ? { x: 0, opacity: 1 } : { x: 18, opacity: 0 }}
    transition={{ duration: reducedMotion ? 0 : .22, ease: CREATE_MOTION_EASE }}>
    {children}
  </motion.div>;
}

function CreateArtworkFlow({ locale, accountId, temporary, onExit }: { locale: Locale; accountId: string; temporary: boolean; onExit: () => void }) {
  const copy = CREATE_FLOW_COPY[locale];
  const imageCopy = CONTRIBUTION_COPY[locale].form;
  const keyboard = useKeyboard();
  const { bottomInset, isKeyboardVisible } = useKeyboardInsets();
  const reducedMotion = useReducedMotion() === true;
  const [initial] = useState(() => temporary ? { draft: emptyCreateArtworkDraft(), step: 0 } : loadCreateArtworkDraft(accountId));
  const [draft, setDraft] = useState<CreateArtworkDraft>(initial.draft);
  const [step, setStep] = useState(initial.step);
  const [complete, setComplete] = useState(false);
  const [photos, setPhotos] = useState<CreateArtworkPhoto[]>([]);
  const [photosReady, setPhotosReady] = useState(temporary);
  const [storageError, setStorageError] = useState(false);
  const [textStorageError, setTextStorageError] = useState(false);
  const [error, setError] = useState<{ field: keyof CreateArtworkDraft | "images"; message: string } | null>(null);
  const [artistSearchOpen, setArtistSearchOpen] = useState(false);
  const [activeArtistIndex, setActiveArtistIndex] = useState(-1);
  const [artFormOpen, setArtFormOpen] = useState(false);
  const [stepAnimating, setStepAnimating] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const artFormButtonRef = useRef<HTMLButtonElement>(null);
  const artFormRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<CreateArtworkPhoto[]>([]);
  const imageSaveQueue = useRef<Promise<void>>(Promise.resolve());
  const firstFocus = useRef(true);
  const stepAnimation = useRef<Animation | null>(null);
  const stepMotionSequence = useRef(0);
  const stepMotionBusy = useRef(false);
  const stepMotionPhase = useRef<"exit" | "enter" | null>(null);

  useEffect(() => {
    if (temporary) return;
    let cancelled = false;
    void loadArtworkImages(accountKey(accountId, "images")).then((stored) => {
      if (cancelled) return;
      const loaded = stored
        .filter((item) => item && typeof item.id === "string" && item.file instanceof File)
        .slice(0, CREATE_IMAGE_LIMIT)
        .map((item) => ({ ...item, url: URL.createObjectURL(item.file) }));
      photosRef.current = loaded;
      setPhotos(loaded);
      setPhotosReady(true);
    }).catch(() => {
      if (cancelled) return;
      setStorageError(true);
      setPhotosReady(true);
    });
    return () => {
      cancelled = true;
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
      photosRef.current = [];
    };
  }, [accountId, temporary]);

  useEffect(() => {
    if (complete || temporary) return;
    try {
      window.localStorage.setItem(accountKey(accountId, CREATE_ARTWORK_DRAFT_KEY), JSON.stringify({ draft, step }));
      setTextStorageError(false);
    } catch {
      setTextStorageError(true);
    }
  }, [accountId, draft, step, complete, temporary]);

  useEffect(() => {
    if (firstFocus.current) {
      firstFocus.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      flowRef.current?.querySelector<HTMLElement>(".mobile-scroll")?.scrollTo({ top: 0 });
      headingRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step, complete]);

  useEffect(() => () => {
    stepMotionSequence.current += 1;
    stepAnimation.current?.cancel();
  }, []);

  useEffect(() => {
    if (!artistSearchOpen || !isKeyboardVisible || step !== 0) return;
    const frame = window.requestAnimationFrame(() => {
      const scroll = flowRef.current?.querySelector<HTMLElement>(".create-flow-scroll .mobile-scroll");
      const field = flowRef.current?.querySelector<HTMLElement>("#create-artist");
      if (!scroll || !field) return;
      const bounds = scroll.getBoundingClientRect();
      const scale = bounds.width / scroll.clientWidth;
      scroll.scrollTop += (field.getBoundingClientRect().top - bounds.top) / scale - 12;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [artistSearchOpen, isKeyboardVisible, step]);

  function updateDraft<Key extends keyof CreateArtworkDraft>(key: Key, value: CreateArtworkDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (error?.field === key) setError(null);
  }

  function persistPhotos(next: CreateArtworkPhoto[]) {
    if (temporary) return;
    const stored = next.map(({ id, file }) => ({ id, file }));
    const pending = imageSaveQueue.current.catch(() => {}).then(() => saveArtworkImages(stored, accountKey(accountId, "images")));
    imageSaveQueue.current = pending;
    void pending.then(() => setStorageError(false), () => setStorageError(true));
  }

  function setPhotoList(next: CreateArtworkPhoto[]) {
    photosRef.current = next;
    setPhotos(next);
    persistPhotos(next);
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (!files.length) return;
    if (photosRef.current.length + files.length > CREATE_IMAGE_LIMIT) {
      setError({ field: "images", message: imageCopy.imageLimitError });
      return;
    }
    if (files.some((file) => !CREATE_IMAGE_TYPES.has(file.type))) {
      setError({ field: "images", message: imageCopy.imageTypeError });
      return;
    }
    if (files.some((file) => file.size > CREATE_IMAGE_MAX_BYTES)) {
      setError({ field: "images", message: imageCopy.imageSizeError });
      return;
    }
    const added = files.map((file) => ({
      id: window.crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
      file,
      url: URL.createObjectURL(file),
    }));
    setPhotoList([...photosRef.current, ...added]);
    setError(null);
  }

  function removePhoto(id: string) {
    const removed = photosRef.current.find((photo) => photo.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    const next = photosRef.current.filter((photo) => photo.id !== id);
    setPhotoList(next);
    if (!next.length) updateDraft("imageRights", false);
  }

  function fail(field: keyof CreateArtworkDraft | "images", message: string) {
    setError({ field, message });
    window.requestAnimationFrame(() => {
      const target = field === "images" ? flowRef.current?.querySelector<HTMLElement>(".create-flow-upload-tile")
        : flowRef.current?.querySelector<HTMLElement>('[name="create-' + field + '"]');
      target?.focus({ preventScroll: false });
    });
  }

  function cancelStepMotion() {
    stepMotionSequence.current += 1;
    stepAnimation.current?.cancel();
    stepAnimation.current = null;
    stepMotionBusy.current = false;
    stepMotionPhase.current = null;
    setStepAnimating(false);
    if (mainRef.current) mainRef.current.inert = false;
  }

  async function transitionPage(commit: () => void, direction: 1 | -1) {
    if (stepMotionBusy.current) {
      if (stepMotionPhase.current === "exit") return;
      stepMotionSequence.current += 1;
      stepAnimation.current?.cancel();
      stepAnimation.current = null;
      stepMotionBusy.current = false;
      stepMotionPhase.current = null;
      setStepAnimating(false);
    }
    const outgoing = mainRef.current;
    if (reducedMotion || !outgoing?.animate) { commit(); return; }

    stepMotionBusy.current = true;
    stepMotionPhase.current = "exit";
    setStepAnimating(true);
    const sequence = ++stepMotionSequence.current;
    outgoing.inert = true;
    const exitAnimation = outgoing.animate([
      { transform: "translateX(0)", opacity: 1 },
      { transform: `translateX(${-direction * 8}px)`, opacity: 0 },
    ], { duration: 90, easing: CREATE_STEP_EASE, fill: "forwards" });
    stepAnimation.current = exitAnimation;
    try { await exitAnimation.finished; } catch { return; }
    if (sequence !== stepMotionSequence.current) return;

    flushSync(commit);
    const incoming = mainRef.current;
    if (!incoming) { stepMotionBusy.current = false; stepMotionPhase.current = null; setStepAnimating(false); return; }
    stepMotionPhase.current = "enter";
    const enterAnimation = incoming.animate([
      { transform: `translateX(${direction * 14}px)`, opacity: 0 },
      { transform: "translateX(0)", opacity: 1 },
    ], { duration: 180, easing: CREATE_STEP_EASE });
    stepAnimation.current = enterAnimation;
    try { await enterAnimation.finished; } catch { /* A close or unmount cancels the movement. */ }
    if (sequence === stepMotionSequence.current) {
      stepAnimation.current = null;
      stepMotionBusy.current = false;
      stepMotionPhase.current = null;
      setStepAnimating(false);
    }
  }

  function showStep(next: number) {
    keyboard.hide();
    setArtFormOpen(false);
    setError(null);
    void transitionPage(() => setStep(next), next < step ? -1 : 1);
  }

  function changeArtFormOpen(open: boolean, restoreFocus = true) {
    setArtFormOpen(open);
    if (open) {
      window.requestAnimationFrame(() => {
        const option = artFormRef.current?.querySelector<HTMLButtonElement>('.create-flow-art-forms [tabindex="0"]');
        option?.focus({ preventScroll: true });
        option?.scrollIntoView({ block: "nearest", behavior: "instant" });
      });
    } else if (restoreFocus) {
      window.requestAnimationFrame(() => artFormButtonRef.current?.focus({ preventScroll: true }));
    }
  }

  useEffect(() => {
    if (!artFormOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !artFormRef.current?.contains(event.target)) changeArtFormOpen(false, false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress, true);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress, true);
  }, [artFormOpen]);

  function leaveCreate() {
    cancelStepMotion();
    onExit();
  }

  async function closeCreate() {
    cancelStepMotion();
    keyboard.hide();
    if (temporary) { leaveCreate(); return; }
    try {
      window.localStorage.setItem(accountKey(accountId, CREATE_ARTWORK_DRAFT_KEY), JSON.stringify({ draft, step }));
      setTextStorageError(false);
    } catch {
      setTextStorageError(true);
      return;
    }
    try {
      await imageSaveQueue.current;
    } catch {
      setStorageError(true);
      return;
    }
    leaveCreate();
  }

  async function finish() {
    keyboard.hide();
    if (!temporary) {
      try {
        await imageSaveQueue.current;
        await saveArtworkImages([], accountKey(accountId, "images"));
        window.localStorage.removeItem(accountKey(accountId, CREATE_ARTWORK_DRAFT_KEY));
      } catch {
        setStorageError(true);
        return;
      }
    }
    void transitionPage(() => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
      photosRef.current = [];
      setPhotos([]);
      setStorageError(false);
      setComplete(true);
    }, 1);
  }

  function nextStep() {
    if (step === 0) {
      if (!draft.artistUnknown && !draft.artist.trim()) { fail("artist", copy.artistError); return; }
      if (!draft.titleUnknown && !draft.title.trim()) { fail("title", copy.titleError); return; }
    }
    if (step === 1 && photos.length && !draft.imageRights) {
      fail("imageRights", imageCopy.imageRightsError);
      return;
    }
    if (step === 2) {
      if (!draft.category) { fail("category", copy.categoryError); return; }
      if (!draft.context.trim()) { fail("context", copy.contextError); return; }
    }
    if (step === 3) void finish();
    else showStep(step + 1);
  }

  function startAnother() {
    void transitionPage(() => {
      setDraft(emptyCreateArtworkDraft());
      setStep(0);
      setError(null);
      setComplete(false);
    }, -1);
  }

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (artFormOpen) {
        event.preventDefault();
        changeArtFormOpen(false);
        return;
      }
      event.preventDefault();
      if (isKeyboardVisible) { keyboard.hide(); return; }
      if (complete) { leaveCreate(); return; }
      if (step > 0) { showStep(step - 1); return; }
      void closeCreate();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  });

  const artistMatches = !draft.artistUnknown && artistSearchOpen
    ? searchCreateArtists(draft.artist, CREATE_ARTIST_OPTIONS)
    : [];
  const selectedArtist = CREATE_ARTIST_OPTIONS.find((artist) => artist.id === draft.artistId && artist.name === draft.artist);
  const displayedArtist = draft.artistUnknown ? copy.artistUnknownSummary : draft.artist.trim();
  const displayedTitle = draft.titleUnknown ? copy.titleUnknownSummary : draft.title.trim();
  const errorId = "create-flow-error";

  const handleTextBlur = (event: ReactFocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = event.relatedTarget as HTMLElement | null;
    // Keep the footer in place until its click runs; hiding the keyboard on blur can move it away from the pointer.
    if (!next?.closest(".create-flow")) keyboard.hide();
    if (event.currentTarget.name === "create-artist" && !next?.closest(".create-flow-suggestions")) setArtistSearchOpen(false);
  };

  function selectArtist(artist: CreateArtistOption) {
    setDraft((current) => ({ ...current, artist: artist.name, artistId: artist.id, artistUnknown: false }));
    setArtistSearchOpen(false);
    setActiveArtistIndex(-1);
    setError(null);
    keyboard.hide();
    flowRef.current?.querySelector<HTMLElement>(".create-flow-scroll .mobile-scroll")?.scrollTo({ top: 0 });
  }

  return <div ref={flowRef} className="create-flow">
    <header className="create-flow-header">
      <div className="create-flow-topbar">
        <button type="button" className="create-flow-close" onClick={() => complete ? leaveCreate() : void closeCreate()} aria-label={complete ? copy.done : copy.close}>
          <X size={18} weight="regular" />
        </button>
        <span>{complete ? APP_NAME : copy.steps[step]}</span>
        <span className="create-flow-topbar-spacer" aria-hidden="true" />
      </div>
      <div className="create-flow-progress" role="progressbar" aria-label={copy.stepCount(step + 1)} aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1}>
        {copy.steps.map((name, index) => <span key={name} data-active={index <= step} />)}
      </div>
    </header>

    <MobileScroll className="create-flow-scroll">
      {complete ? <main key="complete" ref={mainRef} className="create-flow-body create-flow-success">
        <CheckCircle size={36} weight="fill" aria-hidden="true" />
        <p className="create-flow-kicker">{copy.successEyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} className="create-flow-title">{copy.successTitle}</h1>
        <p className="create-flow-intro">{copy.successBody}</p>
        <div className="create-flow-success-actions">
          <button type="button" className="create-flow-next" onClick={startAnother} disabled={stepAnimating} data-transitioning={stepAnimating}>{copy.another}</button>
          <button type="button" className="create-flow-back" onClick={leaveCreate}>{copy.done}</button>
        </div>
      </main> : <main key={step} ref={mainRef} className="create-flow-body" data-step={step} aria-label={copy.steps[step]}>
        <h1 ref={headingRef} tabIndex={-1} className={step === 2 ? "sr-only" : "create-flow-title"}>{copy.headings[step]}</h1>
        {step === 0 ? <p className="create-flow-intro">{copy.intro}</p> : null}

        {step === 0 ? <div className="create-flow-fields">
          <div className="create-flow-field">
            <label htmlFor="create-artist">{copy.artist}</label>
            <KeyboardInput id="create-artist" name="create-artist" type="text" role="combobox" value={draft.artist} disabled={draft.artistUnknown}
              placeholder={copy.artistPlaceholder} maxLength={120} autoComplete="off" onBlur={handleTextBlur}
              aria-autocomplete="list" aria-expanded={artistSearchOpen} aria-controls="create-artist-results"
              aria-activedescendant={artistSearchOpen && activeArtistIndex >= 0 ? `create-artist-result-${activeArtistIndex}` : undefined}
              onFocus={() => { setArtistSearchOpen(true); setActiveArtistIndex(-1); }}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setDraft((current) => ({ ...current, artist: value, artistId: "" }));
                setArtistSearchOpen(true);
                setActiveArtistIndex(-1);
                if (error?.field === "artist") setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && artistMatches.length) {
                  event.preventDefault();
                  setActiveArtistIndex((index) => Math.min(index + 1, artistMatches.length - 1));
                } else if (event.key === "ArrowUp" && artistMatches.length) {
                  event.preventDefault();
                  setActiveArtistIndex((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter" && activeArtistIndex >= 0 && artistMatches[activeArtistIndex]) {
                  event.preventDefault();
                  selectArtist(artistMatches[activeArtistIndex]);
                } else if (event.key === "Escape" && artistSearchOpen) {
                  event.preventDefault();
                  event.stopPropagation();
                  setArtistSearchOpen(false);
                }
              }}
              aria-invalid={error?.field === "artist"} aria-describedby={error?.field === "artist" ? errorId : undefined} />
            {selectedArtist && !artistSearchOpen ? <p className="create-flow-selected-artist"><CheckCircle size={16} weight="fill" />{copy.selectedArtist}: {selectedArtist.detail}</p> : null}
            {artistSearchOpen && !draft.artistUnknown ? <div id="create-artist-results" className="create-flow-suggestions" role="listbox" aria-label={draft.artist.trim() ? copy.matchingArtists : copy.suggestedArtists}>
              <p>{draft.artist.trim() ? copy.matchingArtists : copy.suggestedArtists}</p>
              {artistMatches.map((artist, index) => <button id={`create-artist-result-${index}`} key={artist.id} type="button" role="option"
                className="create-flow-suggestion" aria-selected={artist.id === draft.artistId} data-active={index === activeArtistIndex}
                onClick={() => selectArtist(artist)}><span><strong>{artist.name}</strong><small>{artist.detail}{artist.inTaste ? ` · ${copy.inTaste}` : ""}</small></span><CaretRight size={16} /></button>)}
              {!artistMatches.length && draft.artist.trim().length >= 2 ? <p className="create-flow-no-matches">{copy.noArtistMatch}</p> : null}
            </div> : null}
            <label className="create-flow-choice">
              <input type="checkbox" name="create-artistUnknown" checked={draft.artistUnknown} onChange={(event) => {
                const checked = event.currentTarget.checked;
                setDraft((current) => ({ ...current, artistUnknown: checked, artist: checked ? "" : current.artist, artistId: "" }));
                setArtistSearchOpen(false);
                if (error?.field === "artist") setError(null);
              }} />
              <span>{copy.artistUnknown}</span>
            </label>
          </div>
          <div className="create-flow-field">
            <label htmlFor="create-title">{copy.title}</label>
            <KeyboardInput id="create-title" name="create-title" type="text" value={draft.title} placeholder={copy.titlePlaceholder}
              maxLength={160} disabled={draft.titleUnknown} onBlur={handleTextBlur} onChange={(event) => updateDraft("title", event.currentTarget.value)}
              aria-invalid={error?.field === "title"} aria-describedby={error?.field === "title" ? errorId : undefined} />
            <label className="create-flow-choice">
              <input type="checkbox" name="create-titleUnknown" checked={draft.titleUnknown} onChange={(event) => {
                const checked = event.currentTarget.checked;
                setDraft((current) => ({ ...current, titleUnknown: checked, title: checked ? "" : current.title }));
                if (error?.field === "title") setError(null);
              }} />
              <span>{copy.titleUnknown}</span>
            </label>
          </div>
        </div> : null}

        {step === 1 ? <div className="create-flow-fields">
          <div className="create-flow-field">
            <p className="create-flow-help">{copy.imageHelp}</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleFiles} tabIndex={-1} />
            <div className="create-flow-upload-grid">
              {photos.map((photo) => <div key={photo.id} className="create-flow-photo">
                <img src={photo.url} alt={photo.file.name} draggable={false} />
                <button type="button" className="create-flow-photo-remove" onClick={() => removePhoto(photo.id)} aria-label={copy.removeImage(photo.file.name)}><X size={15} /></button>
              </div>)}
              {photos.length < CREATE_IMAGE_LIMIT ? <button type="button" className="create-flow-upload-tile" disabled={!photosReady} onClick={() => {
                keyboard.hide();
                fileInputRef.current?.click();
              }} aria-label={copy.addImages} aria-invalid={error?.field === "images"} aria-describedby={error?.field === "images" ? errorId : undefined}>
                <Plus size={20} weight="regular" /><span>{copy.addImages}</span>
              </button> : null}
            </div>
          </div>
          {photos.length ? <label className="create-flow-consent">
            <input type="checkbox" name="create-imageRights" checked={draft.imageRights} onChange={(event) => updateDraft("imageRights", event.currentTarget.checked)}
              aria-invalid={error?.field === "imageRights"} aria-describedby={error?.field === "imageRights" ? errorId : undefined} />
            <span>{imageCopy.imageRights}</span>
          </label> : null}
        </div> : null}

        {step === 2 ? <div className="create-flow-fields">
          <div ref={artFormRef} className="create-flow-field create-flow-art-form-field">
            <button ref={artFormButtonRef} id="create-category" name="create-category" type="button" className="create-flow-select"
              aria-expanded={artFormOpen} aria-controls={artFormOpen ? "create-art-form-options" : undefined} aria-invalid={error?.field === "category"}
              aria-describedby={error?.field === "category" ? errorId : undefined}
              onClick={() => { keyboard.hide(); changeArtFormOpen(!artFormOpen); }}>
              <span>{copy.artForm}</span>
              {draft.category ? <span className="create-flow-select-value">{ART_CATEGORY_COPY[locale].names[draft.category]}</span> : null}
              <CaretDown size={16} weight="regular" aria-hidden="true" />
            </button>
            {artFormOpen ? <div id="create-art-form-options"><SelectionPill className="create-flow-art-forms" orientation="vertical" ariaLabel={copy.artForm}
                options={DISCOVER_ART_CATEGORIES.map((category) => ({ value: category.id, label: ART_CATEGORY_COPY[locale].names[category.id] }))}
                value={draft.category} onChange={(value) => updateDraft("category", value)} onCommit={() => changeArtFormOpen(false)} /></div> : null}
          </div>
          <div className="create-flow-field">
            <label htmlFor="create-year">{copy.year} <small>{copy.optional}</small></label>
            <KeyboardInput id="create-year" name="create-year" type="text" value={draft.year} placeholder={copy.yearPlaceholder}
              maxLength={80} onBlur={handleTextBlur} onChange={(event) => updateDraft("year", event.currentTarget.value)} />
          </div>
          <div className="create-flow-field">
            <label htmlFor="create-medium">{copy.medium} <small>{copy.optional}</small></label>
            <KeyboardInput id="create-medium" name="create-medium" type="text" value={draft.medium} placeholder={copy.mediumPlaceholder}
              maxLength={120} onBlur={handleTextBlur} onChange={(event) => updateDraft("medium", event.currentTarget.value)} />
          </div>
          <div className="create-flow-field">
            <label htmlFor="create-context">{copy.context}</label>
            <KeyboardTextarea id="create-context" name="create-context" value={draft.context} placeholder={copy.contextPlaceholder}
              maxLength={1500} rows={5} onBlur={handleTextBlur} onChange={(event) => updateDraft("context", event.currentTarget.value)}
              aria-invalid={error?.field === "context"} aria-describedby={error?.field === "context" ? errorId : undefined} />
          </div>
          <div className="create-flow-field">
            <label htmlFor="create-sources">{copy.sources} <small>{copy.optional}</small></label>
            <KeyboardTextarea id="create-sources" name="create-sources" value={draft.sources} placeholder={copy.sourcesPlaceholder}
              maxLength={1000} rows={3} onBlur={handleTextBlur} onChange={(event) => updateDraft("sources", event.currentTarget.value)} />
          </div>
        </div> : null}

        {step === 3 ? <div className="create-flow-review">
          <section className="create-flow-review-card">
            <div className="create-flow-review-head"><h2>{copy.steps[0]}</h2><button type="button" disabled={stepAnimating} onClick={() => showStep(0)}>{copy.edit}</button></div>
            <strong>{displayedTitle}</strong>
            <p>{displayedArtist}</p>
            {selectedArtist ? <p>{selectedArtist.detail}</p> : null}
          </section>
          <section className="create-flow-review-card">
            <div className="create-flow-review-head"><h2>{copy.steps[1]}</h2><button type="button" disabled={stepAnimating} onClick={() => showStep(1)}>{copy.edit}</button></div>
            {photos.length ? <div className="create-flow-review-images" data-count={photos.length}>{photos.map((photo) => <img key={photo.id} src={photo.url} alt={photo.file.name} draggable={false} />)}</div>
              : <p>{copy.noImages}</p>}
          </section>
          <section className="create-flow-review-card">
            <div className="create-flow-review-head"><h2>{copy.steps[2]}</h2><button type="button" disabled={stepAnimating} onClick={() => showStep(2)}>{copy.edit}</button></div>
            <p>{draft.category ? ART_CATEGORY_COPY[locale].names[draft.category] : ""}{draft.year.trim() ? " · " + draft.year.trim() : ""}</p>
            {draft.medium.trim() ? <p>{draft.medium.trim()}</p> : null}
            <p>{draft.context.trim()}</p>
            {draft.sources.trim() ? <p>{copy.sources}: {draft.sources.trim()}</p> : null}
          </section>
        </div> : null}

        {error ? <p id={errorId} className="create-flow-error" role="alert">{error.message}</p> : null}
        {storageError || textStorageError ? <p className="create-flow-error" role="alert">{copy.storageError}</p> : null}
      </main>}
    </MobileScroll>

    {!complete ? <footer className="create-flow-footer" style={{ bottom: bottomInset }}>
      {step > 0 ? <button type="button" className="create-flow-back" disabled={stepAnimating} onClick={() => showStep(step - 1)}>{copy.back}</button> : <span />}
      <button type="button" className="create-flow-next" onClick={nextStep} disabled={stepAnimating || (step === 1 && !photosReady)} data-transitioning={stepAnimating}>
        {step === 3 ? copy.finish : copy.continue}
        <ArrowRight size={17} weight="regular" aria-hidden="true" />
      </button>
    </footer> : null}
  </div>;
}

const TODAY_COPY: Record<Locale, { viewImage: string; search: string; shuffle: string; defaultBoard: string; categories: string; edited: string; unknownDate: string; actions: TodaySaveLabels }> = {
  en: { viewImage: "View image in detail", search: "Search stories", shuffle: "Shuffle artwork", defaultBoard: "My folder", categories: "Categories", edited: "Last edited", unknownDate: "Date not recorded", actions: { save: "Save", saved: "Saved", chooseBoard: "Choose folder", newBoard: "New folder", boardName: "Folder name", boardNamePlaceholder: "Name your folder", createBoard: "Create folder", cancel: "Cancel", fullScreen: "View image in full screen", savedBy: (count) => `Saved by ${count.toLocaleString("en")} ${count === 1 ? "person" : "people"}` } },
  "pt-BR": { viewImage: "Ver imagem em detalhe", search: "Buscar histórias", shuffle: "Sortear outra obra", defaultBoard: "Minha pasta", categories: "Categorias", edited: "Última edição", unknownDate: "Data não registrada", actions: { save: "Salvar", saved: "Salvo", chooseBoard: "Escolher pasta", newBoard: "Nova pasta", boardName: "Nome da pasta", boardNamePlaceholder: "Nomeie sua pasta", createBoard: "Criar pasta", cancel: "Cancelar", fullScreen: "Ver imagem em tela cheia", savedBy: (count) => `Salvo por ${count.toLocaleString("pt-BR")} ${count === 1 ? "pessoa" : "pessoas"}` } },
  it: { viewImage: "Vedi l’immagine in dettaglio", search: "Cerca storie", shuffle: "Mostra un’opera casuale", defaultBoard: "La mia cartella", categories: "Categorie", edited: "Ultima modifica", unknownDate: "Data non registrata", actions: { save: "Salva", saved: "Salvato", chooseBoard: "Scegli cartella", newBoard: "Nuova cartella", boardName: "Nome della cartella", boardNamePlaceholder: "Dai un nome alla cartella", createBoard: "Crea cartella", cancel: "Annulla", fullScreen: "Vedi l’immagine a schermo intero", savedBy: (count) => `Salvato da ${count.toLocaleString("it")} ${count === 1 ? "persona" : "persone"}` } },
  es: { viewImage: "Ver imagen en detalle", search: "Buscar historias", shuffle: "Mostrar otra obra al azar", defaultBoard: "Mi carpeta", categories: "Categorías", edited: "Última edición", unknownDate: "Fecha no registrada", actions: { save: "Guardar", saved: "Guardado", chooseBoard: "Elegir carpeta", newBoard: "Nueva carpeta", boardName: "Nombre de la carpeta", boardNamePlaceholder: "Nombra tu carpeta", createBoard: "Crear carpeta", cancel: "Cancelar", fullScreen: "Ver imagen en pantalla completa", savedBy: (count) => `Guardado por ${count.toLocaleString("es")} ${count === 1 ? "persona" : "personas"}` } },
};

const LIBRARY_EDIT_COPY: Record<Locale, { edit: string; title: string; folders: string; note: string; notePlaceholder: string; cancel: string; save: string; yourNote: string }> = {
  en: { edit: "Edit", title: "Edit artwork", folders: "Folders", note: "Personal note", notePlaceholder: "Add a note for yourself", cancel: "Cancel", save: "Save changes", yourNote: "Your note" },
  "pt-BR": { edit: "Editar", title: "Editar obra", folders: "Pastas", note: "Nota pessoal", notePlaceholder: "Adicione uma nota para você", cancel: "Cancelar", save: "Salvar alterações", yourNote: "Sua nota" },
  it: { edit: "Modifica", title: "Modifica opera", folders: "Cartelle", note: "Nota personale", notePlaceholder: "Aggiungi una nota personale", cancel: "Annulla", save: "Salva modifiche", yourNote: "La tua nota" },
  es: { edit: "Editar", title: "Editar obra", folders: "Carpetas", note: "Nota personal", notePlaceholder: "Añade una nota personal", cancel: "Cancelar", save: "Guardar cambios", yourNote: "Tu nota" },
};

// Form plus one editorial context. Keep visible categories to two, never more than three.
const PIECE_CONTEXT: Record<string, Record<Locale, string>> = {
  ...approvedContext,
  "death-of-socrates": { en: "Neoclassicism", "pt-BR": "Neoclassicismo", it: "Neoclassicismo", es: "Neoclasicismo" },
  "divine-comedy": { en: "Middle Ages", "pt-BR": "Idade Média", it: "Medioevo", es: "Edad Media" },
  "chart-of-hell": { en: "Renaissance", "pt-BR": "Renascimento", it: "Rinascimento", es: "Renacimiento" },
  "great-wave": { en: "Ukiyo-e", "pt-BR": "Ukiyo-e", it: "Ukiyo-e", es: "Ukiyo-e" },
  "noh-mask": { en: "Noh", "pt-BR": "Nô", it: "Nō", es: "Nō" },
  "arabic-bowl": { en: "Samanid", "pt-BR": "Samânida", it: "Samanide", es: "Samánida" },
  "migrant-mother": { en: "Documentary", "pt-BR": "Documental", it: "Documentario", es: "Documental" },
  caligari: { en: "Expressionism", "pt-BR": "Expressionismo", it: "Espressionismo", es: "Expresionismo" },
  "the-kiss": { en: "Art Nouveau", "pt-BR": "Art Nouveau", it: "Art Nouveau", es: "Art Nouveau" },
  "girl-pearl": { en: "Dutch Golden Age", "pt-BR": "Século de Ouro neerlandês", it: "Secolo d’oro olandese", es: "Siglo de Oro neerlandés" },
};

function TodayArticle({ piece, date, headerDate, locale, copy, isFavourite, boards, selectedBoardIds, relatedPieces, onOpenPiece, onViewImage, onOpenCreator, onFavourite, onToggleBoard, onCreateBoard, onSearch, onShuffle, onClose, onEdit, personalNote }: {
  piece: Piece; date?: string; headerDate?: string; locale: Locale; copy: UiCopy; isFavourite: boolean; boards: SavedBoard<PieceId>[]; selectedBoardIds: string[]; relatedPieces: Piece[];
  onOpenPiece?: (id: PieceId) => void; onViewImage?: () => void; onOpenCreator: () => void; onFavourite: () => void; onToggleBoard: (boardId: string, selected: boolean) => void; onCreateBoard: (name: string, options?: BoardOptions<PieceId>) => void; onSearch?: () => void; onShuffle?: () => void; onClose?: () => void; onEdit?: () => void; personalNote?: string;
}) {
  const labels = TODAY_COPY[locale];
  const currentReader = useCurrentReader();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWrapped, setTitleWrapped] = useState(false);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(title).lineHeight);
      if (lineHeight > 0) setTitleWrapped(title.getBoundingClientRect().height > lineHeight * 1.5);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    let active = true;
    void document.fonts.ready.then(() => { if (active) measure(); });
    return () => { active = false; observer.disconnect(); };
  }, [piece.title, locale]);

  // Sample counts include the initial saved state. A local toggle changes the sample count by one.
  const initiallySaved = currentReader.id === PRIMARY_ACCOUNT_ID ? DEFAULT_FAVOURITES.includes(piece.id)
    : currentReader.id === PREVIEW_ACCOUNT_ID && (piece.id === "chart-of-hell" || piece.id === "girl-pearl");
  const count = piece.favoriteCount + Number(isFavourite) - Number(initiallySaved);
  const categories = [FORM_LABELS[locale][piece.form], PIECE_CONTEXT[piece.id][locale]].slice(0, 3);
  const edited = piece.lastEditedAt ? new Date(piece.lastEditedAt) : null;
  const hasEditDate = edited && !Number.isNaN(edited.getTime());

  return <article className="piece-detail today-article" data-piece-id={piece.id} data-daily={onClose ? undefined : "true"} data-reading-view={onClose ? "detail" : "daily"} aria-label={onClose ? piece.title : `${date}: ${piece.title}`}>
    <div className="today-topbar">
      {onClose ? <>
        <button type="button" className="today-back" onClick={onClose} aria-label={copy.aria.closeStory}><CaretLeft size={14} weight="regular" aria-hidden="true" /></button>
        {onEdit && <button type="button" className="today-detail-edit" onClick={onEdit}>{LIBRARY_EDIT_COPY[locale].edit}</button>}
      </> : <>
        <button type="button" className="today-shuffle" onClick={onShuffle} disabled={!onShuffle} aria-label={labels.shuffle} title={labels.shuffle}><Shuffle size={12} weight="regular" aria-hidden="true" /></button>
        <time className="today-date">{headerDate}</time>
        <button type="button" className="today-search" onClick={onSearch} aria-label={labels.search}><MagnifyingGlass size={12} weight="regular" aria-hidden="true" /></button>
      </>}
    </div>
    <button type="button" className="today-hero" onClick={onViewImage} aria-label={`${labels.viewImage}: ${piece.title}`} aria-haspopup="dialog"><img src={piece.image} alt={piece.imageAlt ?? piece.title} width={piece.imageWidth} height={piece.imageHeight} draggable={false} style={{ objectPosition: piece.imagePosition ?? "center" }} /></button>
    <header className="today-metadata">
      <div className="today-title-row" data-title-wrapped={titleWrapped}>
        <h1 ref={titleRef}>{piece.title}</h1>
        <p className="today-creator"><button type="button" onClick={onOpenCreator} aria-label={copy.creator.openAria(piece.creator)}>{piece.creator}</button><span>, </span><span className="today-creator-date">{piece.year}</span></p>
        <TodaySaveActions currentArtwork={piece} locale={locale} count={count} isSaved={isFavourite} boards={boards.map(board => board.id === DEFAULT_BOARD_ID ? { ...board, name: labels.defaultBoard } : board)} selectedBoardIds={selectedBoardIds} labels={labels.actions} onToggleSave={onFavourite} onToggleBoard={onToggleBoard} onCreateBoard={onCreateBoard} onViewImage={onViewImage ?? (() => {})} />
      </div>
      <ul className="today-categories" aria-label={labels.categories}>{categories.map(category => <li key={category}>{category}</li>)}</ul>
    </header>
    <div className="today-reading">
      <div className="today-story-copy"><EditorialStory paragraphs={piece.story} /></div>
      <p className="today-last-edited">{labels.edited}: {hasEditDate ? <time dateTime={piece.lastEditedAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(edited)}</time> : labels.unknownDate}</p>
    </div>
    <ArtworkInformationSection piece={piece} mediumLabel={FORM_LABELS[locale][piece.form]} onOpenCreator={onOpenCreator} openCreatorLabel={copy.creator.openAria(piece.creator)} />
    {onClose && personalNote ? <section className="library-personal-note"><h2>{LIBRARY_EDIT_COPY[locale].yourNote}</h2><p>{personalNote}</p></section> : null}
    {onOpenPiece && <RelatedWorks id={piece.id} title={copy.daily.moreTitle} carouselLabel={copy.daily.moreCarouselAria}
      items={relatedPieces} openLabel={copy.daily.openStoryAria} onOpen={id => onOpenPiece(id as PieceId)} />}
  </article>;
}

function PieceDetail({
  piece,
  locale,
  copy,
  isFavourite,
  onClose,
  onOpenCreator,
  onFavourite,
  boards,
  selectedBoardIds,
  onToggleBoard,
  onCreateBoard,
  onViewImage,
  allowEdit,
  personalNote,
  onSaveNote,
}: {
  piece: Piece;
  locale: Locale;
  copy: UiCopy;
  isFavourite: boolean;
  onClose: () => void;
  onOpenCreator: (id: CreatorId) => void;
  onFavourite: () => void;
  boards: SavedBoard<PieceId>[];
  selectedBoardIds: string[];
  onToggleBoard: (boardId: string, selected: boolean) => void;
  onCreateBoard: (name: string, options?: BoardOptions<PieceId>) => void;
  onViewImage: () => void;
  allowEdit: boolean;
  personalNote: string;
  onSaveNote: (note: string) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [draftFolderIds, setDraftFolderIds] = useState<string[]>(selectedBoardIds);
  const [draftNote, setDraftNote] = useState(personalNote);
  const editFocusTimer = useRef<number | null>(null);
  const keyboard = useKeyboard();
  const labels = LIBRARY_EDIT_COPY[locale];

  useEffect(() => () => {
    if (editFocusTimer.current !== null) window.clearTimeout(editFocusTimer.current);
  }, []);

  function openEdit() {
    if (editFocusTimer.current !== null) window.clearTimeout(editFocusTimer.current);
    keyboard.hide();
    setDraftFolderIds(selectedBoardIds);
    setDraftNote(personalNote);
    setEditOpen(true);
  }

  function closeEdit() {
    keyboard.hide();
    setEditOpen(false);
    if (editFocusTimer.current !== null) window.clearTimeout(editFocusTimer.current);
    editFocusTimer.current = window.setTimeout(() => {
      const trigger = document.querySelector<HTMLButtonElement>(".artwork-detail-scroll .today-detail-edit");
      if (trigger?.isConnected && !trigger.closest("[inert]")) trigger.focus({ preventScroll: true });
      editFocusTimer.current = null;
    }, 700);
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    for (const board of boards) {
      const selected = draftFolderIds.includes(board.id);
      if (selected !== selectedBoardIds.includes(board.id)) onToggleBoard(board.id, selected);
    }
    onSaveNote(draftNote);
    closeEdit();
  }

  return <>
    <MobileScroll className="piece-scroll artwork-detail-scroll">
      <TodayArticle piece={piece} locale={locale} copy={copy} isFavourite={isFavourite} onClose={onClose}
        boards={boards} selectedBoardIds={selectedBoardIds} relatedPieces={[]}
        onOpenCreator={() => onOpenCreator(piece.creatorId)} onFavourite={onFavourite}
        onToggleBoard={onToggleBoard} onCreateBoard={onCreateBoard} onViewImage={onViewImage}
        onEdit={allowEdit ? openEdit : undefined} personalNote={allowEdit ? personalNote : undefined} />
    </MobileScroll>
    {allowEdit ? <BottomSheet open={editOpen} onOpenChange={open => { if (!open) closeEdit(); else openEdit(); }} title={labels.title} snap={0.62}>
      <form className="library-edit-form" onSubmit={saveEdit}>
        <fieldset className="library-edit-folders"><legend>{labels.folders}</legend>
          {boards.map(board => {
            const selected = draftFolderIds.includes(board.id);
            return <button key={board.id} type="button" aria-pressed={selected} onClick={() => {
              keyboard.hide();
              setDraftFolderIds(current => selected ? current.filter(id => id !== board.id) : [...current, board.id]);
            }}><span>{board.id === DEFAULT_BOARD_ID ? TODAY_COPY[locale].defaultBoard : board.name}</span>{selected ? <CheckCircle size={18} weight="fill" aria-hidden="true" /> : <span className="library-edit-unchecked" aria-hidden="true" />}</button>;
          })}
        </fieldset>
        <label className="library-edit-note-label" htmlFor="library-edit-note">{labels.note}</label>
        <KeyboardTextarea id="library-edit-note" value={draftNote} onChange={event => setDraftNote(event.currentTarget.value)} placeholder={labels.notePlaceholder} maxLength={1000} rows={4} onBlur={event => {
          if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".library-edit-actions, .library-edit-folders")) return;
          keyboard.hide();
        }} />
        <div className="library-edit-actions"><button type="button" onClick={closeEdit}>{labels.cancel}</button><button type="submit">{labels.save}</button></div>
      </form>
    </BottomSheet> : null}
  </>;
}

function PieceArticle({ piece, date, headerDate, locale, copy, daily = false, isFavourite, boards = [], selectedBoardIds = [], relatedPieces = [], onClose, onOpenPiece, onViewImage, onOpenCreator, onFavourite, onToggleBoard, onCreateBoard, onSearch, onShuffle, onShare }: { piece: Piece; date: string; headerDate?: string; locale: Locale; copy: UiCopy; daily?: boolean; isFavourite: boolean; boards?: SavedBoard<PieceId>[]; selectedBoardIds?: string[]; relatedPieces?: Piece[]; onClose?: () => void; onViewImage?: () => void; onOpenPiece?: (id: PieceId) => void; onOpenCreator: () => void; onFavourite: () => void; onToggleBoard?: (boardId: string, selected: boolean) => void; onCreateBoard?: (name: string, options?: BoardOptions<PieceId>) => void; onSearch?: () => void; onShuffle?: () => void; onShare: () => void }) {
  if (daily) return <TodayArticle piece={piece} date={date} headerDate={headerDate ?? date} locale={locale} copy={copy} isFavourite={isFavourite} boards={boards} selectedBoardIds={selectedBoardIds} relatedPieces={relatedPieces} onOpenPiece={onOpenPiece} onViewImage={onViewImage} onOpenCreator={onOpenCreator} onFavourite={onFavourite} onToggleBoard={onToggleBoard ?? (() => {})} onCreateBoard={onCreateBoard ?? (() => {})} onSearch={onSearch ?? (() => {})} onShuffle={onShuffle} />;
  return (
      <article className="piece-detail" data-piece-id={piece.id} data-daily={daily ? "true" : undefined} style={{ "--piece-image": `url(${piece.image})` } as CSSProperties}>
        <BrandMasthead locale={locale} />
        <div className="edition-strip">
          <span className="edition-label">{FORM_LABELS[locale][piece.form]}</span>
          <time>{date}</time>
          {!daily ? (
            <button className="edition-control" type="button" onClick={onClose} aria-label={copy.aria.closeStory}>
              <X size={22} weight="regular" />
            </button>
          ) : null}
        </div>
        <div className="piece-hero">
          <img src={piece.image} alt="" style={{ objectPosition: piece.imagePosition ?? "center" }} />
        </div>

        <div className="story-sheet">
          <div className="story-heading">
            <h1>{piece.title}</h1>
            <p className="piece-medium">{piece.medium}</p>
          </div>
          <div className="piece-actions">
            <span className="story-place">{piece.place}<span aria-hidden="true"> / </span>{piece.year}</span>
            <LikeButton className="engagement-pill" liked={isFavourite} onClick={onFavourite} aria-label={copy.aria.favouriteToggle}>
              <span>{formatCompactCount(piece.favoriteCount, locale)}</span>
            </LikeButton>
            <button type="button" className="round-action" onClick={onShare} aria-label={copy.aria.shareStory}>
              <Share size={20} weight="regular" />
            </button>
          </div>
          <div className="creator-line" aria-label={`${piece.creator}, ${piece.creatorDates}. ${piece.year}, ${piece.place}, ${FORM_LABELS[locale][piece.form]}.`}>
            <button type="button" className="creator-pill" onClick={onOpenCreator} aria-label={copy.creator.openAria(piece.creator)}>
              <img src={piece.image} alt="" style={{ objectPosition: piece.imagePosition ?? "center" }} />
              <strong>{piece.creator}</strong>
              <ArrowRight size={20} weight="regular" aria-hidden="true" />
            </button>
          </div>
          <p className="story-kicker">{piece.kicker}</p>
          <div className="story-copy">
            {piece.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ArtworkInformationSection piece={piece} mediumLabel={FORM_LABELS[locale][piece.form]} onOpenCreator={onOpenCreator} openCreatorLabel={copy.creator.openAria(piece.creator)} />
          {daily && relatedPieces.length && onOpenPiece ? (
            <section className="story-more" aria-labelledby={`story-more-${piece.id}`}>
              <h2 id={`story-more-${piece.id}`}>{copy.daily.moreTitle}</h2>
              <Carousel className="story-more-carousel" contentClassName="story-more-carousel-track" ariaLabel={copy.daily.moreCarouselAria}>
                {relatedPieces.map((relatedPiece) => (
                  <button key={relatedPiece.id} type="button" className="story-more-card" onClick={() => onOpenPiece(relatedPiece.id)} aria-label={copy.daily.openStoryAria(relatedPiece.title)}>
                    <img src={relatedPiece.image} alt="" style={{ objectPosition: relatedPiece.imagePosition ?? "center" }} />
                    <span className="story-more-card-title">{relatedPiece.title}</span>
                    <span className="story-more-card-meta"><strong>{relatedPiece.creator}</strong><span>{relatedPiece.year}</span></span>
                  </button>
                ))}
              </Carousel>
            </section>
          ) : null}
          <div className="daily-signoff">
            <Sparkle size={19} weight="fill" />
            <p>{copy.daily.signoff}</p>
          </div>
        </div>
      </article>
  );
}

type CreatorTab = "overview" | "biography" | "artworks";
const CREATOR_PROFILE_COPY = {
  en: { overview: "Overview", biography: "Biography", artworks: "Artworks", more: "More info", showing: (count: number) => `Showing ${count} ${count === 1 ? "work" : "works"}`, sortFilter: "Sort & Filter", sortBy: "Sort by", featured: "Featured", ascending: "Title A–Z", descending: "Title Z–A", show: "Show", all: "All works", saved: "Saved works", empty: "No saved works by this creator yet.", region: "Associated with", dates: "Lifetime", period: "Period", form: "Art form", context: "Cultural context", reset: "Show all works" },
  "pt-BR": { overview: "Visão geral", biography: "Biografia", artworks: "Obras", more: "Mais informações", showing: (count: number) => `Exibindo ${count} ${count === 1 ? "obra" : "obras"}`, sortFilter: "Ordenar e filtrar", sortBy: "Ordenar por", featured: "Destaques", ascending: "Título A–Z", descending: "Título Z–A", show: "Exibir", all: "Todas as obras", saved: "Obras salvas", empty: "Você ainda não salvou obras deste criador.", region: "Associado a", dates: "Período de vida", period: "Período", form: "Forma de arte", context: "Contexto cultural", reset: "Ver todas as obras" },
  it: { overview: "Panoramica", biography: "Biografia", artworks: "Opere", more: "Altre informazioni", showing: (count: number) => `${count} ${count === 1 ? "opera" : "opere"}`, sortFilter: "Ordina e filtra", sortBy: "Ordina per", featured: "In evidenza", ascending: "Titolo A–Z", descending: "Titolo Z–A", show: "Mostra", all: "Tutte le opere", saved: "Opere salvate", empty: "Non hai ancora salvato opere di questo autore.", region: "Associato a", dates: "Vita", period: "Periodo", form: "Forma d’arte", context: "Contesto culturale", reset: "Mostra tutte le opere" },
  es: { overview: "Resumen", biography: "Biografía", artworks: "Obras", more: "Más información", showing: (count: number) => `Mostrando ${count} ${count === 1 ? "obra" : "obras"}`, sortFilter: "Ordenar y filtrar", sortBy: "Ordenar por", featured: "Destacadas", ascending: "Título A–Z", descending: "Título Z–A", show: "Mostrar", all: "Todas las obras", saved: "Obras guardadas", empty: "Aún no has guardado obras de este creador.", region: "Asociado con", dates: "Vida", period: "Período", form: "Forma de arte", context: "Contexto cultural", reset: "Ver todas las obras" },
};

function CreatorDetail({ creator, pieces: displayPieces, locale, copy, favourites, onClose, onOpenPiece }: {
  creator: Creator; pieces: Piece[]; locale: Locale; copy: UiCopy; favourites: ReadonlySet<PieceId>;
  onClose: () => void; onOpenPiece: (id: PieceId) => void;
}) {
  const [tab, setTab] = useState<CreatorTab>("overview");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<GallerySort>("featured");
  const [medium, setMedium] = useState<"all" | FormId>("all");
  const [filters, setFilters] = useState(createEmptyArtworkFilters);
  const keyboard = useKeyboard();
  const [savedOnly, setSavedOnly] = useState<"all" | "saved">("all");
  const tabRefs = useRef<Partial<Record<CreatorTab, HTMLButtonElement | null>>>({});
  const { followedCreators, toggleFollow } = useArtworkInformation();
  const labels = CREATOR_PROFILE_COPY[locale];
  const saveCopy = INFORMATION_COPY[locale];
  const tabs: CreatorTab[] = ["overview", "biography", "artworks"];
  const creatorPieces = creator.pieceIds
    .map(id => displayPieces.find(piece => piece.id === id))
    .filter((piece): piece is Piece => Boolean(piece));
  const heroPiece = creatorPieces.find(piece => piece.id === creator.heroPieceId) ?? creatorPieces[0];
  if (!heroPiece) return null;

  const biography = creatorBiographies[creator.id]?.[locale] ?? creator.profile?.[locale]?.join(" ") ?? "";
  const following = followedCreators.has(creator.id);
  const visibleWorks = filterAndSortArtworks(creatorPieces.filter(piece => (savedOnly !== "saved" || favourites.has(piece.id)) && (medium === "all" || piece.form === medium)), sort, filters, locale);
  const resetCreatorFilters = () => { setSavedOnly("all"); setMedium("all"); setSort("featured"); setFilters(createEmptyArtworkFilters()); };
  const forms = [...new Set(creatorPieces.map(piece => FORM_LABELS[locale][piece.form]))].join(", ");
  const contexts = [...new Set(creatorPieces.map(piece => PIECE_CONTEXT[piece.id][locale]))].join(", ");

  function selectTab(next: CreatorTab, focus = false) {
    setTab(next);
    if (focus) tabRefs.current[next]?.focus({ preventScroll: true });
  }

  function handleTabKey(event: ReactKeyboardEvent<HTMLButtonElement>, current: CreatorTab) {
    const index = tabs.indexOf(current);
    const next = event.key === "ArrowRight" ? tabs[(index + 1) % tabs.length]
      : event.key === "ArrowLeft" ? tabs[(index + tabs.length - 1) % tabs.length]
      : event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[tabs.length - 1] : null;
    if (!next) return;
    event.preventDefault();
    selectTab(next, true);
  }

  const artworks = <section className="creator-reference-artworks" aria-label={labels.artworks}>
    <header className="creator-reference-works-heading">
      <p aria-live="polite">{labels.showing(visibleWorks.length)}</p>
      <button type="button" className="creator-reference-sort" aria-haspopup="dialog" onClick={() => { keyboard.hide(); setFiltersOpen(true); }}>
        <SlidersHorizontal size={16} aria-hidden="true" /><span>{labels.sortFilter}</span>
      </button>
    </header>
    {visibleWorks.length ? <Carousel className="creator-reference-rail" contentClassName="creator-reference-track" ariaLabel={labels.artworks}>
      {visibleWorks.map(piece => <button key={piece.id} type="button" className="creator-reference-artwork" onClick={() => onOpenPiece(piece.id)} aria-label={copy.daily.openStoryAria(piece.title)}>
        <img src={piece.image} alt="" draggable={false} style={{ objectPosition: piece.imagePosition ?? "center" }} />
        <span className="creator-reference-artwork-copy">
          <strong>{piece.title}</strong><span>{piece.creator}, {piece.year}</span>
        </span>
      </button>)}
    </Carousel> : <div className="creator-reference-empty"><p>{copy.search.emptyTitle}</p><button type="button" onClick={resetCreatorFilters}>{labels.reset}</button></div>}
  </section>;

  return <>
    <MobileScroll className="creator-scroll">
      <article className="creator-detail creator-reference" aria-labelledby="creator-profile-title">
        <header className="creator-reference-hero">
          <img src={heroPiece.image} alt={heroPiece.title} draggable={false} style={{ objectPosition: heroPiece.imagePosition ?? "center" }} />
          <button type="button" className="creator-reference-back" onClick={onClose} aria-label={copy.creator.closeAria}><CaretLeft size={16} aria-hidden="true" /></button>
        </header>
        <section className="creator-reference-identity">
          <h1 id="creator-profile-title">{heroPiece.creator}</h1>
          <p className="creator-reference-meta">{[editorialCreators[creator.id]?.country ?? heroPiece.place, heroPiece.creatorDates].filter(Boolean).join(", ")}</p>
          {!creator.id.startsWith("unknown-") ? <div className="creator-reference-actions">
            <FollowButton
              following={following} followLabel={saveCopy.save} followingLabel={saveCopy.saved}
              ariaLabel={following ? `${saveCopy.saved} ${heroPiece.creator}. ${saveCopy.unsave}` : `${saveCopy.save} ${heroPiece.creator}`}
              onClick={() => toggleFollow(creator.id)}
            />
          </div> : null}
        </section>
        <div className="creator-reference-tabs" role="tablist" aria-label={heroPiece.creator}>
          {tabs.map(item => <button key={item} ref={element => { tabRefs.current[item] = element; }} id={`creator-tab-${item}`}
            type="button" role="tab" aria-selected={tab === item} aria-controls={`creator-panel-${item}`} tabIndex={tab === item ? 0 : -1}
            onClick={() => selectTab(item)} onKeyDown={event => handleTabKey(event, item)}>
            {labels[item]}
          </button>)}
          <span className="creator-reference-tab-indicator" aria-hidden="true" style={{ transform: `translateX(${tabs.indexOf(tab) * 100}%)` }} />
        </div>
        {tabs.map(item => <section key={item} className="creator-reference-panel" id={`creator-panel-${item}`} role="tabpanel"
          aria-labelledby={`creator-tab-${item}`} hidden={tab !== item} tabIndex={0}>
          {tab === item && (item === "biography" ? <div className="creator-reference-biography">
            {biography && <p>{biography}</p>}
            <dl className="creator-reference-facts">
              <div><dt>{labels.region}</dt><dd>{editorialCreators[creator.id]?.country ?? heroPiece.place}</dd></div>
              {heroPiece.creatorDates && <div><dt>{creator.id.startsWith("unknown-") ? labels.period : labels.dates}</dt><dd>{heroPiece.creatorDates}</dd></div>}
              <div><dt>{labels.form}</dt><dd>{forms}</dd></div>
              <div><dt>{labels.context}</dt><dd>{contexts}</dd></div>
            </dl>
          </div> : <>
            {item === "overview" ? <div className="creator-reference-overview">
              {biography && <p>{biography}</p>}
              <button type="button" className="creator-reference-more" onClick={() => selectTab("biography", true)}>{labels.more}<CaretRight size={18} aria-hidden="true" /></button>
            </div> : null}
            {artworks}
          </>)}
        </section>)}
      </article>
    </MobileScroll>
    <ArtworkFilterSheet open={filtersOpen} onOpenChange={setFiltersOpen} locale={locale}
      {...galleryControlCopy(locale, labels.artworks)} sort={sort} onSort={setSort}
      medium={medium} onMedium={setMedium} allMedium="all" filters={filters} onFilters={setFilters} artworks={creatorPieces}
      savedOnly={savedOnly === "saved"} onSavedOnly={value => setSavedOnly(value ? "saved" : "all")} savedOnlyLabel={labels.saved} allWorksLabel={labels.all} />
  </>;
}

// The seven editorial categories remain separate from the legacy artwork-medium filters.
// Covers identify navigation categories; they do not add unpublished works to the catalogue.
const DISCOVER_ART_CATEGORIES: readonly { id: ArtCategoryId; form?: FormId; image: string }[] = [
  { id: "architecture", form: "Architecture", image: "/assets/categories/architecture.jpg" },
  { id: "sculpture", form: "Sculpture", image: approvedPieces.find(piece => piece.id === "michelangelo-david")!.image },
  { id: "painting", form: "Painting", image: approvedPieces.find(piece => piece.id === "death-of-marat")!.image },
  { id: "music", form: "Music", image: approvedPieces.find(piece => piece.id === "billie-holiday-strange-fruit")!.image },
  { id: "literature", form: "Literature", image: approvedPieces.find(piece => piece.id === "animal-farm")!.image },
  { id: "theater", form: "Performance", image: "/assets/content/noh-mask.jpg" },
  { id: "cinema", form: "Film", image: approvedPieces.find(piece => piece.id === "soul")!.image },
];

const ART_CATEGORY_COPY: Record<Locale, { names: Record<ArtCategoryId, string>; emptyTitle: string; emptyBody: string }> = {
  en: { names: { architecture: "Architecture", sculpture: "Sculpture", painting: "Painting", music: "Music", literature: "Literature", theater: "Theater", cinema: "Cinema" }, emptyTitle: "No artworks in this category yet", emptyBody: "Explore another category." },
  "pt-BR": { names: { architecture: "Arquitetura", sculpture: "Escultura", painting: "Pintura", music: "Música", literature: "Literatura", theater: "Teatro", cinema: "Cinema" }, emptyTitle: "Ainda não há obras nesta categoria", emptyBody: "Explore outra categoria." },
  it: { names: { architecture: "Architettura", sculpture: "Scultura", painting: "Pittura", music: "Musica", literature: "Letteratura", theater: "Teatro", cinema: "Cinema" }, emptyTitle: "Non ci sono ancora opere in questa categoria", emptyBody: "Esplora un’altra categoria." },
  es: { names: { architecture: "Arquitectura", sculpture: "Escultura", painting: "Pintura", music: "Música", literature: "Literatura", theater: "Teatro", cinema: "Cine" }, emptyTitle: "Aún no hay obras en esta categoría", emptyBody: "Explora otra categoría." },
};

const DISCOVER_COPY = {
  en: { search: "Search", collections: "Collections", discover: "Discover something new", gallery: "Gallery", all: "All", picks: "Our picks", loved: "Most loved", style: "Style", medium: "Medium", place: "Country", japan: "Japan", categories: "Explore by category", grid: "Grid view", list: "List view", reset: "Show all", viewAll: "View all", back: "Back", backToSearch: "Back to Search", works: (count: number) => `${count} works` },
  "pt-BR": { search: "Buscar", collections: "Coleções", discover: "Descubra algo novo", gallery: "Galeria", all: "Todos", picks: "Seleção", loved: "Mais curtidos", style: "Estilo", medium: "Técnica", place: "País", japan: "Japão", categories: "Explore por categoria", grid: "Vista em grade", list: "Vista em lista", reset: "Mostrar todos", viewAll: "Ver todas", back: "Voltar", backToSearch: "Voltar à busca", works: (count: number) => `${count} obras` },
  it: { search: "Cerca", collections: "Collezioni", discover: "Scopri qualcosa di nuovo", gallery: "Galleria", all: "Tutti", picks: "La nostra selezione", loved: "Più amati", style: "Stile", medium: "Tecnica", place: "Paese", japan: "Giappone", categories: "Esplora per categoria", grid: "Vista a griglia", list: "Vista elenco", reset: "Mostra tutti", viewAll: "Vedi tutte", back: "Indietro", backToSearch: "Torna alla ricerca", works: (count: number) => `${count} opere` },
  es: { search: "Buscar", collections: "Colecciones", discover: "Descubre algo nuevo", gallery: "Galería", all: "Todos", picks: "Selección", loved: "Más populares", style: "Estilo", medium: "Técnica", place: "País", japan: "Japón", categories: "Explora por categoría", grid: "Vista de cuadrícula", list: "Vista de lista", reset: "Mostrar todos", viewAll: "Ver todas", back: "Volver", backToSearch: "Volver a la búsqueda", works: (count: number) => `${count} obras` },
};

const GALLERY_FILTER_COPY = {
    en: { trigger: "Filters", active: "Sorting or filters applied", reset: "Reset filters", done: "Done" },
    "pt-BR": { trigger: "Filtros", active: "Ordenação ou filtros aplicados", reset: "Redefinir filtros", done: "Concluir" },
    it: { trigger: "Filtri", active: "Ordinamento o filtri applicati", reset: "Reimposta filtri", done: "Fine" },
    es: { trigger: "Filtros", active: "Orden o filtros aplicados", reset: "Restablecer filtros", done: "Listo" },
};

const GALLERY_MEDIUM_OPTIONS: ("all" | FormId)[] = ["all", ...new Set(pieces.map(piece => piece.form))];

function galleryControlCopy(locale: Locale, group: string) {
  const labels = DISCOVER_COPY[locale];
  const sort = CREATOR_PROFILE_COPY[locale];
  return {
    labels: { ...GALLERY_FILTER_COPY[locale], group, grid: labels.grid, list: labels.list, title: sort.sortFilter, sortBy: sort.sortBy, medium: labels.medium },
    sortOptions: [{ value: "featured", label: sort.featured }, { value: "ascending", label: sort.ascending }, { value: "descending", label: sort.descending }] as const,
    mediumOptions: GALLERY_MEDIUM_OPTIONS.map(value => ({ value, label: value === "all" ? labels.all : FORM_LABELS[locale][value] })),
  };
}

function DiscoverScreen({ variant: studyVariant, pieces: displayPieces, collections: displayCollections, locale, copy, browse, onBrowse, onOpenPiece, onOpenCollection, onOpenCreator, onOpenProfile, homeSearch }: {
  homeSearch?: { origin: TodaySearchOrigin | null; onClose: () => void; onActivate: (target: HTMLElement) => void };
  variant: ExploreStudyVariant | null;
  pieces: Piece[]; collections: Collection[]; locale: Locale; copy: UiCopy;
  browse: DiscoverBrowseState; onBrowse: (state: DiscoverBrowseState) => void;
  onOpenPiece: (id: PieceId) => void; onOpenCollection: (id: CollectionId) => void; onOpenCreator: (id: CreatorId) => void;
  onOpenProfile: (id: string) => void;
}) {
  const variant = studyVariant ?? "compact-browse";
  const mainExplore = !studyVariant;
  const reducedSearchMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const labels = DISCOVER_COPY[locale];
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [gallerySort, setGallerySort] = useState<GallerySort>("featured");
  const [artworkFilters, setArtworkFilters] = useState(createEmptyArtworkFilters);
  const [galleryMedium, setGalleryMedium] = useState<"all" | FormId>("all");
  const expandedReturn = useRef<number | null>(null);
  const restoreExpanded = useRef(false);
  const categoryCopy = ART_CATEGORY_COPY[locale];
  const keyboard = useKeyboard();
  const galleryRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLElement>(null);
  const browseReturn = useRef<{ scrollTop: number; selector: string } | null>(null);
  const restoreBrowse = useRef(false);
  const focusGallery = useRef(false);
  const { query, filter, form, selection, layout } = browse;
  const category = DISCOVER_ART_CATEGORIES.find(item => selection === `category:${item.id}`);
  const drilldown = filter === "artworks" && (form !== "all" || selection !== "all");
  const filtering = Boolean(homeSearch || query.trim() || drilldown || filter !== "artworks");
  const fieldFilters: SearchFilter[] = ["artworks", "artists", "accounts", "medium"];
  const mediumOptions = GALLERY_MEDIUM_OPTIONS;
  const isHomeSearch = Boolean(homeSearch);
  useEffect(() => {
    if (!isHomeSearch) return;
    const scroll = pageRef.current?.closest<HTMLElement>(".mobile-scroll");
    if (scroll) scroll.scrollTop = 0;
  }, [isHomeSearch, query, filter, form, galleryMedium, gallerySort, artworkFilters]);
  const results = useMemo(() => {
    const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
    const matches = displayPieces.filter(piece => {
      if (category && piece.form !== category.form) return false;
      if (form !== "all" && piece.form !== form) return false;
      if (galleryMedium !== "all" && piece.form !== galleryMedium) return false;
      if (selection === "renaissance" && PIECE_CONTEXT[piece.id].en !== "Renaissance") return false;
      if (selection === "photography" && piece.form !== "Photography") return false;
      if (selection === "japan" && !collections.find(collection => collection.id === "japan-motion")?.pieceIds.includes(piece.id)) return false;
      const text = normalizeSearch([piece.title, piece.creator, piece.place, FORM_LABELS[locale][piece.form], PIECE_CONTEXT[piece.id][locale], piece.kicker, ...piece.story].join(" "));
      return terms.every(term => text.includes(term));
    });
    // These are the prototype's existing sample counts, not a live popularity feed.
    const ordered = selection === "loved" && gallerySort === "featured" ? matches.sort((a, b) => b.favoriteCount - a.favoriteCount) : matches;
    return filterAndSortArtworks(ordered, gallerySort, artworkFilters, locale);
  }, [category, displayPieces, form, galleryMedium, gallerySort, artworkFilters, locale, query, selection]);

  const artistResults = useMemo(() => {
    const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
    return creators.filter(creator => !creator.id.startsWith("unknown-")).flatMap(creator => {
      const works = displayPieces.filter(piece => piece.creatorId === creator.id);
      const piece = works.find(item => item.id === creator.heroPieceId) ?? works[0];
      if (!piece || !terms.every(term => normalizeSearch(`${piece.creator} ${piece.place}`).includes(term))) return [];
      return [{ id: creator.id, name: piece.creator, image: piece.image, imagePosition: piece.imagePosition,
        details: [editorialCreators[piece.creatorId]?.country ?? piece.place, piece.creatorDates].filter(Boolean).join(", "), worksCount: works.length }];
    });
  }, [displayPieces, query]);
  const accountResults = useMemo(() => getSearchAccounts(query), [query]);
  const resultCount = filter === "artists" ? artistResults.length : filter === "accounts" ? accountResults.length : results.length;
  const artworkResults = filter === "artworks" || filter === "medium";
  const entityEmpty = {
    en: { artists: "No artists found", accounts: "No accounts found", hint: "Try another name." },
    "pt-BR": { artists: "Nenhum artista encontrado", accounts: "Nenhuma conta encontrada", hint: "Tente outro nome." },
    it: { artists: "Nessun artista trovato", accounts: "Nessun account trovato", hint: "Prova un altro nome." },
    es: { artists: "No se encontraron artistas", accounts: "No se encontraron cuentas", hint: "Prueba otro nombre." },
  }[locale];

  useLayoutEffect(() => {
    if (restoreExpanded.current) {
      restoreExpanded.current = false;
      const scroll = pageRef.current?.closest<HTMLElement>(".mobile-scroll");
      if (scroll) scroll.scrollTop = expandedReturn.current ?? 0;
      const target = pageRef.current?.querySelector<HTMLElement>(".discover-show-all") ?? pageRef.current?.querySelector<HTMLElement>(".discover-sort-filter");
      target?.focus({ preventScroll: true });
      return;
    }
    if (restoreBrowse.current) {
      restoreBrowse.current = false;
      const scroll = pageRef.current?.closest<HTMLElement>(".mobile-scroll");
      if (scroll) scroll.scrollTop = browseReturn.current?.scrollTop ?? 0;
      const target = browseReturn.current
        ? pageRef.current?.querySelector<HTMLElement>(browseReturn.current.selector)
        : pageRef.current?.querySelector<HTMLElement>(".discover-search input");
      target?.focus({ preventScroll: true });
      return;
    }
    if (!focusGallery.current) return;
    focusGallery.current = false;
    galleryRef.current?.focus({ preventScroll: true });
    galleryRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [browse, galleryExpanded]);

  function choose(nextForm: DiscoverBrowseState["form"], nextSelection: DiscoverSelection = "all", trigger?: HTMLButtonElement) {
    setGalleryMedium("all");
    if (trigger && !filtering) {
      const scroll = pageRef.current?.closest<HTMLElement>(".mobile-scroll");
      browseReturn.current = {
        scrollTop: scroll?.scrollTop ?? 0,
        selector: nextForm !== "all" ? `[data-discover-form="${nextForm}"]` : `[data-discover-selection="${nextSelection}"]`,
      };
    }
    keyboard.hide();
    focusGallery.current = true;
    onBrowse({ ...browse, query: "", filter: "artworks", form: nextForm, selection: nextSelection });
  }

  function openFullGallery() {
    expandedReturn.current = pageRef.current?.closest<HTMLElement>(".mobile-scroll")?.scrollTop ?? 0;
    keyboard.hide();
    focusGallery.current = true;
    setGalleryExpanded(true);
  }

  function closeFullGallery() {
    restoreExpanded.current = true;
    setGalleryExpanded(false);
  }

  function returnToBrowse() {
    keyboard.hide();
    focusGallery.current = false;
    restoreBrowse.current = true;
    onBrowse({ ...browse, query: "", filter: "artworks", form: "all", selection: "all" });
  }

  const shortcuts: { selection: DiscoverSelection; eyebrow: string; title: string }[] = [
    { selection: "loved", eyebrow: labels.picks, title: labels.loved },
    { selection: "renaissance", eyebrow: labels.style, title: PIECE_CONTEXT["chart-of-hell"][locale] },
    { selection: "photography", eyebrow: labels.medium, title: FORM_LABELS[locale].Photography },
    { selection: "japan", eyebrow: labels.place, title: labels.japan },
  ];
  const galleryTitle = !artworkResults ? copy.search.filters[filter] : category ? categoryCopy.names[category.id] : form !== "all" ? FORM_LABELS[locale][form]
    : shortcuts.find(shortcut => shortcut.selection === selection)?.title ?? labels.gallery;

  const collectionsSection = variant ? <ExploreCollections key="collections" variant={variant} collections={displayCollections} artworks={displayPieces} title={labels.collections} worksLabel={labels.works} onOpen={onOpenCollection} /> : (
    <section key="collections" className="discover-featured" aria-labelledby="discover-collections-title">
            <header className="discover-section-heading"><h2 id="discover-collections-title">{labels.collections}</h2></header>
            <Carousel className="discover-featured-rail" contentClassName="discover-featured-track" ariaLabel={labels.collections}>
              {displayCollections.map(collection => <button key={collection.id} type="button" className="discover-collection-card" onClick={() => onOpenCollection(collection.id)}>
                <img src={collection.image} alt="" draggable={false} />
                <span className="discover-card-copy"><strong>{collection.title}</strong><span>{labels.works(collection.pieceIds.length)}</span></span>
              </button>)}
            </Carousel>
          </section>
  );
  const shortcutsSection = (
    <section key="shortcuts" className="discover-new" aria-labelledby="discover-new-title">
            <header className="discover-section-heading"><h2 id="discover-new-title">{labels.discover}</h2></header>
            <div className="discover-tiles">
              {shortcuts.map(shortcut => <button key={shortcut.selection} type="button" className="discover-tile" data-discover-selection={shortcut.selection} onClick={event => choose("all", shortcut.selection, event.currentTarget)}>
                <small>{shortcut.eyebrow}</small><span>{shortcut.title}</span>
              </button>)}
            </div>
          </section>
  );
  const galleryPreview = mainExplore && !galleryExpanded && !filtering && !hasArtworkFilters(artworkFilters) && galleryMedium === "all";
  const visibleResults = galleryPreview ? results.slice(0, 9) : results;
  const gallerySection = (
    <section key="gallery" ref={galleryRef} className="discover-gallery" tabIndex={-1} aria-labelledby="discover-gallery-title">
          <header className="discover-gallery-heading">
            <div className="discover-gallery-title">
              {(drilldown || galleryExpanded) && <button type="button" className="discover-back" onClick={galleryExpanded ? closeFullGallery : returnToBrowse} aria-label={labels.backToSearch}><CaretLeft size={14} aria-hidden="true" /></button>}
              <h2 id="discover-gallery-title">{galleryTitle}</h2>
            </div>
            {artworkResults && <GalleryControls {...galleryControlCopy(locale, labels.gallery)}
              layout={layout} onLayout={next => onBrowse({ ...browse, layout: next })}
              sort={gallerySort} onSort={setGallerySort} medium={galleryMedium} onMedium={setGalleryMedium}
              allMedium="all" allowFilters={mainExplore} locale={locale} filters={artworkFilters} onFilters={setArtworkFilters} artworks={displayPieces} />}
          </header>
          {(filtering || galleryExpanded || galleryMedium !== "all" || hasArtworkFilters(artworkFilters)) ? <div className="discover-results-status">
            <span aria-live="polite">{copy.search.resultCount(resultCount)}</span>
            {!drilldown && resultCount > 0 && (query.trim() || form !== "all") && <button type="button" className="discover-text-action" onClick={() => onBrowse({ ...browse, query: "", form: "all", selection: "all" })}>{labels.reset}</button>}
          </div> : null}
          {resultCount ? filter === "artists" ? <SearchArtistResults artists={artistResults} locale={locale} onOpenArtist={id => { keyboard.hide(); onOpenCreator(id as CreatorId); }} />
            : filter === "accounts" ? <SearchAccountResults people={accountResults} locale={locale} onOpenProfile={onOpenProfile} />
            : <div className="discover-gallery-grid" data-layout={layout}>
            {visibleResults.map(piece => layout === "list" ? <ArtworkListRow key={piece.id} artwork={piece} className="discover-artwork-card" onOpen={onOpenPiece} /> : <button key={piece.id} type="button" className="discover-artwork-card" data-piece-id={piece.id} onClick={() => onOpenPiece(piece.id)}>
              <img src={piece.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: piece.imagePosition ?? "center" }} />
              <span className="discover-card-copy"><strong>{piece.title}</strong><span>{piece.creator}</span></span>
            </button>)}
          </div> : <div className="discover-empty"><h3>{category ? categoryCopy.emptyTitle : artworkResults ? copy.search.emptyTitle : entityEmpty[filter as "artists" | "accounts"]}</h3><p>{category ? categoryCopy.emptyBody : artworkResults ? copy.search.emptyBody : entityEmpty.hint}</p></div>}
          {galleryPreview && results.length > visibleResults.length && <button type="button" className="discover-show-all" onClick={openFullGallery}>
            {labels.viewAll}
          </button>}
        </section>
  );
  const sections = variant === "gallery-first" ? [gallerySection, collectionsSection, shortcutsSection]
    : variant === "collections-first" ? [collectionsSection, gallerySection, shortcutsSection]
    : variant === "compact-browse" ? mainExplore ? [shortcutsSection, gallerySection] : [shortcutsSection, gallerySection, collectionsSection]
    : [collectionsSection, shortcutsSection, gallerySection];
  const conceptProps = { artworks: displayPieces, collections: displayCollections, locale, gallery: filtering ? null : gallerySection,
    onOpenPiece: (id: string) => onOpenPiece(id as PieceId), onOpenCollection: (id: string) => onOpenCollection(id as CollectionId) };
  const concept = variant === "editorial" ? <ExploreEditorial {...conceptProps} />
    : variant === "rooms" ? <ExploreRooms {...conceptProps} />
    : variant === "index" ? <ExploreIndex {...conceptProps} />
    : variant === "switchboard" ? <ExploreSwitchboard {...conceptProps} />
    : variant === "lenses" ? <ExploreLenses {...conceptProps} />
    : variant === "stream" ? <ExploreStream {...conceptProps} /> : null;

  return (
    <>
    <MobileScroll className="app-scroll">
      <main ref={pageRef} className="page discover-page discover-paper" data-explore-variant={variant ?? undefined} data-gallery-expanded={galleryExpanded} aria-label={copy.search.title}
        onClickCapture={event => {
          if (!homeSearch) return;
          // MobileScroll suppresses drag clicks before they reach this capture handler.
          const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>("button") : null;
          if (!target) return;
          target.focus({ preventScroll: true });
          homeSearch.onActivate(target);
          keyboard.hide();
        }}
        onKeyDown={event => {
          if (event.key !== "Escape" || (!drilldown && !galleryExpanded) || event.defaultPrevented) return;
          event.preventDefault();
          if (galleryExpanded) closeFullGallery(); else returnToBrowse();
        }}>
        {!galleryExpanded && <div className="discover-tools">
          <motion.div className="discover-search"
            initial={homeSearch && !reducedSearchMotion ? { clipPath: "inset(5px 0px 5px calc(100% - 22px) round 999px)", y: (homeSearch.origin?.top ?? 69) - 69, x: 4 } : false}
            animate={homeSearch ? { clipPath: "inset(0px 0px 0px 0px round 999px)", y: 0, x: 0 } : undefined}
            transition={{ duration: reducedSearchMotion ? 0 : .32, ease: [.22, 1, .36, 1] }}>
            <SearchIcon size={16} aria-hidden="true" />
            <KeyboardInput ref={inputRef}
              aria-label={copy.search.inputAria}
              placeholder={labels.search}
              value={query}
              onChange={event => onBrowse({ ...browse, query: event.target.value, form: filter === "medium" ? form : "all", selection: "all" })}
              onBlur={event => {
                if (homeSearch && event.relatedTarget instanceof Element && event.relatedTarget.closest(".home-search-surface button")) return;
                keyboard.hide();
              }}
              onKeyDown={event => {
                if (homeSearch && event.key.startsWith("Arrow")) event.stopPropagation();
                if (homeSearch && event.key === "ArrowDown") {
                  const first = galleryRef.current?.querySelector<HTMLButtonElement>(".discover-artwork-card, .search-artist-open, .search-account-open");
                  if (first) { event.preventDefault(); keyboard.hide(); first.focus({ preventScroll: true }); }
                }
                if (event.key === "Enter") {
                  keyboard.hide();
                  galleryRef.current?.focus({ preventScroll: true });
                  if (!homeSearch) galleryRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
                }
              }}
            />
            {query ? <button className={homeSearch ? "home-search-clear" : undefined} type="button" aria-label={copy.search.clearAria} onClick={() => { onBrowse({ ...browse, query: "" }); if (homeSearch) inputRef.current?.focus({ preventScroll: true }); }}>
              {homeSearch ? { en: "Clear", "pt-BR": "Limpar", it: "Cancella", es: "Borrar" }[locale] : <X size={16} />}
            </button> : null}
            {homeSearch && <button className="home-search-close" type="button" aria-label={{ en: "Close search", "pt-BR": "Fechar busca", it: "Chiudi ricerca", es: "Cerrar búsqueda" }[locale]}
              onClick={homeSearch.onClose}><X size={16} aria-hidden="true" /></button>}
          </motion.div>
          <Carousel className="discover-field-filter-rail" contentClassName="discover-field-filter-track" ariaLabel={copy.search.filtersAria}>
            <SelectionPill className="discover-field-selection" ariaLabel={copy.search.filtersAria} value={filter}
              options={fieldFilters.map(item => ({ value: item, label: copy.search.filters[item] }))}
              onChange={next => { setGalleryMedium("all"); onBrowse({ ...browse, filter: next, form: "all", selection: "all" }); }} />
          </Carousel>
          {filter === "medium" && <Carousel className="discover-medium-rail" contentClassName="discover-field-filter-track" ariaLabel={labels.medium}>
            <SelectionPill className="discover-medium-selection" ariaLabel={labels.medium} value={form}
              options={mediumOptions.map(item => ({ value: item, label: item === "all" ? labels.all : FORM_LABELS[locale][item] }))}
              onChange={next => { setGalleryMedium("all"); onBrowse({ ...browse, form: next, selection: "all" }); }} />
          </Carousel>}
        </div>}

        {galleryExpanded ? gallerySection : concept ? <>
          <div hidden={filtering} inert={filtering}>{concept}</div>
          {filtering && gallerySection}
        </> : filtering ? gallerySection : sections}

        {!filtering && !galleryExpanded ? <section className="discover-categories" aria-labelledby="discover-categories-title">
          <header className="discover-section-heading"><h2 id="discover-categories-title">{labels.categories}</h2></header>
          <div className="discover-category-grid">
            {DISCOVER_ART_CATEGORIES.map(item => {
              const piece = displayPieces.find(piece => piece.form === item.form);
              const categorySelection: DiscoverSelection = `category:${item.id}`;
              return <button key={item.id} type="button" className="discover-category-card" data-discover-category={item.id} data-discover-selection={categorySelection} onClick={event => choose("all", categorySelection, event.currentTarget)}>
                <img src={piece?.image ?? item.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: piece?.imagePosition ?? "center" }} />
                <span>{categoryCopy.names[item.id]}</span>
              </button>;
            })}
          </div>
        </section> : null}
      </main>
    </MobileScroll>

    </>
  );
}

function SettingsScreen({
  preferences,
  favouritesCount,
  folderCount,
  currentReader,
  copy,
  onPreference,
  onOpenSheet,
  onViewProfile,
  onShareProfile,
  sharingProfile,
  onRate,
}: {
  preferences: Preferences;
  favouritesCount: number;
  folderCount: number;
  currentReader: SavedPerson;
  copy: UiCopy;
  onPreference: <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => void;
  onOpenSheet: (sheet: SheetId) => void;
  onViewProfile: () => void;
  onShareProfile: () => void;
  sharingProfile: boolean;
  onRate: () => void;
}) {
  const languageLabel = LOCALE_OPTIONS.find((option) => option.value === preferences.locale)?.label ?? LOCALE_OPTIONS[0].label;
  return (
    <MobileScroll className="app-scroll">
      <main className="page settings-page">
        <header className="settings-account-header"><h1>{copy.settings.accountTitle}</h1></header>
        <section className="settings-account-card" aria-label={currentReader.name} tabIndex={-1}>
          <div className="settings-account-identity">
            <SaverAvatar person={currentReader} />
            <div className="settings-account-copy">
              <strong>{currentReader.name}</strong>
              <span>{copy.settings.libraryCounts(favouritesCount, folderCount)}</span>
            </div>
          </div>
          <div className="settings-profile-actions">
            <button type="button" className="settings-profile-action settings-view-profile" onClick={onViewProfile}>{copy.settings.viewProfile}</button>
            <button type="button" className="settings-profile-action settings-share-profile" onClick={onShareProfile} disabled={sharingProfile} aria-busy={sharingProfile}>{copy.settings.shareProfile}</button>
          </div>
        </section>

        <h2 className="settings-section-heading">{copy.settings.title}</h2>

        <div className="settings-menu" aria-label={copy.settings.title}>
          <SettingsMenuRow title={copy.settings.switchAccounts} onClick={() => onOpenSheet("switchAccounts")} />
          <SettingsMenuRow title={copy.settings.language} detail={languageLabel} onClick={() => onOpenSheet("language")} />
          <SettingsMenuRow title={copy.settings.notifications} detail={preferences.notifications ? preferences.notificationTime : copy.settings.off} onClick={() => onOpenSheet("notifications")} />
          <SettingsMenuRow title={copy.settings.widget} detail={widgetLabel(preferences.widget, copy)} onClick={() => onOpenSheet("widget")} />
          <SettingsMenuRow title={copy.settings.storyRepeats} detail={cadenceLabel(preferences.cadence, copy)} onClick={() => onOpenSheet("cadence")} />
        </div>

        <div className="settings-preferences">
          <PreferenceRow label={copy.settings.units}>
            <SegmentedControl
              label={copy.settings.units}
              value={preferences.units}
              options={[
                { value: "metric", label: copy.settings.centimeters },
                { value: "imperial", label: copy.settings.inches },
              ] as const}
              onChange={(value) => onPreference("units", value)}
            />
          </PreferenceRow>
          <PreferenceRow label={copy.settings.textSize}>
            <SegmentedControl
              label={copy.settings.textSize}
              value={preferences.textSize}
              options={[
                { value: "default", label: copy.settings.defaultSize },
                { value: "large", label: copy.settings.largeSize },
                { value: "system", label: copy.settings.systemSize },
              ] as const}
              onChange={(value) => onPreference("textSize", value)}
            />
          </PreferenceRow>
          <PreferenceRow label={copy.settings.theme}>
            <SegmentedControl
              label={copy.settings.theme}
              value={preferences.theme}
              options={[
                { value: "light", label: copy.settings.lightTheme },
                { value: "dark", label: copy.settings.darkTheme },
                { value: "system", label: copy.settings.systemTheme },
              ] as const}
              onChange={(value) => onPreference("theme", value)}
            />
          </PreferenceRow>
        </div>

        <div className="settings-secondary-menu">
          <h2 className="settings-section-heading">{copy.settings.other}</h2>
          <SettingsMenuRow title={copy.settings.aboutProject} detail={copy.settings.versionLabel} onClick={() => onOpenSheet("about")} />
          <SettingsMenuRow title={copy.settings.rateApp} onClick={onRate} />
          <SettingsMenuRow title={copy.settings.legal} onClick={() => onOpenSheet("legal")} />
        </div>

      </main>
    </MobileScroll>
  );
}

function CollectionDetail({ collection, pieces: displayPieces, locale, copy, isSaved, onClose, onOpenPiece, onSave, onShare }: { collection: Collection; pieces: Piece[]; locale: Locale; copy: UiCopy; isSaved: boolean; onClose: () => void; onOpenPiece: (id: PieceId) => void; onSave: () => void; onShare: () => void }) {
  const related = collection.pieceIds.map((id) => getPiece(displayPieces, id));
  return (
    <MobileScroll className="collection-scroll">
      <article className="collection-detail">
        <div className="collection-hero">
          <img src={collection.image} alt="" />
          <div className="collection-gradient" />
          <button className="hero-control hero-back" type="button" onClick={onClose} aria-label={copy.aria.closeCollection}><CaretLeft size={22} weight="regular" /></button>
          <div className="collection-actions">
            <LikeButton className="round-action" liked={isSaved} onClick={onSave} aria-label={isSaved ? copy.aria.removeCollection : copy.aria.saveCollection} />
            <button type="button" className="round-action" onClick={onShare} aria-label={copy.aria.shareCollection}><Share size={20} weight="regular" /></button>
          </div>
          <div className="collection-hero-copy"><p>{[copy.discover.storyCount(related.length), ...collection.eyebrow.split(" · ").slice(1)].join(" · ")}</p><h1>{collection.title}</h1><span>{collection.description}</span></div>
        </div>
        <div className="collection-body">
          <p className="eyebrow">{copy.collection.curatorNote}</p>
          <p className="collection-intro">{copy.collection.intro}</p>
          <div className="collection-piece-stack">
            {related.map(piece => <ArtworkListRow key={piece.id} artwork={piece} onOpen={onOpenPiece} />)}
          </div>
          <div className="collection-signoff"><Sparkle size={20} weight="fill" /><p>{copy.collection.signoff}</p></div>
        </div>
      </article>
    </MobileScroll>
  );
}

function PieceCard({ piece, locale, onOpen }: { piece: Piece; locale: Locale; onOpen: () => void }) {
  return (
    <ArtworkCard image={piece.image} title={piece.title} creator={piece.creator} meta={<>{piece.place} · {FORM_LABELS[locale][piece.form]}</>} imagePosition={piece.imagePosition} onOpen={onOpen} />
  );
}

function PieceRow({ piece, locale, onOpen, variant = "standard" }: { piece: Piece; locale: Locale; onOpen: () => void; variant?: "standard" | "favourite" }) {
  return (
    <button type="button" className="piece-row" onClick={onOpen}>
      <img src={piece.image} alt="" style={{ objectPosition: piece.imagePosition ?? "center" }} />
      {variant === "favourite" ? (
        <span className="piece-row-copy favourite-piece-copy"><strong>{piece.title}</strong><em>{piece.creator}</em><time>{piece.year}</time></span>
      ) : (
        <span className="piece-row-copy"><small>{piece.place} · {FORM_LABELS[locale][piece.form]}</small><strong>{piece.title}</strong><em>{piece.creator}, {piece.year}</em></span>
      )}
      {variant === "standard" ? <CaretRight size={17} /> : null}
    </button>
  );
}

function SectionHeading({ title, action }: { title: string; action?: string }) {
  return <div className="section-heading"><h2>{title}</h2>{action ? <button type="button">{action}<CaretRight size={14} /></button> : null}</div>;
}

function Switch({ ariaLabel, checked, onChange }: { ariaLabel: string; checked: boolean; onChange: () => void }) {
  return <Toggle ariaLabel={ariaLabel} checked={checked} onChange={onChange} />;
}

function SettingsMenuRow({ title, detail, onClick }: { title: string; detail?: string; onClick: () => void }) {
  return <button type="button" className="settings-menu-row" onClick={onClick}><span>{title}</span>{detail ? <SettingsValue value={detail} /> : null}<CaretRight size={19} /></button>;
}

function SettingsValue({ value }: { value: string }) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  useLayoutEffect(() => {
    const changed = previous.current !== value;
    previous.current = value;
    if (!changed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = labelRef.current?.animate(
      [{ transform: "translateY(100%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: 220, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );
    return () => animation?.cancel();
  }, [value]);
  return <small className="settings-value"><span ref={labelRef}>{value}</span></small>;
}

function PreferenceRow({ label, children }: { label: string; children: ReactNode }) {
  return <div className="preference-row"><span>{label}</span>{children}</div>;
}

function SegmentedControl<Value extends string>({ label, options, value, onChange }: { label: string; options: readonly { value: Value; label: string }[]; value: Value; onChange: (value: Value) => void }) {
  return <SelectionPill className="segmented-control" ariaLabel={label} options={options} value={value} onChange={onChange} />;
}

function SheetOptions<Value extends string>({ options, selected, onSelect, onCommit, ariaLabel }: { options: readonly { value: Value; label: string }[]; selected: Value; onSelect: (value: Value) => void; onCommit?: (value: Value) => void; ariaLabel: string }) {
  return <SelectionPill className="sheet-options" orientation="vertical" ariaLabel={ariaLabel} options={options} value={selected} onChange={onSelect} onCommit={onCommit} />;
}
