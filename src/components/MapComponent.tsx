import type { Stage } from "../types";
import { useState, useRef, useEffect } from "react";
import mapImage from "../../resources/map.png";

interface MapComponentProps {
  stage?: Stage;
}

type Coords = {
  x: number;
  y: number;
};

export default function MapComponent({ stage }: MapComponentProps) {
  if (!stage) {
    return DefaultMapComponent();
  }

  const [iconPosition, setIconPosition] = useState<null | Coords>(null);
  const [backgroundScroll, setBackgroundScroll] = useState<Coords>({
    x: 0,
    y: 0,
  });
  const mapDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapDisplayRef.current) {
      const boundingRect = mapDisplayRef.current.getBoundingClientRect();

      const { offsetX, offsetY } = stage;
      setBackgroundScroll({
        x: -offsetX + boundingRect.width / 2,
        y: -offsetY + boundingRect.height / 2,
      });

      setIconPosition({
        x: boundingRect.width / 2 - 16,
        y: boundingRect.height / 2 - 16,
      });
    }
  }, [mapDisplayRef, stage]);

  return (
    <div
      ref={mapDisplayRef}
      className="relative w-full h-[600px] overflow-hidden"
      style={{
        backgroundImage: `url("${mapImage}")`,
        backgroundPosition: `${backgroundScroll.x}px ${backgroundScroll.y}px`,
      }}
    >
      {/* Show stage marker if stage is specified */}
      {stage && (
        <div
          className="absolute"
          style={{
            width: 32,
            height: 32,
            left: iconPosition?.x,
            top: iconPosition?.y,
          }}
        >
          <div className="p-2 bg-black/50 rounded-full text-white text-sm pointer-events-none select-none">
            {stage.icon}
          </div>
        </div>
      )}
    </div>
  );
}

function DefaultMapComponent() {
  return (
    <div className="relative w-full">
      <a href={mapImage} target="_blank" rel="noopener noreferrer">
        <img src={mapImage} alt="Térkép" />
      </a>
    </div>
  );
}
