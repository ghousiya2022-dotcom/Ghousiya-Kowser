import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface QRScannerWindowProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScannerWindow({ onScanSuccess, onClose }: QRScannerWindowProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scannerRef.current.render((decodedText) => {
      onScanSuccess(decodedText);
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    }, (error) => {
      // Ignore routine scanning errors
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Scanner clear error", e));
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-[32px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-blue-500" /></div>
             <h3 className="text-white font-bold uppercase tracking-widest text-[10px]">Vault ID Hardware Scanner</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
            <div id="qr-reader" className="w-full max-w-[350px] !border-none overflow-hidden rounded-2xl bg-zinc-950 ring-1 ring-zinc-800 shadow-inner"></div>
            
            <div className="mt-8 flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest mb-2 animate-pulse">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   Optical Sensor Active
                </div>
                <p className="text-zinc-500 text-sm max-w-[280px] leading-relaxed">
                  Position the patient's Vault QR code within the frame to automatically synchronize their encrypted medical records.
                </p>
            </div>
        </div>

        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
           <AlertCircle className="w-4 h-4 text-zinc-600" />
           <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Only MedVault verified QR roots are supported</span>
        </div>
      </motion.div>
    </div>
  );
}
