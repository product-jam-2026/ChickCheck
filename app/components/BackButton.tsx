// components/BackButton.tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./home/profile/ProfilePage.module.css"; 

interface BackButtonProps {
  href: string;
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link 
      href={href} 
      className={styles.backButton} 
      aria-label="חזור לעמוד הקודם"
    >
      <Image
        src="/icons/back_white.svg"
        alt="Back"
        width={19.33}
        height={19.33}
        className={styles.backIcon}
      />
    </Link>
  );
}