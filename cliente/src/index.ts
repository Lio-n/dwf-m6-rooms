import "./pages/index.ts";
import "./pages/chat.ts";
import "./router.ts";
import { state } from "./state";

(() => {
  state.init();
})();
