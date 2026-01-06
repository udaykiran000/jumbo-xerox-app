const fs = require("fs");
const path = require("path");
const { Worker } = require("worker_threads");
const checkDiskSpace = require("check-disk-space").default;

const UPLOADS_BASE = path.resolve(process.cwd(), "uploads");
const TEMP_BASE = path.join(UPLOADS_BASE, "temp");
const FILES_BASE = path.join(UPLOADS_BASE, "files");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// --- MERGE QUEUE LOGIC ---
let activeMerges = 0;
const mergeQueue = [];

const processMergeQueue = () => {
  if (activeMerges >= 3 || mergeQueue.length === 0) return;

  const { res, tempDir, finalPath, totalChunks, finalFileName, fileName } =
    mergeQueue.shift();
  activeMerges++;

  const worker = new Worker(path.join(__dirname, "../workers/mergeWorker.js"), {
    workerData: { tempDir, finalPath, totalChunks },
  });

  worker.on("message", (msg) => {
    activeMerges--;
    if (msg.success) {
      if (fs.existsSync(tempDir))
        fs.rmSync(tempDir, { recursive: true, force: true });
      res.json({
        success: true,
        url: `/uploads/files/${finalFileName}`,
        fileName,
        hash: msg.hash, // SHA-256 integrity hash
      });
    } else {
      res.status(500).json({ success: false, message: msg.error });
    }
    processMergeQueue(); // Next file in queue
  });

  worker.on("error", (e) => {
    activeMerges--;
    res.status(500).json({ success: false, message: e.message });
    processMergeQueue();
  });
};

// 1. Admin System Stats
exports.getSystemStats = async (req, res) => {
  try {
    const space = await checkDiskSpace(process.cwd());
    res.json({
      success: true,
      free: (space.free / 1e9).toFixed(2) + " GB",
      percentFree: ((space.free / space.size) * 100).toFixed(0) + "%",
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// 2. Get Upload Status (Resumable)
exports.getUploadStatus = async (req, res) => {
  try {
    const { uploadId } = req.query;
    const tempDir = path.join(TEMP_BASE, uploadId);
    ensureDir(TEMP_BASE);
    if (fs.existsSync(tempDir)) {
      const chunks = fs
        .readdirSync(tempDir)
        .filter((f) => f.includes("part_")).length;
      return res.json({ success: true, uploadedChunks: chunks });
    }
    res.json({ success: true, uploadedChunks: 0 });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// 3. Upload Chunk
exports.uploadChunk = async (req, res) => {
  try {
    const { chunkIndex, uploadId } = req.body;
    const chunkFile = req.file;
    if (!chunkFile) throw new Error("No chunk received.");

    const tempDir = path.join(TEMP_BASE, uploadId);
    ensureDir(tempDir);

    const chunkPath = path.join(tempDir, `part_${chunkIndex}`);
    fs.copyFileSync(chunkFile.path, chunkPath);
    fs.unlinkSync(chunkFile.path);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// 4. Merge Chunks (With Queue)
exports.mergeChunks = async (req, res) => {
  const { uploadId, fileName, totalChunks } = req.body;
  try {
    const tempDir = path.join(TEMP_BASE, uploadId);
    const finalFileName = `${Date.now()}_${fileName.replace(/\s+/g, "_")}`;
    const finalPath = path.join(FILES_BASE, finalFileName);
    ensureDir(FILES_BASE);

    // Add to queue
    mergeQueue.push({
      res,
      tempDir,
      finalPath,
      totalChunks,
      finalFileName,
      fileName,
    });
    processMergeQueue();
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getSystemStats = async (req, res) => {
  try {
    const space = await d(process.cwd());
    const used = space.size - space.free; // Used calculation
    res.json({
      success: 1,
      total: (x.size / 1e9).toFixed(2) + " GB",
      free: (x.free / 1e9).toFixed(2) + " GB",
      used: (used / 1e9).toFixed(2) + " GB", // <---
      percentFree: ((x.free / x.size) * 100).toFixed(0) + "%",
    });
  } catch (i) {
    res.status(500).json({ success: 0, message: i.message });
  }
};
