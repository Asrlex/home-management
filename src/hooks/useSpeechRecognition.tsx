interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  start(): void;
  stop(): void;
}

import { useRef } from 'react';

export function useSpeechRecognition(onCommand: (text: string) => void) {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported');
      return;
    }
    const recognition = new SpeechRecognition() as ISpeechRecognition;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      onCommand(transcript);
    };
    recognition.onerror = (event: unknown) => {
      console.error('Speech recognition error', event);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
  };

  return { startRecognition, stopRecognition };
}
