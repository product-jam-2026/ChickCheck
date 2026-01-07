import styles from "./page.module.css";
import GoogleLoginButton from "./GoogleLoginButton";

const ADMIN_EMAIL = "galeliahu30@gmail.com";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  // Middleware handles redirecting logged-in users away from login page
  // No need to duplicate the check here
  
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
