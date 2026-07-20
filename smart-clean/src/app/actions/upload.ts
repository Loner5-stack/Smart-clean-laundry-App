"use server";

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are set in your .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const file = formData.get("image") as File;

    if (!file || !(file instanceof Blob) || file.size === 0) {
      return { success: false, error: "No file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: "Supabase credentials are not configured in .env" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate a unique filename while preserving the extension
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${crypto.randomUUID()}.${extension}`;
    
    // Upload the file to the "services" bucket in Supabase Storage
    const { data, error } = await supabase
      .storage
      .from("services")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from("services")
      .getPublicUrl(filename);

    return { 
      success: true, 
      filePath: publicUrl 
    };

  } catch (error: any) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
