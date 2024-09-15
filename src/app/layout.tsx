import { ReactNode } from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Section from "../lib/components/Section";
import Card from "../lib/components/Card";
import AnimatedBackground from "../lib/components/AnimatedBackground";
import dynamic from "next/dynamic";
import styles from "./styles/layout.module.scss";
import "./globals.css";

const RelayProvider = dynamic(() => import("../lib/RelayProvider"), {
  ssr: false,
});
const StoreProvider = dynamic(() => import("../lib/StoreProvider"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ben Caro - Cool Form",
};

const AppRoot = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="en">
      <body id="root" className={inter.className}>
        <RelayProvider>
          <StoreProvider>
            <div className={styles.appContainer}>
              <Section
                backgroundColor="primary-gradient-color"
                gradient="secondary-accent-color"
                style="flex grow place-content-center"
                showAnimatedBackground
                center
              >
                <Card
                  borderRadius={30}
                  borderColor="primary-bg-color"
                  backgroundColor="primary-bg-color"
                >
                  {children}
                </Card>
              </Section>
              <AnimatedBackground />
            </div>
          </StoreProvider>
        </RelayProvider>
      </body>
    </html>
  );
};

export default AppRoot;
