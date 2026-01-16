import React from "react";
import Image from "next/image";
import styles from "./HomeHelplineButton.module.css";

interface HomeHelplineButtonProps {
  onClick?: () => void;
}

export default function HomeHelplineButton({
  onClick,
}: HomeHelplineButtonProps) {
  return (
    <button
      className={styles.homeHelplineButton}
      onClick={onClick}
      aria-label="קו הסיוע"
    >
      <Image
        src="/icons/mail.svg"
        alt="Helpline"
        width={26}
        height={26}
        className={styles.phoneIcon}
      />
      <span className={styles.helplineButtonText}>פנייה לסיוע</span>
    </button>
  );
}

