import React from "react";
import { motion } from "framer-motion";
import { Box } from "lucide-react";

const ThreeDViewer = ({ fileUrl }) => {
    return (
        <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-700">

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
                }}
            />

            {/* Rotating Cube Simulation */}
            <div className="relative w-32 h-32 preserve-3d animate-spin-slow">
                <motion.div
                    animate={{ rotateX: 360, rotateY: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="w-full h-full relative"
                >
                    {/* Cube Faces */}
                    <div className="absolute inset-0 bg-indigo-500/30 border-2 border-indigo-400 translate-z-16" style={{ transform: 'translateZ(64px)' }} />
                    <div className="absolute inset-0 bg-indigo-500/30 border-2 border-indigo-400 -translate-z-16" style={{ transform: 'translateZ(-64px)' }} />
                    <div className="absolute inset-0 bg-purple-500/30 border-2 border-purple-400 rotate-y-90 translate-z-16" style={{ transform: 'rotateY(90deg) translateZ(64px)' }} />
                    <div className="absolute inset-0 bg-purple-500/30 border-2 border-purple-400 -rotate-y-90 translate-z-16" style={{ transform: 'rotateY(-90deg) translateZ(64px)' }} />
                    <div className="absolute inset-0 bg-emerald-500/30 border-2 border-emerald-400 rotate-x-90 translate-z-16" style={{ transform: 'rotateX(90deg) translateZ(64px)' }} />
                    <div className="absolute inset-0 bg-emerald-500/30 border-2 border-emerald-400 -rotate-x-90 translate-z-16" style={{ transform: 'rotateX(-90deg) translateZ(64px)' }} />
                </motion.div>
            </div>

            {/* Overlay UI */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Box className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">3D Model Preview</p>
                        <p className="text-xs text-gray-400">Interactive View</p>
                    </div>
                </div>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-white/10 rounded">Rotate</span>
                    <span className="px-2 py-1 bg-white/10 rounded">Zoom</span>
                </div>
            </div>
        </div>
    );
};

export default ThreeDViewer;
