import React from "react";
import styles from "./styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  variant?: "confirm" | "alert" | "warning" | "info" | "disable";
  icon?: React.ReactNode;
  label?: string;
}

const Button: React.FC<ButtonProps> = ({
  size = "medium",
  variant = "confirm",
  icon,
  label,
  ...props
}) => (
  <button
    className={`${styles.button} ${styles[size]} ${styles[variant]}`}
    {...props}
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    {label && <span className={styles.label}>{label}</span>}
  </button>
);

export default Button;
