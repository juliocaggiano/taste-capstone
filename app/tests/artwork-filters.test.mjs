import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const source = fs.readFileSync(new URL("../src/artwork-filters.ts", import.meta.url), "utf8");
const { createEmptyArtworkFilters, filterAndSortArtworks, validateArtworkYearRange, getArtworkFilterOptions } = await import(
  `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source, { mode: "strip" })).toString("base64")}`,
);
const works = [
  { title: "Period", creator: "Unknown", place: "Japan", dateStart: 1801, dateEnd: 1900 },
  { title: "Approximate", creator: "Hokusai", place: "Japan", dateStart: 1831, dateEnd: 1831 },
  { title: "Span", creator: "Klimt", place: "Austria", dateStart: 1907, dateEnd: 1908 },
  { title: "Exact", creator: "David", place: "France", dateStart: 1787, dateEnd: 1787 },
  { title: "Undated", creator: "Unknown" },
];
const filtered = (filter, sort = "featured") => filterAndSortArtworks(works, sort, { ...createEmptyArtworkFilters(), ...filter }, "en").map(work => work.title);

test("inclusive single-year ranges match a listed year and overlapping period", () => {
  assert.deepEqual(filtered({ yearFrom: "1831", yearTo: "1831" }), ["Period", "Approximate"]);
  assert.deepEqual(filtered({ yearFrom: "1908", yearTo: "1908" }), ["Span"]);
  assert.deepEqual(filtered({ yearFrom: "1900", yearTo: "1907" }), ["Period", "Span"]);
});
test("open ranges exclude unknown dates, while unrestricted browsing keeps them", () => {
  assert.deepEqual(filtered({ yearTo: "1787" }), ["Exact"]);
  assert.deepEqual(filtered({ yearFrom: "1907" }), ["Span"]);
  assert.equal(filtered({}).at(-1), "Undated");
});
test("artist and place intersect with the date range", () => {
  assert.deepEqual(filtered({ artist: "Hokusai", place: "Japan", yearFrom: "1800", yearTo: "1900" }), ["Approximate"]);
  assert.deepEqual(filtered({ artist: "Hokusai", place: "France" }), []);
});
test("chronological ordering uses the recorded start, places unknown dates last, and preserves ties", () => {
  assert.deepEqual(filtered({}, "oldest"), ["Exact", "Period", "Approximate", "Span", "Undated"]);
  assert.deepEqual(filtered({}, "newest"), ["Span", "Approximate", "Period", "Exact", "Undated"]);
  const tied = [{ title: "B", creator: "A", dateStart: 1787 }, { title: "A", creator: "A", dateStart: 1787 }];
  assert.deepEqual(filterAndSortArtworks(tied, "newest", createEmptyArtworkFilters(), "en"), tied);
  assert.deepEqual(works.map(work => work.title), ["Period", "Approximate", "Span", "Exact", "Undated"]);
});
test("invalid years and reversed ranges do not silently apply", () => {
  for (const year of ["0", "-100", "1800.5", "19ab", "10000"]) assert.equal(validateArtworkYearRange({ yearFrom: year, yearTo: "" }), "year");
  assert.equal(validateArtworkYearRange({ yearFrom: "1900", yearTo: "1800" }), "order");
  assert.equal(validateArtworkYearRange({ yearFrom: " 1800 ", yearTo: "" }), null);
  assert.equal(validateArtworkYearRange({ yearFrom: "", yearTo: "" }), null);
  assert.deepEqual(filtered({ yearFrom: "1900", yearTo: "1800" }), []);
});
test("available artists and places are unique, alphabetized and omit empty metadata", () => {
  const options = getArtworkFilterOptions(works);
  assert.deepEqual(options.artists.map(option => option.value), ["David", "Hokusai", "Klimt", "Unknown"]);
  assert.deepEqual(options.places.map(option => option.value), ["Austria", "France", "Japan"]);
});
