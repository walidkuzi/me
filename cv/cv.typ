// ============================================================
//  Waleed Mohammad Rahim — Curriculum Vitae
//  Build:  typst compile --font-path cv/fonts cv/cv.typ public/Waleed-Rahim-CV.pdf
//  (or, from the repo root:  npm run cv)
// ============================================================

#let ink = rgb("#11161f")
#let body-col = rgb("#2b3648")
#let teal = rgb("#0c8576")
#let dim = rgb("#5b6b80")
#let rule-col = rgb("#cbd3df")

#set document(title: "Waleed Mohammad Rahim — Curriculum Vitae", author: "Waleed Mohammad Rahim")
#set page(
  paper: "a4",
  margin: (x: 1.45cm, top: 1.15cm, bottom: 1.0cm),
  footer: context [
    #set text(font: "JetBrains Mono", size: 7pt, fill: dim)
    #grid(
      columns: (1fr, auto),
      align: (left, right),
      [WALEED MOHAMMAD RAHIM],
      [walidkuzi.github.io/me · #counter(page).display() / #counter(page).final().first()],
    )
  ],
)
#set text(font: "Space Grotesk", size: 9pt, fill: body-col, lang: "en")
#set par(justify: false, leading: 0.52em, spacing: 0.5em)
#set list(marker: text(fill: teal)[–], indent: 1pt, body-indent: 6pt, spacing: 0.38em)

// ---- helpers ----
#let mono(size: 8pt, fill: dim, it) = text(font: "JetBrains Mono", size: size, fill: fill, it)

#let section(title) = {
  v(5pt)
  mono(size: 8pt, fill: teal)[#upper(title)]
  v(2pt)
  line(length: 100%, stroke: 0.6pt + rule-col)
  v(4pt)
}

#let entry(role, org, date, ..body) = {
  grid(
    columns: (1fr, auto),
    align: (left + horizon, right + horizon),
    text(size: 10.5pt, weight: "bold", fill: ink)[#role],
    mono(size: 8pt)[#date],
  )
  v(0.5pt)
  mono(size: 8.2pt, fill: teal)[#org]
  v(2.5pt)
  body.pos().join()
  v(3.5pt)
}

#let skill(cat, items) = {
  grid(
    columns: (3.1cm, 1fr),
    gutter: 8pt,
    mono(size: 8pt, fill: teal)[#cat],
    text(size: 9pt, fill: body-col)[#items],
  )
  v(2.5pt)
}

// ============================================================
//  HEADER
// ============================================================
#grid(
  columns: (1fr, auto),
  align: (left + bottom, right + bottom),
  [
    #text(size: 21pt, weight: "medium", fill: ink, tracking: -0.02em)[Waleed Mohammad Rahim]
    #v(2pt)
    #mono(size: 9pt, fill: teal)[AI Systems Architect & Software Engineer · Founder]
  ],
  [
    #set align(right)
    #mono(size: 8pt)[
      Istanbul, Turkey \
      waleedkuzi\@gmail.com \
      +90 501 080 6000 \
      github.com/walidkuzi
    ]
  ],
)
#v(6pt)
#line(length: 100%, stroke: 1pt + ink)

// ============================================================
//  SUMMARY
// ============================================================
#section("Profile")
Software engineer and founder specialized in building the *infrastructure layer of AI* — the
platforms, orchestration engines, and retrieval architectures that make large language models do
useful work inside real businesses. I design platforms end-to-end (schema, services, agent
orchestration, retrieval pipelines, multi-tenant billing, and UX) and lead them from zero to one,
setting technical direction and shipping production-grade systems across SMB and enterprise markets
in MENA.

// ============================================================
//  EXPERIENCE
// ============================================================
#section("Experience")

#entry("Founder & Software Engineer", "AI Platforms & Automation Systems", "2025 — Present")[
  - Lead design and development of AI-driven platforms focused on business productivity.
  - Own AI system architecture, automation platforms, and scalable SaaS infrastructure.
  - Build knowledge-based retrieval systems, enterprise integrations, and end-to-end deployment.
]

#entry("Project Manager & Product Architect", "Akwadx Software Agency", "2024 — Present")[
  - Lead architecture and development planning of software systems for startups.
  - Provide technical leadership across cross-functional teams and drive product strategy.
  - Design high-performance backend infrastructure.
]

#entry("Founder", "Rehlat Uhud — Online Travel Platform", "2023 — 2024")[
  - Built an end-to-end travel booking platform with itinerary planning.
  - Delivered supplier integrations and a multi-tenant admin layer.
]

#entry("Founder", "Tourel Tourism — Tourism Technology", "2022 — 2024")[
  - Designed the platform architecture, booking engine, and operator tooling.
  - Connected tour operators with travelers across the booking value chain.
]

#entry("Founder", "Al Rayah — Delivery Platform", "2020")[
  - Built a last-mile delivery startup: dispatch, courier app, and merchant dashboard.
]

#entry("Founder", "Kayan Beauty — Beauty Technology", "2018 — 2020")[
  - First commercial venture connecting beauty service providers and customers.
  - Foundational experience building, shipping, and iterating products.
]

// ============================================================
//  SKILLS
// ============================================================
#section("Technical Skills")
#skill("AI & LLM", "Claude API, OpenAI, Gemini, LangChain, LangGraph, LlamaIndex, CrewAI, Pydantic AI, Ollama, vLLM, MCP")
#skill("Vector & Retrieval", "Pinecone, Weaviate, Qdrant, Chroma, pgvector, FAISS, Milvus, Hybrid Search")
#skill("Languages", "TypeScript, Python, JavaScript, Go, Rust, SQL, Bash")
#skill("Frontend", "Next.js, React, React Native, Expo, Tailwind CSS, shadcn/ui, Framer Motion, Radix UI")
#skill("Backend & APIs", "Node.js, FastAPI, NestJS, tRPC, GraphQL, gRPC, WebSockets, Kafka, RabbitMQ, Temporal")
#skill("Data & Storage", "PostgreSQL, Redis, MongoDB, Supabase, Prisma, Drizzle, ClickHouse, S3")
#skill("Cloud & Infra", "AWS, GCP, Vercel, Cloudflare, Docker, Kubernetes, Terraform, GitHub Actions")
#skill("Architecture", "Multi-Tenant SaaS, Microservices, Event-Driven, CQRS, DDD, Agent Orchestration, RAG, Observability")

// ============================================================
//  EDUCATION + LANGUAGES
// ============================================================
#section("Education & Languages")
#grid(
  columns: (1.15fr, 1fr),
  gutter: 22pt,
  [
    #text(size: 10pt, weight: "bold", fill: ink)[B.Sc. Software Engineering]
    #v(1pt)
    #mono(size: 8.2pt, fill: teal)[Üsküdar University, Istanbul · 2022 — Present]
    #v(7pt)
    #text(size: 10pt, weight: "bold", fill: ink)[Self-Directed Engineering]
    #v(1pt)
    #mono(size: 8.2pt, fill: teal)[2018 — Present]
    #v(2pt)
    #text(size: 9pt)[AI systems, software architecture, and SaaS platforms — learned by building and shipping real products.]
  ],
  [
    #for (lang, lvl) in (
      ("Pashto", "Native"),
      ("Arabic", "Native"),
      ("English", "Professional"),
      ("Turkish", "Elementary"),
      ("Urdu", "Elementary"),
      ("Russian", "Elementary"),
    ) {
      grid(
        columns: (1fr, auto),
        align: (left, right),
        text(size: 9.2pt, fill: ink)[#lang],
        mono(size: 7.8pt)[#upper(lvl)],
      )
      v(1.5pt)
      line(length: 100%, stroke: 0.5pt + rule-col)
      v(2.5pt)
    }
  ],
)
