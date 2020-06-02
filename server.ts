import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import router from "./routes.ts";

const port = 5000;

const app = new Application();

app.use(oakCors()); // Enable CORS for All Routes

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server running on port ${port}...`);

await app.listen({ port });
