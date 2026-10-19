/*
 * "The checklist: must-knows while investing in a home", from dishahabitat.com/checklist.
 * Article text is Disha Habitat's own, lightly edited for grammar; no facts were added.
 */
export type ChecklistItem = { slug: string; title: string; summary: string; image: string; body: string[]; checks?: string[] };

export const checklist: ChecklistItem[] = [
  {
    "slug": "khata-certificate",
    "title": "Khata certificate",
    "summary": "The property’s record in the municipal tax register",
    "image": "/images/checklist/khata.webp",
    "body": [
      "A khata (in Bengaluru, now an e-khata) enters a property in the municipal tax register and names the person who pays its property tax. It is not proof of ownership on its own: ownership comes from the sale deed and the chain of title documents.",
      "A khata is needed in two situations: when the owner wishes to register the property, and when the owner wishes to sell it."
    ]
  },
  {
    "slug": "occupancy-certificate",
    "title": "Occupancy certificate",
    "summary": "Proof a building is fit to live in",
    "image": "/images/checklist/oc.webp",
    "body": [
      "An occupancy certificate is a document issued by a local government agency or planning authority when construction of a new project is complete. It is proof that the project has been built according to the applicable building codes, regulations and laws. It is the developer’s responsibility to obtain the occupancy certificate once the project is complete. The certificate shows that the building is fit to live in, and it is needed when applying for water, sanitation and electricity connections."
    ]
  },
  {
    "slug": "carpet-area",
    "title": "Carpet area",
    "summary": "What you are actually paying for",
    "image": "/images/checklist/carpet.webp",
    "body": [
      "Carpet area is that area in the flat which you could cover using a carpet. It is also known as the net usable area. The Real Estate (Regulation and Development) Act, 2016 (RERA) defines carpet area as “the net usable floor area of an apartment, excluding the area covered by the external walls, areas under services shafts, exclusive balcony or verandah area and exclusive open terrace area, but includes the area covered by the internal partition walls of the apartment”. RERA requires developers to state the carpet area of each home.",
      "The built-up area of a flat is its carpet area plus the space taken by the walls. It can also include areas such as balconies, terraces and flower beds. This is why a flat seems larger when it is described in built-up area.",
      "Super built-up area is the built-up area of the property, along with the proportionate area of the common facilities in the housing project. These facilities may include the lobby, the lift shaft, the stairs, the swimming pool, the garden and the clubhouse. Developers arrive at the super built-up area of a unit by adding its built-up area to its share of the common areas, such as corridors, lift lobbies and lifts."
    ]
  },
  {
    "slug": "deviation-assessment",
    "title": "Deviation assessment",
    "summary": "How far a building may differ from its plan",
    "image": "/images/checklist/deviation.webp",
    "body": [
      "When a builder seeks approval for a building plan, the project exists only on paper. Once construction starts, small differences from the sanctioned plan can be unavoidable. Bengaluru’s building rules tolerate only small deviations when the occupancy certificate is issued; larger ones can delay or prevent it. Under RERA, a developer cannot alter the sanctioned plan without the consent of buyers that the Act requires."
    ]
  },
  {
    "slug": "sewage-treatment-plants",
    "title": "Sewage treatment plants",
    "summary": "Why a community treats its own sewage",
    "image": "/images/checklist/stp.webp",
    "body": [
      "A sewage treatment plant (STP) cleans a community’s waste water through physical, biological and sometimes chemical processes, so that it can be safely discharged or reused, for example in gardens. Air is circulated to help bacteria break the sewage down. The idea is like a septic tank, but on a larger scale and with cleaner results, and one plant can serve many homes."
    ]
  }
];

export const getChecklistItem = (slug: string) => checklist.find((c) => c.slug === slug);

/*
 * What to check before you buy, for each must-know. Each point restates the article above it as an
 * action; no new facts are introduced.
 */
const checks: Record<string, string[]> = {
  "khata-certificate": [
    "Ask whose name the property’s khata is in, and compare it with the sale deed and title documents.",
    "Keep it ready: it is needed to register the property, and again if you sell it.",
  ],
  "occupancy-certificate": [
    "Ask whether the occupancy certificate (OC) has been issued for the building.",
    "Remember the developer is responsible for obtaining it once construction is complete.",
    "An OC is needed when applying for water, sanitation and electricity connections.",
  ],
  "carpet-area": [
    "Ask for the carpet area of the home, not only the built-up or super built-up area.",
    "Understand what the super built-up area adds: a share of the lobby, lifts, stairs, pool, garden and clubhouse.",
    "Compare homes by carpet area, the net usable floor area defined by RERA.",
  ],
  "deviation-assessment": [
    "Ask how the finished building compares with its approved layout plan.",
    "Ask whether any deviation is within the limits allowed for the occupancy certificate.",
  ],
  "sewage-treatment-plants": [
    "Ask whether the community treats its own sewage with an STP.",
    "Ask how the treated water is disposed of or reused.",
  ],
};
for (const c of checklist) c.checks = checks[c.slug];
