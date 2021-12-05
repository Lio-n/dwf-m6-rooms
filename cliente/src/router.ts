import { Router } from "@vaadin/router";
import { state } from "./state";

(() => {
  const router = new Router(document.querySelector(".root"));
  router.setRoutes([
    { path: "/", component: "home-page" },
    { path: "/chat", component: "chat-page" },
  ]);

  const cs = state.getState();
  if (cs.userId && cs.rtdbRoomId) {
    state.listenRoom();
    Router.go("/chat");
  }
})();
