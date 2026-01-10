import mongoose from "mongoose";

export async function clear(): Promise<Record<string, never>> {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  
  return {};
}