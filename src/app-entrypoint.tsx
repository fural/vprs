import "./core/i18n/i18n-config";
import ReactDOM from "react-dom/client";
import { AppProviders } from "./app-providers";
import { AppRouter } from "./app-router";
import "./index.css";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AppProviders>
      <AppRouter />
    </AppProviders>,
  );
}
