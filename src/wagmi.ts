import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient } from "wagmi";
import { canto } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const cantoTestnet = {
  id: 7701,
  name: "Canto Testnet",
  network: "Canto Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Canto",
    symbol: "CANTO",
  },
  rpcUrls: {
    default: {
      http: ["https://canto-testnet.plexnode.wtf"],
    },
    public: {
      http: ["https://canto-testnet.plexnode.wtf"],
    },
  },
  blockExplorers: {
    default: { name: "Canto Scan", url: "https://testnet.tuber.build/" },
  },
  iconUrls: [
    "https://s2.tokeninsight.com/static/coins/img/content/imgUrl/canto_logo.png",
  ],
  testnet: true,
  contracts: {
    multicall3: {
      address: "0xcE10fAAffdf51217Ed301210122F83E07FB23899" as `0x${string}`,
    },
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [cantoTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Canto Herald",
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { chains };
