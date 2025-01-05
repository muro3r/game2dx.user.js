import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  type ArenaPeriod,
  type ArenaUnlockStauts,
  checkArenaUnlockStatus,
  parseTable,
} from "../../src/arenaModeUnlockStatus";

describe("arenaCube", () => {
  let arenaCubeHtml: string;
  let arenaCubeElement: HTMLElement;

  beforeAll(async () => {
    arenaCubeHtml = await readFile(
      resolve(__dirname, "./fixtures/arenaCube.html"),
      "utf8",
    );
  });

  beforeEach(() => {
    arenaCubeElement = document.createElement("div");
    arenaCubeElement.innerHTML = arenaCubeHtml;
  });

  it("テーブルの内容をパースする", () => {
    const expected: ArenaPeriod[] = [
      {
        eventCount: 1,
        begin: new Date("2024-12-19:00:00.000+09:00"),
        end: new Date("2025-01-05T00:00:00.000+09:00"),
        cubeCount: 58,
      },
    ];

    expect(parseTable(arenaCubeElement)).toEqual(expected);
  });

  it("アリーナの解禁状況を取得する", () => {
    const arenaPeriodFactory = (
      eventCount: number,
      cubeCount: number,
    ): ArenaPeriod => ({
      begin: new Date(),
      end: new Date(),
      eventCount,
      cubeCount,
    });

    const arenaPeriod: ArenaPeriod[] = [
      arenaPeriodFactory(1, 60 * 2),
      arenaPeriodFactory(2, 61),
      arenaPeriodFactory(3, 59),
      arenaPeriodFactory(5, 60 * 3),
    ];

    const expected: ArenaUnlockStauts[] = [
      { id: 1, data: [true, true] },
      { id: 2, data: [true, true] },
      { id: 3, data: [false, false] },
      { id: 4, data: [false, false] },
      { id: 5, data: [true, true] },
    ];

    expect(checkArenaUnlockStatus(arenaPeriod, 5)).toEqual(expected);
  });
});
