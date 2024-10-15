import React, { useRef, useEffect, useState } from 'react';
const QR = () => {

  useEffect(() => {
    const handleMessage = (event) => {
      // event.originで安全に発信元を確認することができます
      if (event.origin !== 'https://script.google.com/macros/s/AKfycbwA4v7uWv585N8p3sUifQI1bKnLTSLQg79raDAVDgr1UEeAtgBdHQ7VxbCljONBwXTk2Q/exec') return;

      console.log('Received message from iframe:', event.data);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <iframe
        src="https://script.google.com/macros/s/AKfycbwA4v7uWv585N8p3sUifQI1bKnLTSLQg79raDAVDgr1UEeAtgBdHQ7VxbCljONBwXTk2Q/exec"
        title="External Page"
        width="100%"
        height="500px"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default QR;
