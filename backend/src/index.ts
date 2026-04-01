import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const port = env.PORT;

app.listen(port, () => {
  logger.info({ env: env.NODE_ENV, port }, `Server running on port ${port}`);
});
