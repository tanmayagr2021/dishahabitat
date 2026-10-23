/*
 * The design system: every page is built from these, so the whole site keeps one look.
 * Buttons are global classes (btn btn-primary | btn-dark | btn-soft | btn-ghost | btn-light | btn-outline),
 * as are .display (the serif), .eyebrow and .text-link. Colours and spacing are CSS variables in
 * src/app/globals.css (var(--ink), var(--surface), var(--gutter)…) and Tailwind utilities with the same names.
 */
export { Accordion } from "./Accordion";
export { Breadcrumbs } from "./Breadcrumbs";
export { CtaBand } from "./CtaBand";
export { type Cta, CtaLink } from "./CtaLink";
export { type Fact, FactList } from "./FactList";
export { Feature } from "./Feature";
export { ChoiceCards, Checkbox, fieldClasses, SelectField, TextArea, TextField } from "./Field";
export { Gallery, type GalleryItem } from "./Gallery";
export { PageIntro } from "./PageIntro";
export { PhotoHero, type Spec } from "./PhotoHero";
export { Quote } from "./Quote";
export { Panel, Section, SectionHead } from "./Section";
export { type SpecItem, Specs } from "./Specs";
export { Tag } from "./Tag";
