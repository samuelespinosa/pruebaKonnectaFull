import { Label } from "recharts";
import React from "react";

interface PieLabelProps {
  score: number;
}

export const PieLabel: React.FC<PieLabelProps> = ({ score }) => {
  return (
    <Label
      content={({ viewBox }) => {
        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
          return (
            <text
              x={viewBox.cx}
              y={viewBox.cy}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <tspan
                x={viewBox.cx}
                y={(viewBox.cy || 0) - 24}
                className="fill-muted-foreground"
              >
                {"Score"}
              </tspan>
              <tspan
                x={viewBox.cx}
                y={viewBox.cy}
                className="fill-foreground text-3xl font-bold"
              >
                {score}
              </tspan>
            </text>
          );
        }
        return null;
      }}
    />
  );
};