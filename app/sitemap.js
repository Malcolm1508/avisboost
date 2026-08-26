import { ARTICLES } from "@/lib/articles";

export default function sitemap() {
  const base = "https://boostrepu.fr";
  const now = new Date();
  const staticPages = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  const articlePages = ARTICLES.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticPages, ...articlePages];
}
