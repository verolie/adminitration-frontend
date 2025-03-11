"use client";
import React, { useState } from "react";
import styles from "./style.module.css";
import Image from "next/image";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import { menuList } from "@/utils/constant/menuList";
// import LogoImage from "@/../public/logo-circular.png";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "white" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row",
  justifyContent: "space-between",
  margin: 0,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
    flexGrow: 1,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const SideBar = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Container className={styles.sidenav}>
      {menuList.map((item) =>
        item.submenu && item.submenu.length > 0 ? (
          <Accordion
            key={item.label}
            expanded={expanded === item.label}
            onChange={handleChange(item.label)}
            className={styles.accordion}
            style={{ width: "100%" }}
          >
            <AccordionSummary
              aria-controls={`${item.label}-content`}
              id={`${item.label}-header`}
              className={styles.accordionSummary}
            >
              <Grid container className={styles.gridContainerSummary}>
                <Grid item xs={2}>
                  {item.icon}
                </Grid>
                <Grid item xs={8} className={styles.titleSubUnit}>
                  <Typography>{item.label}</Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            {item.submenu.map((subItem) => (
              <Link
                key={subItem.path}
                href={subItem.path}
                passHref
                style={{ padding: 0 }}
              >
                <AccordionDetails className={styles.accordionDetails}>
                  <Typography className={styles.subTab}>
                    {subItem.label}
                  </Typography>
                </AccordionDetails>
              </Link>
            ))}
          </Accordion>
        ) : (
          <Link
            key={item.path}
            href={item.path}
            passHref
            style={{ padding: 0 }}
          >
            <Grid container className={styles.gridContainer}>
              <Grid item xs={2} className={styles.logoPosition}>
                {item.icon}
              </Grid>
              <Grid item xs={9} sx={{ padding: 0 }}>
                <Typography>{item.label}</Typography>
              </Grid>
            </Grid>
          </Link>
        )
      )}
    </Container>
  );
};

export default SideBar;
