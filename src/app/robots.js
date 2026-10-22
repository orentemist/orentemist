const SITE_URL = "https://orentemist.online";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: SITE_URL + "/sitemap.xml"
  };
}