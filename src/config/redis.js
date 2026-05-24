import Redis from "ioredis";

export const pub = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
export const sub = pub.duplicate();

pub.on("connect", () => console.log("🔌 Redis Pub Connected"));
sub.on("connect", () => console.log("🔌 Redis Sub Connected"));

pub.on("error", (err) => console.log("❌ Redis Pub Error:", err));
sub.on("error", (err) => console.log("❌ Redis Sub Error:", err));
