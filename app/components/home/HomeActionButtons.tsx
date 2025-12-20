import React from "react";
import HomeUpdateButton from "./HomeUpdateButton";
import HomeHelplineButton from "./HomeHelplineButton";
import styles from "./HomeActionButtons.module.css";

interface HomeActionButtonsProps {
  updateNotificationsCount?: number;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
}

export default function HomeActionButtons({
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
}: HomeActionButtonsProps) {
  return (
    <div className={styles.homeActionButtons}>
      <HomeUpdateButton
        notificationsCount={updateNotificationsCount}
        onClick={onUpdatesClick}
      />
      <HomeHelplineButton onClick={onHelplineClick} />
    </div>
  );
}

