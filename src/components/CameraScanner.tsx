import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, StopCircle, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CameraScannerProps {
  onScanResult: (scannedId: string) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const CameraScanner = ({ onScanResult, isScanning, setIsScanning }: CameraScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanFeedback, setScanFeedback] = useState<"scanning" | "success" | "error" | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: "environment" // Prefer back camera if available
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        toast.success("Camera started successfully");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    setScanFeedback(null);
    toast.info("Camera stopped");
  };

  // Simulate ID scanning - in real implementation, this would use OCR or barcode scanning
  const simulateScan = () => {
    setScanFeedback("scanning");
    
    // Simulate processing time
    setTimeout(() => {
      const mockStudentIds = ["STU001", "STU002", "STU003", "STU004", "STU005"];
      const randomId = mockStudentIds[Math.floor(Math.random() * mockStudentIds.length)];
      
      setScanFeedback("success");
      onScanResult(randomId);
      
      setTimeout(() => {
        setScanFeedback(null);
      }, 2000);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="p-8 space-y-8 bg-gradient-to-br from-card to-secondary/20 border-0 shadow-warm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
          📱 ID Scanner Ready
        </h2>
        <p className="text-muted-foreground text-lg">
          {isScanning ? "Hold your ID card steady in front of the camera 📷" : "Ready to scan? Click below to get started! ✨"}
        </p>
      </div>
      
      <div className="flex justify-center">
        {!isScanning ? (
          <Button 
            onClick={startCamera} 
            variant="default" 
            size="lg"
            className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
          >
            <Camera className="w-5 h-5 mr-2" />
            📱 Start Camera
          </Button>
        ) : (
          <Button 
            onClick={stopCamera} 
            variant="secondary" 
            size="lg"
            className="text-lg font-semibold px-8 py-4"
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Stop Camera
          </Button>
        )}
      </div>

      <div className="relative bg-gradient-to-br from-muted/50 to-secondary/30 rounded-2xl overflow-hidden aspect-video border border-border/50">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-3 border-accent rounded-2xl w-52 h-36 animate-pulse shadow-scan bg-accent/5" />
              <div className="absolute top-4 left-4 bg-success/90 text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                📷 Camera Active
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-foreground">
                Place your ID card here! 📱
              </div>
            </div>

            {/* Scan feedback overlay */}
            {scanFeedback && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-card p-8 rounded-2xl flex flex-col items-center gap-4 shadow-lg border border-border/20">
                  {scanFeedback === "scanning" && (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-primary"></div>
                      <p className="text-foreground text-lg font-medium">✨ Reading your ID...</p>
                    </>
                  )}
                  {scanFeedback === "success" && (
                    <>
                      <CheckCircle className="w-12 h-12 text-success" />
                      <p className="text-success font-semibold text-lg">🎉 Welcome to class!</p>
                    </>
                  )}
                  {scanFeedback === "error" && (
                    <>
                      <AlertCircle className="w-12 h-12 text-destructive" />
                      <p className="text-destructive font-medium text-lg">😕 Couldn't read that, try again!</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4 mx-auto w-fit">
                <Camera className="w-16 h-16 text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">Your camera will show up here</p>
              <p className="text-muted-foreground/70 text-sm mt-1">Don't worry, we won't record anything!</p>
            </div>
          </div>
        )}
      </div>

      {isScanning && (
        <div className="flex justify-center">
          <Button 
            onClick={simulateScan} 
            disabled={!!scanFeedback}
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-accent to-success hover:from-accent/90 hover:to-success/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
          >
            {scanFeedback ? "⏳ Processing..." : "✨ Scan My ID Card"}
          </Button>
        </div>
      )}
    </Card>
  );
};