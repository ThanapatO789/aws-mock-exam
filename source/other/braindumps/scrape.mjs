import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "c:/workspace/playground/aws-mock-exam/source/other/braindumps";
const RAW_HTML_DIR = path.join(OUT_DIR, "html");
fs.mkdirSync(RAW_HTML_DIR, { recursive: true });

function decodeEntities(str) {
  return str
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parsePage(html, pageNum) {
  const questions = [];
  // Match each question panel in the main content area (heading_1 .. heading_5)
  const panelRegex = /<div class="panel-heading" role="tab" id="heading_(\d+)">([\s\S]*?)(?=<div class="panel-heading" role="tab" id="heading_\d+">|<div class="row clear-row">|<div id="cpBody_SimplePager)/g;
  let match;
  while ((match = panelRegex.exec(html)) !== null) {
    const block = match[2];
    const qNumMatch = block.match(/QUESTION:\s*(\d+)/i);
    if (!qNumMatch) continue;
    const qNum = Number(qNumMatch[1]);

    const leadMatch = block.match(/<p class="lead">([\s\S]*?)<div><ol class="rounded-list(?:-multi)?"/i);
    if (!leadMatch) continue;
    const questionText = decodeEntities(leadMatch[1]);

    const olMatch = block.match(/<ol class="rounded-list(?:-multi)?"[^>]*>([\s\S]*?)<\/ol>/i);
    if (!olMatch) continue;
    const olContent = olMatch[1];

    const liParts = olContent.split(/<li\s+/i).slice(1);
    const choices = [];
    const correctFromAttr = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    liParts.forEach((part, idx) => {
      const letter = letters[idx];
      const isCorrect = /data-correct="True"/i.test(part);
      const textPart = part.replace(/^[^>]*>/, "").replace(/<\/li>\s*$/i, "");
      const text = decodeEntities(textPart);
      choices.push({ letter, text });
      if (isCorrect) correctFromAttr.push(letter);
    });

    const ansMatch = block.match(/<strong>Answer\(s\):<\/strong>\s*([A-Z,\s]+?)\s*<br>/i);
    let correct = correctFromAttr;
    if (!correct.length && ansMatch) {
      correct = ansMatch[1]
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const explMatch = block.match(/<h5><strong>Explanation:<\/strong><\/h5>([\s\S]*?)<\/div><br><\/div>/i);
    const explanation = explMatch ? decodeEntities(explMatch[1]) : "";

    const multi = correct.length > 1;
    questions.push({
      id: qNum,
      page: pageNum,
      type: multi ? "multi" : "single",
      multi,
      question: questionText,
      choices,
      correct,
      explanation,
    });
  }
  return questions;
}

async function fetchPage(pageNum) {
  const cacheFile = path.join(RAW_HTML_DIR, `page-${pageNum}.html`);
  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, "utf8");
  }
  const url = `https://free-braindumps.com/amazon/free-saa-c03-braindumps/page-${pageNum}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for page ${pageNum}`);
  const html = await res.text();
  if (html.includes("Login or Create an account")) {
    throw new Error(`Page ${pageNum} requires login`);
  }
  fs.writeFileSync(cacheFile, html, "utf8");
  return html;
}

async function main() {
  const allQuestions = [];
  const startPage = 2;
  const endPage = 111;
  const concurrency = 5;

  for (let p = startPage; p <= endPage; p += concurrency) {
    const batch = [];
    for (let i = p; i < p + concurrency && i <= endPage; i++) {
      batch.push(
        fetchPage(i).then((html) => ({ page: i, qs: parsePage(html, i) }))
      );
    }
    const results = await Promise.all(batch);
    for (const r of results) {
      if (r.qs.length !== 5) {
        console.warn(`WARN: Page ${r.page} returned ${r.qs.length} questions`);
      }
      allQuestions.push(...r.qs);
    }
    if ((p - startPage) % 25 === 0) {
      console.log(`Fetched up to page ${Math.min(endPage, p + concurrency - 1)}... (${allQuestions.length} questions)`);
    }
  }

  allQuestions.sort((a, b) => a.id - b.id);
  const outJson = path.join(OUT_DIR, "questions.json");
  fs.writeFileSync(outJson, JSON.stringify(allQuestions, null, 2) + "\n", "utf8");
  console.log(`Done! Saved ${allQuestions.length} questions to ${outJson}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
