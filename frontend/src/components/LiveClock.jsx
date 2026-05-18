import { useEffect, useState } from "react";

function formatClockTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function LiveClock({ className = "" }) {
  const [time, setTime] = useState(() => formatClockTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatClockTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time dateTime={time} className={className}>
      {time}
    </time>
  );
}
