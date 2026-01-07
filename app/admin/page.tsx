import AdminPage from "@/app/components/admin/AdminPage";

export default async function Admin() {
  // Middleware handles admin authentication and redirects
  // No need to check here to avoid redirect loops
  return (
    <main>
      <AdminPage />
    </main>
  );
}

