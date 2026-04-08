import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI1ZTRkYzVjOWUwYTQyYzI5OGZhOTUxNWU2ZWY4YjgwEgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086";
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return new NextResponse('Error fetching Workflow Builder UI', { status: 500 });
    }
    const html = await res.text();
    
    // DEBUG: Write to file so we can inspect it bypassing shell
    const fs = await import('fs');
    fs.writeFileSync(process.cwd() + '/debug.html', html);
    
    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8' 
      }
    });
  } catch (error) {
    console.error("Error fetching Stitch HTML:", error);
    return new NextResponse('Internal Server Error while fetching Workflow Builder UI', { status: 500 });
  }
}
