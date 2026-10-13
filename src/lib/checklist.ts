/*
 * "The checklist: must-knows while investing in a home", from dishahabitat.com/checklist.
 * Article text is Disha Habitat's own, lightly edited for grammar; no facts were added.
 */
export type ChecklistItem = { slug: string; title: string; summary: string; image: string; body: string[] };

export const checklist: ChecklistItem[] = [
  {
    "slug": "khata-certificate",
    "title": "Khata certificate",
    "summary": "Who legally owns a property",
    "image": "/images/checklist/khata.webp",
    "body": [
      "The Khata Certificate is a document that identifies who the owner of a particular property is. In other words, it “certifies” that a particular property belongs to particular person.",
      "These documents are compulsory in two situations, the first is when the property owner wishes to register the property and the second is when the owner wishes to sell the property."
    ]
  },
  {
    "slug": "occupancy-certificate",
    "title": "Occupancy certificate",
    "summary": "Proof a building is fit to live in",
    "image": "/images/checklist/oc.webp",
    "body": [
      "An occupancy certificate is a document that is issued by a local government agency or planning authority, upon the completion of construction of a new project. The certificate is proof that the project has been built, by adhering to the applicable building codes, relevant regulations and laws. It is the responsibility of the developer to obtain an occupancy certificate, once the project has been completed. The certificate is an indication that the building is suitable for occupancy. An OC is required, when applying for water, sanitation and electricity connections."
    ]
  },
  {
    "slug": "carpet-area",
    "title": "Carpet area",
    "summary": "What you are actually paying for",
    "image": "/images/checklist/carpet.webp",
    "body": [
      "Carpet area is that area in the flat which you could cover using a carpet. It is also known as the net usable area. According to the Real Estate Regulation and Development Act (RERA), carpet area is ‘the net usable floor area of an apartment, excluding the area covered by the external walls but including the area covered by internal partition walls of the apartment’. Under the government’s PMAY programme, carpet area is defined as the ‘area enclosed within the walls and the actual area to lay the carpet’.",
      "The built-up area in a flat is its carpet area, plus the space taken by the walls. The build-up area in a flat also includes other unusable areas like balcony, terrace, flower beds, etc. This is why the space in a flat would seem larger when it is expressed in build-up area terms.",
      "Super built-up area is the built-up area of the property, along with the proportionate area of the common facilities in the housing project. These facilities may include the lobby, the lift shaft, the stairs, the swimming pool, the garden, the park, and clubhouse, etc. Developers arrive at the super built-up area of a unit by way of adding the total built-up area with the area occupied by common areas, including the corridor, the lift lobby, the elevator, etc. In some cases, builders even include amenities such as pools, gardens, and clubhouses, in the common area."
    ]
  },
  {
    "slug": "deviation-assessment",
    "title": "Deviation assessment",
    "summary": "How far a building may differ from its plan",
    "image": "/images/checklist/deviation.webp",
    "body": [
      "When builders seek approval on Project layout plan from govt authorities, at that time project is only on papers. Despite the fact that these layout plans are normally prepared by very reputed architects, there will always be deviation from approved layout plan. This is because when construction starts, the construction company face some unavoidable technical and architectural difficulties / glitches in execution of approved layout plan. Keeping this in mind, Govt authorities allow deviation of +5% to -5% from approved layout plan. We can term it as an unintentional deviation."
    ]
  },
  {
    "slug": "sewage-treatment-plants",
    "title": "Sewage treatment plants",
    "summary": "Why a community treats its own water",
    "image": "/images/checklist/stp.webp",
    "body": [
      "Sewage Treatment Plants (STP) requires physical, biological and often chemical processes in order to eliminate contaminants. Its purpose is to produce sewage water that is environmentally friendly and suitable for disposal or reuse. By circulating air, a sewage treatment plant works to facilitate bacteria’s growth to break down sewage. The aim is to have much healthier, more eco-friendly waste. It requires a process comparable to a standard septic tank, but there are some main differences. Sewage treatment plants may handle waste from several domestic dwellings or commercial properties, depending on their size."
    ]
  }
];

export const getChecklistItem = (slug: string) => checklist.find((c) => c.slug === slug);
