import React from "react";

export interface ButtonVariants {
    variant?:  | 'primary' | 'outline';
    children: React.ReactNode;
  /** Icon-only buttonlar için erişilebilir ad */
    ariaLabel?: string
    }