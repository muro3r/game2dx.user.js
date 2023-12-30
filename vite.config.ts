import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      build: {
        fileName: "game2dx.user.js",
      },
      userscript: {
        name: "game2dx",
        namespace: "muro3r/game2dx",
        author: "muro3r",
        match: ["https://p.eagate.573.jp/game/2dx/*"],
        icon: "https://www.google.com/s2/favicons?sz=64&domain=573.jp",
      },
    }),
  ],
});
