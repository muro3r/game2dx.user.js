import { createArenaPlayerCounter } from "./features/arena";
import { arenaModeUnlockStatus, playRecorderFilename } from "./features/djdata";
import { rememberSelectOption } from "./riva/bingo/rememberSelectorOption";

type RouteHandler = {
  pattern: RegExp;
  handlers: Array<() => void>;
};

const routes: RouteHandler[] = [
  {
    pattern: /rival\/bingo\/card_set_(music|cleartype)\.html$/,
    handlers: [rememberSelectOption],
  },
  {
    pattern: /djdata\/play_recorder\/detail\.html$/,
    handlers: [playRecorderFilename],
  },
  {
    pattern: /djdata\/arena_mode\/index\.html$/,
    handlers: [arenaModeUnlockStatus],
  },
  {
    pattern: /ranking\/arena\/top_ranking\.html$/,
    handlers: [createArenaPlayerCounter],
  },
];

routes.forEach(({ pattern, handlers }) => {
  if (location.pathname.match(pattern)) {
    handlers.forEach((fn) => fn());
  }
});
