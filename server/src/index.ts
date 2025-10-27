import { buildApp } from "@/app.js"

async function start() {
  try {
    const app = await buildApp();

    const port = Number(process.env.PORT) || 3000;

    await app.listen({ port, host: '0.0.0.0' });

    console.log(`🚀 Server listening on http://localhost:${port}`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();

