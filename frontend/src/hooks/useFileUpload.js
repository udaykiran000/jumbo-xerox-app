import { useState, useRef, useEffect } from "react";
import api from "../services/api";

export const useFileUpload = () => {
  const [progress, setProgress] = useState({});
  const [netHealth, setNetHealth] = useState({
    type: "Checking...",
    color: "text-gray-400",
  });
  const pauseRef = useRef(false);
  const wakeLock = useRef(null);

  useEffect(() => {
    const monitor = () => {
      const conn = navigator.connection || {};
      const type = (conn.effectiveType || "unknown").toUpperCase();
      const speed = conn.downlink || 0;
      let h = { type, color: "text-red-500" };
      if (speed > 5 || type === "WIFI") h.color = "text-green-500";
      else if (speed > 1.5) h.color = "text-yellow-500";
      setNetHealth(h);
    };
    monitor();
    if (navigator.connection) navigator.connection.onchange = monitor;
  }, []);

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator && !wakeLock.current) {
        wakeLock.current = await navigator.wakeLock.request("screen");
      }
    } catch (e) {
      console.warn("WakeLock failed");
    }
  };

  // 'stats' parameter added for Total ETA calculation
  const uploadFile = async (file, { onAlert, onProgress, onEta, stats }) => {
    await requestWakeLock();
    const startTime = Date.now();
    let uploadId = localStorage.getItem(`upId_${file.name}`);
    let chunkIndex = 0;
    let offset = 0;

    if (uploadId) {
      try {
        const { data } = await api.get(`/upload/status?uploadId=${uploadId}`);
        chunkIndex = data.uploadedChunks;
        offset = chunkIndex * (1024 * 1024); // Handshake logic
      } catch (e) {
        uploadId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      }
    } else {
      uploadId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      localStorage.setItem(`upId_${file.name}`, uploadId);
    }

    let currentChunkSize = 1024 * 1024; // 1MB Base

    while (offset < file.size) {
      if (pauseRef.current) return { paused: true };

      const chunk = file.slice(offset, offset + currentChunkSize);
      const fd = new FormData();
      fd.append("chunk", chunk);
      fd.append("chunkIndex", chunkIndex);
      fd.append("uploadId", uploadId);

      let success = false;
      let retries = 0;
      const retryGaps = [1000, 3000, 5000];

      while (!success && retries < 3) {
        try {
          const t0 = performance.now();
          await api.post("/upload/chunk", fd);
          const duration = (performance.now() - t0) / 1000;

          // 10MB MAX CHUNK - WIFI OPTIMIZATION
          if (duration < 0.8)
            currentChunkSize = Math.min(currentChunkSize * 2, 10 * 1024 * 1024);
          else if (duration > 3)
            currentChunkSize = Math.max(currentChunkSize / 2, 512 * 1024);

          const speed = chunk.size / duration;

          // TOTAL ETA LOGIC (Combined for all files)
          if (onEta && stats) {
            const currentTotalUploaded =
              stats.uploadedSoFar + offset + chunk.size;
            const remainingBytes = stats.totalSize - currentTotalUploaded;
            const totalEtaSecs = Math.round(remainingBytes / speed);
            if (totalEtaSecs >= 0) {
              onEta(new Date(totalEtaSecs * 1000).toISOString().substr(11, 8));
            }
          }

          success = true;
        } catch (err) {
          retries++;
          if (retries >= 3) {
            pauseRef.current = true;
            if (onAlert) onAlert("Network Error: 3 retries failed.");
            return { paused: true };
          }
          await new Promise((r) => setTimeout(r, retryGaps[retries - 1]));
        }
      }

      offset += chunk.size;
      chunkIndex++;
      const fileP = Math.round((offset / file.size) * 100);
      setProgress((v) => ({ ...v, [file.name]: fileP }));
      if (onProgress) onProgress(fileP, offset); // sends back bytes for overall calc
    }

    try {
      const res = await api.post("/upload/merge", {
        uploadId,
        fileName: file.name,
        totalChunks: chunkIndex,
      });
      localStorage.removeItem(`upId_${file.name}`);
      return { success: true, url: res.data.url, fileName: file.name };
    } catch (e) {
      return { success: false };
    }
  };

  return { uploadFile, progress, netHealth, pauseRef };
};
