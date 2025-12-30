import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import styles from "./page.module.css";
import GoogleLoginButton from "./GoogleLoginButton";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return <div className={styles.loginForm}>hello {user.email}</div>;
  
  const params = await searchParams;

  return (
    <div className="content">
      <div className={styles.loginForm}>
        {params?.message && (
          <p className={styles.errorMessage}>{params.message}</p>
        )}
        <GoogleLoginButton />
      </div>
    </div>
  );
}
