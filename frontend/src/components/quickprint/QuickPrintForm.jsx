import React, { useState, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload,
  FileText,
  Trash2,
  Plus,
  Settings2,
  BookOpen,
  Loader2,
  ChevronRight,
  Printer,
  Wifi,
  Signal,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useFileUpload } from "../../hooks/useFileUpload";
import { PRICING_DATA, calculateItemPrice } from "../../utils/pricingRules";
import toast from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const QuickPrintForm = () => {
  const navigate = useNavigate();
  const { uploadFile, progress, netHealth, pauseRef } = useFileUpload();

  // --- CORE STATES ---
  const [files, setFiles] = useState([]);
  const [totalNumPages, setTotalNumPages] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);
  const [eta, setEta] = useState("");
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentFileIdx, setCurrentFileIdx] = useState(0);

  const [settings, setSettings] = useState({
    printType: "grayscale",
    size: "A4",
    media: "75gsm",
    binding: "none",
    sides: "single",
    copies: 1,
    lamination: "None",
    cover: "No Cover Page",
    orientation: "Portrait",
    instructions: "",
  });

  // --- PRICING & UI RULES ---
  const availableSizes = Object.keys(PRICING_DATA[settings.printType] || {});
  const availableMedia =
    PRICING_DATA[settings.printType]?.[settings.size] || {};
  const isBindingDisabled = [
    "A0",
    "A1",
    "A2",
    "A3",
    "fls",
    "Sticker 12x18",
    "Sticker 13x19",
  ].includes(settings.size);
  const isDoubleAvailable = availableMedia[settings.media]?.double > 0;

  useEffect(() => {
    if (!availableSizes.includes(settings.size))
      setSettings((p) => ({ ...p, size: availableSizes[0] }));
    if (!availableMedia[settings.media])
      setSettings((p) => ({ ...p, media: Object.keys(availableMedia)[0] }));
    if (!isDoubleAvailable) setSettings((p) => ({ ...p, sides: "single" }));
    if (isBindingDisabled)
      setSettings((p) => ({
        ...p,
        binding: "none",
        lamination: "None",
        cover: "No Cover Page",
      }));
  }, [settings.printType, settings.size, settings.media]);

  // --- 1. SEQUENTIAL PREVIEW GENERATOR ---
  const generateThumbnail = async (file) => {
    if (file.type !== "application/pdf") return null;
    try {
      const url = URL.createObjectURL(file);
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const canvas = document.createElement("canvas");
      const viewport = page.getViewport({ scale: 0.15 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport })
        .promise;
      return canvas.toDataURL();
    } catch (e) {
      return null;
    }
  };

  const processFiles = async (acceptedFiles) => {
    // 2. 30MB ALERT
    if (acceptedFiles.some((f) => f.size > 30 * 1024 * 1024)) {
      toast("Heavy files (>30MB) detected. Wi-Fi recommended!", {
        icon: "🌐",
        duration: 4000,
      });
    }

    let pagesSum = 0;
    const newList = [];
    for (const file of acceptedFiles) {
      const thumb = await generateThumbnail(file);
      let pages = 1;
      if (file.type === "application/pdf") {
        try {
          const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file))
            .promise;
          pages = pdf.numPages;
        } catch (e) {
          console.error("PDF read error", e);
        }
      }
      newList.push({ file, pages, id: `${Date.now()}-${file.name}`, thumb });
      pagesSum += pages;
    }
    setFiles((prev) => [...prev, ...newList]);
    setTotalNumPages((p) => p + pagesSum);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: processFiles,
  });
  const estimatedPrice = useMemo(
    () => calculateItemPrice(totalNumPages, settings.copies, settings),
    [totalNumPages, settings]
  );

  const removeFile = (id) => {
    const f = files.find((x) => x.id === id);
    if (!f) return;
    setTotalNumPages((p) => p - f.pages);
    setFiles((p) => p.filter((x) => x.id !== id));
  };

  // --- 3. FINAL SUBMIT WITH TOTAL ETA & MASTER PROGRESS ---
  const handleFinalSubmit = async () => {
    if (files.length === 0) return toast.error("Please upload files first!");
    setUploading(true);
    setActiveAlert(null);
    const totalBytes = files.reduce((acc, f) => acc + f.file.size, 0);
    let uploadedSoFar = 0;

    try {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIdx(i + 1);
        const item = files[i];
        const res = await uploadFile(item.file, {
          stats: { totalSize: totalBytes, uploadedSoFar },
          onEta: (time) => setEta(time),
          onProgress: (fileP, fileBytes) => {
            const totalDone = uploadedSoFar + fileBytes;
            setOverallProgress((totalDone / totalBytes) * 100);
          },
          onAlert: (m) => {
            setActiveAlert(m);
            setUploading(false);
          },
        });
        if (res?.paused) return;
        if (res?.success) {
          results.push(res);
          uploadedSoFar += files[i].file.size;
        }
      }
      navigate("/checkout", {
        state: {
          fileKeys: results.map((r) => r.url.split("/").pop()),
          ...settings,
          totalPages: totalNumPages,
          totalPrice: estimatedPrice,
        },
      });
    } catch (e) {
      toast.error("Process failed.");
    } finally {
      if (!pauseRef.current) setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 pt-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Quick Print
              </h1>
              <p className="text-slate-500 font-medium">
                Upload once, Print anything.
              </p>
            </div>
            <div
              className={`px-4 py-2 bg-white rounded-2xl border shadow-sm flex items-center gap-2 ${netHealth.color}`}
            >
              {netHealth.type === "WIFI" ? (
                <Wifi size={14} />
              ) : (
                <Signal size={14} />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {netHealth.type}
              </span>
            </div>
          </div>

          {/* 1. UPLOAD DOCUMENTS */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <SectionHeader
                icon={<CloudUpload size={20} />}
                title="1. Upload Documents"
                color="bg-blue-600"
              />
              {files.length > 0 && (
                <button
                  onClick={open}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-100 border border-blue-100 active:scale-95"
                >
                  <Plus size={16} /> Add More
                </button>
              )}
            </div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-10 rounded-[1.5rem] text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-blue-400"
              }`}
            >
              <input {...getInputProps()} />
              <CloudUpload className="mx-auto mb-4 text-slate-300" size={32} />
              <p className="text-slate-700 font-bold">
                Drop files here or Click to upload
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, DOC, DOCX up to 500MB
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="relative overflow-hidden p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group"
                >
                  <motion.div
                    animate={{ width: `${progress[f.file.name] || 0}%` }}
                    className="absolute inset-0 bg-blue-50/50 -z-10"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-blue-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                      {f.thumb ? (
                        <img
                          src={f.thumb}
                          className="w-full h-full object-cover"
                          alt="thumb"
                        />
                      ) : (
                        <FileText
                          className="m-auto mt-4 text-blue-400"
                          size={20}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[150px] md:max-w-xs">
                        {f.file.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        {progress[f.file.name]
                          ? `${progress[f.file.name]}% Uploaded`
                          : `${f.pages} Pages`}
                      </p>
                    </div>
                  </div>
                  {!uploading && (
                    <button
                      onClick={() => removeFile(f.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  {progress[f.file.name] === 100 && (
                    <CheckCircle2 className="text-green-500" size={20} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 2. PRINT SETTINGS (FIXED: Re-added) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <SectionHeader
              icon={<Settings2 size={20} />}
              title="2. Print Settings"
              color="bg-cyan-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <SelectGroup
                label="Color Mode"
                value={settings.printType}
                onChange={(v) => setSettings({ ...settings, printType: v })}
              >
                <option value="grayscale">Grayscale (B&W)</option>
                <option value="color">Full Color</option>
              </SelectGroup>
              <SelectGroup
                label="Paper Size"
                value={settings.size}
                onChange={(v) => setSettings({ ...settings, size: v })}
              >
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </SelectGroup>
              <div className="md:col-span-2">
                <SelectGroup
                  label="Paper Quality (GSM)"
                  value={settings.media}
                  onChange={(v) => setSettings({ ...settings, media: v })}
                >
                  {Object.entries(availableMedia).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.name}
                    </option>
                  ))}
                </SelectGroup>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Print Sides
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border">
                  <button
                    onClick={() =>
                      setSettings({ ...settings, sides: "single" })
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                      settings.sides === "single"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    Single
                  </button>
                  <button
                    disabled={!isDoubleAvailable}
                    onClick={() =>
                      setSettings({ ...settings, sides: "double" })
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                      settings.sides === "double"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-400 disabled:opacity-30"
                    }`}
                  >
                    Double
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Copies
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.copies}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      copies: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-slate-100 border-none rounded-xl p-3.5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* 3. FINISHING OPTIONS (FIXED: Re-added) */}
          {!isBindingDisabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100"
            >
              <SectionHeader
                icon={<BookOpen size={20} />}
                title="3. Finishing Options"
                color="bg-indigo-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="md:col-span-2">
                  <SelectGroup
                    label="Binding Type"
                    value={settings.binding}
                    onChange={(v) => setSettings({ ...settings, binding: v })}
                  >
                    {Object.entries(PRICING_DATA.binding).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name} {v.cost > 0 ? `(+₹${v.cost})` : ""}
                      </option>
                    ))}
                  </SelectGroup>
                </div>
                {settings.binding !== "none" &&
                  settings.binding !== "corner" && (
                    <>
                      <SelectGroup
                        label="Lamination"
                        value={settings.lamination}
                        onChange={(v) =>
                          setSettings({ ...settings, lamination: v })
                        }
                      >
                        <option value="None">None</option>
                        <option value="Gloss">Gloss</option>
                        <option value="Matt">Matt</option>
                      </SelectGroup>
                      <SelectGroup
                        label="Cover Page"
                        value={settings.cover}
                        onChange={(v) => setSettings({ ...settings, cover: v })}
                      >
                        <option value="No Cover Page">None</option>
                        <option value="Printed Cover">Printed</option>
                        <option value="Plastic Sheet">Plastic</option>
                      </SelectGroup>
                    </>
                  )}
              </div>
            </motion.div>
          )}

          {/* SPECIAL INSTRUCTIONS (FIXED: Re-added) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
              Special Instructions
            </label>
            <textarea
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium h-24 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Page 5 should be color..."
              value={settings.instructions}
              onChange={(e) =>
                setSettings({ ...settings, instructions: e.target.value })
              }
            />
          </div>
        </div>

        {/* ORDER SUMMARY (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
              <Printer size={180} />
            </div>
            <div className="relative z-10">
              <h4 className="text-center font-black tracking-widest text-slate-500 text-[10px] mb-6 uppercase">
                Order Summary
              </h4>

              {/* Stacked Thumbnails */}
              <div className="flex -space-x-10 justify-center py-4 mb-6">
                {files.slice(-3).map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, rotate: i * 5 - 5 }}
                    className="w-20 h-28 bg-white p-1 rounded-xl shadow-2xl border border-white/20"
                  >
                    {f.thumb ? (
                      <img
                        src={f.thumb}
                        className="w-full h-full object-cover rounded"
                        alt="thumb"
                      />
                    ) : (
                      <FileText className="m-auto mt-8 text-slate-300" />
                    )}
                  </motion.div>
                ))}
                {files.length > 3 && (
                  <div className="z-20 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-4 border-slate-900 mt-10">
                    +{files.length - 3}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <SummaryItem label="Total Pages" value={totalNumPages} />
                <SummaryItem
                  label="Amount"
                  value={`₹${estimatedPrice.toFixed(2)}`}
                />
              </div>

              {uploading && (
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-[10px] font-black text-blue-400">
                    <span>OVERALL PROGRESS</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${overallProgress}%` }}
                      className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                  <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Time Left: {eta}
                  </div>
                </div>
              )}

              <button
                disabled={files.length === 0 || uploading}
                onClick={handleFinalSubmit}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  uploading
                    ? "bg-slate-800 text-blue-400"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/40"
                }`}
              >
                {uploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE ACTION BAR */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-[0_-15px_30px_rgba(0,0,0,0.08)] z-50"
          >
            {uploading ? (
              <div className="space-y-3">
                <div className="flex justify-between px-1">
                  <span className="text-xs font-black">
                    Uploading {currentFileIdx}/{files.length}
                  </span>
                  <span className="text-sm font-black text-blue-600">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
                  <motion.div
                    animate={{ width: `${overallProgress}%` }}
                    className="h-full bg-blue-600 relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
                <div className="text-[10px] text-center text-slate-400 font-bold uppercase">
                  Time Left: {eta}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="pl-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase">
                    Total Pay
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    ₹{estimatedPrice.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAUSE OVERLAY */}
      <AnimatePresence>
        {activeAlert && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center p-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white w-full rounded-3xl p-8 text-center max-w-sm mx-auto"
            >
              <AlertTriangle
                className="text-orange-500 mx-auto mb-4"
                size={48}
              />
              <h3 className="text-xl font-black mb-2">Upload Paused</h3>
              <p className="text-slate-500 text-sm mb-6">{activeAlert}</p>
              <button
                onClick={() => {
                  pauseRef.current = false;
                  handleFinalSubmit();
                }}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Resume Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionHeader = ({ icon, title, color }) => (
  <div className="flex items-center gap-3">
    <div className={`${color} p-2.5 rounded-xl text-white shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-800 tracking-tight">
      {title}
    </h3>
  </div>
);

const SelectGroup = ({ label, value, onChange, children }) => (
  <div className="relative">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-100 border-none rounded-xl p-4 font-bold text-slate-800 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
    >
      {children}
    </select>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">
      {label}
    </span>
    <span className="font-black text-slate-200 capitalize">{value}</span>
  </div>
);

export default QuickPrintForm;
