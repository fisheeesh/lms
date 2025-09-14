import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart";

export const description = "Logs Overview Bar Chart for last 60 days";

type LogsAlertsOverview = { date: string | number; logs: number; alerts: number };

const chartConfig = {
    logs: {
        label: "Logs",
        color: "var(--chart-2)",
    },
    alerts: {
        label: "Alerts",
        color: "var(--chart-1)",
    },
} satisfies Record<string, { label: string; color: string }>;

interface Props {
    data: LogsAlertsOverview[];
}

export function LogsAlertsOverviewChart({ data }: Props) {
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("logs");

    const total = useMemo(
        () => ({
            logs: data.reduce((acc, curr) => acc + (curr.logs ?? 0), 0),
            alerts: data.reduce((acc, curr) => acc + (curr.alerts ?? 0), 0),
        }),
        [data]
    );

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle className="text-xl md:text-2xl">Logs & Alerts Overview</CardTitle>
                    <CardDescription>
                        Showing total logs & alerts for the last <span className="font-en">60</span> days
                    </CardDescription>
                </div>

                <div className="flex font-en">
                    {(["logs", "alerts"] as const).map((key) => (
                        <button
                            key={key}
                            data-active={activeChart === key}
                            className="data-[active=true]:bg-muted/50 cursor-pointer relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                            onClick={() => setActiveChart(key)}
                        >
                            <span className="text-muted-foreground text-xs">
                                {chartConfig[key].label}
                            </span>
                            <span className="text-lg leading-none font-bold sm:text-3xl">
                                {total[key].toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full font-en">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                }
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey={activeChart}
                                        labelFormatter={(value) =>
                                            new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }
                                    />
                                }
                            />
                            <Bar
                                dataKey={activeChart}
                                fill={chartConfig[activeChart].color}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}