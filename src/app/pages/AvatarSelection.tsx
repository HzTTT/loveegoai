import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload, RotateCcw } from "lucide-react";
import { useUser } from "../context/UserContext";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import { motion } from "motion/react";

export default function AvatarSelection() {
  const navigate = useNavigate();
  const { setAvatar } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setCroppedImage(null);
      });
      reader.readAsDataURL(file);
    }
  };

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const image = new Image();
    image.src = imageSrc;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      image,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/jpeg");
    });
  };

  const handleCrop = async () => {
    const cropped = await createCroppedImage();
    if (cropped) {
      setCroppedImage(cropped);
      setAvatar(cropped);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEnjoy = () => {
    if (croppedImage) {
      navigate('/onboarding');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] p-8 pt-20">
      <motion.h1 
        className="text-[40px] font-bold mb-12 text-center font-[IM_FELL_DW_Pica] bg-gradient-to-r from-[#4A235A] via-[#6A3A7C] to-[#8B4A9E] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(74,35,90,0.15)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Upload your avatar
      </motion.h1>
      
      {/* Decorative Circle Image */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4A235A]/20 shadow-lg">
          <img src={imgKoala} alt="Decoration" className="w-full h-full object-cover" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center mb-8">
        {!imageSrc && !croppedImage && (
          <motion.div 
            className="relative w-full max-w-md aspect-square rounded-[30px] bg-gradient-to-br from-white/60 via-purple-50/30 to-pink-50/20 border-4 border-dashed border-[#4A235A]/30 flex flex-col items-center justify-center cursor-pointer hover:border-[#4A235A]/50 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background gradient */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Upload className="w-20 h-20 text-[#4A235A]/60 mb-4 drop-shadow-sm" />
              </motion.div>
              <p className="text-2xl text-[#222]/70 font-bold font-[IM_FELL_DW_Pica] drop-shadow-sm">Tap to upload</p>
              <p className="text-sm text-[#222]/50 mt-3 font-medium">JPG, PNG or GIF</p>
              
              {/* Decorative elements */}
              <motion.div
                className="absolute top-8 right-8 w-3 h-3 rounded-full bg-purple-300/40"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-pink-300/40"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {imageSrc && !croppedImage && (
          <div className="w-full max-w-md">
            <div className="relative w-full aspect-square rounded-[30px] overflow-hidden bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2 text-[#222]/70 font-[IM_FELL_DW_Pica]">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleReset}
                className="flex-1 bg-white text-[#222] rounded-[50px] py-3 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-[IM_FELL_DW_Pica]"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
              <button
                onClick={handleCrop}
                className="flex-1 bg-[#222] text-white rounded-[50px] py-3 font-bold hover:bg-black transition-colors font-[IM_FELL_DW_Pica]"
              >
                Crop
              </button>
            </div>
          </div>
        )}

        {croppedImage && (
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#222] mb-6">
                <img src={croppedImage} alt="Cropped avatar" className="w-full h-full object-cover" />
              </div>
              
              <button
                onClick={handleReset}
                className="bg-white text-[#222] rounded-[50px] px-8 py-3 font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 font-[IM_FELL_DW_Pica]"
              >
                <RotateCcw className="w-5 h-5" />
                Upload Different Photo
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <button 
        onClick={handleEnjoy}
        disabled={!croppedImage}
        className={`w-full rounded-[50px] py-4 mt-8 text-xl font-bold transition-colors ${ croppedImage ? 'bg-[#222] text-white hover:bg-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed' } font-[IM_FELL_DW_Pica]`}
      >
        Enjoy
      </button>
    </div>
  );
}