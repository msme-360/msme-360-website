/**
 * Navigation configuration for MSME 360
 */

export const EXCLUDED_NAV_PATHS = [
  "dashboard",
  "admin",
  "internal"
];

/**
 * Checks if a given pathname should have the global Navbar and Footer hidden.
 * @param pathname The current URL path
 * @returns boolean
 */
export function isExcludedPath(pathname: string): boolean {
  if (!pathname) return false;
  const segments = pathname.split('/');
  return EXCLUDED_NAV_PATHS.some(path => segments.includes(path));
}
