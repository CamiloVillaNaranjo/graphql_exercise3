import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://192.168.99.100:4466",
  secret: "OfnsQy3xg0GN03t5I3A+PA==",
});

export { prisma as default };
