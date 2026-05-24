import Listing from "../models/listing.js";
import { redis } from "../config/redis.js";

export async function getListing(id) {
  
  const cacheKey = `listing:${id}`;

  // 1️⃣ Try cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2️⃣ DB lookup
  const listing = await Listing.findById(id);

  // 3️⃣ Save to cache (5 min)
  await redis.set(cacheKey, JSON.stringify(listing), "EX", 300);

  return listing;
}
