import { SUPABASE_ENABLED } from "@/lib/config";
import HomeClient from "./components/home/HomeClient";

export default async function Home() {
  // Middleware handles all authentication checks and redirects
  // No need to duplicate the check here - if we reach this point,
  // the middleware has already verified the user is authenticated
  return <HomeClient />;
}
