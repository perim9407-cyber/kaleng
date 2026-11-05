import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2 } from 'lucide-react';

interface AudioRecorderProps {
  onAudioRecorded: (dataUrl: string) => void;
  onClearAudio: () => void;
  existingAudioUrl?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioRecorded,
  onClearAudio,
  existingAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onAudioRecorded(base64data);
        };
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      // Start 10s max timer
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((sec) => {
          if (sec >= 10) {
            stopRecording();
            return 10;
          }
          return sec + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone error', err);
      setErrorMsg('Microphone access was denied or not supported on this device.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!existingAudioUrl) return;

    if (isPlaying) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio(existingAudioUrl);
        audioElementRef.current.onended = () => setIsPlaying(false);
      } else {
        audioElementRef.current.src = existingAudioUrl;
      }
      audioElementRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 sm:p-4 text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-stone-700 flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-amber-700" />
          <span>Record Ambient Audio or Voice Note (up to 10s)</span>
        </span>
        {isRecording && (
          <span className="text-red-600 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            00:{recordSeconds.toString().padStart(2, '0')} / 10s
          </span>
        )}
      </div>

      {errorMsg && (
        <p className="text-red-600 text-[11px] mb-2">{errorMsg}</p>
      )}

      <div className="flex items-center gap-3">
        {!isRecording && !existingAudioUrl && (
          <button
            type="button"
            onClick={startRecording}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md flex items-center gap-2 font-medium transition-colors"
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={stopRecording}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 font-medium transition-colors animate-pulse"
          >
            <Square className="w-3.5 h-3.5" />
            <span>Stop Recording ({10 - recordSeconds}s left)</span>
          </button>
        )}

        {existingAudioUrl && !isRecording && (
          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={togglePlayback}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-md flex items-center gap-1.5 font-medium transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Voice Note' : 'Listen to Voice Note'}</span>
            </button>

            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Audio packed
            </span>

            <button
              type="button"
              onClick={() => {
                if (audioElementRef.current) audioElementRef.current.pause();
                setIsPlaying(false);
                onClearAudio();
              }}
              className="ml-auto p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors"
              title="Delete recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
