import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const source = fs.readFileSync(new URL("../src/artwork-date-presets.ts", import.meta.url), "utf8");
const { getArtworkDatePresets, getArtworkDatePresetValue } = await import(
  `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source, { mode: "strip" })).toString("base64")}`,
);
test("modern decades and calendar centuries have inclusive correct bounds", () => {
  const presets = getArtworkDatePresets();
  assert.equal(presets.filter(item => item.value.startsWith("decade-")).length, 13);
  assert.equal(presets.filter(item => item.value.startsWith("century-")).length, 19);
  for (const [value, from, to] of [["decade-2020", "2020", "2029"], ["decade-1900", "1900", "1909"], ["century-19", "1801", "1900"], ["century-16", "1501", "1600"], ["century-1", "1", "100"]]) {
    const preset = presets.find(item => item.value === value);
    assert.equal(preset.yearFrom, from); assert.equal(preset.yearTo, to);
  }
});
test("custom and open ranges are not mislabeled as a preset", () => {
  assert.equal(getArtworkDatePresetValue({ yearFrom: "", yearTo: "" }), "any");
  assert.equal(getArtworkDatePresetValue({ yearFrom: "1900", yearTo: "1909" }), "decade-1900");
  assert.equal(getArtworkDatePresetValue({ yearFrom: "1801", yearTo: "1900" }), "century-19");
  assert.equal(getArtworkDatePresetValue({ yearFrom: "1900", yearTo: "" }), "custom");
  assert.equal(getArtworkDatePresetValue({ yearFrom: "1831", yearTo: "1831" }), "custom");
});
test("all four locales expose identical date choices with localized labels", () => {
  const base = getArtworkDatePresets().map(({ label, ...preset }) => preset);
  for (const locale of ["pt-BR", "it", "es"]) {
    assert.deepEqual(getArtworkDatePresets(locale).map(({ label, ...preset }) => preset), base);
    assert.notEqual(getArtworkDatePresets(locale)[2].label, getArtworkDatePresets()[2].label);
  }
});
