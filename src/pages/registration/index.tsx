import styles from "./styles.module.css";
import { useAppContext } from "@/context/context";
import { TextField, Button, Box, Typography, Container } from "@mui/material";

export default function Registration() {
  return (
    <Container maxWidth="sm" className={styles.container}>
      <Box className={styles.box}>
        <Typography variant="h4" align="left" gutterBottom>
          Register
        </Typography>
        <form>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={styles.button}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}
