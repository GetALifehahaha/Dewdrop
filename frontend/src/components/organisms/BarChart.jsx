"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import useTicketStats from "../../hooks/useTicketStats"
import { useEffect } from "react"

export const description = "A bar chart with a label"

const chartConfig = {
  desktop: {
    label: "Ticket Counts",
    color: "var(--color-accent-blue)",
  },
}

const BarChartLabel = () => {
  const { ticketStatsData, ticketStatsError, ticketStatsLoading } = useTicketStats();

  if (ticketStatsLoading) return <h5>Loading stats</h5>
  if (ticketStatsError) return <h5>Error loading</h5>

  const lastIndex = ticketStatsData.length - 1;
  const currentCount = ticketStatsData[lastIndex].count;
  const prevCount = ticketStatsData[lastIndex - 1].count;

  const ticketDiff = currentCount - prevCount;

  // Correct percentage relative to previous count
  const ticketDiffRate = (ticketDiff / prevCount) * 100;

  const chartData = ticketStatsData.map((stat, index) => { return { month: new Date(stat.month).toLocaleString('en-CA', { month: "short" }), count: stat.count } })

  const date = new Date();
  const currentYear = date.getFullYear()
  const currentMonth = date.toLocaleDateString('en-CA', { month: "long" })
  const sixMonthsAgo = new Date(date.getFullYear(), date.getMonth() - 6, 1).toLocaleDateString('en-CA', { month: "long" })
  return (
    <Card className="bg-main border-main-dark border font-medium">
      <CardHeader>
        <CardTitle>Tickets Statistics</CardTitle>
        <CardDescription>{sixMonthsAgo} - {currentMonth} {currentYear}</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {ticketDiff >= 0
            ? `Trending up by ${ticketDiffRate.toFixed(2)}%`
            : `Trending down by ${Math.abs(ticketDiffRate).toFixed(2)}%`}
          {ticketDiff >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total tickets for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarChartLabel