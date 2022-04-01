import { JeRedis } from "@ltvengine/je-redis";
import { DecorateName, Server } from "@hapi/hapi";

async function register(server: Server, pluginOptions: any) {
  async function connect(connectionOptions: {
    settings: any;
    decorate: DecorateName;
  }) {
    const client =
      connectionOptions.settings === null
        ? new JeRedis()
        : new JeRedis(connectionOptions.settings);
    server.decorate("server", "redis", client as any);
    server.decorate("request", "redis", client as any);
    server.events.on("stop", () => {
      try {
        server.log(
          ["hapi-redis2", "info"],
          `closing redis connection for redis`
        );
        client.close();
      } catch (err) {
        server.log(["hapi-redis2", "error"], err);
      }
    });
  }
  await connect(pluginOptions);
  console.log("[hapi-jeredis]: connected");
}
export const plugin = {
  register: register,
  pkg: require("../package.json"),
};
