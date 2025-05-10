"use client";
import React, { useState } from "react";
import styles from "./style.module.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { menuList } from "@/utils/constant/menuList";
import { useAppContext } from "@/context/context";

const SideBar = () => {
  const { addTab } = useAppContext();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <Container className={styles.sidenav}>
      {menuList.map((item) => {
        if (item.submenu && item.submenu.length > 0) {
          return (
            <div
              key={item.label}
              className={`${styles.labelContainer} ${
                hoveredItem === item.label ? styles.hovered : ""
              }`}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={styles.iconLabel}>{item.icon}</div>
              <div className={styles.titleSubUnit}>
                <Typography className={styles.textLabel}>
                  {item.label}
                </Typography>
              </div>

              {hoveredItem === item.label && (
                <div
                  className={styles.popup}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={styles.submenuList}>
                    {item.submenu.map((sub) => (
                      <Typography
                        key={sub.label}
                        className={styles.submenuItem}
                        onClick={(e) => {
                          e.stopPropagation();
                          addTab(sub.label);
                        }}
                      >
                        {sub.label}
                      </Typography>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Jika tidak ada submenu, buat elemen biasa
        return (
          <div
            key={item.label}
            className={`${styles.labelContainer} ${
              hoveredItem === item.label ? styles.hovered : ""
            }`}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => addTab(item.label)} // Klik langsung tambahkan tab
          >
            <div className={styles.iconLabel}>{item.icon}</div>
            <div className={styles.titleSubUnit}>
              <Typography className={styles.textLabel}>{item.label}</Typography>
            </div>
          </div>
        );
      })}
    </Container>
  );
};

export default SideBar;
