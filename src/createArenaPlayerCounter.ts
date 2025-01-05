import type { arena } from "../types";
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

      const currentDate = new Date();
      const threshhold = 30;

      const players = res.list.filter(({ update_date }) => {
        const currentYear = currentDate.getFullYear();
        const updateDate = new Date(update_date);

        // システム時刻が1月で、更新日が12月の場合、前年の日付として扱う
        if (
          currentDate.getMonth() + 1 === 1 &&
          updateDate.getMonth() + 1 === 12
        ) {
          updateDate.setFullYear(currentYear - 1);
        } else {
          updateDate.setFullYear(currentYear);
        }

        return (
          currentDate.getTime() - threshhold * 60 * 1000 <= updateDate.getTime()
        );
      });

      counterElement[playStyle === PlayStyle.SINGLE ? "single" : "double"] =
        players.length;
    },
  );
}
