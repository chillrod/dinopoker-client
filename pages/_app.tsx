import { ChakraProvider, Container } from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { MessageBox } from "../components/molecules/message-box/message-box";
import { Nav } from "../components/molecules/nav/nav";
import theme from "../config/theme/theme";
import { ToastProvider } from "../services/toast-provider";

import ScreenLoading from "../components/templates/_screen-loading";
import { emitter } from "../services/emitter/emitter";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { AuthService } from "../services/auth/auth.service";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState<{ show: boolean; message?: string }>({
    show: false,
  });

  useEffect(() => {
    AuthService.ensureSignedIn();
  }, []);

  useEffect(() => {
    emitter.on("EMIT_SCREENLOADING", (data) => {
      setLoading(data);
    });

    return () => {
      emitter.off("EMIT_SCREENLOADING");
    };
  }, []);

  const screenLoadingTransition = {
    initial: {
      opacity: 0.8,
      transition: {
        duration: 0.1,
      },
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>dinoplanningpoker - Online sprint estimation for agile teams</title>
        <link rel="canonical" href="/" />
        <meta
          name="description"
          content="Create a room and invite your team to join. Start planning your sprints and get feedback from your team."
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <ToastProvider />

      <AnimatePresence>
        {loading.show && (
          <>
            <motion.div
              variants={screenLoadingTransition}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ScreenLoading action={loading.message} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!loading.show && (
        <>
          <MessageBox />
          <Component {...pageProps} />
        </>
      )}
    </ChakraProvider>
  );
}

export default MyApp;
