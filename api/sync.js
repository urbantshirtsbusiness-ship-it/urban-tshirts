// Vercel Serverless Function to commit updated products.json directly to GitHub
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { password, products } = req.body || {};

  if (password !== "ADMIN123") {
    return res.status(401).json({ error: "Invalid admin password." });
  }

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Invalid products array." });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(400).json({
      error: "NO_TOKEN",
      message: "GITHUB_TOKEN is not set in Vercel Environment Variables."
    });
  }

  const owner = "urbantshirtsbusiness-ship-it";
  const repo = "urban-tshirts";
  const filePath = "products.json";

  try {
    // 1. Fetch current file SHA
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "UrbanTshirts-Sync"
      }
    });

    let sha = undefined;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // 2. Commit updated products.json
    const contentEncoded = Buffer.from(JSON.stringify(products, null, 2), "utf8").toString("base64");
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "UrbanTshirts-Sync"
      },
      body: JSON.stringify({
        message: `Update products catalog (${products.length} items) via Admin Panel`,
        content: contentEncoded,
        sha: sha
      })
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      return res.status(putRes.status).json({
        error: "GITHUB_ERROR",
        message: errData.message || "Failed to commit to GitHub"
      });
    }

    const putData = await putRes.json();
    return res.status(200).json({
      success: true,
      message: "Products committed to GitHub successfully. Vercel is redeploying your live site.",
      commit: putData.commit?.html_url
    });
  } catch (err) {
    return res.status(500).json({ error: "SERVER_ERROR", message: err.message });
  }
}
