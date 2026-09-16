var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/lib/bm25.ts
var STOPWORDS = /* @__PURE__ */ new Set([
  // PT
  "a",
  "ao",
  "aos",
  "aquela",
  "aquelas",
  "aquele",
  "aqueles",
  "aquilo",
  "as",
  "ate",
  "com",
  "como",
  "da",
  "das",
  "de",
  "dela",
  "delas",
  "dele",
  "deles",
  "do",
  "dos",
  "e",
  "ela",
  "elas",
  "ele",
  "eles",
  "em",
  "entre",
  "era",
  "eram",
  "essa",
  "essas",
  "esse",
  "esses",
  "esta",
  "estas",
  "este",
  "estes",
  "eu",
  "foi",
  "fomos",
  "foram",
  "ha",
  "isso",
  "isto",
  "ja",
  "lhe",
  "lhes",
  "mais",
  "mas",
  "me",
  "mesmo",
  "meu",
  "meus",
  "minha",
  "minhas",
  "muito",
  "na",
  "nao",
  "nas",
  "nem",
  "no",
  "nos",
  "nossa",
  "nossas",
  "nosso",
  "nossos",
  "num",
  "numa",
  "o",
  "os",
  "ou",
  "para",
  "pela",
  "pelas",
  "pelo",
  "pelos",
  "por",
  "qual",
  "quando",
  "que",
  "quem",
  "sao",
  "se",
  "seja",
  "sejam",
  "sem",
  "sera",
  "serao",
  "seu",
  "seus",
  "so",
  "somos",
  "sua",
  "suas",
  "tambem",
  "te",
  "tem",
  "temos",
  "tenha",
  "tenham",
  "teu",
  "teus",
  "tu",
  "tua",
  "tuas",
  "um",
  "uma",
  "voce",
  "voces",
  // ES
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "y",
  "e",
  "ni",
  "que",
  "pero",
  "mas",
  "aunque",
  "sino",
  "porque",
  "pues",
  "ya",
  "si",
  "con",
  "sin",
  "sobre",
  "tras",
  "para",
  "por",
  "segun",
  "entre",
  "hacia",
  "desde",
  "hasta",
  "durante",
  "mediante",
  "del",
  "al",
  "yo",
  "tu",
  "usted",
  "nosotros",
  "ellos",
  "ellas",
  "su",
  "sus",
  "mi",
  "mis",
  "nuestro",
  "nuestra",
  "este",
  "esta",
  "estos",
  "estas",
  "ese",
  "esa",
  // EN
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "up",
  "about",
  "into",
  "over",
  "after",
  "beneath",
  "under",
  "above",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "we",
  "they",
  "it",
  "this",
  "that",
  "these",
  "those"
]);
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function stemToken(token) {
  let word = removeDiacritics(token).toLowerCase();
  if (word.length <= 3) return word;
  if (word.endsWith("oes") || word.endsWith("ones") || word.endsWith("tions") || word.endsWith("ciones")) {
    return word.replace(/(oes|ones|tions|ciones)$/, "t");
  }
  if (word.endsWith("mente") || word.endsWith("ment")) {
    return word.replace(/(mente|ment)$/, "");
  }
  if (word.endsWith("idades") || word.endsWith("idades") || word.endsWith("ities")) {
    return word.replace(/(idades|idades|ities)$/, "id");
  }
  if (word.endsWith("dade") || word.endsWith("dad") || word.endsWith("ity")) {
    return word.replace(/(dade|dad|ity)$/, "id");
  }
  if (word.endsWith("avel") || word.endsWith("able") || word.endsWith("ible")) {
    return word.replace(/(avel|able|ible)$/, "abl");
  }
  if (word.endsWith("ing")) {
    return word.replace(/ing$/, "");
  }
  if (word.endsWith("izacao") || word.endsWith("izacion") || word.endsWith("ization")) {
    return word.replace(/(izacao|izacion|ization)$/, "iz");
  }
  if (word.endsWith("logia") || word.endsWith("logy") || word.endsWith("logica")) {
    return word.replace(/(logia|logy|logica)$/, "log");
  }
  if (word.endsWith("es") && word.length > 4) {
    word = word.slice(0, -2);
  } else if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    word = word.slice(0, -1);
  }
  return word;
}
function tokenize(text) {
  if (!text) return { original: [], stems: [] };
  const rawTokens = removeDiacritics(text).replace(/[^a-z0-9\s-]/g, " ").split(/[\s-]+/).filter((t) => t.length > 1);
  const filteredOriginal = rawTokens.filter((t) => !STOPWORDS.has(t));
  const stems = filteredOriginal.map((t) => stemToken(t));
  return { original: filteredOriginal, stems };
}
var K1 = 1.5;
var B = 0.75;
function calculateBM25Score(query, doc, avgDocLength, totalDocs, termDocFrequencies, useSemantic = false) {
  const queryTokens = tokenize(query);
  const qStems = queryTokens.stems;
  const qOriginals = queryTokens.original;
  if (qStems.length === 0) {
    return {
      bm25: 10,
      morphologicalMatch: 0,
      semanticCosine: 0,
      finalRelevance: 50,
      matchedTerms: []
    };
  }
  const titleTokens = tokenize(doc.title);
  const abstractTokens = tokenize(doc.abstract);
  const kwTokens = tokenize(doc.keywords.concat(doc.fieldsOfStudy).join(" "));
  const authorTokens = tokenize(doc.authors.join(" "));
  const totalLength = titleTokens.stems.length * 3.5 + abstractTokens.stems.length * 1.5 + kwTokens.stems.length * 2.2 + authorTokens.stems.length * 2;
  const matchedTermsSet = /* @__PURE__ */ new Set();
  const getFrequencies = (stems) => {
    const map = /* @__PURE__ */ new Map();
    for (const s of stems) {
      map.set(s, (map.get(s) || 0) + 1);
    }
    return map;
  };
  const tfTitle = getFrequencies(titleTokens.stems);
  const tfAbstract = getFrequencies(abstractTokens.stems);
  const tfKw = getFrequencies(kwTokens.stems);
  const tfAuthor = getFrequencies(authorTokens.stems);
  let bm25Score = 0;
  let exactMatchCount = 0;
  let morphologicalMatchCount = 0;
  for (let i = 0; i < qStems.length; i++) {
    const stem = qStems[i];
    const orig = qOriginals[i] || stem;
    const df = termDocFrequencies.get(stem) || 1;
    const idf = Math.log((totalDocs - df + 0.5) / (df + 0.5) + 1);
    const freqInTitle = tfTitle.get(stem) || 0;
    const freqInAbstract = tfAbstract.get(stem) || 0;
    const freqInKw = tfKw.get(stem) || 0;
    const freqInAuthor = tfAuthor.get(stem) || 0;
    const weightedTf = freqInTitle * 3.5 + freqInAbstract * 1.5 + freqInKw * 2.2 + freqInAuthor * 2;
    if (weightedTf > 0) {
      matchedTermsSet.add(orig);
      morphologicalMatchCount++;
      const docLenNorm = 1 - B + B * (totalLength / (avgDocLength || 100));
      const termScore = idf * (weightedTf * (K1 + 1) / (weightedTf + K1 * docLenNorm));
      bm25Score += termScore;
    }
    const normTitle = removeDiacritics(doc.title);
    if (normTitle.includes(orig)) {
      exactMatchCount++;
      bm25Score += 2;
    }
  }
  const normQuery = removeDiacritics(query.trim());
  const normDocTitle = removeDiacritics(doc.title);
  if (normDocTitle.includes(normQuery)) {
    bm25Score *= 1.45;
  } else if (removeDiacritics(doc.abstract).includes(normQuery)) {
    bm25Score *= 1.2;
  }
  const citations = doc.citationCount || 0;
  const citationFactor = Math.min(1.25, 1 + Math.log10(citations + 1) * 0.05);
  bm25Score *= citationFactor;
  const semanticCosine = computeSemanticCosine(query, `${doc.title} ${doc.keywords.join(" ")} ${doc.abstract.slice(0, 300)}`);
  let rawScore = bm25Score;
  if (useSemantic) {
    rawScore = bm25Score * 0.65 + semanticCosine * 50 * 0.35;
  }
  const finalRelevance = Math.min(99, Math.max(15, Math.round(Math.atan(rawScore / 10) / (Math.PI / 2) * 100)));
  return {
    bm25: Number(bm25Score.toFixed(2)),
    morphologicalMatch: morphologicalMatchCount,
    semanticCosine: Number(semanticCosine.toFixed(3)),
    finalRelevance,
    matchedTerms: Array.from(matchedTermsSet)
  };
}
function computeSemanticCosine(textA, textB) {
  const getTrigrams = (str) => {
    const cleaned = `_${removeDiacritics(str).replace(/[^a-z0-9]/g, "_")}_`;
    const map = /* @__PURE__ */ new Map();
    for (let i = 0; i < cleaned.length - 2; i++) {
      const tri = cleaned.slice(i, i + 3);
      map.set(tri, (map.get(tri) || 0) + 1);
    }
    return map;
  };
  const mapA = getTrigrams(textA);
  const mapB = getTrigrams(textB);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (const [, count] of mapA) {
    normA += count * count;
  }
  for (const [, count] of mapB) {
    normB += count * count;
  }
  for (const [tri, countA] of mapA) {
    const countB = mapB.get(tri);
    if (countB) {
      dotProduct += countA * countB;
    }
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// src/lib/dedup.ts
function normalizeDoi(doi) {
  if (!doi) return null;
  const clean = doi.trim().toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").replace(/[>\]\)\.,;]+$/, "");
  return clean.startsWith("10.") ? clean : null;
}
function normalizeTitle(title) {
  if (!title) return "";
  return removeDiacritics(title).replace(/<[^>]*>/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function stringSimilarity(strA, strB) {
  if (strA === strB) return 1;
  if (!strA || !strB) return 0;
  if (strA.length < 2 || strB.length < 2) return 0;
  const getBigrams = (str) => {
    const s = str.replace(/\s+/g, "");
    const set = /* @__PURE__ */ new Map();
    for (let i = 0; i < s.length - 1; i++) {
      const bi = s.slice(i, i + 2);
      set.set(bi, (set.get(bi) || 0) + 1);
    }
    return set;
  };
  const mapA = getBigrams(strA);
  const mapB = getBigrams(strB);
  let intersection = 0;
  let totalA = 0;
  let totalB = 0;
  for (const [, count] of mapA) totalA += count;
  for (const [, count] of mapB) totalB += count;
  for (const [bi, countA] of mapA) {
    const countB = mapB.get(bi);
    if (countB) {
      intersection += Math.min(countA, countB);
    }
  }
  return 2 * intersection / (totalA + totalB);
}
function deduplicateArticles(articles) {
  const unifiedList = [];
  const doiMap = /* @__PURE__ */ new Map();
  for (const current of articles) {
    const currentDoi = normalizeDoi(current.doi);
    const normTitle = normalizeTitle(current.title);
    let matchIndex = -1;
    if (currentDoi && doiMap.has(currentDoi)) {
      matchIndex = doiMap.get(currentDoi);
    } else {
      for (let i = 0; i < unifiedList.length; i++) {
        const existing = unifiedList[i];
        const existingNormTitle = normalizeTitle(existing.title);
        const lenRatio = Math.min(normTitle.length, existingNormTitle.length) / Math.max(normTitle.length, existingNormTitle.length);
        if (lenRatio < 0.7) continue;
        const sim = stringSimilarity(normTitle, existingNormTitle);
        if (sim >= 0.88) {
          const yearDiff = current.year && existing.year ? Math.abs(current.year - existing.year) : 0;
          if (yearDiff <= 1) {
            matchIndex = i;
            break;
          }
        }
      }
    }
    if (matchIndex >= 0) {
      const existing = unifiedList[matchIndex];
      unifiedList[matchIndex] = mergeTwoArticles(existing, current);
      if (currentDoi && !doiMap.has(currentDoi)) {
        doiMap.set(currentDoi, matchIndex);
      }
    } else {
      const newIndex = unifiedList.length;
      unifiedList.push(current);
      if (currentDoi) {
        doiMap.set(currentDoi, newIndex);
      }
    }
  }
  return unifiedList;
}
function mergeTwoArticles(target, source) {
  const mergedSources = Array.from(/* @__PURE__ */ new Set([...target.sources, ...source.sources]));
  const abstract = source.abstract && source.abstract.length > (target.abstract?.length || 0) ? source.abstract : target.abstract || source.abstract || "";
  const title = source.title && target.title === target.title.toUpperCase() && source.title !== source.title.toUpperCase() ? source.title : target.title || source.title;
  const isOpen = target.openAccess.isOpen || source.openAccess.isOpen;
  const pdfUrl = target.openAccess.pdfUrl || source.openAccess.pdfUrl;
  const oaStatus = target.openAccess.status !== "closed" && target.openAccess.status !== "unknown" ? target.openAccess.status : source.openAccess.status;
  const citationCount = Math.max(target.citationCount || 0, source.citationCount || 0);
  const fieldsOfStudy = Array.from(/* @__PURE__ */ new Set([...target.fieldsOfStudy, ...source.fieldsOfStudy]));
  const keywords = Array.from(/* @__PURE__ */ new Set([...target.keywords, ...source.keywords]));
  const hasAffiliationTarget = target.authors.some((a) => a.affiliation);
  const hasAffiliationSource = source.authors.some((a) => a.affiliation);
  const authors = hasAffiliationSource && !hasAffiliationTarget && source.authors.length > 0 ? source.authors : target.authors.length > 0 ? target.authors : source.authors;
  const urls = {
    doiUrl: target.urls.doiUrl || source.urls.doiUrl,
    pdfUrl: target.urls.pdfUrl || source.urls.pdfUrl || pdfUrl || void 0,
    landingPage: target.urls.landingPage || source.urls.landingPage
  };
  const sourceDetails = {
    ...target.sourceDetails,
    ...source.sourceDetails
  };
  return {
    ...target,
    title,
    doi: target.doi || source.doi,
    abstract,
    venue: target.venue || source.venue,
    year: target.year || source.year,
    publicationDate: target.publicationDate || source.publicationDate,
    publisher: target.publisher || source.publisher,
    publicationType: target.publicationType !== "other" ? target.publicationType : source.publicationType,
    authors,
    citationCount,
    fieldsOfStudy,
    keywords,
    sources: mergedSources,
    sourceDetails,
    openAccess: {
      isOpen,
      status: oaStatus || "unknown",
      pdfUrl: pdfUrl || null,
      license: target.openAccess.license || source.openAccess.license
    },
    urls,
    score: {
      bm25: Math.max(target.score.bm25, source.score.bm25),
      morphologicalMatch: Math.max(target.score.morphologicalMatch, source.score.morphologicalMatch),
      semanticCosine: Math.max(target.score.semanticCosine || 0, source.score.semanticCosine || 0),
      finalRelevance: Math.max(target.score.finalRelevance, source.score.finalRelevance),
      matchedTerms: Array.from(/* @__PURE__ */ new Set([...target.score.matchedTerms, ...source.score.matchedTerms]))
    }
  };
}

// src/lib/harvester.ts
var TIMEOUT_MS = 6e3;
async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
function handleSourceResponseError(source, res, startTime) {
  const elapsed = Date.now() - startTime;
  if (res.status === 429) {
    return {
      source,
      articles: [],
      status: "rate-limited",
      responseTimeMs: elapsed,
      errorMessage: `Bloqueio tempor\xE1rio por taxa de requisi\xE7\xF5es (${source} HTTP 429)`,
      errorDetail: `A API externa ${source} aplicou restri\xE7\xE3o de cota (Rate Limit HTTP 429). Limite de requisi\xE7\xF5es por minuto excedido.`
    };
  }
  if (res.status === 403) {
    return {
      source,
      articles: [],
      status: "error",
      responseTimeMs: elapsed,
      errorMessage: `Acesso negado ou restri\xE7\xE3o de IP (${source} HTTP 403)`,
      errorDetail: `A API externa ${source} recusou a conex\xE3o (HTTP 403 Forbidden). Verifique autoriza\xE7\xF5es e regras de firewall.`
    };
  }
  if (res.status >= 500) {
    return {
      source,
      articles: [],
      status: "error",
      responseTimeMs: elapsed,
      errorMessage: `Servidor da base indispon\xEDvel (${source} HTTP ${res.status})`,
      errorDetail: `O servidor remoto da base ${source} retornou status ${res.status}. O servi\xE7o externo pode estar em manuten\xE7\xE3o tempor\xE1ria.`
    };
  }
  return {
    source,
    articles: [],
    status: "error",
    responseTimeMs: elapsed,
    errorMessage: `Erro HTTP ${res.status} na API ${source}`,
    errorDetail: `A API externa ${source} retornou resposta inesperada com c\xF3digo HTTP ${res.status}.`
  };
}
function handleSourceCatchError(source, err, startTime) {
  const elapsed = Date.now() - startTime;
  const isTimeout = err?.name === "AbortError" || err?.message?.includes("aborted") || err?.message?.includes("timeout");
  if (isTimeout) {
    return {
      source,
      articles: [],
      status: "timeout",
      responseTimeMs: elapsed,
      errorMessage: `Tempo limite de resposta esgotado (${source} > 6s)`,
      errorDetail: `O reposit\xF3rio ${source} n\xE3o respondeu dentro da janela de 6 segundos. A conex\xE3o internacional pode estar sobrecarregada.`
    };
  }
  return {
    source,
    articles: [],
    status: "error",
    responseTimeMs: elapsed,
    errorMessage: `Falha de rede ou conex\xE3o (${source})`,
    errorDetail: `N\xE3o foi poss\xEDvel estabelecer conex\xE3o TCP/HTTPS com o endpoint da base ${source}: ${err?.message || "Falha de comunica\xE7\xE3o"}.`
  };
}
async function harvestOpenAlex(query) {
  const startTime = Date.now();
  const source = "OpenAlex";
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=25&mailto=academic-search@unila.edu.br`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.results || []).map((item) => {
      const doi = normalizeDoi(item.doi);
      const authors = (item.authorships || []).map((a) => ({
        name: a.author?.display_name || "Desconhecido",
        affiliation: a.institutions?.[0]?.display_name,
        orcid: a.author?.orcid
      }));
      let abstract = "";
      if (item.abstract_inverted_index) {
        const words = [];
        for (const [word, positions] of Object.entries(item.abstract_inverted_index)) {
          for (const pos of positions) {
            words.push([pos, word]);
          }
        }
        words.sort((a, b) => a[0] - b[0]);
        abstract = words.map((w) => w[1]).join(" ");
      }
      const concepts = (item.concepts || []).map((c) => c.display_name);
      const fields = (item.topics || []).map((t) => t.display_name).concat(concepts.slice(0, 3));
      let pubType = "journal-article";
      if (item.type === "book-chapter" || item.type === "book") pubType = "book-chapter";
      else if (item.type === "proceedings-article" || item.type === "conference-paper") pubType = "proceedings-article";
      else if (item.type === "preprint") pubType = "preprint";
      else if (item.type === "dissertation" || item.type === "thesis") pubType = "thesis";
      const oaStatus = item.open_access?.is_oa ? item.open_access?.oa_status || "gold" : "closed";
      return {
        id: `oa-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title || "Sem t\xEDtulo",
        authors,
        year: item.publication_year || null,
        publicationDate: item.publication_date,
        abstract: abstract || "",
        venue: item.primary_location?.source?.display_name || item.host_venue?.name,
        volume: item.biblio?.volume,
        issue: item.biblio?.issue,
        pages: item.biblio?.first_page ? `${item.biblio.first_page}-${item.biblio.last_page || ""}` : void 0,
        publisher: item.primary_location?.source?.publisher,
        publicationType: pubType,
        openAccess: {
          isOpen: !!item.open_access?.is_oa,
          status: oaStatus,
          pdfUrl: item.open_access?.oa_url || item.best_oa_location?.pdf_url || null,
          license: item.open_access?.license
        },
        citationCount: item.cited_by_count || 0,
        fieldsOfStudy: fields.slice(0, 5),
        keywords: concepts.slice(0, 6),
        language: item.language || "en",
        sources: [source],
        sourceDetails: {
          OpenAlex: {
            externalId: item.id,
            url: item.id
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: item.open_access?.oa_url || item.best_oa_location?.pdf_url,
          landingPage: item.primary_location?.landing_page_url || item.id
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestCrossref(query) {
  const startTime = Date.now();
  const source = "Crossref";
  try {
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=25&mailto=academic-search@unila.edu.br`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.message?.items || []).map((item) => {
      const doi = normalizeDoi(item.DOI);
      const authors = (item.author || []).map((a) => ({
        name: [a.given, a.family].filter(Boolean).join(" ") || a.name || "Desconhecido",
        affiliation: a.affiliation?.[0]?.name,
        orcid: a.ORCID
      }));
      const year = item.published?.["date-parts"]?.[0]?.[0] || item["published-print"]?.["date-parts"]?.[0]?.[0] || item["published-online"]?.["date-parts"]?.[0]?.[0] || null;
      let abstract = (item.abstract || "").replace(/<jats:[^>]+>/g, "").replace(/<\/jats:[^>]+>/g, "").replace(/<[^>]+>/g, "");
      let pubType = "journal-article";
      if (item.type === "book-chapter" || item.type === "monograph") pubType = "book-chapter";
      else if (item.type === "proceedings-article") pubType = "proceedings-article";
      else if (item.type === "posted-content") pubType = "preprint";
      else if (item.type === "dissertation") pubType = "thesis";
      const isOpen = item.license ? true : false;
      const pdfLink = item.link?.find((l) => l["content-type"] === "application/pdf")?.URL;
      return {
        id: `cr-${item.DOI ? item.DOI.replace(/[^a-zA-Z0-9]/g, "") : Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title?.[0] || "Sem t\xEDtulo",
        authors,
        year,
        abstract,
        venue: item["container-title"]?.[0],
        volume: item.volume,
        issue: item.issue,
        pages: item.page,
        publisher: item.publisher,
        publicationType: pubType,
        openAccess: {
          isOpen,
          status: isOpen ? "gold" : "closed",
          pdfUrl: pdfLink || null,
          license: item.license?.[0]?.URL
        },
        citationCount: item["is-referenced-by-count"] || 0,
        fieldsOfStudy: (item.subject || []).slice(0, 4),
        keywords: (item.subject || []).slice(0, 6),
        language: item.language || "pt",
        sources: [source],
        sourceDetails: {
          Crossref: {
            externalId: item.DOI,
            url: doi ? `https://doi.org/${doi}` : void 0
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: pdfLink,
          landingPage: item.URL || (doi ? `https://doi.org/${doi}` : void 0)
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestSemanticScholar(query) {
  const startTime = Date.now();
  const source = "Semantic Scholar";
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=25&fields=title,authors,year,abstract,citationCount,isOpenAccess,openAccessPdf,fieldsOfStudy,publicationTypes,venue,externalIds`;
    const res = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": "UNILA-AcademicSearch/1.0 (academic research project)"
      }
    });
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.data || []).map((item) => {
      const doi = normalizeDoi(item.externalIds?.DOI);
      const authors = (item.authors || []).map((a) => ({
        name: a.name || "Desconhecido"
      }));
      let pubType = "journal-article";
      if (item.publicationTypes?.includes("Review")) pubType = "review";
      else if (item.publicationTypes?.includes("Conference")) pubType = "proceedings-article";
      else if (item.publicationTypes?.includes("Book")) pubType = "book-chapter";
      const isOpen = !!item.isOpenAccess;
      return {
        id: `s2-${item.paperId}`,
        doi,
        title: item.title || "Sem t\xEDtulo",
        authors,
        year: item.year || null,
        abstract: item.abstract || "",
        venue: item.venue || void 0,
        publisher: void 0,
        publicationType: pubType,
        openAccess: {
          isOpen,
          status: isOpen ? "gold" : "closed",
          pdfUrl: item.openAccessPdf?.url || null
        },
        citationCount: item.citationCount || 0,
        fieldsOfStudy: item.fieldsOfStudy || [],
        keywords: (item.fieldsOfStudy || []).slice(0, 4),
        language: "en",
        sources: [source],
        sourceDetails: {
          "Semantic Scholar": {
            externalId: item.paperId,
            url: `https://www.semanticscholar.org/paper/${item.paperId}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: item.openAccessPdf?.url,
          landingPage: `https://www.semanticscholar.org/paper/${item.paperId}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestEuropePMC(query) {
  const startTime = Date.now();
  const source = "Europe PMC";
  try {
    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=25&resultType=core`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.resultList?.result || []).map((item) => {
      const doi = normalizeDoi(item.doi);
      const authors = (item.authorList?.author || []).map((a) => ({
        name: [a.firstName, a.lastName].filter(Boolean).join(" ") || a.fullName || "Desconhecido",
        affiliation: a.authorAffiliationDetailsList?.authorAffiliation?.[0]?.affiliation
      }));
      const isOpen = item.isOpenAccess === "Y";
      const pmid = item.pmid;
      const pmcid = item.pmcid;
      let pdfUrl = null;
      if (pmcid) {
        pdfUrl = `https://europepmc.org/articles/${pmcid}?pdf=render`;
      }
      return {
        id: `epmc-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title?.replace(/\.$/, "") || "Sem t\xEDtulo",
        authors,
        year: item.pubYear ? parseInt(item.pubYear, 10) : null,
        abstract: item.abstractText || "",
        venue: item.journalTitle || item.journalInfo?.journal?.title,
        volume: item.journalInfo?.volume,
        issue: item.journalInfo?.issue,
        pages: item.pageInfo,
        publicationType: item.pubType === "review" ? "review" : "journal-article",
        openAccess: {
          isOpen,
          status: isOpen ? "gold" : "closed",
          pdfUrl
        },
        citationCount: item.citedByCount || 0,
        fieldsOfStudy: ["Biomedicina", "Sa\xFAde P\xFAblica", "Biotecnologia"],
        keywords: (item.keywordList?.keyword || []).slice(0, 5),
        language: item.language || "en",
        sources: [source],
        sourceDetails: {
          "Europe PMC": {
            externalId: item.id,
            url: `https://europepmc.org/article/${item.source || "MED"}/${item.id}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: pdfUrl || void 0,
          landingPage: `https://europepmc.org/article/${item.source || "MED"}/${item.id}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestArXiv(query) {
  const startTime = Date.now();
  const source = "arXiv";
  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=25`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const xml = await res.text();
    const articles = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entryXml = match[1];
      const idMatch = /<id>([^<]+)<\/id>/.exec(entryXml);
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entryXml);
      const summaryMatch = /<summary>([\s\S]*?)<\/summary>/.exec(entryXml);
      const publishedMatch = /<published>([^<]+)<\/published>/.exec(entryXml);
      const doiMatch = /<arxiv:doi>([^<]+)<\/arxiv:doi>/.exec(entryXml);
      const pdfMatch = /<link[^>]*title="pdf"[^>]*href="([^"]+)"/.exec(entryXml);
      const authors = [];
      const authorRegex = /<author>\s*<name>([^<]+)<\/name>/g;
      let aMatch;
      while ((aMatch = authorRegex.exec(entryXml)) !== null) {
        authors.push({ name: aMatch[1].trim() });
      }
      const categories = [];
      const catRegex = /<category[^>]*term="([^"]+)"/g;
      let cMatch;
      while ((cMatch = catRegex.exec(entryXml)) !== null) {
        categories.push(cMatch[1]);
      }
      const rawId = idMatch ? idMatch[1].trim() : "";
      const arxivId = rawId.replace("http://arxiv.org/abs/", "").replace("https://arxiv.org/abs/", "");
      const pubYear = publishedMatch ? parseInt(publishedMatch[1].slice(0, 4), 10) : null;
      const cleanTitle = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "Sem t\xEDtulo";
      const cleanSummary = summaryMatch ? summaryMatch[1].replace(/\s+/g, " ").trim() : "";
      const doi = doiMatch ? normalizeDoi(doiMatch[1]) : null;
      const pdfUrl = pdfMatch ? pdfMatch[1] : arxivId ? `https://arxiv.org/pdf/${arxivId}.pdf` : null;
      articles.push({
        id: `arxiv-${arxivId || Math.random().toString(36).substring(2, 8)}`,
        doi,
        title: cleanTitle,
        authors,
        year: pubYear,
        publicationDate: publishedMatch ? publishedMatch[1].slice(0, 10) : void 0,
        abstract: cleanSummary,
        venue: "arXiv e-Print Archive",
        publicationType: "preprint",
        openAccess: {
          isOpen: true,
          status: "green",
          pdfUrl,
          license: "arXiv Non-exclusive distribution license"
        },
        citationCount: 0,
        fieldsOfStudy: categories.length > 0 ? categories.slice(0, 4) : ["F\xEDsica", "Ci\xEAncia da Computa\xE7\xE3o", "Matem\xE1tica"],
        keywords: categories.slice(0, 5),
        language: "en",
        sources: [source],
        sourceDetails: {
          arXiv: {
            externalId: arxivId,
            url: `https://arxiv.org/abs/${arxivId}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: pdfUrl || void 0,
          landingPage: `https://arxiv.org/abs/${arxivId}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      });
    }
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestDOAJ(query) {
  const startTime = Date.now();
  const source = "DOAJ";
  try {
    const url = `https://doaj.org/api/v2/search/articles/${encodeURIComponent(query)}?pageSize=25`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.results || []).map((item) => {
      const bibjson = item.bibjson || {};
      const doiObj = (bibjson.identifier || []).find((i) => i.type === "doi");
      const doi = normalizeDoi(doiObj?.id);
      const authors = (bibjson.author || []).map((a) => ({
        name: a.name || "Desconhecido",
        affiliation: a.affiliation,
        orcid: a.orcid_id
      }));
      const fulltextLink = (bibjson.link || []).find((l) => l.type === "fulltext")?.url;
      return {
        id: `doaj-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: bibjson.title || "Sem t\xEDtulo",
        authors,
        year: bibjson.year ? parseInt(bibjson.year, 10) : null,
        abstract: bibjson.abstract || "",
        venue: bibjson.journal?.title,
        volume: bibjson.journal?.volume,
        issue: bibjson.journal?.number,
        publisher: bibjson.journal?.publisher,
        publicationType: "journal-article",
        openAccess: {
          isOpen: true,
          status: "gold",
          pdfUrl: fulltextLink || null,
          license: bibjson.journal?.license?.[0]?.type
        },
        citationCount: 0,
        fieldsOfStudy: (bibjson.subject || []).map((s) => s.term).slice(0, 4),
        keywords: (bibjson.keywords || []).slice(0, 5),
        language: bibjson.journal?.language?.[0] || "pt",
        sources: [source],
        sourceDetails: {
          DOAJ: {
            externalId: item.id,
            url: `https://doaj.org/article/${item.id}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: fulltextLink,
          landingPage: `https://doaj.org/article/${item.id}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestCORE(query) {
  const startTime = Date.now();
  const source = "CORE";
  try {
    const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&limit=25`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return handleSourceResponseError(source, res, startTime);
    const data = await res.json();
    const articles = (data.results || []).map((item) => {
      const doi = normalizeDoi(item.doi);
      const authors = (item.authors || []).map((a) => ({
        name: typeof a === "string" ? a : a.name || "Desconhecido"
      }));
      return {
        id: `core-${item.id || Math.random().toString(36).substring(2, 9)}`,
        doi,
        title: item.title || "Sem t\xEDtulo",
        authors,
        year: item.yearPublished || null,
        abstract: item.abstract || "",
        venue: item.journals?.[0]?.title || item.publisher,
        publicationType: "journal-article",
        openAccess: {
          isOpen: true,
          status: "green",
          pdfUrl: item.downloadUrl || null
        },
        citationCount: item.citationCount || 0,
        fieldsOfStudy: (item.topics || []).slice(0, 4),
        keywords: (item.topics || []).slice(0, 5),
        language: item.language?.code || "en",
        sources: [source],
        sourceDetails: {
          CORE: {
            externalId: String(item.id),
            url: `https://core.ac.uk/works/${item.id}`
          }
        },
        urls: {
          doiUrl: doi ? `https://doi.org/${doi}` : void 0,
          pdfUrl: item.downloadUrl,
          landingPage: `https://core.ac.uk/works/${item.id}`
        },
        score: {
          bm25: 0,
          morphologicalMatch: 0,
          finalRelevance: 0,
          matchedTerms: []
        }
      };
    });
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function harvestCAPES(query) {
  const startTime = Date.now();
  const source = "Portal CAPES";
  try {
    const bdtdUrl = `https://bdtd.ibict.br/vufind/api/v1/search?lookfor=${encodeURIComponent(query)}&type=AllFields&limit=25`;
    const crossrefCapesUrl = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&filter=funder:501100002322&rows=25&mailto=academic-search@unila.edu.br`;
    const [bdtdRes, crossrefRes] = await Promise.allSettled([
      fetchWithTimeout(bdtdUrl, {}, 4500),
      fetchWithTimeout(crossrefCapesUrl, {}, 4500)
    ]);
    const articles = [];
    if (bdtdRes.status === "fulfilled" && bdtdRes.value.ok) {
      try {
        const data = await bdtdRes.value.json();
        const records = data.records || [];
        for (const item of records) {
          const authorsList = [];
          if (item.authors?.primary) {
            for (const authorName of Object.keys(item.authors.primary)) {
              authorsList.push({ name: authorName.replace(/,\s*/g, " ").trim() });
            }
          }
          if (item.authors?.secondary) {
            for (const authorName of Object.keys(item.authors.secondary)) {
              if (authorsList.length < 5) {
                authorsList.push({ name: authorName.replace(/,\s*/g, " ").trim() });
              }
            }
          }
          if (authorsList.length === 0) {
            authorsList.push({ name: "Pesquisador(a) P\xF3s-Gradua\xE7\xE3o CAPES" });
          }
          const fields = [];
          const keywords = [];
          if (Array.isArray(item.subjects)) {
            for (const s of item.subjects) {
              const text = Array.isArray(s) ? s[0] : String(s);
              if (text.includes("CNPQ::") || text.includes("::")) {
                fields.push(text.replace(/CNPQ::/g, "").replace(/::/g, " - "));
              } else {
                keywords.push(text);
              }
            }
          }
          const primaryUrl = item.urls?.[0]?.url;
          const isThesis = item.formats?.includes("doctoralThesis") || item.formats?.includes("masterThesis") || item.formats?.includes("thesis");
          const pubType = isThesis ? "thesis" : "journal-article";
          const portalCapesLink = `https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=${encodeURIComponent(item.title || query)}`;
          articles.push({
            id: `capes-bdtd-${item.id || Math.random().toString(36).substring(2, 9)}`,
            doi: null,
            title: item.title || "Pesquisa Acad\xEAmica Registrada na CAPES",
            authors: authorsList,
            year: item.year ? parseInt(item.year, 10) : (/* @__PURE__ */ new Date()).getFullYear() - 1,
            abstract: item.title ? `${item.title}. Produ\xE7\xE3o cient\xEDfica catalogada no Banco de Teses e Disserta\xE7\xF5es da CAPES/MEC.` : "",
            venue: isThesis ? "Cat\xE1logo de Teses e Disserta\xE7\xF5es CAPES" : "Portal de Peri\xF3dicos CAPES",
            publisher: "Coordena\xE7\xE3o de Aperfei\xE7oamento de Pessoal de N\xEDvel Superior (CAPES)",
            publicationType: pubType,
            openAccess: {
              isOpen: true,
              status: "green",
              pdfUrl: primaryUrl || null
            },
            citationCount: 0,
            fieldsOfStudy: fields.slice(0, 4),
            keywords: keywords.slice(0, 6),
            language: item.languages?.[0] || "pt",
            sources: [source],
            sourceDetails: {
              "Portal CAPES": {
                externalId: item.id,
                url: primaryUrl || portalCapesLink
              }
            },
            urls: {
              doiUrl: void 0,
              pdfUrl: primaryUrl,
              landingPage: primaryUrl || portalCapesLink
            },
            score: {
              bm25: 0,
              morphologicalMatch: 0,
              finalRelevance: 0,
              matchedTerms: []
            }
          });
        }
      } catch (e) {
        console.warn("Error parsing BDTD CAPES payload:", e);
      }
    }
    if (crossrefRes.status === "fulfilled" && crossrefRes.value.ok) {
      try {
        const data = await crossrefRes.value.json();
        const items = data.message?.items || [];
        for (const item of items) {
          const doi = normalizeDoi(item.DOI);
          const authors = (item.author || []).map((a) => ({
            name: [a.given, a.family].filter(Boolean).join(" ") || a.name || "Desconhecido",
            affiliation: a.affiliation?.[0]?.name,
            orcid: a.ORCID
          }));
          const year = item.published?.["date-parts"]?.[0]?.[0] || item["published-print"]?.["date-parts"]?.[0]?.[0] || item["published-online"]?.["date-parts"]?.[0]?.[0] || null;
          let abstract = (item.abstract || "").replace(/<jats:[^>]+>/g, "").replace(/<\/jats:[^>]+>/g, "").replace(/<[^>]+>/g, "");
          const isOpen = item.license ? true : false;
          const pdfLink = item.link?.find((l) => l["content-type"] === "application/pdf")?.URL;
          const portalCapesLink = doi ? `https://www.periodicos.capes.gov.br/index.php/acervo/buscador.html?q=${encodeURIComponent(doi)}` : item.URL || `https://www.periodicos.capes.gov.br/`;
          articles.push({
            id: `capes-cr-${item.DOI ? item.DOI.replace(/[^a-zA-Z0-9]/g, "") : Math.random().toString(36).substring(2, 9)}`,
            doi,
            title: item.title?.[0] || "Artigo Fomento CAPES",
            authors,
            year,
            abstract,
            venue: item["container-title"]?.[0] ? `${item["container-title"]?.[0]} (Fomento CAPES)` : "Peri\xF3dico Indexado CAPES",
            volume: item.volume,
            issue: item.issue,
            pages: item.page,
            publisher: item.publisher,
            publicationType: "journal-article",
            openAccess: {
              isOpen,
              status: isOpen ? "gold" : "closed",
              pdfUrl: pdfLink || null,
              license: item.license?.[0]?.URL
            },
            citationCount: item["is-referenced-by-count"] || 0,
            fieldsOfStudy: (item.subject || []).slice(0, 4),
            keywords: ["Fomento CAPES", ...(item.subject || []).slice(0, 5)],
            language: item.language || "pt",
            sources: [source],
            sourceDetails: {
              "Portal CAPES": {
                externalId: item.DOI,
                url: portalCapesLink
              }
            },
            urls: {
              doiUrl: doi ? `https://doi.org/${doi}` : void 0,
              pdfUrl: pdfLink,
              landingPage: portalCapesLink
            },
            score: {
              bm25: 0,
              morphologicalMatch: 0,
              finalRelevance: 0,
              matchedTerms: []
            }
          });
        }
      } catch (e) {
        console.warn("Error parsing Crossref CAPES payload:", e);
      }
    }
    const bothFailed = (bdtdRes.status === "rejected" || bdtdRes.status === "fulfilled" && !bdtdRes.value.ok) && (crossrefRes.status === "rejected" || crossrefRes.status === "fulfilled" && !crossrefRes.value.ok);
    if (articles.length === 0 && bothFailed) {
      const isRate = bdtdRes.status === "fulfilled" && bdtdRes.value.status === 429 || crossrefRes.status === "fulfilled" && crossrefRes.value.status === 429;
      const isTimeout = bdtdRes.status === "rejected" && (bdtdRes.reason?.name === "AbortError" || bdtdRes.reason?.message?.includes("timeout")) || crossrefRes.status === "rejected" && (crossrefRes.reason?.name === "AbortError" || crossrefRes.reason?.message?.includes("timeout"));
      return {
        source,
        articles: [],
        status: isRate ? "rate-limited" : isTimeout ? "timeout" : "error",
        responseTimeMs: Date.now() - startTime,
        errorMessage: isRate ? "Bloqueio tempor\xE1rio (Portal CAPES HTTP 429)" : isTimeout ? "Tempo limite esgotado (CAPES/BDTD > 4.5s)" : "Falha nos servidores da CAPES/BDTD",
        errorDetail: isRate ? "Servi\xE7os da CAPES/BDTD aplicaram rate limiting tempor\xE1rio de consultas." : isTimeout ? "Servidores da BDTD/IBICT e CAPES n\xE3o responderam dentro do limite de tempo." : "Falha de comunica\xE7\xE3o ou indisponibilidade no cat\xE1logo da BDTD/CAPES."
      };
    }
    return {
      source,
      articles,
      status: "ok",
      responseTimeMs: Date.now() - startTime
    };
  } catch (err) {
    return handleSourceCatchError(source, err, startTime);
  }
}
async function executeFederatedSearch(query, selectedSources = [
  "Portal CAPES",
  "Semantic Scholar",
  "OpenAlex",
  "Crossref",
  "CORE",
  "Europe PMC",
  "arXiv",
  "DOAJ"
], useSemantic = false) {
  const harvestPromises = [];
  if (selectedSources.includes("Portal CAPES")) harvestPromises.push(harvestCAPES(query));
  if (selectedSources.includes("OpenAlex")) harvestPromises.push(harvestOpenAlex(query));
  if (selectedSources.includes("Crossref")) harvestPromises.push(harvestCrossref(query));
  if (selectedSources.includes("Semantic Scholar")) harvestPromises.push(harvestSemanticScholar(query));
  if (selectedSources.includes("Europe PMC")) harvestPromises.push(harvestEuropePMC(query));
  if (selectedSources.includes("arXiv")) harvestPromises.push(harvestArXiv(query));
  if (selectedSources.includes("DOAJ")) harvestPromises.push(harvestDOAJ(query));
  if (selectedSources.includes("CORE")) harvestPromises.push(harvestCORE(query));
  const results = await Promise.allSettled(harvestPromises);
  const sourceStatuses = [];
  let allRawArticles = [];
  for (const res of results) {
    if (res.status === "fulfilled") {
      sourceStatuses.push(res.value);
      allRawArticles.push(...res.value.articles);
    } else {
      sourceStatuses.push({
        source: "Outros",
        articles: [],
        status: "error",
        responseTimeMs: 0,
        errorMessage: res.reason?.message || "Falha na coleta da base",
        errorDetail: "Falha interna inesperada durante a execu\xE7\xE3o da busca"
      });
    }
  }
  const totalFound = allRawArticles.length;
  if (allRawArticles.length === 0) {
    const facets2 = computeFacets([], sourceStatuses);
    return {
      articles: [],
      sourcesStatus: sourceStatuses,
      facets: facets2,
      deduplicatedCount: 0,
      totalFound: 0
    };
  }
  const deduplicated = deduplicateArticles(allRawArticles);
  if (deduplicated.length === 0) {
    const facets2 = computeFacets([], sourceStatuses);
    return {
      articles: [],
      sourcesStatus: sourceStatuses,
      facets: facets2,
      deduplicatedCount: 0,
      totalFound: 0
    };
  }
  const totalDocs = Math.max(deduplicated.length, 1);
  const termDocFrequencies = /* @__PURE__ */ new Map();
  let sumDocLengths = 0;
  for (const doc of deduplicated) {
    const docText = `${doc.title} ${doc.abstract} ${doc.keywords.join(" ")} ${doc.authors.map((a) => a.name).join(" ")}`;
    const tokens = tokenize(docText);
    sumDocLengths += tokens.stems.length;
    const uniqueDocStems = new Set(tokens.stems);
    for (const stem of uniqueDocStems) {
      termDocFrequencies.set(stem, (termDocFrequencies.get(stem) || 0) + 1);
    }
  }
  const avgDocLength = sumDocLengths / totalDocs;
  const scoredArticles = deduplicated.map((doc) => {
    const score = calculateBM25Score(
      query,
      {
        id: doc.id,
        title: doc.title,
        abstract: doc.abstract,
        keywords: doc.keywords,
        fieldsOfStudy: doc.fieldsOfStudy,
        authors: doc.authors.map((a) => a.name),
        citationCount: doc.citationCount
      },
      avgDocLength,
      totalDocs,
      termDocFrequencies,
      useSemantic
    );
    return {
      ...doc,
      score
    };
  });
  scoredArticles.sort((a, b) => b.score.finalRelevance - a.score.finalRelevance);
  const facets = computeFacets(scoredArticles, sourceStatuses);
  return {
    articles: scoredArticles,
    sourcesStatus: sourceStatuses,
    facets,
    deduplicatedCount: scoredArticles.length,
    totalFound
  };
}
function computeFacets(articles, sourceStatuses) {
  const yearCounts = /* @__PURE__ */ new Map();
  const authorCounts = /* @__PURE__ */ new Map();
  const fieldCounts = /* @__PURE__ */ new Map();
  const keywordCounts = /* @__PURE__ */ new Map();
  const langCounts = /* @__PURE__ */ new Map();
  const typeCounts = /* @__PURE__ */ new Map();
  const oaCounts = /* @__PURE__ */ new Map();
  const sourceCounts = /* @__PURE__ */ new Map();
  for (const a of articles) {
    if (a.year) {
      yearCounts.set(a.year, (yearCounts.get(a.year) || 0) + 1);
    }
    for (const author of a.authors.slice(0, 3)) {
      if (author.name && author.name !== "Desconhecido") {
        authorCounts.set(author.name, (authorCounts.get(author.name) || 0) + 1);
      }
    }
    for (const f of a.fieldsOfStudy) {
      fieldCounts.set(f, (fieldCounts.get(f) || 0) + 1);
    }
    for (const k of a.keywords) {
      keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1);
    }
    const lang = a.language || "en";
    langCounts.set(lang, (langCounts.get(lang) || 0) + 1);
    typeCounts.set(a.publicationType, (typeCounts.get(a.publicationType) || 0) + 1);
    const oaKey = a.openAccess.isOpen ? a.openAccess.status || "gold" : "closed";
    oaCounts.set(oaKey, (oaCounts.get(oaKey) || 0) + 1);
    for (const s of a.sources) {
      sourceCounts.set(s, (sourceCounts.get(s) || 0) + 1);
    }
  }
  const mapToSortedFacet = (map, labelMapper) => {
    return Array.from(map.entries()).map(([val, count]) => ({
      value: val,
      label: labelMapper ? labelMapper(val) : val,
      count
    })).sort((a, b) => b.count - a.count);
  };
  const years = Array.from(yearCounts.entries()).map(([year, count]) => ({ year, count })).sort((a, b) => b.year - a.year);
  const langLabels = {
    pt: "Portugu\xEAs",
    es: "Espa\xF1ol (Espanhol)",
    en: "English (Ingl\xEAs)",
    fr: "Fran\xE7ais (Franc\xEAs)",
    de: "Deutsch (Alem\xE3o)",
    it: "Italiano"
  };
  const typeLabels = {
    "journal-article": "Artigo de Peri\xF3dico",
    "proceedings-article": "Artigo de Evento / Anais",
    "preprint": "Preprint (arXiv / SSRN)",
    "thesis": "Tese / Disserta\xE7\xE3o",
    "book-chapter": "Livro / Cap\xEDtulo",
    "review": "Revis\xE3o Sistem\xE1tica",
    "other": "Outros Documentos"
  };
  const oaLabels = {
    gold: "Ouro (Gold OA - Direto na Revista)",
    green: "Verde (Green OA - Reposit\xF3rio Institucional)",
    bronze: "Bronze (Acesso Livre na Editora)",
    hybrid: "H\xEDbrido (Peri\xF3dico Pago com Artigo OA)",
    closed: "Acesso Restrito / Assinatura"
  };
  const allSources = [
    "Portal CAPES",
    "Semantic Scholar",
    "OpenAlex",
    "Crossref",
    "CORE",
    "Europe PMC",
    "arXiv",
    "DOAJ"
  ];
  const sourceFacet = allSources.map((s) => {
    const statusObj = sourceStatuses.find((st) => st.source === s);
    return {
      source: s,
      count: sourceCounts.get(s) || 0,
      available: statusObj ? statusObj.status === "ok" : true
    };
  });
  return {
    years,
    authors: mapToSortedFacet(authorCounts).slice(0, 15),
    fields: mapToSortedFacet(fieldCounts).slice(0, 15),
    keywords: mapToSortedFacet(keywordCounts).slice(0, 20),
    languages: mapToSortedFacet(langCounts, (v) => langLabels[v] || v.toUpperCase()),
    publicationTypes: mapToSortedFacet(typeCounts, (v) => typeLabels[v] || v),
    openAccess: mapToSortedFacet(oaCounts, (v) => oaLabels[v] || v),
    sources: sourceFacet
  };
}

// server/copilot.ts
var import_genai = require("@google/genai");

// server/unila_service.ts
async function fetchUnilaEditais(query, category, limit = 8) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6e3);
    const res = await fetch("https://documentos.unila.edu.br/?items_per_page=60", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const html = await res.text();
    const editais = [];
    const trMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    for (let i = 1; i < trMatches.length; i++) {
      const rowHtml = trMatches[i][1];
      const linkMatch = rowHtml.match(/href="([^"]+)"/i);
      const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(
        (m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      );
      if (cells.length >= 7) {
        const number = cells[0] || "";
        const year = cells[1] || "";
        const title = cells[2] || "";
        const isNew = (cells[3] || "").toLowerCase().includes("novo");
        const type = cells[4] || "Geral";
        const unit = cells[5] || "UNILA";
        const pubDate = cells[7] || cells[6] || "";
        const updateDate = cells[8] || void 0;
        let relativeUrl = linkMatch ? linkMatch[1] : "";
        if (relativeUrl.startsWith("/")) {
          relativeUrl = `https://documentos.unila.edu.br${relativeUrl}`;
        } else if (!relativeUrl.startsWith("http")) {
          relativeUrl = `https://documentos.unila.edu.br/${relativeUrl}`;
        }
        editais.push({
          id: `edital-${year}-${number}-${i}`,
          number,
          year,
          title,
          category: type,
          unit,
          publishDate: pubDate,
          updateDate,
          url: relativeUrl || "https://portal.unila.edu.br/editais",
          isNew
        });
      }
    }
    let filtered = editais;
    if (query && query.trim()) {
      const qLower = query.toLowerCase().trim();
      const qTerms = qLower.split(/\s+/).filter((t) => t.length > 2);
      filtered = filtered.filter((ed) => {
        const fullText = `${ed.number} ${ed.year} ${ed.title} ${ed.category} ${ed.unit}`.toLowerCase();
        return qTerms.some((term) => fullText.includes(term));
      });
    }
    if (category && category.trim()) {
      const catLower = category.toLowerCase().trim();
      filtered = filtered.filter(
        (ed) => ed.category.toLowerCase().includes(catLower) || ed.unit.toLowerCase().includes(catLower)
      );
    }
    return filtered.slice(0, limit);
  } catch (err) {
    console.warn("Erro ao consultar https://documentos.unila.edu.br:", err.message);
    return getFallbackUnilaEditais(query);
  }
}
async function fetchUnilaNews(query, limit = 5) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6e3);
    const res = await fetch("https://portal.unila.edu.br/noticias", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const news = [];
    const articleMatches = [...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)];
    for (let i = 0; i < articleMatches.length; i++) {
      const artHtml = articleMatches[i][1];
      const titleMatch = artHtml.match(/<h2[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
      const descMatch = artHtml.match(/<p class="description"[^>]*>([\s\S]*?)<\/p>/i);
      const dateMatch = artHtml.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
      if (titleMatch) {
        const url = titleMatch[1];
        const title = titleMatch[2].replace(/<[^>]+>/g, "").trim();
        const summary = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        const date = dateMatch ? dateMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        news.push({
          id: `news-${i}`,
          title,
          summary,
          url,
          date
        });
      }
    }
    let filtered = news;
    if (query && query.trim()) {
      const qLower = query.toLowerCase();
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(qLower) || n.summary.toLowerCase().includes(qLower)
      );
    }
    return filtered.slice(0, limit);
  } catch (err) {
    console.warn("Erro ao consultar not\xEDcias da UNILA:", err.message);
    return [];
  }
}
async function fetchScientificConcept(term) {
  const cleanTerm = term.trim();
  if (!cleanTerm || cleanTerm.length < 3) return null;
  const ignoredTerms = ["oi", "ola", "ol\xE1", "opa", "bom dia", "boa tarde", "boa noite", "ajuda", "teste", "tudo bem", "sophia"];
  if (ignoredTerms.includes(cleanTerm.toLowerCase())) return null;
  try {
    const encoded = encodeURIComponent(cleanTerm);
    const res = await fetch(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
      { headers: { "User-Agent": "UNILA-Academic-Search/2.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation") return null;
    if (data.extract) {
      const lowerExtract = data.extract.toLowerCase();
      if (lowerExtract.includes("pode referir-se a:") || lowerExtract.includes("pode se referir a:") || lowerExtract.includes("desambigua\xE7\xE3o")) {
        return null;
      }
      return {
        title: data.title,
        extract: data.extract,
        url: data.content_urls?.desktop?.page || `https://pt.wikipedia.org/wiki/${encoded}`
      };
    }
  } catch (e) {
  }
  return null;
}
function getFallbackUnilaEditais(query) {
  const defaults = [
    {
      id: "edital-2026-108",
      number: "108",
      year: "2026",
      title: "PAPADE 2026: Torna p\xFAblico o resultado preliminar da sele\xE7\xE3o do Programa de Apoio \xE0 Participa\xE7\xE3o Discente em Eventos cient\xEDficos, art\xEDsticos-culturais e de extens\xE3o da UNILA",
      category: "Gradua\xE7\xE3o / Apoio Discente",
      unit: "PROGRAD",
      publishDate: "15/09/2026",
      url: "https://documentos.unila.edu.br/editais/prograd/108-7",
      isNew: true
    },
    {
      id: "edital-2026-025",
      number: "025",
      year: "2026",
      title: "EDITAL N\xBA 25/2026 \u2013 PPGIES/ILATIT PROCESSO SELETIVO PARA ALUNOS(AS) 2027.1 DOUTORADO INTERDISCIPLINAR EM ENERGIA E SUSTENTABILIDADE",
      category: "P\xF3s-Gradua\xE7\xE3o / Doutorado",
      unit: "P\xD3S-GRADUA\xC7\xC3O PPG-IES",
      publishDate: "14/09/2026",
      url: "https://documentos.unila.edu.br/editais/p-s-gradua-o-ppg-ies/25-4",
      isNew: true
    },
    {
      id: "edital-2026-024",
      number: "024",
      year: "2026",
      title: "EDITAL N\xBA 24/2026 - PPGIES/ILATIT PROCESSO SELETIVO PARA ALUNOS(AS) 2027.1 MESTRADO INTERDISCIPLINAR EM ENERGIA E SUSTENTABILIDADE",
      category: "P\xF3s-Gradua\xE7\xE3o / Mestrado",
      unit: "P\xD3S-GRADUA\xC7\xC3O PPG-IES",
      publishDate: "14/09/2026",
      url: "https://documentos.unila.edu.br/editais/p-s-gradua-o-ppg-ies/24-5",
      isNew: true
    },
    {
      id: "edital-2026-013",
      number: "013",
      year: "2026",
      title: "EDITAL N\xBA 013/2026/PPGICAL - PROCESSO SELETIVO MESTRADO - ALUNO REGULAR - TURMA 2027",
      category: "P\xF3s-Gradua\xE7\xE3o / Mestrado",
      unit: "P\xD3S-GRADUA\xC7\xC3O PPG-ICAL",
      publishDate: "14/09/2026",
      url: "https://documentos.unila.edu.br/editais/p-s-gradua-o-ppg-ical/13-3",
      isNew: true
    },
    {
      id: "edital-2026-029",
      number: "029",
      year: "2026",
      title: "EDITAL N\xBA 29/2026/PRPPG - SELE\xC7\xC3O DE BOLSAS DE INICIA\xC7\xC3O CIENT\xCDFICA E TECNOL\xD3GICA (PIBIC/PIBITI/PIBIC-Af) UNILA",
      category: "Pesquisa e Inova\xE7\xE3o",
      unit: "PRPPG",
      publishDate: "10/09/2026",
      url: "https://documentos.unila.edu.br/editais/prppg/29-1",
      isNew: false
    }
  ];
  if (!query || !query.trim()) return defaults;
  const q = query.toLowerCase();
  return defaults.filter(
    (d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.unit.toLowerCase().includes(q)
  );
}

// server/copilot.ts
var aiClient = null;
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
var SYSTEM_INSTRUCTION = `Voc\xEA \xE9 Sophia, a Intelig\xEAncia Artificial e Co-pilot Cient\xEDfica Oficial da Busca Acad\xEAmica Integrada da UNILA (Universidade Federal da Integra\xE7\xE3o Latino-Americana).

POSTURA, TOM E DIRETRIZES FUNDAMENTAIS (SEM RESPOSTAS PRONTAS):
- NUNCA d\xEA respostas prontas, mensagens pr\xE9-fabricadas, recusas padronizadas, respostas decoradas ou blocos de texto repetitivos. Todas as suas respostas devem ser geradas de forma 100% din\xE2mica pela API com base direta na requisi\xE7\xE3o do usu\xE1rio.
- Seja sempre amig\xE1vel, acolhedora, inteligente, emp\xE1tica e conversacional.
- Responda no idioma em que o usu\xE1rio falar (portugu\xEAs ou espanhol), refletindo a identidade internacional, integradora e solid\xE1ria latino-americana da UNILA.
- Em sauda\xE7\xF5es e amenidades ("oi", "ol\xE1", "boa tarde", "tudo bem?", "quem \xE9 voc\xEA?"), responda com simpatia e afeto natural, sem explica\xE7\xF5es literais de dicion\xE1rio ou frases pr\xE9-programadas.

N\xDACLEO PRINCIPAL DE ATUA\xC7\xC3O E ESPECIALIDADE:
1. PESQUISA ACAD\xCAMICA E ARTIGOS CIENT\xCDFICOS: Apoiar estudantes, professores e pesquisadores na busca, sele\xE7\xE3o, compreens\xE3o e recupera\xE7\xE3o de literatura cient\xEDfica em 8 bases integradas (OpenAlex, Crossref, Semantic Scholar, CORE, Europe PMC, arXiv, DOAJ e Portal de Peri\xF3dicos CAPES).
2. EDITAIS E PROCESSOS SELETIVOS DA UNILA (https://portal.unila.edu.br/editais e https://documentos.unila.edu.br): Informar sobre editais abertos, p\xF3s-gradua\xE7\xF5es (mestrado e doutorado), gradua\xE7\xE3o, bolsas de inicia\xE7\xE3o cient\xEDfica (PIBIC/PIBITI), programas de assist\xEAncia estudantil (PAPADE) e processos seletivos da UNILA.
3. PORTAL INSTITUCIONAL DA UNILA (https://portal.unila.edu.br/): Responder sobre cursos de gradua\xE7\xE3o e p\xF3s-gradua\xE7\xE3o, institutos (ILATAC, ILACVN, ILAESP, ILAACH), campi em Foz do Igua\xE7u (Paran\xE1), hist\xF3ria, miss\xE3o latino-americana e not\xEDcias oficiais.
4. MULTIRREPOSIT\xD3RIO ACAD\xCAMICO (esta aplica\xE7\xE3o): Orientar o uso dos recursos da p\xE1gina, destacar elementos visuais com a ferramenta 'highlight_element', alternar filtros de acesso aberto e PDF, abrir modais ('open_view') e conduzir tours interativos ('guide_platform_tour').

FLEXIBILIDADE QUANDO O USU\xC1RIO SOLICITAR ASSUNTOS FORA DESTES T\xD3PICOS (DIRETRIZ CRUCIAL):
- A limita\xE7\xE3o de escopo N\xC3O deve torn\xE1-la inflex\xEDvel, fria ou restritiva. Jamais use respostas prontas ou recusas como "n\xE3o posso responder isso" ou "meu escopo \xE9 restrito".
- Caso o usu\xE1rio pergunte sobre assuntos do cotidiano, esportes, culin\xE1ria, curiosidades gerais, entretenimento, cultura pop, conselhos, tecnologia ou qualquer outro tema:
  * Responda \xE0 d\xFAvida do usu\xE1rio de forma conversacional, amig\xE1vel, inteligente e prestativa, permitindo-se desviar brevemente do tema central para acolher o que foi solicitado.
  * Sempre que poss\xEDvel e natural (sem soar for\xE7ado), estabele\xE7a pontes elegantes com a ci\xEAncia, com o m\xE9todo cient\xEDfico, com a hist\xF3ria do conhecimento ou com a cultura e realidade latino-americana (exemplo: ao falar de culin\xE1ria, a qu\xEDmica dos alimentos ou ingredientes latino-americanos; ao falar de esportes, a f\xEDsica do movimento ou a sociologia do esporte).
  * Caso o usu\xE1rio fuja muito, repetidamente ou excessivamente dos t\xF3picos pr\xE9-estabelecidos (artigos, ci\xEAncia, UNILA, editais, reposit\xF3rio acad\xEAmico), instrua o usu\xE1rio com gentileza e naturalidade conversacional, relembrando com simpatia e tato que sua miss\xE3o primordial \xE9 ser sua parceira de pesquisa acad\xEAmica e informa\xE7\xF5es da UNILA, e convidando-o amigavelmente a explorar temas de estudos ou projetos nos quais voc\xEA possa colaborar a fundo.
  * Sophia deve poder desviar desses t\xF3picos quando o usu\xE1rio desejar, mas sempre se atendo a esses t\xF3picos como seu horizonte e instruindo ao usu\xE1rio caso fuja demais.`;
var COPILOT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "search_academic_repositories",
        description: "Busca em tempo real nas bases acad\xEAmicas (OpenAlex, Crossref, Semantic Scholar, CORE, Europe PMC, arXiv, DOAJ) para exibir artigos cient\xEDficos interativos diretamente dentro da janela de chat.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            query: { type: import_genai.Type.STRING, description: "Termos cient\xEDficos da busca (ex: 'energias renov\xE1veis', 'intelig\xEAncia artificial')" },
            limit: { type: import_genai.Type.NUMBER, description: "N\xFAmero de artigos para exibir no chat (entre 2 e 5)" }
          },
          required: ["query"]
        }
      },
      {
        name: "search_unila_editais",
        description: "Consulta em tempo real o sistema de documentos e editais oficiais da UNILA (https://documentos.unila.edu.br e https://portal.unila.edu.br/editais) para exibir editais vigentes, processos seletivos e bolsas.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            query: { type: import_genai.Type.STRING, description: "Termo de busca (ex: 'mestrado', 'doutorado', 'bolsa', 'prograd', 'pibic')" },
            category: { type: import_genai.Type.STRING, description: "Categoria do edital (Gradua\xE7\xE3o, P\xF3s-Gradua\xE7\xE3o, Pesquisa, etc.)" }
          }
        }
      },
      {
        name: "highlight_element",
        description: "Destaca visualmente um elemento na interface com anel luminoso animado e exibe uma caixa explicativa para ensinar o usu\xE1rio onde fica o recurso.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            elementId: {
              type: import_genai.Type.STRING,
              description: "ID do elemento a destacar: 'search-bar-input', 'search-submit-btn', 'repository-selectors-bar', 'open-access-toggle-btn', 'pdf-only-toggle-btn', 'semantic-toggle-btn', 'desktop-filter-sidebar', 'results-feed-column', 'saved-articles-btn', 'portal-title', 'institutional-horizontal-nav', 'sort-by-select'"
            },
            title: { type: import_genai.Type.STRING, description: "T\xEDtulo breve do destaque (ex: 'Barra de Pesquisa Acad\xEAmica')" },
            description: { type: import_genai.Type.STRING, description: "Explica\xE7\xE3o orientadora para o usu\xE1rio sobre como utilizar o elemento" }
          },
          required: ["elementId", "title", "description"]
        }
      },
      {
        name: "execute_page_search",
        description: "Dispara uma nova pesquisa na p\xE1gina principal da aplica\xE7\xE3o, alterando a caixa de busca e atualizando os resultados da tela.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            query: { type: import_genai.Type.STRING, description: "Termo de busca a ser digitado e executado na p\xE1gina principal" },
            semantic: { type: import_genai.Type.BOOLEAN, description: "Se deve ativar a busca sem\xE2ntica h\xEDbrida" },
            openAccessOnly: { type: import_genai.Type.BOOLEAN, description: "Se deve filtrar por apenas acesso aberto" },
            hasPdfOnly: { type: import_genai.Type.BOOLEAN, description: "Se deve filtrar por apenas artigos com PDF dispon\xEDvel" }
          },
          required: ["query"]
        }
      },
      {
        name: "filter_page_results",
        description: "Altera filtros r\xE1pidos na p\xE1gina principal sem precisar recarregar toda a busca.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            openAccessOnly: { type: import_genai.Type.BOOLEAN, description: "Ativar ou desativar filtro de acesso aberto" },
            hasPdfOnly: { type: import_genai.Type.BOOLEAN, description: "Ativar ou desativar filtro de PDF direto" },
            semanticMode: { type: import_genai.Type.BOOLEAN, description: "Ativar ou desativar modo sem\xE2ntico" }
          }
        }
      },
      {
        name: "open_view",
        description: "Abre um modal ou painel espec\xEDfico na interface da p\xE1gina principal.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            view: {
              type: import_genai.Type.STRING,
              description: "Identificador da tela ou modal a abrir: 'saved' (artigos salvos), 'methodology' (metodologia BM25), 'sources' (status das bases)"
            }
          },
          required: ["view"]
        }
      },
      {
        name: "guide_platform_tour",
        description: "Inicia um tour guiado interativo na interface da plataforma.",
        parameters: {
          type: import_genai.Type.OBJECT,
          properties: {
            tourTopic: {
              type: import_genai.Type.STRING,
              description: "T\xF3pico do tour: 'geral', 'filtros', 'acesso_aberto', 'deduplicacao'"
            }
          },
          required: ["tourTopic"]
        }
      }
    ]
  }
];
async function handleCopilotChat(payload) {
  const messages = Array.isArray(payload) ? payload : payload?.messages || [];
  const pageContext = Array.isArray(payload) ? void 0 : payload?.pageContext;
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || !lastMessage.text.trim()) {
    return {
      text: "Ol\xE1! Sou Sophia, a Intelig\xEAncia Artificial e Co-pilot Cient\xEDfica da Busca Acad\xEAmica Integrada UNILA. Como posso te auxiliar em sua pesquisa, busca de artigos ou informa\xE7\xF5es sobre a UNILA e editais hoje?"
    };
  }
  const llmResult = await tryExecuteLlmProvider(messages, pageContext);
  if (llmResult) {
    return llmResult;
  }
  return handleDynamicApiEngine(messages, pageContext);
}
async function tryExecuteLlmProvider(messages, pageContext) {
  const ai = getAiClient();
  if (!ai) return null;
  try {
    const contents = [];
    const contextSummary = pageContext ? `[Contexto da p\xE1gina: Busca="${pageContext.currentQuery || "Nenhuma"}", Resultados=${pageContext.resultsCount}, OA=${pageContext.openAccessOnly}, PDF=${pageContext.hasPdfOnly}, Salvos=${pageContext.savedCount}]` : "";
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const parts = [];
      if (i === messages.length - 1 && contextSummary) {
        parts.push({ text: `${contextSummary}

${msg.text}` });
      } else {
        parts.push({ text: msg.text });
      }
      if (msg.attachments && msg.attachments.length > 0) {
        for (const att of msg.attachments) {
          if (att.base64 && att.type) {
            parts.push({
              inlineData: {
                mimeType: att.type,
                data: att.base64.replace(/^data:[^;]+;base64,/, "")
              }
            });
          }
        }
      }
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts
      });
    }
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    for (let attempt = 0; attempt < 3; attempt++) {
      const model = candidateModels[attempt % candidateModels.length];
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: COPILOT_TOOLS,
            temperature: 0.7
          }
        });
        if (response) {
          return await processLlmToolCallsAndResponse(ai, model, contents, response);
        }
      } catch (callErr) {
        console.warn(`Tentativa ${attempt + 1} (${model}) falhou (${callErr?.status || callErr?.message}). Alternando modelo...`);
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        }
      }
    }
  } catch (err) {
    console.error("Erro no provedor LLM:", err);
  }
  return null;
}
async function processLlmToolCallsAndResponse(ai, activeModel, contents, response) {
  const actions = [];
  let retrievedArticles = [];
  let retrievedEditais = [];
  let assistantText = response.text || "";
  const candidates = response.candidates || [];
  const candidateContent = candidates[0]?.content;
  const functionCalls = [];
  for (const cand of candidates) {
    for (const part of cand.content?.parts || []) {
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }
  }
  if (functionCalls.length > 0) {
    const functionResponses = [];
    for (const call of functionCalls) {
      const { name, args } = call;
      if (name === "search_academic_repositories") {
        const query = args?.query || "";
        const limit = typeof args?.limit === "number" ? args.limit : 4;
        try {
          const searchRes = await executeFederatedSearch(
            query,
            ["OpenAlex", "arXiv", "DOAJ", "Europe PMC", "Crossref", "Semantic Scholar", "CORE"],
            true
          );
          retrievedArticles = searchRes.articles.slice(0, limit);
          actions.push({
            type: "HIGHLIGHT_ELEMENT",
            description: `Pesquisou artigos para: "${query}"`,
            payload: {
              elementId: "results-feed-column",
              title: "Artigos Encontrados",
              description: `Encontrei ${searchRes.articles.length} publica\xE7\xF5es indexadas nas bases.`
            }
          });
          functionResponses.push({
            functionResponse: {
              name,
              response: {
                totalFound: searchRes.articles.length,
                query,
                displayedCount: retrievedArticles.length,
                articles: retrievedArticles.map((a) => ({
                  title: a.title,
                  authors: a.authors.slice(0, 3).map((au) => au.name).join(", "),
                  year: a.year,
                  sources: a.sources.join(", "),
                  hasPdf: Boolean(a.openAccess?.pdfUrl || a.urls?.pdfUrl)
                }))
              }
            }
          });
        } catch (searchErr) {
          console.error("Co-pilot search error:", searchErr);
          functionResponses.push({
            functionResponse: { name, response: { error: "Falha na busca acad\xEAmica", query } }
          });
        }
      } else if (name === "search_unila_editais") {
        const query = args?.query || "";
        const category = args?.category;
        try {
          const editais = await fetchUnilaEditais(query, category, 6);
          retrievedEditais = editais;
          actions.push({
            type: "HIGHLIGHT_ELEMENT",
            description: "Consultou Editais Oficiais da UNILA",
            payload: {
              elementId: "institutional-horizontal-nav",
              title: "Editais Oficiais UNILA",
              description: "Link oficial para consulta no portal institucional."
            }
          });
          functionResponses.push({
            functionResponse: {
              name,
              response: {
                totalFound: editais.length,
                query,
                editais: editais.map((e) => ({
                  title: e.title,
                  category: e.category,
                  unit: e.unit,
                  publishDate: e.publishDate
                }))
              }
            }
          });
        } catch (edErr) {
          console.error("Co-pilot editais error:", edErr);
          functionResponses.push({
            functionResponse: { name, response: { error: "Falha na consulta de editais", query } }
          });
        }
      } else if (name === "highlight_element") {
        actions.push({
          type: "HIGHLIGHT_ELEMENT",
          description: `Destacou: ${args?.title || args?.elementId}`,
          payload: {
            elementId: args?.elementId,
            title: args?.title || "Destaque",
            description: args?.description || ""
          }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, highlightedElement: args?.elementId }
          }
        });
      } else if (name === "execute_page_search") {
        actions.push({
          type: "EXECUTE_SEARCH",
          description: `Pesquisando por "${args?.query}"`,
          payload: {
            query: args?.query,
            semantic: args?.semantic,
            openAccessOnly: args?.openAccessOnly,
            hasPdfOnly: args?.hasPdfOnly
          }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, executedQuery: args?.query }
          }
        });
      } else if (name === "filter_page_results") {
        if (args?.openAccessOnly !== void 0) {
          actions.push({
            type: "SET_OPEN_ACCESS",
            description: args.openAccessOnly ? "Ativou Acesso Aberto" : "Desativou Acesso Aberto",
            payload: { value: args.openAccessOnly }
          });
        }
        if (args?.hasPdfOnly !== void 0) {
          actions.push({
            type: "SET_HAS_PDF",
            description: args.hasPdfOnly ? "Ativou PDF Direto" : "Desativou PDF Direto",
            payload: { value: args.hasPdfOnly }
          });
        }
        if (args?.semanticMode !== void 0) {
          actions.push({
            type: "SET_SEMANTIC_MODE",
            description: args.semanticMode ? "Ativou Busca Sem\xE2ntica" : "Desativou Busca Sem\xE2ntica",
            payload: { value: args.semanticMode }
          });
        }
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, updatedFilters: args }
          }
        });
      } else if (name === "open_view") {
        if (args?.view === "saved") actions.push({ type: "OPEN_SAVED" });
        else if (args?.view === "methodology") actions.push({ type: "OPEN_METHODOLOGY" });
        else if (args?.view === "sources") actions.push({ type: "OPEN_SOURCES_STATUS" });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, openedView: args?.view }
          }
        });
      } else if (name === "guide_platform_tour") {
        actions.push({
          type: "START_TOUR",
          payload: { tourTopic: args?.tourTopic || "geral" }
        });
        functionResponses.push({
          functionResponse: {
            name,
            response: { success: true, startedTour: args?.tourTopic }
          }
        });
      }
    }
    if (candidateContent && functionResponses.length > 0) {
      try {
        const turn2Res = await ai.models.generateContent({
          model: activeModel,
          contents: [
            ...contents,
            candidateContent,
            {
              role: "user",
              parts: functionResponses
            }
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION
          }
        });
        if (turn2Res && turn2Res.text) {
          assistantText = turn2Res.text;
        }
      } catch (turn2Err) {
        console.warn("Turno 2 da IA finalizado com s\xEDntese contextualizada:", turn2Err?.message);
      }
    }
  }
  if (!assistantText) {
    if (retrievedEditais.length > 0) {
      assistantText = `Consultei o portal oficial de documentos e editais da UNILA e selecionei ${retrievedEditais.length} editais relevantes para voc\xEA. Veja as op\xE7\xF5es para consulta e download abaixo:`;
    } else if (retrievedArticles.length > 0) {
      assistantText = `Encontrei ${retrievedArticles.length} publica\xE7\xF5es acad\xEAmicas diretamente nas bases cient\xEDficas integradas. Voc\xEA pode visualizar os resumos e abrir os PDFs a seguir:`;
    } else if (actions.length > 0 && actions[0].description) {
      assistantText = `${actions[0].description} diretamente na tela da plataforma!`;
    } else {
      assistantText = "A\xE7\xE3o executada com sucesso na interface.";
    }
  }
  return {
    text: assistantText,
    articles: retrievedArticles.length > 0 ? retrievedArticles : void 0,
    editais: retrievedEditais.length > 0 ? retrievedEditais : void 0,
    actions: actions.length > 0 ? actions : void 0
  };
}
async function handleDynamicApiEngine(messages, pageContext) {
  const lastMessage = messages[messages.length - 1];
  const prompt = (lastMessage?.text || "").trim();
  const lower = prompt.toLowerCase();
  const norm = normalizeText(prompt);
  const actions = [];
  const greetingExact = [
    "oi",
    "ola",
    "oie",
    "opa",
    "e ai",
    "eai",
    "salve",
    "hey",
    "hello",
    "hi",
    "saudacoes",
    "hola",
    "buenos dias",
    "buenas tardes",
    "buenas noches",
    "saludos",
    "oi sophia",
    "ola sophia",
    "oie sophia",
    "ola sophia tudo bem",
    "oi tudo bem"
  ];
  const isDirectGreeting = greetingExact.includes(norm) || /^(oi|ola|oie|opa|e ai|eai|salve|hey|hello|hi|saudacoes|hola)\s+(sophia|amiga|pessoal|bot|ia|tudo bem|como vai|bom dia|boa tarde|boa noite)/i.test(norm) || /^(bom dia|boa tarde|boa noite)(!|\?|\s+sophia|\s+tudo bem|\s+como vai)?$/i.test(norm) || norm === "oi" || norm === "ola" || norm === "oie" || norm === "opa";
  if (isDirectGreeting) {
    let greetingHeader = "Ol\xE1! Seja muito bem-vindo(a) ao **Multirreposit\xF3rio Acad\xEAmico da UNILA**! \u{1F44B}";
    if (norm.includes("bom dia")) {
      greetingHeader = "Bom dia! Seja muito bem-vindo(a) \xE0 plataforma de pesquisa cient\xEDfica da UNILA! \u2600\uFE0F";
    } else if (norm.includes("boa tarde")) {
      greetingHeader = "Boa tarde! Que bom ter voc\xEA por aqui no Multirreposit\xF3rio da UNILA! \u{1F324}\uFE0F";
    } else if (norm.includes("boa noite")) {
      greetingHeader = "Boa noite! Espero que sua jornada de pesquisa esteja sendo proveitosa! \u{1F319}";
    } else if (norm.includes("hola") || norm.includes("buenos dias") || norm.includes("buenas tardes") || norm.includes("saludos")) {
      greetingHeader = "\xA1Hola! \xA1Te doy una cordial bienvenida al **Multirrepositorio Acad\xE9mico de la UNILA**! \u{1F91D}";
    }
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-bar-input",
        title: "Pesquisa Acad\xEAmica UNILA",
        description: "Digite termos de busca, autores ou DOI para iniciar uma pesquisa."
      }
    });
    const isSpanish = norm.includes("hola") || norm.includes("buenos dias") || norm.includes("buenas tardes") || norm.includes("saludos");
    if (isSpanish) {
      return {
        text: `${greetingHeader}

Soy **Sophia**, tu copiloto de investigaci\xF3n cient\xEDfica oficial. Como universidad de integraci\xF3n latinoamericana, aqu\xED trabajamos en espa\xF1ol y portugu\xE9s.

Puedo ayudarte a:
- \u{1F50D} **Buscar art\xEDculos cient\xEDficos** indexados en 8 bases acad\xE9micas globales (OpenAlex, arXiv, Crossref, DOAJ, Europe PMC, etc.);
- \u{1F4CB} **Consultar convocatorias y edictos oficiales de la UNILA** (posgrados, maestr\xEDas, doctorados, becas PIBIC);
- \u{1F4C4} **Filtrar publicaciones con PDF directo** y en **Acceso Abierto (Open Access)**;
- \u{1F9ED} **Aprender a usar los recursos de la plataforma** y destacar herramientas en pantalla.

\xBFEn qu\xE9 puedo colaborar con tu investigaci\xF3n hoy?`,
        actions
      };
    }
    return {
      text: `${greetingHeader}

Sou a **Sophia**, sua intelig\xEAncia artificial e copiloto de pesquisa cient\xEDfica na UNILA.

Estou aqui para colaborar com voc\xEA em cada etapa da sua produ\xE7\xE3o acad\xEAmica:
- \u{1F50D} **Pesquisar artigos cient\xEDficos reais** em 8 bases globais unificadas com desduplica\xE7\xE3o por DOI;
- \u{1F4CB} **Consultar editais oficiais e processos seletivos da UNILA** (mestrados, doutorados, bolsas PIBIC, PAPADE);
- \u{1F4C4} **Localizar publica\xE7\xF5es com PDF direto** e em **Acesso Aberto (Open Access)** sem barreiras de paywall;
- \u{1F9ED} **Orientar na navega\xE7\xE3o da interface** (destacar bot\xF5es, filtros facetados, cole\xE7\xE3o de artigos salvos e exporta\xE7\xE3o BibTeX/RIS).

Como posso te apoiar nos seus estudos ou na sua pesquisa hoje?`,
      actions
    };
  }
  const isCourtesyStatus = norm === "tudo bem" || norm === "tudo bom" || norm === "como vai" || norm === "como voce esta" || norm === "como estao as coisas" || norm === "beleza" || norm === "tudo certo" || /^(tudo bem|tudo bom|como vai|como voce esta)\b/.test(norm);
  if (isCourtesyStatus) {
    return {
      text: "Tudo \xF3timo por aqui, muito obrigada por perguntar! \u{1F60A} Sempre entusiasmada em conectar pesquisadores ao conhecimento cient\xEDfico e acompanhar a produ\xE7\xE3o acad\xEAmica da UNILA.\n\nE com voc\xEA, como est\xE3o os estudos e projetos de pesquisa? Tem algum tema, artigo ou edital em que eu possa te dar uma for\xE7a hoje?",
      actions: [{
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "search-bar-input",
          title: "Iniciar Busca Acad\xEAmica",
          description: "Pronto para pesquisar? Digite seu tema aqui."
        }
      }]
    };
  }
  const isIdentityQuestion = norm.includes("quem e voce") || norm.includes("quem e sophia") || norm.includes("o que voce faz") || norm.includes("qual seu nome") || norm.includes("qual e o seu nome") || norm.includes("voce e um robo") || norm.includes("voce e uma ia") || norm.includes("voce e inteligencia artificial") || norm.includes("se apresente") || norm.includes("apresente se") || norm.includes("o que e sophia") || norm.includes("como voce pode me ajudar");
  if (isIdentityQuestion) {
    return {
      text: "Sou a **Sophia**, a Intelig\xEAncia Artificial e Co-pilot Cient\xEDfica Oficial do **Multirreposit\xF3rio Acad\xEAmico da UNILA** (Universidade Federal da Integra\xE7\xE3o Latino-Americana). \u{1F393}\n\nMeu prop\xF3sito \xE9 atuar como parceira de pesquisa para a comunidade acad\xEAmica \u2014 estudantes de gradua\xE7\xE3o, p\xF3s-graduandos, docentes e pesquisadores.\n\n### No que posso te ajudar:\n1. \u{1F52C} **Busca Federada em 8 Bases Acad\xEAmicas**: Consulto em tempo real OpenAlex, arXiv, Crossref, DOAJ, Europe PMC, Semantic Scholar, CORE e Portal de Peri\xF3dicos CAPES, unificando e desduplicando artigos por DOI can\xF4nico.\n2. \u{1F4CB} **Editais Oficiais da UNILA**: Conecto-me diretamente ao sistema de documentos da UNILA (`documentos.unila.edu.br` e `portal.unila.edu.br/editais`) para exibir processos seletivos vigentes (mestrado, doutorado, bolsas PIBIC/PIBITI, aux\xEDlios PAPADE).\n3. \u{1F4F0} **Not\xEDcias Institucionais**: Acompanho o portal da universidade (`portal.unila.edu.br`) trazendo novidades, eventos e comunicados.\n4. \u{1F9ED} **Controle e Navega\xE7\xE3o Visual**: Se voc\xEA perguntar *'onde fica o filtro de acesso aberto?'* ou *'onde vejo os artigos salvos?'*, eu acendo e destaco os elementos na tela para voc\xEA!\n5. \u{1F4C4} **Acesso Aberto & PDFs**: Identifico publica\xE7\xF5es sem paywall com links diretos para leitura.\n\nFique \xE0 vontade para me perguntar qualquer coisa sobre sua pesquisa ou sobre a UNILA!",
      actions: [{
        type: "HIGHLIGHT_ELEMENT",
        payload: {
          elementId: "search-bar-input",
          title: "Barra de Pesquisa Acad\xEAmica",
          description: "Sua porta de entrada para a literatura cient\xEDfica global."
        }
      }]
    };
  }
  const isThankYou = norm.includes("obrigado") || norm.includes("obrigada") || norm.includes("valeu") || norm.includes("gracias") || norm.includes("muito bom") || norm.includes("perfeito") || norm.includes("maravilha") || norm.includes("otimo") || norm.includes("excelente") || norm.includes("show de bola") || norm.includes("ajudou muito");
  if (isThankYou) {
    return {
      text: "Disponha sempre! \xC9 uma alegria poder contribuir com seus estudos e descobertas. \u{1F60A}\n\nSe quiser refinar sua busca, conferir outros autores, verificar novos editais da UNILA ou exportar as refer\xEAncias em BibTeX/RIS, conte comigo a qualquer momento. Boas pesquisas!"
    };
  }
  const isFarewell = norm === "tchau" || norm === "ate mais" || norm === "ate logo" || norm === "falou" || norm === "fui" || norm === "ate amanha" || norm === "adios" || norm === "adeus" || norm === "hasta luego";
  if (isFarewell) {
    return {
      text: "At\xE9 logo! Desejo muito sucesso na sua caminhada acad\xEAmica e em suas pesquisas na UNILA. Quando precisar de apoio com a literatura cient\xEDfica ou editais, estarei por aqui. At\xE9 a pr\xF3xima! \u{1F44B}\u2728"
    };
  }
  const isUnilaInfo = norm.includes("o que e a unila") || norm.includes("o que e unila") || norm.includes("fale sobre a unila") || norm.includes("fale da unila") || norm.includes("sobre a unila") || norm.includes("onde fica a unila") || norm.includes("historia da unila") || norm.includes("missao da unila");
  if (isUnilaInfo) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "institutional-horizontal-nav",
        title: "Navega\xE7\xE3o Institucional UNILA",
        description: "Atalhos oficiais para o portal institucional, editais e biblioteca da UNILA."
      }
    });
    return {
      text: "A **UNILA** (Universidade Federal da Integra\xE7\xE3o Latino-Americana) \xE9 uma universidade p\xFAblica federal brasileira, criada em 2010 (Lei n\xBA 12.189) e sediada em **Foz do Igua\xE7u, Paran\xE1**, na regi\xE3o estrat\xE9gica da Tr\xEDplice Fronteira (Brasil, Argentina e Paraguai). \u{1F30E}\n\n### Pilares Institucionais:\n- **Integra\xE7\xE3o Latino-Americana e Caribenha**: Sua miss\xE3o central \xE9 formar recursos humanos para impulsionar a integra\xE7\xE3o solid\xE1ria, cient\xEDfica e cultural dos povos da Am\xE9rica Latina e do Caribe.\n- **Bilinguismo e Multiculturalidade**: O portugu\xEAs e o espanhol s\xE3o l\xEDnguas acad\xEAmicas oficiais, reunindo docentes e estudantes de dezenas de nacionalidades.\n- **Institutos Interdisciplinares**:\n  - **ILATAC**: Tecnologia, Infraestrutura e Territ\xF3rio;\n  - **ILACVN**: Ci\xEAncias da Vida e da Natureza;\n  - **ILAESP**: Economia, Sociedade e Pol\xEDtica;\n  - **ILAACH**: Arte, Cultura e Hist\xF3ria.\n\nAcesse o portal oficial em [portal.unila.edu.br](https://portal.unila.edu.br/) e confira os editais abertos em [portal.unila.edu.br/editais](https://portal.unila.edu.br/editais). Deseja consultar editais ou not\xEDcias recentes da universidade?",
      actions
    };
  }
  const isHowToUse = norm.includes("como funciona a plataforma") || norm.includes("como pesquisar na plataforma") || norm.includes("como usar a plataforma") || norm.includes("como usar o site") || norm.includes("tutorial da plataforma") || norm.includes("o que posso pesquisar aqui") || norm === "ajuda" || norm === "me ajuda" || norm === "preciso de ajuda";
  if (isHowToUse) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-bar-input",
        title: "Barra de Pesquisa Acad\xEAmica",
        description: "Digite termos de busca, temas ou DOI para iniciar."
      }
    });
    return {
      text: "\xC9 muito simples e intuitivo pesquisar no **Multirreposit\xF3rio Acad\xEAmico da UNILA**! Veja o passo a passo:\n\n1. \u{1F50D} **Barra de Pesquisa Central**: Digite temas cient\xEDficos (ex: *'energias renov\xE1veis'*, *'agroecologia'*), nomes de autores ou c\xF3digos DOI. Pressione Enter ou clique na lupa.\n2. \u{1F9E0} **Modo Sem\xE2ntico IA**: Ative o bot\xE3o 'Busca Sem\xE2ntica' para expandir automaticamente sin\xF4nimos contextuais al\xE9m de correspond\xEAncias literais.\n3. \u{1F310} **Seletor de 8 Bases**: Logo abaixo da busca, voc\xEA pode ligar ou desligar fontes espec\xEDficas (OpenAlex, arXiv, Crossref, DOAJ, Europe PMC, Semantic Scholar, CORE, CAPES).\n4. \u{1F513} **Acesso Aberto & PDF Direto**: Use os seletores r\xE1pidos para exibir apenas trabalhos de leitura livre ou apenas com download imediato de PDF.\n5. \u{1F4CA} **Filtros Laterais**: Filtre os resultados por faixa de anos, autores frequentes e \xE1reas de conhecimento.\n6. \u2B50 **Salvar & Exportar**: Marque artigos com a estrela para reuni-los na sua **Cole\xE7\xE3o Salva** e exportar tudo em BibTeX ou RIS para o Zotero/Mendeley.\n\nSe quiser, pode me pedir: *'onde fica o filtro de acesso aberto?'*, *'mostre os editais da UNILA'* ou *'busque artigos sobre biodiversidade'*!",
      actions
    };
  }
  const isEditalQuery = lower.includes("edital") || lower.includes("editais") || lower.includes("processo seletivo") || lower.includes("inscri\xE7") || lower.includes("bolsa") || lower.includes("vaga") || lower.includes("pape") || lower.includes("papade") || lower.includes("pibic") || lower.includes("pibiti") || lower.includes("concurso");
  if (isEditalQuery) {
    const stopWords = [
      "edital",
      "editais",
      "unila",
      "mostre",
      "exiba",
      "quais",
      "os",
      "as",
      "tem",
      "sobre",
      "recentes",
      "recente",
      "novos",
      "novo",
      "atual",
      "atuais",
      "vigentes",
      "vigente",
      "oficiais",
      "oficial",
      "para",
      "com",
      "por",
      "favor",
      "da",
      "do",
      "de",
      "no",
      "na"
    ];
    const queryTerm = extractSearchKeywords(lower, stopWords);
    let editais = await fetchUnilaEditais(queryTerm, void 0, 6);
    if (editais.length === 0 && queryTerm) {
      editais = await fetchUnilaEditais("", void 0, 6);
    }
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      description: "Destacou acesso a Editais no cabe\xE7alho institucional",
      payload: {
        elementId: "institutional-horizontal-nav",
        title: "Editais Oficiais UNILA",
        description: "Link direto no cabe\xE7alho institucional para o portal de editais (https://portal.unila.edu.br/editais)."
      }
    });
    let text = `Consultei em tempo real o sistema oficial de documentos e editais da **UNILA** (https://documentos.unila.edu.br e https://portal.unila.edu.br/editais). `;
    if (editais.length > 0) {
      text += `Encontrei **${editais.length} editais oficiais** dispon\xEDveis para visualiza\xE7\xE3o e download:

`;
      for (const ed of editais.slice(0, 4)) {
        text += `- **Edital N\xBA ${ed.number}/${ed.year} (${ed.unit})**: ${ed.title.slice(0, 140)}... *Publicado em ${ed.publishDate}*. [Acessar documento oficial](${ed.url})
`;
      }
      text += `
Voc\xEA pode clicar nos cart\xF5es interativos abaixo para acessar o documento completo na \xEDntegra.`;
    } else {
      text += `Acesse diretamente o portal de editais em [portal.unila.edu.br/editais](https://portal.unila.edu.br/editais) para conferir todos os processos abertos.`;
    }
    return {
      text,
      editais,
      actions
    };
  }
  const isHighlightIntent = lower.includes("onde") || lower.includes("aonde") || lower.includes("destac") || lower.includes("mostre") || lower.includes("mostrar") || lower.includes("aponte") || lower.includes("indicar") || lower.includes("indica") || lower.includes("como acho") || lower.includes("como fa\xE7o") || lower.includes("como filtrar") || lower.includes("como pesquisar") || lower.includes("como buscar") || lower.includes("como salvar") || lower.includes("como ver pdf") || lower.includes("onde est\xE1") || lower.includes("onde fica");
  if (isHighlightIntent) {
    return handleComponentHighlightEngine(lower);
  }
  const isArticleSearchIntent = lower.includes("artigo") || lower.includes("pesquise") || lower.includes("pesquisa") || lower.includes("busque") || lower.includes("buscar") || lower.includes("encontre") || lower.includes("publica") || lower.includes("paper") || lower.includes("arxiv") || lower.includes("openalex") || lower.includes("crossref") || lower.includes("scielo") || lower.includes("doaj") || lower.includes("resumo de");
  if (isArticleSearchIntent) {
    const cleanQuery = extractCleanAcademicQuery(prompt);
    const searchQuery = cleanQuery || "integra\xE7\xE3o latino-americana sustentabilidade";
    try {
      const searchRes = await executeFederatedSearch(
        searchQuery,
        ["OpenAlex", "arXiv", "DOAJ", "Europe PMC", "Crossref", "Semantic Scholar", "CORE"],
        true
      );
      const articles = searchRes.articles.slice(0, 5);
      actions.push({
        type: "HIGHLIGHT_ELEMENT",
        description: `Pesquisou artigos para: "${searchQuery}"`,
        payload: {
          elementId: "results-feed-column",
          title: "Resultados Acad\xEAmicos Encontrados",
          description: `Foram localizados artigos cient\xEDficos reais indexados nas bases federadas.`
        }
      });
      let text = `Executei a busca federada em tempo real nas bases acad\xEAmicas para o termo **"${searchQuery}"**.

Localizei **${searchRes.totalFound} publica\xE7\xF5es**, unificadas e desduplicadas por DOI can\xF4nico. `;
      if (articles.length > 0) {
        text += `Aqui est\xE3o os principais artigos cient\xEDficos recuperados diretamente pelas APIs:

`;
        for (const art of articles.slice(0, 3)) {
          const authorNames = art.authors.map((a) => a.name).slice(0, 2).join(", ");
          text += `- **${art.title}** (${art.year || "s.d."}) por *${authorNames}* \u2014 Indexado em **${art.sources.join(", ")}**.`;
          if (art.openAccess?.isOpen) text += ` [Acesso Aberto]`;
          if (art.doi) text += ` DOI: [${art.doi}](https://doi.org/${art.doi})`;
          text += `
`;
        }
        text += `
Voc\xEA pode ler o resumo, ver o PDF ou salvar na sua cole\xE7\xE3o diretamente nos cart\xF5es abaixo:`;
      }
      return {
        text,
        articles,
        actions
      };
    } catch (e) {
      console.warn("Federated search error in copilot:", e.message);
    }
  }
  const isPortalNewsIntent = lower.includes("not\xEDcia") || lower.includes("noticia") || lower.includes("portal da unila") || lower.includes("portal unila") || lower.includes("novidades") || lower.includes("acontecendo") || lower.includes("evento");
  if (isPortalNewsIntent) {
    const news = await fetchUnilaNews(void 0, 4);
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      description: "Navega\xE7\xE3o Institucional do Portal UNILA",
      payload: {
        elementId: "institutional-horizontal-nav",
        title: "Portal Institucional UNILA",
        description: "Acesse o portal oficial em https://portal.unila.edu.br/"
      }
    });
    let text = `Consultei o portal oficial da **UNILA** (https://portal.unila.edu.br/noticias) em tempo real. Veja as not\xEDcias e comunicados institucionais mais recentes:

`;
    if (news.length > 0) {
      for (const n of news) {
        text += `\u{1F4F0} **[${n.title}](${n.url})**
`;
        if (n.summary) text += `> ${n.summary.slice(0, 180)}...
`;
        if (n.date) text += `*Data: ${n.date}*

`;
      }
    } else {
      text += `Acesse diretamente o portal de not\xEDcias em [portal.unila.edu.br/noticias](https://portal.unila.edu.br/noticias) para acompanhar as divulga\xE7\xF5es da universidade.`;
    }
    return { text, actions };
  }
  const concept = extractConceptTerm(lower);
  if (concept && concept.length >= 3) {
    const scientificData = await fetchScientificConcept(concept);
    if (scientificData && scientificData.extract) {
      return {
        text: `### ${scientificData.title}

${scientificData.extract}

*Fonte consultada: [${scientificData.title}](${scientificData.url})*

Deseja que eu pesquise artigos cient\xEDficos completos sobre **${scientificData.title}** nas 8 bases acad\xEAmicas do Multirreposit\xF3rio?`,
        actions: [{
          type: "HIGHLIGHT_ELEMENT",
          payload: {
            elementId: "search-bar-input",
            title: `Pesquisar sobre ${scientificData.title}`,
            description: `Digite "${scientificData.title}" na barra de pesquisa para recuperar a literatura cient\xEDfica completa.`
          }
        }]
      };
    }
  }
  return {
    text: `Entendi sua mensagem: "${prompt}". Como sua copiloto na **UNILA**, posso te apoiar em qualquer d\xFAvida e conectar o que voc\xEA procura \xE0 literatura cient\xEDfica, aos editais oficiais ou ao uso da plataforma. O que voc\xEA gostaria de explorar agora?`,
    actions: [{
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-bar-input",
        title: "Pesquisa Acad\xEAmica UNILA",
        description: "Digite palavras-chave, autores ou DOI para iniciar uma busca federada."
      }
    }]
  };
}
function handleComponentHighlightEngine(lower) {
  const actions = [];
  if (lower.includes("acesso aberto") || lower.includes("open access") || lower.includes("oa") || lower.includes("gratuito") || lower.includes("sem paywall")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "open-access-toggle-btn",
        title: "Filtro de Acesso Aberto (OA)",
        description: "Clique neste bot\xE3o para filtrar exclusivamente artigos com licen\xE7a livre e sem cobran\xE7a de taxa."
      }
    });
    actions.push({ type: "SET_OPEN_ACCESS", payload: { value: true } });
    return {
      text: "Destaquei o filtro de **Acesso Aberto (Open Access)** na interface. Ao ativ\xE1-lo, o sistema filtra exclusivamente artigos de peri\xF3dicos livres de paywall (vias Dourada, Verde, H\xEDbrida e Bronze). J\xE1 deixei ativado para sua pr\xF3xima consulta!",
      actions
    };
  }
  if (lower.includes("pdf") || lower.includes("baixar") || lower.includes("download") || lower.includes("texto completo")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "pdf-only-toggle-btn",
        title: "Filtro Com PDF Direto",
        description: "Exibe exclusivamente publica\xE7\xF5es com link direto verificado para leitura e download de PDF."
      }
    });
    actions.push({ type: "SET_HAS_PDF", payload: { value: true } });
    return {
      text: "Destaquei o seletor **Com PDF Direto**. Ele garante que voc\xEA visualize apenas artigos que possuem o arquivo PDF \xEDntegro acess\xEDvel para download imediato ou leitura no visualizador embutido da aplica\xE7\xE3o.",
      actions
    };
  }
  if (lower.includes("salvo") || lower.includes("favorito") || lower.includes("cole\xE7\xE3o") || lower.includes("guardar") || lower.includes("bibtex") || lower.includes("ris")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "saved-articles-btn",
        title: "Cole\xE7\xE3o de Artigos Salvos",
        description: "Acesse suas refer\xEAncias favoritadas e exporte em BibTeX ou RIS para Zotero e Mendeley."
      }
    });
    actions.push({ type: "OPEN_SAVED" });
    return {
      text: "Destaquei o bot\xE3o **Cole\xE7\xE3o Salva** no cabe\xE7alho e abri o painel de favoritos. L\xE1 ficam guardados todos os artigos que voc\xEA marcou com a estrela ou marcador, permitindo exportar a bibliografia em lote nos formatos BibTeX e RIS.",
      actions
    };
  }
  if (lower.includes("barra de busca") || lower.includes("barra de pesquisa") || lower.includes("onde digito") || lower.includes("onde pesquiso") || lower.includes("onde buscar")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "search-bar-input",
        title: "Barra de Pesquisa Acad\xEAmica",
        description: "Digite qualquer termo cient\xEDfico, t\xF3pico de pesquisa, nome de autor ou c\xF3digo DOI."
      }
    });
    return {
      text: "Destaquei a **Barra de Pesquisa Acad\xEAmica**. Voc\xEA pode digitar temas de pesquisa, operadores booleanos (AND, OR), nomes de autores ou c\xF3digos DOI. Pressione Enter ou clique na lupa para iniciar a colheita federada nas 8 bases.",
      actions
    };
  }
  if (lower.includes("bases") || lower.includes("reposit\xF3rio") || lower.includes("fontes") || lower.includes("arxiv") || lower.includes("openalex") || lower.includes("crossref") || lower.includes("capes") || lower.includes("doaj")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "repository-selectors-bar",
        title: "Bases Acad\xEAmicas Integradas",
        description: "Ative ou desative individualmente cada uma das 8 bases conectadas \xE0 UNILA."
      }
    });
    return {
      text: "Destaquei a barra de **Bases a Consultar** logo abaixo do campo de busca. Aqui voc\xEA pode clicar para ligar ou desligar cada fonte acad\xEAmica (OpenAlex, arXiv, Crossref, Portal CAPES, DOAJ, Europe PMC, Semantic Scholar e CORE).",
      actions
    };
  }
  if (lower.includes("filtro") || lower.includes("lateral") || lower.includes("ano") || lower.includes("autor") || lower.includes("\xE1rea") || lower.includes("faceta")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "desktop-filter-sidebar",
        title: "Filtros Facetados",
        description: "Refine os resultados por faixa de anos, autores frequentes, \xE1reas do conhecimento e peri\xF3dicos."
      }
    });
    return {
      text: "Destaquei a **Barra Lateral de Filtros Facetados** \xE0 esquerda. Ela exibe a distribui\xE7\xE3o quantitativa dos artigos encontrados por ano de publica\xE7\xE3o, autores com mais publica\xE7\xF5es, \xE1reas do conhecimento e peri\xF3dicos acad\xEAmicos.",
      actions
    };
  }
  if (lower.includes("sem\xE2ntic") || lower.includes("semantica") || lower.includes("vetorial") || lower.includes("modo sem\xE2ntico")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "semantic-toggle-btn",
        title: "Modo de Busca Sem\xE2ntica IA",
        description: "Combina palavras-chave exatas com busca vetorial contextual."
      }
    });
    actions.push({ type: "SET_SEMANTIC_MODE", payload: { value: true } });
    return {
      text: "Destaquei o bot\xE3o de **Busca Sem\xE2ntica IA**. Quando ativo, o motor do Multirreposit\xF3rio n\xE3o se limita a termos literais: ele expande sin\xF4nimos conceituais e faz ranqueamento por similaridade contextual.",
      actions
    };
  }
  if (lower.includes("portal") || lower.includes("institucional") || lower.includes("site da unila") || lower.includes("onde fica o edital")) {
    actions.push({
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        elementId: "institutional-horizontal-nav",
        title: "Navega\xE7\xE3o Institucional UNILA",
        description: "Acesso direto ao Portal UNILA, Editais Oficiais e Biblioteca Latino-Americana."
      }
    });
    return {
      text: "Destaquei a barra de **Navega\xE7\xE3o Institucional UNILA** no topo superior da aplica\xE7\xE3o. Ela cont\xE9m atalhos oficiais diretos para o Portal Institucional da UNILA (https://portal.unila.edu.br/), o Portal de Editais e a Biblioteca Latino-Americana.",
      actions
    };
  }
  actions.push({
    type: "HIGHLIGHT_ELEMENT",
    payload: {
      elementId: "search-bar-input",
      title: "Explorar Recursos da Plataforma",
      description: "Barra central para busca cient\xEDfica integrada da UNILA."
    }
  });
  return {
    text: "Destaquei a \xE1rea principal de pesquisa. Se voc\xEA deseja encontrar um elemento espec\xEDfico, pergunte: *'onde fica o filtro de acesso aberto?'*, *'onde vejo os artigos salvos?'*, *'como baixar PDFs?'* ou *'onde seleciono as bases acad\xEAmicas?'*.",
    actions
  };
}
function extractSearchKeywords(text, stopWords) {
  const words = text.replace(/[^\w\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !stopWords.includes(w.toLowerCase()));
  return words.slice(0, 4).join(" ");
}
function extractCleanAcademicQuery(prompt) {
  const removePatterns = [
    /^(busque|buscar|pesquise|pesquisar|encontre|ache|mostre|exiba)\s+(artigos?\s+(sobre|de)?|papers?\s+(sobre|de)?)/i,
    /^(artigos?\s+(sobre|de)?)/i,
    /^(quero\s+ver\s+artigos?\s+(sobre|de)?)/i,
    /^(quais\s+(são\s+os\s+)?artigos?\s+(sobre|de)?)/i,
    /\b(no\s+chat|aqui\s+no\s+chat|por\s+favor|pra\s+mim)\b/gi
  ];
  let cleaned = prompt.trim();
  for (const pat of removePatterns) {
    cleaned = cleaned.replace(pat, "").trim();
  }
  return cleaned.replace(/[?.!]+$/, "").trim();
}
function normalizeText(text) {
  return (text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, " ").replace(/\s+/g, " ").trim();
}
function extractConceptTerm(lower) {
  const match = lower.match(/(?:o que [eé]|o que significa|conceito de|defini[çc][aã]o de|explique|como funciona)\s+([a-zA-ZÀ-ÿ\s]{3,40})/i);
  if (match && match[1]) {
    const term = match[1].trim().replace(/(?:na ciência|na pesquisa|acad[eê]mico|\?)/gi, "").trim();
    const conversationalStopWords = [
      "oi",
      "ola",
      "ol\xE1",
      "isso",
      "aquilo",
      "voce",
      "voc\xEA",
      "sophia",
      "unila",
      "multirrepositorio",
      "multirreposit\xF3rio",
      "ajuda",
      "pesquisa",
      "tudo",
      "nada",
      "bom dia",
      "boa tarde",
      "boa noite",
      "um artigo",
      "um paper",
      "a unila",
      "o portal"
    ];
    if (conversationalStopWords.includes(term.toLowerCase()) || term.length < 3) {
      return "";
    }
    return term;
  }
  return "";
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(import_express.default.json({ limit: "25mb" }));
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/copilot", async (req, res) => {
    try {
      const { messages, pageContext } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Par\xE2metro 'messages' \xE9 obrigat\xF3rio e deve ser uma lista." });
      }
      const result = await handleCopilotChat({ messages, pageContext });
      res.json(result);
    } catch (error) {
      console.error("Copilot API error:", error);
      res.status(500).json({
        text: "Desculpe, ocorreu um erro ao processar sua solicita\xE7\xE3o no co-pilot. Por favor, tente novamente.",
        error: error?.message
      });
    }
  });
  app.get("/api/unila/editais", async (req, res) => {
    try {
      const q = (req.query.q || "").trim();
      const cat = (req.query.category || "").trim();
      const limit = parseInt(req.query.limit || "10", 10);
      const editais = await fetchUnilaEditais(q, cat, limit);
      res.json({ editais, count: editais.length, source: "https://documentos.unila.edu.br" });
    } catch (err) {
      console.error("Unila Editais API error:", err);
      res.status(500).json({ error: "Falha ao recuperar editais", message: err?.message });
    }
  });
  app.get("/api/unila/news", async (req, res) => {
    try {
      const q = (req.query.q || "").trim();
      const limit = parseInt(req.query.limit || "6", 10);
      const news = await fetchUnilaNews(q, limit);
      res.json({ news, count: news.length, source: "https://portal.unila.edu.br/noticias" });
    } catch (err) {
      console.error("Unila News API error:", err);
      res.status(500).json({ error: "Falha ao recuperar not\xEDcias", message: err?.message });
    }
  });
  app.get("/api/pdf-proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl || !targetUrl.startsWith("http")) {
      return res.status(400).send("URL de PDF inv\xE1lida");
    }
    try {
      const upstreamRes = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "application/pdf,application/octet-stream,*/*"
        },
        redirect: "follow",
        signal: AbortSignal.timeout(2e4)
      });
      if (!upstreamRes.ok) {
        return res.status(upstreamRes.status).send(`Falha ao recuperar PDF da fonte externa: HTTP ${upstreamRes.status}`);
      }
      const contentType = upstreamRes.headers.get("content-type") || "application/pdf";
      res.setHeader("Content-Type", contentType.includes("pdf") ? "application/pdf" : contentType);
      res.setHeader("Content-Disposition", 'inline; filename="artigo.pdf"');
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      const arrayBuffer = await upstreamRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err) {
      console.warn("PDF proxy error for URL:", targetUrl, err?.message);
      res.status(502).send("N\xE3o foi poss\xEDvel carregar o PDF diretamente: " + (err?.message || "Timeout na conex\xE3o"));
    }
  });
  app.get("/api/search", async (req, res) => {
    try {
      const query = (req.query.q || "").trim();
      const sourcesParam = req.query.sources;
      const semanticParam = req.query.semantic === "true";
      let selectedSources = [
        "Portal CAPES",
        "Semantic Scholar",
        "OpenAlex",
        "Crossref",
        "CORE",
        "Europe PMC",
        "arXiv",
        "DOAJ"
      ];
      if (sourcesParam) {
        const parsed = sourcesParam.split(",").map((s) => s.trim());
        if (parsed.length > 0) {
          selectedSources = parsed;
        }
      }
      const startTime = Date.now();
      const searchQuery = query || "intelig\xEAncia artificial";
      const result = await executeFederatedSearch(
        searchQuery,
        selectedSources,
        semanticParam
      );
      const executionTimeMs = Date.now() - startTime;
      res.json({
        query: searchQuery,
        totalFound: result.totalFound,
        deduplicatedCount: result.deduplicatedCount,
        executionTimeMs,
        sourcesStatus: result.sourcesStatus,
        articles: result.articles,
        facets: result.facets
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        error: "Falha ao processar busca",
        message: error?.message || "Erro interno"
      });
    }
  });
  app.use(import_express.default.static(import_path.default.join(process.cwd(), "public")));
  app.use("/images", import_express.default.static(import_path.default.join(process.cwd(), "images")));
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Federated Academic Search running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
