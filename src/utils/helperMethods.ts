/**
 * Extracts the main website (domain) from a given URL without the TLD (.com, .org, etc.)
 * and capitalizes the first letter of the main domain.
 * @param {string} url - The full URL to extract the main website from.
 * @returns {string} The main website with the first letter capitalized.
 */
export function extractMainWebsite(url: string): string {
  try {
    // Parse the URL
    const parsedUrl = new URL(url);

    // Extract the hostname (e.g., "newss.com")
    const hostname = parsedUrl.hostname;

    // Split the hostname by '.'
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      // Extract the main part before the TLD
      const mainDomain = parts[parts.length - 2];

      // Capitalize the first letter of the main domain
      return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
    }

    // If splitting fails, return the hostname as-is with capitalization
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch (error) {
    console.error(`Invalid URL: ${url}`, error);
    return "";
  }
}

