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
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">ID Scanner</h2>
          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={startCamera} variant="default" className="gap-2">
                <Camera className="w-4 h-4" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="destructive" className="gap-2">
                <StopCircle className="w-4 h-4" />
                Stop Camera
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 border-4 border-primary/30">
                  <div className="absolute inset-4 border-2 border-dashed border-primary/50">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary/70 text-sm font-medium">
                      Position ID Card Here
                    </div>
                  </div>
                </div>

                {/* Scan feedback overlay */}
                {scanFeedback && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-card p-6 rounded-lg flex flex-col items-center gap-3">
                      {scanFeedback === "scanning" && (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="text-foreground">Scanning ID...</p>
                        </>
                      )}
                      {scanFeedback === "success" && (
                        <>
                          <CheckCircle className="w-8 h-8 text-success" />
                          <p className="text-success font-medium">Scan Successful!</p>
                        </>
                      )}
                      {scanFeedback === "error" && (
                        <>
                          <AlertCircle className="w-8 h-8 text-destructive" />
                          <p className="text-destructive font-medium">Scan Failed</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Camera not started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isScanning && (
          <div className="flex justify-center">
            <Button 
              onClick={simulateScan} 
              disabled={!!scanFeedback}
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg"
            >
              {scanFeedback ? "Processing..." : "Scan ID Card"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};