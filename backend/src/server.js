require("./config/env");
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./socket/socket");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

initSocket(server);
connectDB();
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
