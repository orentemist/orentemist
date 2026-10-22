import { cache } from "react";

const SITE_URL = "https://orentemist.online";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://orentemist-backend.onrender.com/api"
).replace(/\/+$/, "");

const API_ORIGIN = new URL(API_URL).origin;

const getProduct = cache(async (slug) => {
  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(slug)}/`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Unable to load product metadata:", error);
    return null;
  }
});

function getAbsoluteImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  const trimmedPath = imagePath.trim();

  if (!trimmedPath) {
    return null;
  }

  try {
    return new URL(trimmedPath, `${API_ORIGIN}/`).toString();
  } catch {
    return null;
  }
}

function getProductImage(productData) {
  if (!productData) {
    return null;
  }

  if (
    typeof productData.image === "string" &&
    productData.image.trim()
  ) {
    return getAbsoluteImageUrl(productData.image);
  }

  if (Array.isArray(productData.images) && productData.images.length > 0) {
    const firstImage = productData.images[0];

    if (typeof firstImage === "string") {
      return getAbsoluteImageUrl(firstImage);
    }

    if (firstImage && typeof firstImage === "object") {
      return getAbsoluteImageUrl(
        firstImage.image || firstImage.url || firstImage.src
      );
    }
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productData = await getProduct(slug);

  const productName = productData?.name || "Discover Our Fragrances";

  const title = `${productName} | ORENTEMIST`;

  const description = (
    productData?.description ||
    `Discover ${productName} at ORENTEMIST. Explore our fragrances and find your next signature scent.`
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const productImage = getProductImage(productData);

  const productUrl =
    `${SITE_URL}/products/${encodeURIComponent(slug)}`;

  return {
    title,
    description,

    alternates: {
      canonical: productUrl,
    },

    robots: {
      index: Boolean(productData),
      follow: true,
      googleBot: {
        index: Boolean(productData),
        follow: true,
        "max-image-preview": "large",
      },
    },

    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "ORENTEMIST",
      locale: "en_NG",
      type: "website",

      ...(productImage
        ? {
            images: [
              {
                url: productImage,
                alt: `${productName} - ORENTEMIST`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: productImage ? "summary_large_image" : "summary",
      title,
      description,

      ...(productImage ? { images: [productImage] } : {}),
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}