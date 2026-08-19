// @ts-check
import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',  // ← 新增这一行
  site: "https://example.com",
  integrations: [preact()],
});
