---
slug: "dossierbox"
title: "DossierBox"
category: "Career Document Platform"
status: "published"
featured: true
order: 1
date: "2026-08-27"
summary: "A mobile-first career-document platform built around a reusable professional Dossier that users can turn into tailored application documents."
context: "DossierBox is built around the idea that people should not have to repeatedly recreate their career information for every application. Instead, a reusable Dossier acts as the source of truth for professional information, which can then support different application documents and variants."
problem: "Career information is often scattered across old CVs, documents, profiles, and application forms. Existing resume tools can also make users think in terms of templates before they have properly organized the information they need. I wanted to explore a product model where the underlying career data comes first and documents are generated from that reusable source of truth."
built: "I am developing DossierBox as a full-stack Next.js application using TypeScript, PostgreSQL, Drizzle ORM, and NextAuth.\n\nThe application includes authenticated user workflows, persistent profile and document records, database migrations, server-side operations, document creation and rendering workflows, profile import functionality, and responsive interfaces.\n\nA major part of the development has involved tracing real user journeys, diagnosing application-state and persistence problems, refining the information architecture, and improving the experience through iterative testing rather than treating the interface as a static design."
result: "DossierBox has evolved into a working full-stack product with authenticated workflows, persistent data, document operations, import functionality, and a production deployment. The project continues to be developed and serves as an ongoing demonstration of product engineering, debugging, architecture, and UX iteration."
coverImage: "dossierbox.png"
gallery:
  - "dossierbox-1.png"
  - "dossierbox-2.png"
  - "dossierbox-3.png"
liveUrl: "https://dossier-box.vercel.app"
sourceUrl: "https://github.com/CodeBruv/dossierbox"
seoTitle: "DossierBox — Career Document Platform | Code Bruv"
seoDescription: "DossierBox is a full-stack career-document platform built with Next.js and TypeScript, using a reusable professional Dossier as the source for application documents."
---

DossierBox began with a simple product question: what if career information could be maintained once and reused across different job applications instead of repeatedly rebuilding a CV from scratch?

The core concept is the Dossier, a reusable source of truth for a person's professional information. Documents sit on top of that information rather than being the starting point.

I am building the application with Next.js and TypeScript, backed by PostgreSQL and Drizzle ORM, with authentication and server-side application workflows.

The project has also become a practical exercise in debugging a real application. During development I have worked through issues involving authentication, database migrations, persistent records, imported profile data, application state, document workflows, and responsive user journeys.

Rather than hiding those problems behind a polished screenshot, I have used them to improve the underlying architecture and the user experience. This has included tracing data from import through persistence and back into the interface, testing complete user journeys, and restructuring flows when the implementation did not match the intended product model.

DossierBox is still under active development, but it represents the kind of work I want to do professionally: building real product interfaces while understanding the data, application logic, and user experience behind them.
