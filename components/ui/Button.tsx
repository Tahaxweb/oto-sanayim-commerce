"use client"
import classNames from "classnames"
import { ButtonVariants } from "@/types/componentTypes"

type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonVariants {
  size?: ButtonSize
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  ariaLabel?: string
}

const OUTLINE_SHADOW_DEFAULT =
  "rgba(238, 242, 246, 0.5) 0px -3px 1px 0px inset, rgba(38, 69, 109, 0) 0px 4px 1px 0px, rgba(38, 69, 109, 0.01) 0px 2px 1px 0px, rgba(38, 69, 109, 0.02) 0px 1px 1px 0px, rgba(38, 69, 109, 0.03) 0px 1px 1px 0px"

const OUTLINE_SHADOW_HOVER =
  "rgba(221, 231, 242, 0.5) 0px -3px 1px 0px inset, rgba(81, 114, 148, 0) 0px 12px 3px 0px, rgba(81, 114, 148, 0.01) 0px 8px 3px 0px, rgba(81, 114, 148, 0.02) 0px 4px 3px 0px, rgba(81, 114, 148, 0.04) 0px 2px 2px 0px, rgba(81, 114, 148, 0.05) 0px 0px 1px 0px"

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  fullWidth = false,
  ariaLabel,
  onClick,
}: ButtonProps) {
  const isOutline = variant === 'outline'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={isOutline ? { boxShadow: OUTLINE_SHADOW_DEFAULT } : undefined}
      onMouseEnter={(e) => {
        if (!isOutline) return
        e.currentTarget.style.background =
          "linear-gradient(0deg, rgba(227,232,239,0.05) 0%, rgba(227,232,239,0.05) 100%), #f8fafc"
        e.currentTarget.style.boxShadow = OUTLINE_SHADOW_HOVER
      }}
      onMouseLeave={(e) => {
        if (!isOutline) return
        e.currentTarget.style.background = "#ffffff"
        e.currentTarget.style.boxShadow = OUTLINE_SHADOW_DEFAULT
      }}
      className={classNames(
        "font-medium text-center cursor-pointer select-none transition-all  duration-200",
        // WIDTH
        { "w-full": fullWidth },
        // SIZE
        {
          "px-3 py-1.5 text-sm rounded-lg": size === "sm",
          "px-4 py-2.5 text-sm rounded-xl": size === "md",
          "px-6 py-3 text-base rounded-2xl": size === "lg",
        },
        // VARIANT
        {
          "bg-[#FF3C00] text-white hover:bg-[#e63600]": variant === "primary",
          "bg-white border border-[#e3e8ef] text-gray-900": isOutline,
        },
        // DISABLED
        { "opacity-50 cursor-not-allowed pointer-events-none": disabled }
      )}
    >
      {children}
    </button>
  )
}

export default Button