import express from "express";
import multer from "multer";
import SiteImage from "../models/SiteImage.js";
import SiteText from "../models/SiteText.js";
import Founder from "../models/Founder.js";
import Newsletter from "../models/Newsletter.js";
import { uploadImage, uploadFile, deleteAsset } from "../config/cloudinary.js";
import { authRequired, adminRequired } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authRequired, adminRequired);

/* ── Site Images ── */
router.put("/images/:key", upload.single("image"), async (req, res) => {
  try {
    const { key } = req.params;
    const doc = await SiteImage.findOne({ key });
    if (!doc) return res.status(404).json({ message: "Image slot not found" });
    if (!req.file) return res.status(400).json({ message: "Image file is required" });

    if (doc.cloudinaryPublicId) {
      await deleteAsset(doc.cloudinaryPublicId);
    }

    const result = await uploadImage(req.file.buffer, "site-images", key);
    doc.url = result.secure_url;
    doc.cloudinaryPublicId = result.public_id;
    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/images/:key", async (req, res) => {
  try {
    const doc = await SiteImage.findOne({ key: req.params.key });
    if (!doc) return res.status(404).json({ message: "Image slot not found" });

    if (doc.cloudinaryPublicId) {
      await deleteAsset(doc.cloudinaryPublicId);
    }
    doc.url = "";
    doc.cloudinaryPublicId = "";
    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Site Text ── */
router.put("/texts/:key", async (req, res) => {
  try {
    const { value } = req.body;
    const doc = await SiteText.findOneAndUpdate({ key: req.params.key }, { value: value ?? "" }, { new: true });
    if (!doc) return res.status(404).json({ message: "Text field not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Founders ── */
router.put("/founders/:id", upload.single("image"), async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);
    if (!founder) return res.status(404).json({ message: "Founder not found" });

    const { name, role, country, message } = req.body;
    if (name !== undefined) founder.name = name;
    if (role !== undefined) founder.role = role;
    if (country !== undefined) founder.country = country;
    if (message !== undefined) founder.message = message;

    if (req.file) {
      if (founder.cloudinaryPublicId) await deleteAsset(founder.cloudinaryPublicId);
      const result = await uploadImage(req.file.buffer, "founders", `founder-${founder._id}`);
      founder.imageUrl = result.secure_url;
      founder.cloudinaryPublicId = result.public_id;
    }

    await founder.save();
    res.json(founder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/founders/:id/image", async (req, res) => {
  try {
    const founder = await Founder.findById(req.params.id);
    if (!founder) return res.status(404).json({ message: "Founder not found" });
    if (founder.cloudinaryPublicId) await deleteAsset(founder.cloudinaryPublicId);
    founder.imageUrl = "";
    founder.cloudinaryPublicId = "";
    await founder.save();
    res.json(founder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Newsletters ── */
router.get("/newsletters", async (_req, res) => {
  const items = await Newsletter.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/newsletters", upload.fields([{ name: "cover", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), async (req, res) => {
  try {
    const { issue, date, title, excerpt, color } = req.body;
    if (!issue || !date || !title || !excerpt) {
      return res.status(400).json({ message: "Issue, date, title, and excerpt are required" });
    }
    if (!req.files?.pdf?.[0]) {
      return res.status(400).json({ message: "PDF file is required when publishing a newsletter" });
    }

    const item = new Newsletter({ issue, date, title, excerpt, color: color || "#0f9f6f" });

    if (req.files?.cover?.[0]) {
      const result = await uploadImage(req.files.cover[0].buffer, "newsletters", `cover-${Date.now()}`);
      item.coverImageUrl = result.secure_url;
      item.coverCloudinaryPublicId = result.public_id;
    }
    if (req.files?.pdf?.[0]) {
      const result = await uploadFile(req.files.pdf[0].buffer, "newsletters", `pdf-${Date.now()}`, "raw");
      item.pdfUrl = result.secure_url;
      item.pdfCloudinaryPublicId = result.public_id;
    }

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/newsletters/:id", upload.fields([{ name: "cover", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), async (req, res) => {
  try {
    const item = await Newsletter.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Newsletter not found" });

    const { issue, date, title, excerpt, color } = req.body;
    if (issue !== undefined) item.issue = issue;
    if (date !== undefined) item.date = date;
    if (title !== undefined) item.title = title;
    if (excerpt !== undefined) item.excerpt = excerpt;
    if (color !== undefined) item.color = color;

    if (req.files?.cover?.[0]) {
      if (item.coverCloudinaryPublicId) await deleteAsset(item.coverCloudinaryPublicId);
      const result = await uploadImage(req.files.cover[0].buffer, "newsletters", `cover-${item._id}`);
      item.coverImageUrl = result.secure_url;
      item.coverCloudinaryPublicId = result.public_id;
    }
    if (req.files?.pdf?.[0]) {
      if (item.pdfCloudinaryPublicId) await deleteAsset(item.pdfCloudinaryPublicId, "raw");
      const result = await uploadFile(req.files.pdf[0].buffer, "newsletters", `pdf-${item._id}`, "raw");
      item.pdfUrl = result.secure_url;
      item.pdfCloudinaryPublicId = result.public_id;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/newsletters/:id", async (req, res) => {
  try {
    const item = await Newsletter.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Newsletter not found" });

    if (item.coverCloudinaryPublicId) await deleteAsset(item.coverCloudinaryPublicId);
    if (item.pdfCloudinaryPublicId) await deleteAsset(item.pdfCloudinaryPublicId, "raw");

    await item.deleteOne();
    res.json({ message: "Newsletter deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/newsletters/:id/pdf", async (req, res) => {
  try {
    const item = await Newsletter.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Newsletter not found" });
    if (item.pdfCloudinaryPublicId) await deleteAsset(item.pdfCloudinaryPublicId, "raw");
    item.pdfUrl = "";
    item.pdfCloudinaryPublicId = "";
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
