import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";

// For optimization purpose
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <main className={roboto.className}>
    <main>
      <Component {...pageProps} />
    </main>
  );
}
