import express from "express";
import mongoose from "mongoose";
import SiteImage from "../models/SiteImage.js";
import SiteText from "../models/SiteText.js";
import Founder from "../models/Founder.js";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

function safeFilename(issue, title) {
  const base = `${issue || "newsletter"}-${title || "gysc"}`.replace(/[^\w\s.-]/g, "").trim().replace(/\s+/g, "-");
  return `${base || "gysc-newsletter"}.pdf`;
}

async function streamNewsletterPdf(item, res, disposition) {
  if (!item.pdfUrl?.startsWith("http")) {
    res.status(404).json({ message: "PDF file URL is missing or invalid" });
    return;
  }

  const response = await fetch(item.pdfUrl);
  if (!response.ok) {
    res.status(502).json({ message: "Could not retrieve PDF from storage" });
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = safeFilename(item.issue, item.title);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${disposition}; filename="${filename}"`);
  res.setHeader("Content-Length", buffer.length);
  res.setHeader("Cache-Control", "public, max-age=300");
  res.send(buffer);
}

router.get("/newsletters/:id/pdf", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid publication id" });
    }
    const item = await Newsletter.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Publication not found" });
    if (!item.pdfUrl?.trim()) {
      return res.status(404).json({ message: "No PDF uploaded for this publication yet. Upload one in Admin → Newsletters." });
    }
    await streamNewsletterPdf(item, res, "inline");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/newsletters/:id/download", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid publication id" });
    }
    const item = await Newsletter.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Publication not found" });
    if (!item.pdfUrl?.trim()) {
      return res.status(404).json({ message: "No PDF uploaded for this publication yet. Upload one in Admin → Newsletters." });
    }
    await streamNewsletterPdf(item, res, "attachment");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const [images, texts, founders, newsletters] = await Promise.all([
      SiteImage.find().sort({ section: 1, key: 1 }).lean(),
      SiteText.find().sort({ section: 1, key: 1 }).lean(),
      Founder.find().sort({ order: 1 }).lean(),
      Newsletter.find().sort({ createdAt: -1 }).lean(),
    ]);

    const textMap = Object.fromEntries(texts.map((t) => [t.key, t.value]));
    const imageMap = Object.fromEntries(images.map((i) => [i.key, i.url]));

    res.json({ images, texts, textMap, imageMap, founders, newsletters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
