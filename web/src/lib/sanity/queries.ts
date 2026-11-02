// ponytail: one 2000px rendition for every use; add per-component srcset if card weight matters.
const sized = `+ "?w=2000&fit=max"`;
export const contentQuery = `{"settings":*[_type=="siteSettings" && _id=="siteSettings"][0]{...,"heroImage":heroImage.asset->url ${sized},"heroAlt":heroImage.alt,"aboutImage":aboutImage.asset->url ${sized},"aboutAlt":aboutImage.alt},"events":*[_type=="event" && defined(slug.current)]{...,"slug":slug.current,"image":image.asset->url ${sized},"imageAlt":image.alt}}`;
