"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./HomeGreeting.module.css";

interface HomeGreetingProps {
  userName: string;
}

export default function HomeGreeting({ userName }: HomeGreetingProps) {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "בוקר טוב";
    } else if (hour >= 12 && hour < 18) {
      return "צהריים טובים";
    } else if (hour >= 18 && hour < 22) {
      return "ערב טוב";
    } else {
      return "לילה טוב";
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const firstName = userName.split(' ')[0];

  return (
    <div className={styles.homeGreeting}>
      <button
        className={styles.profileIconButton}
        onClick={handleProfileClick}
        aria-label="פרופיל"
      >
        <Image
          src="/icons/profile_icon.svg"
          alt="Profile"
          width={46}
          height={46}
          className={styles.profileIcon}
        />
      </button>
      <span className={styles.greetingText}>
        {getGreeting()}, {firstName} !
      </span>
    </div>
  );
}

