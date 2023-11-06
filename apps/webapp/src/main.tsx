import React from "react";
import ReactDOM from "react-dom/client";
import invariant from "tiny-invariant";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

invariant(rootElement, "Root element not found");

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
