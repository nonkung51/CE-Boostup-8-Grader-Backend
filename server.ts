import { Application, send, Context } from 'https://deno.land/x/oak/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';

import router from './routes.ts';

const port = 5000;

const app = new Application();

app.use(oakCors());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context: Context) => {
    try {
        await send(context, context.request.url.pathname, {
            root: `${Deno.cwd()}/dist`,
            index: 'index.html',
        });
    } catch (error) {
        await send(context, '/', {
            root: `${Deno.cwd()}/dist`,
            index: 'index.html',
        });
    }
	
});

console.log(`Server running on port ${port}...`);

await app.listen({ port });
