/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bot, Mic, MicOff } from "lucide-react";
import axios from "axios";

export default function WalmartAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const sendToModel = async (transcript: string) => {
    const res = await axios.post(
      "http://localhost:8000/analyze",
      {
        message: transcript,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const entities = res.data.entities;
    console.log("Extracted Entities:", entities);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        await sendToModel(spokenText);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      recognitionRef.current?.start();
    }
    setIsListening((prev) => !prev);
  };

  const [shapes, setShapes] = useState<{ top: number; left: number }[]>([]);

  useEffect(() => {
    const randomShapes = Array.from({ length: 12 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setShapes(randomShapes);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#edf3fa] to-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {shapes.map((shape, i) => (
          <div
            key={i}
            className="w-6 h-6 bg-blue-200 opacity-40 absolute transform rotate-45"
            style={{
              top: `${shape.top}%`,
              left: `${shape.left}%`,
            }}
          ></div>
        ))}
      </div>

      <h1 className="text-3xl md:text-5xl font-semibold text-center text-[#001e60] z-10">
        Welcome to Your <br />
        <span className="text-blue-600 font-bold">Walmart Assistant</span>
      </h1>

      <p className="text-gray-600 text-center text-lg mt-4 z-10">
        Meet <span className="text-blue-700 font-semibold">Milo</span>, your
        personal shopping assistant
      </p>

      <div className="bg-white rounded-xl shadow-md mt-8 p-6 flex flex-col items-center w-full max-w-xl z-10">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Bot className="text-blue-600 w-6 h-6" />
          </div>
          <p className="text-gray-700">
            &quot;Hi there! Try asking me about products, deals, or your
            orders...&quot;
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-200 transition">
            Show deals
          </button>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-200 transition">
            Track order
          </button>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-200 transition">
            Find stores
          </button>
        </div>
      </div>

      {/* MIC BUTTON + TRANSCRIPT DISPLAY */}
      <div className="mt-6 z-10 flex flex-col items-center">
        <p className="text-blue-600 text-sm font-medium mb-2">
          ▼ Speak to Milo ▼
        </p>
        <button
          onClick={handleMicClick}
          className={`bg-white border ${
            isListening ? "border-red-400" : "border-blue-200"
          } px-6 py-3 rounded-full shadow-sm flex items-center text-blue-600 font-medium hover:bg-blue-50 transition`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Speak to Milo
            </>
          )}
        </button>

        {transcript && (
          <p className="mt-4 text-gray-700 text-sm bg-blue-50 px-4 py-2 rounded">
            🗣️ You said: <span className="font-medium">{transcript}</span>
          </p>
        )}
      </div>
    </div>
  );
}
