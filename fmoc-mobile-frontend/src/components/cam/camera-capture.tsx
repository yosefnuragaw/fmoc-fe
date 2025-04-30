"use client";

import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { HiMiniHome } from 'react-icons/hi2';
import CircleIcon from '@mui/icons-material/Circle';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';

const menuItems = [
  { key: 'Home', icon: <HiMiniHome size={25} />, label: 'Home' },
  { key: 'Photo', icon: <CircleIcon />, label: 'Photo' },
  { key: 'Rotate', icon: <FlipCameraIosIcon />, label: 'Rotate' },
];

type CameraCaptureProps = {
  onCaptureComplete: (data: { imageData: string; lat: number | null; lon: number | null }) => void;
  onClose: () => void;
};

export default function CameraCapture({ onCaptureComplete, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Capture image and pass back data
  const captureImage = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const save = (lat: number | null, lon: number | null) => {
      const base64Data = imageSrc.replace(/^data:image\/jpeg;base64,/, '');
      const captureData = { imageData: base64Data, lat, lon };
      localStorage.setItem('capturedData', JSON.stringify(captureData));
      onCaptureComplete(captureData);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => save(pos.coords.latitude, pos.coords.longitude),
      () => save(null, null),
      { enableHighAccuracy: true }
    );
  }, [onCaptureComplete]);

  const toggleCamera = () => setFacingMode((m) => (m === 'user' ? 'environment' : 'user'));

  const handleMenuClick = (key: string) => {
    if (key === 'Rotate') {
      toggleCamera();
    } else if (key === 'Home') {
      onClose();
    } else if (key === 'Photo') {
      captureImage();
      onClose();
    }
  };

  return (
    <div style={containerStyle}>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode, width: 1280, height: 720 }}
        style={webcamStyle}
      />
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-indigo-50 border-t border-gray-300 flex justify-around py-1 px-2 shadow-inner">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            className="flex flex-col items-center px-3 py-1 rounded-full transition text-neutral-400"
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
};

const webcamStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};