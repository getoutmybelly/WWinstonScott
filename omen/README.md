# OMEN — Sign & Wonder Reader

OMEN is a local-first web app for interpreting unusual events through multiple symbolic lenses while keeping astronomical facts separate from interpretive claims.

## Current MVP

- Free-form omen / synchronicity story intake
- Event date and time
- Optional location permission
- Symbol and context matching
- Convergence analysis across multiple signs in one event
- Reading lenses: convergence, warning, initiation, ancestors, relationship, career
- Live tropical planetary positions for Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto
- Retrograde detection and major aspect detection
- Lunar phase
- Source-aware correspondence cards that distinguish historical sources from interpretive conventions
- Personal Grimoire stored locally in the browser
- Grimoire JSON import/export
- TXT/Markdown source-note uploads with lightweight lexical retrieval into later omen readings
- One-click bee-event canonical test case

## Privacy model

The MVP is static and local-first. Omen stories, custom correspondences, and uploaded text notes stay in the browser's local storage. The astronomy library is loaded client-side. There is no account system or server-side omen database in this version.

## Knowledge entry schema

```json
{
  "symbol": "Cardinal",
  "keywords": ["cardinal", "red bird"],
  "themes": ["message", "ancestor", "vitality"],
  "tradition": "Personal / folk",
  "meaning": "Interpretive note here",
  "source": "Book, teacher, URL, or personal observation",
  "evidence": "personal"
}
```

## Next architecture

The next major version should move the knowledge corpus into a structured, versioned source library and add real RAG: document chunking, metadata, embeddings, source retrieval, citation-first synthesis, and an AI interpretation layer. PDF/DOC ingestion should be processed by a backend rather than stored as raw browser localStorage.

Planned layers:

1. **Event parser** — entities, sequence, roles, emotion, objects, animals, numbers, colors, repeated motifs.
2. **Correspondence engine** — tradition-specific symbolic knowledge with source provenance.
3. **Convergence engine** — finds recurring themes across otherwise separate signs.
4. **Astrology engine** — event chart, aspects, lunar phase, retrogrades, houses, natal transits, planetary hours.
5. **RAG library** — user-added books, articles, notes, historical texts, and practitioner teachings.
6. **Synthesis engine** — generates readings while labeling historical, traditional, personal, and speculative layers.
7. **Omen journal** — saves events and looks for repeated symbols across time.

## Canonical test case

The bee-sting / soccer-game event is intentionally included as the first complex test. It exercises animal symbolism, body-location symbolism, family boundaries, a former partner entering the scene, professional/public visibility, arrival/departure imagery, and an event chart at the same time.

## Source posture

OMEN should never flatten multiple spiritual traditions into one alleged universal dictionary. Each future corpus entry should preserve its tradition, source, cultural context, and confidence level. Personal spiritual belief is welcome; provenance stays visible.
