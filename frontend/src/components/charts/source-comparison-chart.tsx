import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import CommonFilter from "../shared/common-filter"
import { TSFILTER } from "@/lib/constants"

export const description = "A line chart"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function SourceComparisonChart() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2 flex lg:items-center flex-col lg:flex-row justify-between gap-4">
                <div>
                    <CardTitle className="text-xl md:text-2xl">Logs' Source Comparison Chart</CardTitle>
                    <CardDescription>Comparison of different log sources</CardDescription>
                </div>
                <CommonFilter
                    filterValue="duration"
                    filters={TSFILTER}
                    otherClasses="min-h-[44px] sm:min-w-[150px]"
                />
            </CardHeader>
            <CardContent className="h-[320px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="desktop"
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
