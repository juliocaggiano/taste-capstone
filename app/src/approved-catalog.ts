// Generated from verified editorial imports; see docs/editorial/PROTOTYPE_IMPORTS.md.
import catalog from "./approved-catalog.json";
import { editorialWorks, editorialCreators } from "./editorial-information";
export type ApprovedPieceId = "michelangelo-david" | "stanczyk" | "death-of-marat" | "the-ambassadors" | "goya-third-of-may" | "potato-eaters" | "the-gleaners" | "liberty-leading-the-people" | "school-of-athens" | "beethoven-symphony-nine" | "billie-holiday-strange-fruit" | "joao-gilberto-chega-saudade" | "animal-farm" | "vidas-secas" | "the-great-gatsby" | "eternal-sunshine" | "soul" | "im-still-here" | "saturn-devouring-his-son" | "death-of-socrates" | "pantheon" | "raft-of-medusa" | "las-meninas" | "arnolfini-portrait" | "gulf-stream" | "floor-scrapers" | "the-angelus" | "man-controller-of-the-universe" | "retirantes";
export type ApprovedCreatorId = "michelangelo-buonarroti" | "jan-matejko" | "jacques-louis-david" | "hans-holbein-the-younger" | "francisco-goya" | "vincent-van-gogh" | "jean-francois-millet" | "eugene-delacroix" | "raphael" | "ludwig-van-beethoven" | "billie-holiday" | "joao-gilberto" | "george-orwell" | "graciliano-ramos" | "f-scott-fitzgerald" | "michel-gondry" | "pete-docter-kemp-powers" | "walter-salles" | "pantheon-architect-unknown" | "theodore-gericault" | "diego-velazquez" | "jan-van-eyck" | "winslow-homer" | "gustave-caillebotte" | "diego-rivera" | "candido-portinari";
export type ApprovedForm = "Painting" | "Sculpture" | "Music" | "Literature" | "Film" | "Architecture" | "Performance" | "Photography";
export const approvedPieces = catalog.map(piece => ({ ...piece, medium: editorialWorks[piece.id]?.medium ?? piece.medium, creatorDates: editorialCreators[piece.creatorId]?.dates || piece.creatorDates, id: piece.id as ApprovedPieceId, creatorId: piece.creatorId as ApprovedCreatorId, form: piece.form as ApprovedForm }));
export const approvedCreators = [...new Set(approvedPieces.map(piece => piece.creatorId))].map(id => {
  const works = approvedPieces.filter(piece => piece.creatorId === id);
  return { id, canonicalName: works[0].creator, dates: works[0].creatorDates, heroPieceId: works[0].id, pieceIds: works.map(piece => piece.id) };
});
export const approvedContext = Object.fromEntries(approvedPieces.map(piece => [piece.id, { en: piece.context, "pt-BR": piece.context, it: piece.context, es: piece.context }]));
