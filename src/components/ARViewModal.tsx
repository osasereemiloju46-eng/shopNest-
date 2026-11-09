import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, RotateCw, ZoomIn, ZoomOut, Check, Sparkles, Layers, Sliders } from 'lucide-react';
import { Product } from '../types';
import { hapticAddToCart } from '../utils/haptics';

interface ARViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ARViewModal: React.FC<ARViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 40 });
  const [roomScene, setRoomScene] = useState<'living' | 'minimal' | 'gallery'>('living');
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle device camera toggle
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera permission denied or unavailable:', err);
          setCameraError('Camera access unavailable. Using simulated architectural room.');
          setUseCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useCamera]);

  const handleTakeSnapshot = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  const roomBackgrounds = {
    living: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    minimal: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    gallery: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* AR Viewport Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-stone-950">
        {useCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={roomBackgrounds[roomScene]}
            alt="Room Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.92]"
          />
        )}

        {/* Reticle / Room Surface Tracker */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border border-white/20 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-32 h-32 border border-white/30 rounded-full" />
          </div>
        </div>

        {/* 3D Placed Product Object with Draggable / Interactive Transform */}
        <div
          className="absolute cursor-grab active:cursor-grabbing select-none transition-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
          }}
          onMouseDown={(e) => {
            const startX = e.clientX - position.x;
            const startY = e.clientY - position.y;
            const onMouseMove = (moveEvent: MouseEvent) => {
              setPosition({
                x: moveEvent.clientX - startX,
                y: moveEvent.clientY - startY,
              });
            };
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX - position.x;
            const startY = touch.clientY - position.y;
            const onTouchMove = (moveEvent: TouchEvent) => {
              const moveTouch = moveEvent.touches[0];
              setPosition({
                x: moveTouch.clientX - startX,
                y: moveTouch.clientY - startY,
              });
            };
            const onTouchEnd = () => {
              window.removeEventListener('touchmove', onTouchMove);
              window.removeEventListener('touchend', onTouchEnd);
            };
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onTouchEnd);
          }}
        >
          {/* Shadow */}
          <div
            className="w-44 h-12 bg-black/40 rounded-full blur-md mx-auto -mb-6"
            style={{ transform: `scale(${scale * 0.9})` }}
          />
          {/* Item */}
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-64 h-64 object-contain filter drop-shadow-2xl pointer-events-none"
          />

          {/* Dimension Tag */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap font-mono shadow-md border border-white/20">
            {product.dimensions.split('·')[0]}
          </div>
        </div>

        {/* Snapshot feedback flash */}
        {snapshotTaken && (
          <div className="absolute inset-0 bg-white animate-out fade-out duration-500 pointer-events-none" />
        )}
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-20">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20"
          aria-label="Exit AR"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-semibold">Nest AR Space</span>
        </div>

        <button
          onClick={() => setUseCamera(!useCamera)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-1.5 transition-colors ${
            useCamera
              ? 'bg-emerald-600 text-white border-emerald-400'
              : 'bg-black/60 text-white border-white/20'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{useCamera ? 'Live Cam' : 'Sim Room'}</span>
        </button>
      </div>

      {/* Snapshot Toast Notification */}
      {snapshotTaken && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-xl border border-stone-700 flex items-center gap-2 z-30">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Room snapshot saved to Android Gallery</span>
        </div>
      )}

      {/* Added to Bag Toast */}
      {addedToast && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-xl flex items-center gap-2 z-30">
          <Check className="w-4 h-4" />
          <span>Added to your Nest Bag!</span>
        </div>
      )}

      {/* Bottom AR Control Panel */}
      <div className="relative z-20 w-full bg-stone-900/90 backdrop-blur-xl border-t border-stone-800 p-4 flex flex-col gap-3">
        {/* Environment Presets (if not live camera) */}
        {!useCamera && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 font-medium">Room Setting:</span>
            <div className="flex items-center gap-1.5">
              {(['living', 'minimal', 'gallery'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoomScene(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium text-xs transition-colors ${
                    roomScene === r
                      ? 'bg-white text-stone-900 font-semibold'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scale & Rotate Sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-stone-800/80 p-2 rounded-xl text-stone-300 text-xs">
            <ZoomIn className="w-4 h-4 text-stone-400" />
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5"
            />
            <span className="font-mono text-[10px] w-8 text-right">
              {Math.round(scale * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2 bg-stone-800/80 p-2 rounded-xl text-stone-300 text-xs">
            <RotateCw className="w-4 h-4 text-stone-400" />
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5"
            />
            <span className="font-mono text-[10px] w-8 text-right">
              {rotation}°
            </span>
          </div>
        </div>

        {/* Action Buttons: Snapshot + Add to Bag */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleTakeSnapshot}
            className="h-11 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 border border-stone-700 active:scale-95 transition-transform shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Capture</span>
          </button>

          <button
            onClick={() => {
              hapticAddToCart();
              onAddToCart(product);
              setAddedToast(true);
              setTimeout(() => setAddedToast(false), 2000);
            }}
            className="flex-1 h-11 rounded-xl bg-white hover:bg-stone-200 text-stone-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
          >
            <span>Add {product.name} · ${product.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
