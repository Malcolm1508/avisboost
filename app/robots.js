export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/t/"] },
    ],
    sitemap: "https://boostrepu.fr/sitemap.xml",
    host: "https://boostrepu.fr",
  };
}
