export const getDefaultImage = (category) => {
  if (!category) return '/default-service.jpg';
  const lowerCategory = category.toLowerCase();
  const validCategories = ['cleaning', 'plumbing', 'electrical', 'carpentry', 'painting'];
  if (validCategories.includes(lowerCategory)) {
    return `/default-${lowerCategory}.jpg`;
  }
  return '/default-service.jpg';
};

export const isValidImageUrl = (url) => {
  if (!url) return true; // Empty is handled by defaulting
  try {
    const parsed = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidExtension = validExtensions.some(ext => parsed.pathname.toLowerCase().endsWith(ext));
    const isValidDomain = parsed.hostname === 'images.unsplash.com';
    return hasValidExtension || isValidDomain;
  } catch (e) {
    return false;
  }
};
