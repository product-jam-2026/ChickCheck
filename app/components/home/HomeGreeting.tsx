import React from "react";
import Image from "next/image";
import styles from "./HomeGreeting.module.css";

interface HomeGreetingProps {
  userName: string;
}

export default function HomeGreeting({ userName }: HomeGreetingProps) {
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

  return (
    <div className={styles.homeGreeting}>
      <Image
        src="/icons/bluma_face.svg"
        alt="Profile"
        width={46}
        height={46}
        className={styles.profileIcon}
      />
      <span className={styles.greetingText}>
        {getGreeting()}, {userName} !
      </span>
    </div>
  );
}

