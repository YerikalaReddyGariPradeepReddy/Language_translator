import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface VoiceRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextRecognized: (text: string) => void;
  language: string;
}

export default function VoiceRecordingModal({
  isOpen,
  onClose,
  onTextRecognized,
  language,
}: VoiceRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useVoiceRecognition({
    language,
    continuous: true,
    interimResults: true,
  });

  useEffect(() => {
    if (isOpen && hasRecognitionSupport) {
      setIsRecording(true);
      startListening();
    } else {
      setIsRecording(false);
      stopListening();
    }
  }, [isOpen, hasRecognitionSupport, startListening, stopListening]);

  const handleUseText = () => {
    if (transcript.trim()) {
      onTextRecognized(transcript);
      onClose();
    }
  };

  const handleCancel = () => {
    stopListening();
    onClose();
  };

  if (!hasRecognitionSupport) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold mb-2">Voice Recognition Not Supported</h3>
            <p className="text-muted-foreground">
              Your browser doesn't support voice recognition. Please try using Chrome or Edge.
            </p>
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isListening ? "animate-recording" : ""
            }`}>
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2">
              {isListening ? "Listening..." : "Ready to Listen"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Speak clearly in {language === "en" ? "English" : "your selected language"}
            </p>
          </div>

          {/* Waveform Visualization */}
          {isListening && (
            <div className="flex items-center justify-center space-x-1 mb-8">
              {[20, 35, 45, 30, 55, 40, 25].map((height, index) => (
                <div
                  key={index}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{ 
                    height: `${height}px`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Recognized Text */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-6 min-h-[60px] flex items-center">
            <p className="text-slate-900 dark:text-slate-100 text-center italic w-full">
              {transcript || "Start speaking to see your words here..."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleUseText}
              disabled={!transcript.trim()}
            >
              Use Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
