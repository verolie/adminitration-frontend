import Head from "next/head";
import styles from "@/styles/Home.module.css";
import AppBar from "../component/appBar/appBar";
import { Container } from "@mui/material";
import TabPage from "@/component/tabPage/tabPage";
import { useAppContext } from "@/context/context";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export default function Home() {
  useSessionTimeout();

  const { tabs, removeTab } = useAppContext();

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <AppBar />
      <Container sx={{ minWidth: "unset" }} className={styles.containerBody}>
        <TabPage tabs={tabs} page="main" onRemoveTab={removeTab} />
      </Container>
    </>
  );
}

