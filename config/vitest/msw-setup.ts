import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vite-plus/test";

// Add request handlers here. These will be used in the tests.
const handlers: any[] = [];

export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
