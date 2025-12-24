"use client";
import React from "react";

type Props = {
  as?: "button" | "a";
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  fallbackHref?: string;
};

export default function BackControl({
  as = "button",
  className,
  ariaLabel,
  children,
  fallbackHref = "/",
}: Props) {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (window.history.length > 1) window.history.back();
      else window.location.assign(fallbackHref);
    }
  };

  if (as === "a") {
    return (
      <a href="#" className={className} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
}
