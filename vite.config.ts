import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

//altered due to cors errors
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/fpl": {
        target: "https://fantasy.premierleague.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/fpl/, ""),
      },
    },
  },
});
