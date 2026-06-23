"use client";
import { useState, useEffect, useRef, CSSProperties } from "react";

const SPEED = 100; // ms per character

export function TypewriterTitle({
  text,
  className,
  style,
  onDone,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (displayed.length < text.length) {
      const t = setTimeout(
        () => setDisplayed(text.slice(0, displayed.length + 1)),
        SPEED,
      );
      return () => clearTimeout(t);
    }
    setDone(true);
    onDoneRef.current?.();
  }, [displayed, text]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [done]);

  return (
    <h2 className={className} style={style}>
      {displayed}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: "0.78em",
            backgroundColor: "currentColor",
            marginLeft: 4,
            verticalAlign: "middle",
            opacity: cursorOn ? 1 : 0,
            transition: "opacity 0.08s",
          }}
        />
      )}
    </h2>
  );
}
