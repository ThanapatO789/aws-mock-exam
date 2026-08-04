#!/usr/bin/env node
// source/build_questions.mjs
import fs from "node:fs";

function validateRawQuestion(q, idx, errors, ctx) {
  const where = `${ctx} #${idx + 1}`;
  if (!q.question || typeof q.question !== "string") errors.push(`${where}: missing question text`);
  if (!Array.isArray(q.choices) || q.choices.length < 2) errors.push(`${where}: needs >=2 choices`);
  const letters = new Set((q.choices || []).map((c) => c.letter));
  if (!Array.isArray(q.correct) || q.correct.length < 1) errors.push(`${where}: missing correct answer(s)`);
  for (const letter of q.correct || []) {
    if (!letters.has(letter)) errors.push(`${where}: correct letter "${letter}" not among choices`);
  }
  const expectMulti = (q.correct || []).length > 1;
  if (q.type !== (expectMulti ? "multi" : "single")) {
    errors.push(`${where}: type "${q.type}" inconsistent with ${q.correct.length} correct answer(s)`);
  }
  if (!q.explanation || typeof q.explanation !== "string") errors.push(`${where}: missing explanation`);
}

function loadRawSet(file, errors) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data)) {
      errors.push(`${file}: expected a JSON array`);
      return null;
    }
    return data;
  } catch (err) {
    if (err.code === "ENOENT") {
      errors.push(`${file}: file not found`);
    } else if (err instanceof SyntaxError) {
      errors.push(`${file}: invalid JSON`);
    } else {
      errors.push(`${file}: ${err.message}`);
    }
    return null;
  }
}

function checkFile(file) {
  const errors = [];
  const data = loadRawSet(file, errors);
  if (!data) return errors;
  if (data.length !== 65) errors.push(`${file}: expected 65 questions, found ${data.length}`);
  data.forEach((q, i) => validateRawQuestion(q, i, errors, file));
  return errors;
}

function mergeFiles(files, outFile) {
  const errors = [];
  let nextId = 1;
  const merged = [];
  files.forEach((file, setIdx) => {
    const data = loadRawSet(file, errors);
    if (!data) return;
    if (data.length !== 65) errors.push(`${file}: expected 65 questions, found ${data.length}`);
    data.forEach((q, i) => {
      validateRawQuestion(q, i, errors, file);
      merged.push({
        id: nextId++,
        set: setIdx + 1,
        type: q.type,
        question: q.question,
        choices: q.choices,
        correct: q.correct,
        explanation: q.explanation,
        multi: q.type === "multi",
      });
    });
  });
  if (errors.length) return { errors };
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2) + "\n");
  return { errors: [], count: merged.length };
}

const [, , cmd, ...rest] = process.argv;

if (cmd === "check") {
  const errors = checkFile(rest[0]);
  errors.forEach((e) => console.error(e));
  console.log(errors.length ? `FAIL: ${errors.length} problem(s)` : `OK: ${rest[0]}`);
  process.exit(errors.length ? 1 : 0);
} else if (cmd === "merge") {
  const oIdx = rest.indexOf("-o");
  if (oIdx === -1) { console.error("merge requires -o <outFile>"); process.exit(1); }
  const outFile = rest[oIdx + 1];
  const files = rest.filter((_, i) => i !== oIdx && i !== oIdx + 1);
  const { errors, count } = mergeFiles(files, outFile);
  errors.forEach((e) => console.error(e));
  console.log(errors.length ? `FAIL: ${errors.length} problem(s)` : `OK: wrote ${count} questions to ${outFile}`);
  process.exit(errors.length ? 1 : 0);
} else {
  console.error("usage: build_questions.mjs check <file> | merge <f1> ... <f6> -o <outFile>");
  process.exit(1);
}
