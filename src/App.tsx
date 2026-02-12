import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Download,
  Settings,
  Move,
  ZoomIn,
  Maximize,
  Smartphone,
  Globe,
  Github,
} from "lucide-react";

interface ImgState {
  x: number;
  y: number;
  scale: number;
}

interface DragRefState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialPinchDist: number;
  initialScale: number;
}

const PhotoCropper: React.FC = () => {
  // Config State
  const [targetW, setTargetW] = useState<number>(354);
  const [targetH, setTargetH] = useState<number>(472);
  const [crownP, setCrownP] = useState<number>(15.5);
  const [chinP, setChinP] = useState<number>(80);

  // Image State
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgState, setImgState] = useState<ImgState>({ x: 0, y: 0, scale: 1 });

  // Ref-based state for dragging and pinching to prevent closure staleness
  const dragRef = useRef<DragRefState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialPinchDist: 0,
    initialScale: 1,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drawing Logic
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      imgState.x,
      imgState.y,
      image.width * imgState.scale,
      image.height * imgState.scale,
    );
  }, [image, imgState, targetW, targetH]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Initial Image Reset
  const resetImage = useCallback(
    (newImg: HTMLImageElement) => {
      const scaleW = targetW / newImg.width;
      const scaleH = targetH / newImg.height;
      const scale = Math.max(scaleW, scaleH);

      setImgState({
        scale,
        x: (targetW - newImg.width * scale) / 2,
        y: (targetH - newImg.height * scale) / 2,
      });
    },
    [targetW, targetH],
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        resetImage(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleZoom = useCallback(
    (val: number) => {
      const newScale = Math.max(0.01, Math.min(5, val));
      const centerX = targetW / 2;
      const centerY = targetH / 2;

      setImgState((prev) => {
        const mouseXInImg = (centerX - prev.x) / prev.scale;
        const mouseYInImg = (centerY - prev.y) / prev.scale;
        return {
          ...prev,
          scale: newScale,
          x: centerX - mouseXInImg * newScale,
          y: centerY - mouseYInImg * newScale,
        };
      });
    },
    [targetW, targetH],
  );

  // Robust Window-based Interaction Logic
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!dragRef.current.isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const displayScale = targetW / rect.width;

      const newX =
        (clientX - rect.left) * displayScale - dragRef.current.startX;
      const newY = (clientY - rect.top) * displayScale - dragRef.current.startY;

      setImgState((prev) => ({ ...prev, x: newX, y: newY }));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);

    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging || !containerRef.current) return;

      if (e.touches.length === 2) {
        if (e.cancelable) e.preventDefault();

        handleMove(e.touches[0].clientX, e.touches[0].clientY);

        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );

        if (dragRef.current.initialPinchDist > 0) {
          const ratio = currentDist / dragRef.current.initialPinchDist;
          handleZoom(dragRef.current.initialScale * ratio);
        }
      }
    };

    const onUp = () => {
      dragRef.current.isDragging = false;
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [targetW, targetH, handleZoom]);

  const handleStart = (
    clientX: number,
    clientY: number,
    secondTouch?: { x: number; y: number },
  ) => {
    if (!image || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const displayScale = targetW / rect.width;

    const initialDist = secondTouch
      ? Math.hypot(clientX - secondTouch.x, clientY - secondTouch.y)
      : 0;

    dragRef.current = {
      isDragging: true,
      startX: (clientX - rect.left) * displayScale - imgState.x,
      startY: (clientY - rect.top) * displayScale - imgState.y,
      initialPinchDist: initialDist,
      initialScale: imgState.scale,
    };
    document.body.style.cursor = "grabbing";
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `ID_Photo_${targetW}x${targetH}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const applyPreset = (w: number, h: number, crown: number, chin: number) => {
    setTargetW(w);
    setTargetH(h);
    setCrownP(crown);
    setChinP(chin);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* GitHub Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Maximize className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:inline tracking-tight">
            Universal Photo Cropper
          </span>
        </div>
        <a
          href="https://github.com/jiahuiiiii/Universal-Photo-Cropper"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95"
        >
          <Github className="w-4 h-4" />
          <span>View on GitHub</span>
        </a>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 flex-1">
        {/* Sidebar Controls */}
        <div className="w-full lg:w-80 xl:w-96 space-y-4 shrink-0">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xs font-bold uppercase text-slate-400 mb-4 flex items-center tracking-widest">
              <Settings className="w-4 h-4 mr-2" /> Target Settings
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={targetW}
                  onChange={(e) => setTargetW(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={targetH}
                  onChange={(e) => setTargetH(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Crown Position
                  </label>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold">
                    {crownP}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={crownP}
                  onChange={(e) => setCrownP(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Chin Position
                  </label>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {chinP}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={chinP}
                  onChange={(e) => setChinP(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest flex items-center">
              <Globe className="w-4 h-4 mr-2" /> Presets
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset(354, 472, 15, 80)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
              >
                SG Passport
              </button>
              <button
                onClick={() => applyPreset(600, 600, 12, 65)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
              >
                US Visa
              </button>
              <button
                onClick={() => applyPreset(413, 531, 10, 85)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
              >
                EU (35x45)
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors mb-4 group">
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Upload New Image
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>

            <button
              onClick={download}
              disabled={!image}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center transition-all transform active:scale-[0.98]"
            >
              <Download className="w-5 h-5 mr-2" /> Download Result
            </button>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-start lg:pt-4">
          <div
            ref={containerRef}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onTouchStart={(e) => {
              if (e.touches.length === 2) {
                handleStart(e.touches[0].clientX, e.touches[0].clientY, {
                  x: e.touches[1].clientX,
                  y: e.touches[1].clientY,
                });
              }
            }}
            className="relative bg-white shadow-xl border-4 border-white rounded-lg overflow-hidden touch-none"
            style={{
              width: "100%",
              maxWidth: `${targetW}px`,
              aspectRatio: `${targetW}/${targetH}`,
              cursor: "grab",
            }}
          >
            <canvas
              ref={canvasRef}
              width={targetW}
              height={targetH}
              className="w-full h-full block pointer-events-none"
            />

            {/* Overlay Guides */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute w-full border-t border-dashed border-red-500/80 z-20"
                style={{ top: `${crownP}%` }}
              >
                <span className="absolute right-2 -top-4 text-[9px] bg-red-500 text-white px-1.5 rounded-sm font-bold uppercase">
                  Crown
                </span>
              </div>
              <div
                className="absolute w-full border-t border-dashed border-emerald-500/80 z-20"
                style={{ top: `${chinP}%` }}
              >
                <span className="absolute right-2 -top-4 text-[9px] bg-emerald-500 text-white px-1.5 rounded-sm font-bold uppercase">
                  Chin
                </span>
              </div>

              <div className="absolute inset-x-0 top-1/2 border-t border-slate-200/20" />
              <div className="absolute inset-y-0 left-1/2 border-l border-slate-200/20" />
            </div>
          </div>

          {/* Responsive Footer Controls */}
          <div className="w-full max-w-[500px] mt-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-4">
              <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0.01"
                max="5"
                step="0.01"
                value={imgState.scale}
                disabled={!image}
                onChange={(e) => handleZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
              />
              <span className="text-[10px] font-mono font-bold text-slate-500 w-8">
                x{imgState.scale.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Move className="w-3 h-3 mr-2" /> 2-Finger Pan & Pinch
              </div>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Maximize className="w-3 h-3 mr-2" /> {targetW}x{targetH} PX
              </div>
              <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Smartphone className="w-3 h-3 mr-2" /> Scroll Allowed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCropper;
