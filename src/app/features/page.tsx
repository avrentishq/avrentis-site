import { redirect } from "next/navigation";

/**
 * /features redirects to /product — the real features overview lives
 * there. Keeping this route alive as a 308 avoids breaking any external
 * links or bookmarks that pointed at the historical placeholder.
 */
export default function FeaturesPage() {
  redirect("/product");
}
