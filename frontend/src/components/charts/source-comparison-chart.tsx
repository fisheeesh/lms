import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import CommonFilter from "../shared/common-filter";
import { TSFILTER } from "@/lib/constants";

export const description = "Logs' Source Comparison Line Chart";

interface Props {
    data: SourceComparisons[];
}

const chartConfig = {
    api: { label: "API", color: "var(--chart-1)" },
    firewall: { label: "Firewall", color: "var(--chart-2)" },
    crowdstrike: { label: "CrowdStrike", color: "var(--chart-3)" },
    aws: { label: "AWS", color: "var(--chart-4)" },
    m365: { label: "M365", color: "var(--chart-5)" },
    ad: { label: "AD", color: "var(--chart-6)" },
} satisfies ChartConfig;

export function SourceComparisonChart({ data }: Props) {
    const seriesKeys = Object.keys(chartConfig) as (keyof typeof chartConfig)[];

    return (
        <Card className="h-full overflow-hidden">
            <CardHeader className="pb-2 flex lg:items-center flex-col lg:flex-row justify-between gap-4">
                <div>
                    <CardTitle className="text-xl md:text-2xl">Logs' Source Comparison</CardTitle>
                    <CardDescription>Comparison of different log sources</CardDescription>
                </div>
                <CommonFilter
                    filterValue="duration"
                    filters={TSFILTER}
                    otherClasses="min-h-[44px] sm:min-w-[150px]"
                />
            </CardHeader>

            <CardContent className="h-[320px] min-w-0 overflow-hidden"> {/* important */}
                <ChartContainer config={chartConfig} className="h-full w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval="preserveStartEnd"
                                minTickGap={12}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent labelKey="date" />}
                            />
                            {seriesKeys.map((k) => (
                                <Line
                                    key={k}
                                    type="monotone"
                                    dataKey={k}
                                    stroke={`var(--color-${k})`}
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}