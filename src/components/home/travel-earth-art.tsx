"use client";

import { useEffect, useState } from "react";

export function TravelEarthArt() {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    fetch("/images/unigo-travel-earth-clean.svg")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load the travel illustration");
        }

        return response.text();
      })
      .then(setSvg)
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!svg) {
    return <div className="min-h-[400px]" />;
  }

  return (
    <div
      className="travel-earth-inline"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
