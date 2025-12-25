"use client";
import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(fallbackHref);
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
