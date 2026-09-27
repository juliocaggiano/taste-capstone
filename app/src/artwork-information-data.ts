import { editorialCreators } from "./editorial-information";
// Factual summaries for the prototype. Sources and scope: qa/artwork-information-2026-09-21/content-sources.md.
type InformationLocale = "en" | "pt-BR" | "it" | "es";

const legacyCreatorBiographies: Record<string, Record<InformationLocale, string>> = {
  "jacques-louis-david": {
    en: "Jacques-Louis David was a French painter whose work helped define Neoclassicism. He painted ancient history and contemporary politics, supporting the French Revolution before becoming Napoleon’s official painter.",
    "pt-BR": "Jacques-Louis David foi um pintor francês cuja obra ajudou a definir o neoclassicismo. Pintou a história antiga e a política de seu tempo, apoiando a Revolução Francesa antes de se tornar pintor oficial de Napoleão.",
    it: "Jacques-Louis David fu un pittore francese la cui opera contribuì a definire il Neoclassicismo. Dipinse la storia antica e la politica del suo tempo, sostenendo la Rivoluzione francese prima di diventare pittore ufficiale di Napoleone.",
    es: "Jacques-Louis David fue un pintor francés cuya obra ayudó a definir el neoclasicismo. Pintó la historia antigua y la política de su tiempo, apoyando la Revolución francesa antes de convertirse en pintor oficial de Napoleón.",
  },
  "dante-alighieri": {
    en: "Dante Alighieri was a Florentine poet who wrote the Divine Comedy in Italian. Exiled from Florence in 1302, he spent his remaining years elsewhere in Italy and died in Ravenna.",
    "pt-BR": "Dante Alighieri foi um poeta florentino que escreveu a Divina Comédia em italiano. Exilado de Florença em 1302, passou o restante da vida em outras partes da Itália e morreu em Ravena.",
    it: "Dante Alighieri fu un poeta fiorentino che scrisse la Divina Commedia in volgare italiano. Esiliato da Firenze nel 1302, trascorse il resto della vita in altre città italiane e morì a Ravenna.",
    es: "Dante Alighieri fue un poeta florentino que escribió la Divina Comedia en italiano. Exiliado de Florencia en 1302, pasó el resto de su vida en otras partes de Italia y murió en Rávena.",
  },
  "sandro-botticelli": {
    en: "Sandro Botticelli was a Renaissance painter based in Florence, where he trained with Filippo Lippi. He made religious paintings and mythological scenes for patrons including the Medici family and their circle.",
    "pt-BR": "Sandro Botticelli foi um pintor renascentista de Florença, onde estudou com Filippo Lippi. Produziu pinturas religiosas e cenas mitológicas para patronos como a família Medici e seu círculo.",
    it: "Sandro Botticelli fu un pittore rinascimentale attivo a Firenze, dove si formò con Filippo Lippi. Realizzò dipinti religiosi e scene mitologiche per committenti tra cui la famiglia Medici e la sua cerchia.",
    es: "Sandro Botticelli fue un pintor renacentista activo en Florencia, donde se formó con Filippo Lippi. Creó pinturas religiosas y escenas mitológicas para mecenas como la familia Médici y su círculo.",
  },
  "katsushika-hokusai": {
    en: "Katsushika Hokusai was a Japanese artist who worked in Edo, now Tokyo. Across a career of more than seventy years, he produced paintings, woodblock print designs and illustrated books.",
    "pt-BR": "Katsushika Hokusai foi um artista japonês que trabalhou em Edo, hoje Tóquio. Em uma carreira de mais de setenta anos, produziu pinturas, desenhos para xilogravuras e livros ilustrados.",
    it: "Katsushika Hokusai fu un artista giapponese attivo a Edo, l’attuale Tokyo. In una carriera di oltre settant’anni realizzò dipinti, disegni per xilografie e libri illustrati.",
    es: "Katsushika Hokusai fue un artista japonés que trabajó en Edo, la actual Tokio. A lo largo de más de setenta años de carrera, produjo pinturas, diseños para xilografías y libros ilustrados.",
  },
  "unknown-japanese-artist": {
    en: "The maker of this mask has not been identified. Made in nineteenth-century Japan, it represents an old man, a character played in Noh theatre using masks of the Kojo type.",
    "pt-BR": "O autor desta máscara não foi identificado. Feita no Japão do século XIX, ela representa um homem idoso, personagem interpretado no teatro Noh com máscaras do tipo Kojo.",
    it: "L’autore di questa maschera non è stato identificato. Realizzata nel Giappone del XIX secolo, rappresenta un anziano, personaggio interpretato nel teatro Nō con maschere del tipo Kojo.",
    es: "El autor de esta máscara no ha sido identificado. Realizada en el Japón del siglo XIX, representa a un anciano, personaje interpretado en el teatro Noh con máscaras del tipo Kojo.",
  },
  "unknown-iranian-potter": {
    en: "The potter who made this bowl has not been identified. The tenth-century vessel belongs to a tradition of glazed ceramics decorated with Arabic inscriptions, where writing forms the main ornament.",
    "pt-BR": "O ceramista que fez esta tigela não foi identificado. A peça do século X pertence a uma tradição de cerâmicas vidradas decoradas com inscrições árabes, nas quais a escrita é o principal ornamento.",
    it: "Il ceramista che realizzò questa ciotola non è stato identificato. Il recipiente del X secolo appartiene a una tradizione di ceramiche invetriate con iscrizioni arabe, in cui la scrittura costituisce l’ornamento principale.",
    es: "El ceramista que hizo este cuenco no ha sido identificado. La pieza del siglo X pertenece a una tradición de cerámicas vidriadas con inscripciones árabes, donde la escritura constituye el ornamento principal.",
  },
  "dorothea-lange": {
    en: "Dorothea Lange was an American photographer who began with studio portraits in San Francisco. During the Great Depression, she turned to documentary work, photographing unemployed people and migrant farm workers for federal agencies.",
    "pt-BR": "Dorothea Lange foi uma fotógrafa americana que começou com retratos de estúdio em São Francisco. Durante a Grande Depressão, dedicou-se ao trabalho documental, fotografando desempregados e trabalhadores rurais migrantes para órgãos federais.",
    it: "Dorothea Lange fu una fotografa americana che iniziò con ritratti in studio a San Francisco. Durante la Grande Depressione passò alla fotografia documentaria, ritraendo disoccupati e lavoratori agricoli migranti per agenzie federali.",
    es: "Dorothea Lange fue una fotógrafa estadounidense que comenzó con retratos de estudio en San Francisco. Durante la Gran Depresión pasó al trabajo documental, fotografiando a desempleados y trabajadores agrícolas migrantes para organismos federales.",
  },
  "robert-wiene": {
    en: "Robert Wiene worked as a screenwriter and director in Germany and Austria from 1912. He directed The Cabinet of Dr. Caligari, whose painted sets made it a defining work of German Expressionist cinema.",
    "pt-BR": "Robert Wiene trabalhou como roteirista e diretor na Alemanha e na Áustria a partir de 1912. Dirigiu O Gabinete do Dr. Caligari, cujos cenários pintados marcaram o cinema expressionista alemão.",
    it: "Robert Wiene lavorò come sceneggiatore e regista in Germania e Austria dal 1912. Diresse Il gabinetto del dottor Caligari, le cui scenografie dipinte segnarono il cinema espressionista tedesco.",
    es: "Robert Wiene trabajó como guionista y director en Alemania y Austria desde 1912. Dirigió El gabinete del doctor Caligari, cuyos decorados pintados marcaron el cine expresionista alemán.",
  },
  "gustav-klimt": {
    en: "Gustav Klimt was an Austrian painter and a founding member of the Vienna Secession. His work included portraits, landscapes and decorative commissions; during his Golden Period, he incorporated metal leaf into paintings.",
    "pt-BR": "Gustav Klimt foi um pintor austríaco e um dos fundadores da Secessão de Viena. Sua obra incluiu retratos, paisagens e encomendas decorativas; em seu período dourado, incorporou folhas metálicas às pinturas.",
    it: "Gustav Klimt fu un pittore austriaco e uno dei fondatori della Secessione viennese. Realizzò ritratti, paesaggi e opere decorative su commissione; nel suo periodo aureo incorporò foglie metalliche nei dipinti.",
    es: "Gustav Klimt fue un pintor austríaco y uno de los fundadores de la Secesión de Viena. Su obra incluyó retratos, paisajes y encargos decorativos; durante su período dorado incorporó láminas metálicas a sus pinturas.",
  },
  "johannes-vermeer": {
    en: "Johannes Vermeer lived and worked in Delft in the seventeenth century. Alongside his work as an art dealer, he painted domestic scenes, city views and figures, paying close attention to light.",
    "pt-BR": "Johannes Vermeer viveu e trabalhou em Delft no século XVII. Além de atuar como negociante de arte, pintou cenas domésticas, vistas urbanas e figuras, com atenção especial à luz.",
    it: "Johannes Vermeer visse e lavorò a Delft nel XVII secolo. Oltre all’attività di mercante d’arte, dipinse scene domestiche, vedute urbane e figure, prestando particolare attenzione alla luce.",
    es: "Johannes Vermeer vivió y trabajó en Delft en el siglo XVII. Además de ejercer como marchante de arte, pintó escenas domésticas, vistas urbanas y figuras, prestando especial atención a la luz.",
  },
};

// Physical painting dimensions, height × width. Never derive these from image pixels.
export const technicalDimensions: Record<string, { heightCm: number; widthCm: number; heightInches?: number; widthInches?: number; source: string }> = {
  "death-of-socrates": {
    heightCm: 129.5,
    widthCm: 196.2,
    heightInches: 51,
    widthInches: 77.25,
    source: "https://www.metmuseum.org/art/collection/search/436105",
  },
  "the-kiss": {
    heightCm: 180,
    widthCm: 180,
    source: "https://sammlung.belvedere.at/objects/6678/der-kuss-liebespaar",
  },
  "girl-pearl": {
    heightCm: 44.5,
    widthCm: 39,
    source: "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring",
  },
};

// New English biographies stay English until translations receive editorial review.
export const creatorBiographies: Record<string, Record<InformationLocale, string>> = { ...legacyCreatorBiographies };
for (const [id, creator] of Object.entries(editorialCreators)) {
  creatorBiographies[id] = legacyCreatorBiographies[id] ?? { en: creator.biography, "pt-BR": creator.biography, it: creator.biography, es: creator.biography };
}
