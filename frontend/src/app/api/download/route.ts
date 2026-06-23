import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SCREENS = {
  workflow: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI1ZTRkYzVjOWUwYTQyYzI5OGZhOTUxNWU2ZWY4YjgwEgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086",
  logs: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzExMzVjNzc2MjQ0YjRjODViOGIyNDQ3MjNjZTIyOTM3EgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086",
  dashboard: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZhNzc0ZjZhMjhiYzRiNDY5MGFkMjQ2ZTVhZWQ0MWRhEgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086",
  agents: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FkMmRlNzQ5YzZkMzQ3MmZiOTUwNjNmZDNlOGFjNTlkEgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086",
  main: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzNiYWVhYTJkMDIwYjQyNTg4MDQ4NDQxMjdiMzJiMzFlEgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086"
};

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'src', 'data', 'stitch');
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const results = [];

    for (const [name, url] of Object.entries(SCREENS)) {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const filepath = path.join(dir, `${name}.html`);
        fs.writeFileSync(filepath, text, 'utf-8');
        results.push(`Saved ${name}.html`);
      } else {
        results.push(`Failed to fetch ${name}.html`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
