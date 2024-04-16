import { Container } from "@mui/material"
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import { Header } from "../Header/Header";
import { Outlet } from "react-router-dom";

export const Layout = () => {
    return <TonConnectUIProvider
    manifestUrl="https://disintar.github.io/disintar-nft-withdraw/tonconnect-manifest.json"
    uiPreferences={{ theme: THEME.DARK }}
    walletsListConfiguration={{
      includeWallets: [
        {
          appName: "tonwallet",
          name: "TON Wallet",
          imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
          aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
          universalLink: "https://wallet.ton.org/ton-connect",
          jsBridgeKey: "tonwallet",
          bridgeUrl: "https://bridge.tonapi.io/bridge",
          platforms: ["chrome", "android"]
        }
      ]
    }}
>
        <Header />
        <Outlet />
    </TonConnectUIProvider>
}
