const SITE_URL = "https://orentemist.online";
const API_URL = "https://api.orentemist.online/api";

export default async function sitemap() {
  const currentDate = new Date();

  const pages = [
    {
      url: SITE_URL + "/",
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    const response = await fetch(API_URL + "/products/", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return pages;
    }

    const data = await response.json();

    const products = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
        ? data.results
        : [];

    const productPages = products
      .filter(function (product) {
        return product.slug;
      })
      .map(function (product) {
        return {
          url:
            SITE_URL +
            "/products/" +
            encodeURIComponent(product.slug),
          lastModified: product.updated_at
            ? new Date(product.updated_at)
            : currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        };
      });

    return pages.concat(productPages);
  } catch (error) {
    console.error("Sitemap error:", error);
    return pages;
  }
}