"use client";
import * as React from "react";
import styles from "./style.module.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BusinessIcon from '@mui/icons-material/Business';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logoutProcess } from "@/utils/logoutProcess";

interface ResponsiveNavBarProps {
  onClickChangePass: () => void;
  username?: string | null;
}

const NavBar: React.FC<ResponsiveNavBarProps> = ({
  onClickChangePass,
  username,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClickUser = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logoutProcess(); // Jalankan proses logout
    handleClose(); // Tutup menu
  };

  const handleChangeCompany = () => {
    router.push("/choose-company");
  };

  return (
    <Container className={styles.gridContainer} maxWidth={false} disableGutters>
      <div className={styles.appLogo}>
        <AccountCircleIcon className={styles.userIcon} />
        <Typography className={styles.appName}>MyApp</Typography>
      </div>

      <div className={styles.gridUser} onClick={handleClickUser}>
        <AccountCircleIcon className={styles.userIcon} />
        <Typography className={styles.nameUser}>
          {username || "Username"}
        </Typography>
      </div>

      {/* Menu Dropdown */}
      <Menu
        className={styles.menuLogout}
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        disableScrollLock={true}
      >
        <MenuItem onClick={handleChangeCompany} className={styles.customMenuItem}>
          <p>Change Company</p>
          <BusinessIcon className={styles.logoutIcon} />
        </MenuItem>
        <MenuItem onClick={handleLogout} className={styles.customMenuItem}>
          <p>Log Out</p>
          <ExitToAppIcon className={styles.logoutIcon} />
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default NavBar;
