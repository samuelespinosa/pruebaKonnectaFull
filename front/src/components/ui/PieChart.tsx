import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart,PieLabelRenderProps } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartOutsideData = [
  { type: "FCP", score: 275, fill: "hsl(var(--chart-1))" },
  { type: "LCP", score: 200, fill: "hsl(var(--chart-2))" },
  { type: "TBT", score: 287, fill: "hsl(var(--chart-3)" },
  { type: "CLS", score: 173, fill: "hsl(var(--chart-4))" },
  { type: "SI", score: 190, fill: "hsl(var(--chart-5))" },
]
const chartInsideData = [
  { total: "Total Score", value: 44, fill: "orange" },
  { total: "Total Score", value: 66, fill: "white" },
 ]


export function PieChartComposed() {
  const [isHovered,setIsHovered]=React.useState(false);
  const labelContent = ({ viewBox }: PieLabelRenderProps) => {
    if (!viewBox || typeof viewBox !== 'object' || !('cx' in viewBox) || !('cy' in viewBox)) {
      return null; // Handle cases where viewBox is invalid
    }

    const { cx, cy } = viewBox;

    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        <tspan
          x={cx}
          y={cy - 24}
          className="fill-muted-foreground"
        >
          {'Score'}
        </tspan>
        <tspan
          x={cx}
          y={cy}
          className="fill-foreground text-3xl font-bold"
        >
          {44}
        </tspan>
      </text>
    );
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="text-center items-center pb-0">
        <CardTitle>Performance</CardTitle>
        <CardDescription> Kaffetal - June 2024</CardDescription>
      </CardHeader>
      <CardContent 
        className="flex-1 pb-0 group"
          onMouseEnter={()=>setIsHovered(true)}
          onMouseLeave={()=>setIsHovered(false)}  
      >
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[250px]"
        >
          
          <PieChart>
            {isHovered &&<ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />}
              <Pie
              data={chartInsideData}
              dataKey="value"
              nameKey="total"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={1}
              isAnimationActive={false}
              label={false}
      
            >
              <Label
                content={labelContent}
                />
              </Pie>
            
            
            {isHovered && <Pie
              data={chartOutsideData}
              dataKey="score"
              nameKey="type"
              innerRadius={85}
              outerRadius={100}
              strokeWidth={5}
            >
           
           <Label content={labelContent} />
            </Pie>
            }
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        
        <div className="flex items-center gap-2 font-medium leading-none">
        
        <span className="relative inline-block pl-4">
          <span className="absolute top-0 left-0 w-3 h-3 border-l-8 border-r-8 border-b-13 border-transparent border-b-red-500"></span>
          0–49
        </span>

      
      
        <span className="relative inline-block pl-4">
          <span className="absolute top-0 left-0 w-3 h-3 bg-orange-500"></span>
          50–89
        </span>

     
        <span className="relative inline-block pl-4">
          <span className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full"></span>
          90–100
        </span>
                    
        </div>
        
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
