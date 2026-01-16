import styles from "./page.module.css";
import GoogleLoginButton from "./GoogleLoginButton";

// Local brand icon from public/icons
const BRAND_IMAGE = "/icons/chickckeckicon.svg";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>
          שלום:)
          <br />
          ברוכים
          <br />
          הבאים!
        </h1>
      </header>

      <main className={styles.main}>
        <p className={styles.subtitle}>התחברות באמצעות:</p>
        <div className={styles.loginForm}>
          {params?.message && (
            <p className={styles.errorMessage}>{params.message}</p>
          )}
          <GoogleLoginButton className={styles.googleButton} />
        </div>
      </main>

      <footer className={styles.brand} aria-hidden>
        <img
          src={BRAND_IMAGE}
          alt="ChickCheck brand"
          className={styles.brandImage}
        />
      </footer>
    </div>
  );
}