"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveTransformer(formData: FormData) {
  const transformer = formData.get("transformer") as string;
  db.pipeline.update("1", transformer);
  revalidatePath("/pipelines/1");
}
