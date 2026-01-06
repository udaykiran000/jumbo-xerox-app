const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { tempDir, finalPath, totalChunks } = workerData;

async function mergeChunks() {
  const writeStream = fs.createWriteStream(finalPath);
  const hash = crypto.createHash("sha256");

  try {
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(tempDir, `part_${i}`);

      if (!fs.existsSync(chunkPath)) {
        throw new Error(`Chunk missing: part_${i}`);
      }

      const chunkBuffer = fs.readFileSync(chunkPath);

      // Hash update chestunnam (Integrity check)
      hash.update(chunkBuffer);

      // Stream dwara file loki rastunnam
      const readStream = fs.createReadStream(chunkPath);
      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream, { end: false });
        readStream.on("end", resolve);
        readStream.on("error", reject);
      });

      // Chunk use ayyaka ventane delete chestunnam
      fs.unlinkSync(chunkPath);
    }

    writeStream.end();

    // Final SHA-256 Hash digest
    const finalHash = hash.digest("hex");

    parentPort.postMessage({
      success: true,
      hash: finalHash,
    });
  } catch (error) {
    parentPort.postMessage({
      success: false,
      error: error.message,
    });
  }
}

mergeChunks();
