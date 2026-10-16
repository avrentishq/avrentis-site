import { permanentRedirect } from "next/navigation";
import { SITE_ROUTES } from "@/lib/routes";

/**
 * /features redirects to /product — the real features overview lives
 * there. Keeping this route alive as a 308 avoids breaking any external
 * links or bookmarks that pointed at the historical placeholder.
 */
export default function FeaturesPage() {
  permanentRedirect(SITE_ROUTES.product);
}
