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

/**
 * Method to get the color classes based on the URL.
 */
export function getColorClasses(url: string): { border: string; bg: string; text: string; glow: string } {
    const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      violet: {
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        glow: "after:bg-gradient-to-r after:from-violet-500 after:to-violet-300",
      },
      sky: {
        border: "border-sky-500/30",
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        glow: "after:bg-gradient-to-r after:from-sky-500 after:to-sky-300",
      },
      emerald: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "after:bg-gradient-to-r after:from-emerald-500 after:to-emerald-300",
      },
      amber: {
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        glow: "after:bg-gradient-to-r after:from-amber-500 after:to-amber-300",
      },
      rose: {
        border: "border-rose-500/30",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        glow: "after:bg-gradient-to-r after:from-rose-500 after:to-rose-300",
      },
      indigo: {
        border: "border-indigo-500/30",
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        glow: "after:bg-gradient-to-r after:from-indigo-500 after:to-indigo-300",
      },
    }

    // Simple hash function to assign colors based on domain
    const colors = Object.keys(colorMap)
    const hash = url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colorKey = colors[hash % colors.length]
    
    return colorMap[colorKey]
  }

// Get color class based on group color
export function getColorClassesBasedOnName(name: string): { border: string; bg: string; text: string; glow: string } {
    const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      violet: {
        border: "border-violet-500/30",
        bg: "bg-violet-500/10",
        text: "text-violet-400",
        glow: "after:bg-gradient-to-r after:from-violet-500 after:to-violet-300",
      },
      sky: {
        border: "border-sky-500/30",
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        glow: "after:bg-gradient-to-r after:from-sky-500 after:to-sky-300",
      },
      emerald: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        glow: "after:bg-gradient-to-r after:from-emerald-500 after:to-emerald-300",
      },
      amber: {
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        glow: "after:bg-gradient-to-r after:from-amber-500 after:to-amber-300",
      },
    }

    const colors = Object.keys(colorMap)
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const color = colors[hash % colors.length]
    return colorMap[color] || colorMap.violet
  }
