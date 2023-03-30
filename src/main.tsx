import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WagmiConfig } from "wagmi";
import routes from "~react-pages";

import { App } from "./App";
import { chains, client } from "./wagmi";
import { ErrorPage } from "./error-page";

import "unfonts.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          ...midnightTheme({
            accentColor: "#09fc99",
            accentColorForeground: "black",
            borderRadius: "small",
          }),
          fonts: {
            ...midnightTheme().fonts,
            body: "Minecraft, Courier, monospace",
          },
        }}
      >
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
