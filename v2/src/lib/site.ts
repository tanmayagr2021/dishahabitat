/*
 * Where V2's links go. V2 is the homepage opening only; every other page belongs to the full
 * website (V1). Its preview lives on Vercel until dishahabitat.com is switched over, so change
 * `fullSite` once the domain moves.
 */
export const fullSite = "https://dishahabitat.vercel.app";

export const links = {
  communities: "#communities",
  story: `${fullSite}/story`,
  checklist: `${fullSite}/checklist`,
  contact: `${fullSite}/contact`,
  community: (slug: string) =>
    slug === "pursuit-of-the-elements" ? `${fullSite}/homes/pursuit-of-the-elements` : `${fullSite}/homes/${slug}`,
};

/*
 * "Plan a visit" opens WhatsApp with a message ready to send, on Disha's published sales line for
 * Pursuit of the Elements. Nothing is sent from the website, so the label never promises a call back.
 */
const visitMessage = "Hello Disha Habitat, I would like to plan a visit to Pursuit of the Elements in Gunjur.";
export const whatsappVisit = `https://api.whatsapp.com/send?phone=919505333333&text=${encodeURIComponent(visitMessage)}`;
