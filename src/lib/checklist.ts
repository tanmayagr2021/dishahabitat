/*
 * "The checklist: must-knows while investing in a home", from dishahabitat.com/checklist.
 * Article text is Disha Habitat's own, lightly edited for grammar; no facts were added.
 */
export type ChecklistItem = { slug: string; title: string; summary: string; image: string; body: string[]; checks?: string[] };

export const checklist: ChecklistItem[] = [
  {
    "slug": "khata-certificate",
    "title": "Khata certificate",
    "summary": "Who legally owns a property",
    "image": "/images/checklist/khata.webp",
    "body": [
      "The Khata Certificate is a document that identifies who the owner of a particular property is. In other words, it “certifies” that a particular property belongs to a particular person.",
      "These documents are compulsory in two situations: when the owner wishes to register the property, and when the owner wishes to sell it."
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
      "Carpet area is that area in the flat which you could cover using a carpet. It is also known as the net usable area. According to the Real Estate (Regulation and Development) Act, 2016 (RERA), carpet area is ‘the net usable floor area of an apartment, excluding the area covered by the external walls but including the area covered by internal partition walls of the apartment’. Under the government’s PMAY programme, carpet area is defined as the ‘area enclosed within the walls and the actual area to lay the carpet’.",
      "The built-up area of a flat is its carpet area plus the space taken by the walls. It can also include areas such as balconies, terraces and flower beds. This is why a flat seems larger when it is described in built-up area.",
      "Super built-up area is the built-up area of the property, along with the proportionate area of the common facilities in the housing project. These facilities may include the lobby, the lift shaft, the stairs, the swimming pool, the garden and the clubhouse. Developers arrive at the super built-up area of a unit by adding its built-up area to its share of the common areas, such as corridors, lift lobbies and lifts. Some builders also include amenities such as pools, gardens and clubhouses in the common area."
    ]
  },
  {
    "slug": "deviation-assessment",
    "title": "Deviation assessment",
    "summary": "How far a building may differ from its plan",
    "image": "/images/checklist/deviation.webp",
    "body": [
      "When builders seek approval for a project’s layout plan from government authorities, the project exists only on paper. Even though layout plans are usually prepared by reputed architects, there will always be some deviation from the approved plan, because once construction starts the builder meets unavoidable technical and architectural difficulties in carrying it out. Keeping this in mind, government authorities allow a deviation of up to 5% either way from the approved layout plan. This can be called an unintentional deviation."
    ]
  },
  {
    "slug": "sewage-treatment-plants",
    "title": "Sewage treatment plants",
    "summary": "Why a community treats its own water",
    "image": "/images/checklist/stp.webp",
    "body": [
      "A sewage treatment plant (STP) uses physical, biological and often chemical processes to remove contaminants. Its purpose is to produce sewage water that is environmentally friendly and suitable for disposal or reuse. By circulating air, a sewage treatment plant works to facilitate bacteria’s growth to break down sewage. The aim is to have much healthier, more eco-friendly waste. The process is comparable to a standard septic tank, with some important differences. Sewage treatment plants may handle waste from several domestic dwellings or commercial properties, depending on their size."
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
    "Ask whose name the property’s khata certificate is in.",
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
    "Know that authorities allow a deviation of plus or minus 5% from the approved plan.",
  ],
  "sewage-treatment-plants": [
    "Ask whether the community treats its own sewage with an STP.",
    "Ask how the treated water is disposed of or reused.",
  ],
};
for (const c of checklist) c.checks = checks[c.slug];
