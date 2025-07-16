import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    // Revalidate the data page
    revalidatePath("/data");
    
    return NextResponse.json({ 
      success: true, 
      message: "Data page cache cleared successfully" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to clear cache" 
    }, { status: 500 });
  }
} 