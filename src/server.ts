import "dotenv/config";
import createApp from "./app";
// import prisma from "./prisma/prisma.service";

const PORT = process.env.PORT || 3001;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// process.on("SIGTERM", async () => {
//   console.log("SIGTERM received. Shutting down gracefully...");
//   await prisma.$disconnect();
//   server.close(() => {
//     console.log("Server closed.");
//   });
// });

// process.on("SIGINT", async () => {
//   console.log("SIGINT received. Shutting down gracefully...");
//   await prisma.$disconnect();
//   server.close(() => {
//     console.log("Server closed.");
//   });
// });
