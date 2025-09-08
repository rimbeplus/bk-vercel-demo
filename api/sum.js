export default function handler(req, res) {
    if (req.method === "POST") {
      const { a, b } = req.body;
      res.status(200).json({ result: a + b });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  