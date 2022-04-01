import { Server } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { plugin } from "../src";
const launchServer = async function () {
  const clientOpts = {
    settings: "redis://secret@127.0.0.1:6379/2",
    decorate: true,
  };

  const server = new Server({ port: 8080 });

  await server.register({
    plugin: plugin,
    options: {
      host: "0.0.0.0",
      decorate: true,
    },
  });

  server.route({
    method: "GET",
    path: "/redis/{val}",
    async handler(request: any) {
      const client = request.redis.client;

      try {
        await client.set("hello", request.params.val);
        return {
          result: "ok",
        };
      } catch (err) {
        throw Boom.internal("Internal Redis error");
      }
    },
  });

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
