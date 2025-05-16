interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  type: string;
  error: string;
  timeStamp: number;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
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
    recognition.onerror = (event) => {
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
