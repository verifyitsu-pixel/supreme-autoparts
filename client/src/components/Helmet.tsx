import { useEffect } from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

const Helmet: React.FC<HelmetProps> = ({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonicalUrl,
}) => {
  useEffect(() => {
    const defaultTitle = "Supreme Autoparts Kenya | Genuine & OEM Car Spare Parts Nairobi";
    const defaultDescription = "Supreme Autoparts Kenya is your premier destination for genuine and high-quality OEM spare parts for Toyota, BMW, Mercedes-Benz, and more. Fast delivery across Kenya. Quality parts you can trust.";
    const defaultOgImage = "https://supremeautoparts.co.ke/assets/images/og-image.jpg"; // Replace with actual default OG image
    const defaultOgUrl = "https://supremeautoparts.co.ke/";

    document.title = title ? `${title} | Supreme Autoparts` : defaultTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || defaultDescription);

    // Update Open Graph title
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', ogTitle || title || defaultTitle);

    // Update Open Graph description
    let ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescriptionTag) {
      ogDescriptionTag = document.createElement('meta');
      ogDescriptionTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescriptionTag);
    }
    ogDescriptionTag.setAttribute('content', ogDescription || description || defaultDescription);

    // Update Open Graph image
    let ogImageTag = document.querySelector('meta[property="og:image"]');
    if (!ogImageTag) {
      ogImageTag = document.createElement('meta');
      ogImageTag.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageTag);
    }
    ogImageTag.setAttribute('content', ogImage || defaultOgImage);

    // Update Open Graph URL
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
      ogUrlTag = document.createElement('meta');
      ogUrlTag.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute('content', ogUrl || canonicalUrl || defaultOgUrl);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl || window.location.href);

  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl]);

  return null;
};

export default Helmet;
