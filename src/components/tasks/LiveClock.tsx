import React, { useState, useEffect } from "react";

const LiveClock = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="liveClock">
      {currentTime.split(":").map((time, index) => (
        <span key={index} className="clockTime">
          {time}
          {index < 2 && ":"}
        </span>
      ))}
    </div>
  );
};

export default LiveClock;