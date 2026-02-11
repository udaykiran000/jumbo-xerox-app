const Busboy = require("busboy");
const fsSync = require("fs");
const fs = require("fs").promises;
const path = require("path");
const { Worker } = require("worker_threads");
const archiver = require("archiver");
const Order = require("../models/Order");

const TEMP_BASE = path.join(process.cwd(), "uploads", "temp");
const FILES_BASE = path.join(process.cwd(), "uploads", "files");

// 1. Status Check
exports.getUploadStatus = async (req, res) => {
  try {
    const { uploadId } = req.query;
    const tempDir = path.join(TEMP_BASE, uploadId);
    if (fsSync.existsSync(tempDir)) {
      const files = await fs.readdir(tempDir);
      const valid = files.filter(
        (f) => f.startsWith("part_") && !f.endsWith(".tmp"),
      );
      let bytes = 0;
      valid.forEach(
        (f) => (bytes += fsSync.statSync(path.join(tempDir, f)).size),
      );
      return res.json({
        success: true,
        uploadedBytes: bytes,
        nextIndex: valid.length,
      });
    }
    res.json({ success: true, uploadedBytes: 0, nextIndex: 0 });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// 2. Upload Chunk (No-Deadlock Version)
exports.uploadChunk = async (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  let uploadId, chunkIndex;
  let savePromise = null;

  busboy.on("field", (name, val) => {
    if (name === "uploadId") uploadId = val;
    if (name === "chunkIndex") chunkIndex = val;
  });

  busboy.on("file", (name, file, info) => {
    // If fields haven't arrived yet, we must wait OR the order must be fixed on frontend.
    // Fixed order (metadata first) is much more reliable.
    if (!uploadId || chunkIndex === undefined) {
      console.error("[BUSBOY] Field order error. Meta must come before file.");
      file.resume();
      return;
    }

    const tempDir = path.join(TEMP_BASE, uploadId);
    if (!fsSync.existsSync(tempDir))
      fsSync.mkdirSync(tempDir, { recursive: true });

    const finalPath = path.join(tempDir, `part_${chunkIndex}`);
    const tmpPath = `${finalPath}.tmp`;
    const writeStream = fsSync.createWriteStream(tmpPath);

    savePromise = new Promise((resolve, reject) => {
      file.pipe(writeStream);
      writeStream.on("finish", () => {
        try {
          fsSync.renameSync(tmpPath, finalPath);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      writeStream.on("error", reject);
    });
  });

  busboy.on("finish", async () => {
    try {
      if (savePromise) await savePromise;
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  });

  req.pipe(busboy);
};

// 3. Merge Logic
exports.mergeChunks = async (req, res) => {
  const { uploadId, fileName, totalChunks } = req.body;
  const tempDir = path.join(TEMP_BASE, uploadId);
  const finalFileName = `${Date.now()}_${fileName.replace(/\s+/g, "_")}`;
  const finalPath = path.join(FILES_BASE, finalFileName);

  if (!fsSync.existsSync(FILES_BASE))
    await fs.mkdir(FILES_BASE, { recursive: true });

  const worker = new Worker(path.join(__dirname, "../workers/mergeWorker.js"), {
    workerData: { tempDir, finalPath, totalChunks },
  });

  worker.on("message", (msg) => {
    if (msg.success) {
      fsSync.rmSync(tempDir, { recursive: true, force: true });
      res.json({ success: true, url: `/uploads/files/${finalFileName}` });
    } else res.status(500).json({ success: false, message: msg.error });
  });
  worker.on("error", (e) =>
    res.status(500).json({ success: false, message: e.message }),
  );
};

// 4. Download Zip (Kept as original)
exports.downloadOrderZip = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("user", "name");
    const customerName = order.user?.name?.replace(/\s+/g, "_") || "Customer";
    const shortId = orderId.slice(-6).toUpperCase();
    res.attachment(`Order_${shortId}_${customerName}.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);
    for (const file of order.files) {
      const originalFileName = path.basename(file.url);
      const filePath = path.join(FILES_BASE, originalFileName);
      if (fsSync.existsSync(filePath))
        archive.file(filePath, { name: `${shortId}_${file.name}` });
    }
    await archive.finalize();
  } catch (error) {
    res.status(500).json({ message: "Zip failed" });
  }
};
