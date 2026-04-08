const fs = require('fs');

async function download() {
  const url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI1ZTRkYzVjOWUwYTQyYzI5OGZhOTUxNWU2ZWY4YjgwEgsSBxCSu87AwBgYAZIBIwoKcHJvamVjdF9pZBIVQhMzNDg1NTAxMjM5NTI4OTU3NzMy&filename=&opi=89354086";
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('workflow.html', text);
  console.log("Downloaded HTML");
}

download().catch(console.error);
