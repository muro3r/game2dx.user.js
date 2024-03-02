import { arena } from "../types";
import { ArenaActivePlayerCounter } from "./components/ArenaActivePlayerCounter";

export function createArenaPlayerCounter() {
  const playMenu = document.getElementById("play-menu");
  if (playMenu === null) {
    return;
  }

  enum PlayStyle {
    SINGLE = "0",
    DOUBLE = "1",
  }

  customElements.define(
    "arena-active-player-counter",
    ArenaActivePlayerCounter,
  );

  const counterElement = document.createElement(
    "arena-active-player-counter",
  ) as ArenaActivePlayerCounter;
  playMenu.append(counterElement);

  $(document).on(
    "ajaxComplete",
    (_event: Event, jqXHR: JQueryXHR, ajaxOptions: JQueryAjaxSettings) => {
      const params = new URLSearchParams(ajaxOptions.data);
      const playStyle = params.get("play_style") as PlayStyle | null;
      if (playStyle === null || jqXHR.status !== 200) {
        return;
      }

      const res: arena.ArenaTopRanking = jqXHR.responseJSON;

      const players = res.list.filter(({ update_date }) => {
        const updateDate = new Date(update_date);
        updateDate.setFullYear(updateDate.getMonth() + 1 === 12 ? 2023 : 2024);

        const currentDate = new Date();
        return (
          currentDate.getTime() - 1 * 60 * 60 * 1000 <= updateDate.getTime()
        );
      });

      counterElement[playStyle === PlayStyle.SINGLE ? "single" : "double"] =
        players.length;
    },
  );
}
