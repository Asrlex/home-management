import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import React, { useState } from 'react';
import { BsSoundwave } from 'react-icons/bs';
import { FaMicrophone } from 'react-icons/fa';

const Microphone = () => {
  const [listening, setListening] = useState(false);
  const handleVoiceCommand = (text: string) => {
    setListening(false);
    console.log('Voice command:', text);
    if (text.toLowerCase().includes('tarea')) {
      console.log('Tarea detected');
    } else if (text.toLowerCase().includes('lista de la compra')) {
      console.log('Lista de la compra detected');
    }
  };

  const { startRecognition, stopRecognition } =
    useSpeechRecognition(handleVoiceCommand);

  const handleVoiceCommandClick = () => {
    if (!listening) {
      setListening(true);
      startRecognition();
    } else {
      setListening(false);
      stopRecognition();
    }
  };

  return (
    <button className="microphoneButton" onClick={handleVoiceCommandClick}>
      {listening ? (
        <BsSoundwave className="microphoneIcon" />
      ) : (
        <FaMicrophone className="microphoneIcon" />
      )}
    </button>
  );
};

export default Microphone;
