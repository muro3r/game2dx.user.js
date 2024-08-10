import { arenaModeUnlockStatus } from "./arenaModeUnlockStatus";
import { createArenaPlayerCounter } from "./createArenaPlayerCounter";
import playRecorderFilename from "./playRecorderFilename";
import rememberSelectOption from "./rememberSelectorOption";

// 師弟システム ビンゴカード
if (location.pathname.match(/rival\/bingo\/card_set_(music|cleartype).html$/)) {
  rememberSelectOption();
}

// プレー録画機能 ファイル名
if (location.pathname.match(/djdata\/play_recorder\/detail.html$/)) {
  playRecorderFilename();
}

// アリーナモード解禁状況
if (location.pathname.match(/djdata\/arena_mode\/index.html$/)) {
  arenaModeUnlockStatus();
}

// アリーナモード プレイヤー数カウンター
if (location.pathname.match(/ranking\/arena\/top_ranking.html$/)) {
  createArenaPlayerCounter();
}
