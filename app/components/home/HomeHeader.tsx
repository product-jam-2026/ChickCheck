import React from "react";
import HomeGreeting from "./HomeGreeting";
import HomeActionButtons from "./HomeActionButtons";
import styles from "./HomeHeader.module.css";

interface HomeHeaderProps {
  userName?: string;
  updateNotificationsCount?: number;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
}

export default function HomeHeader({
  userName = "בלומה",
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
}: HomeHeaderProps) {
  return (
    <header className={styles.homeHeader}>
      <HomeGreeting userName={userName} />
      <HomeActionButtons
        updateNotificationsCount={updateNotificationsCount}
        onUpdatesClick={onUpdatesClick}
        onHelplineClick={onHelplineClick}
      />
    </header>
  );
}

