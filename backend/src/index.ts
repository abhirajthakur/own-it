import app from "./app.js";
import { server } from "./config/index.js";
import { logger } from "./utils/logger.js";

app.listen(server.port, () => {
  logger.info(
    { env: server.env, port: server.port },
    `Server running on port ${server.port}`,
  );
});
