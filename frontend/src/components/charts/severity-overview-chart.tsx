import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

export const description = "A donut chart";

type SeverityPoint = { type: "Info" | "Warn" | "Error" | "Critical"; value: number };
interface Props { data: SeverityPoint[] }

const chartConfig = {
    value: { label: "Count" },
    info: { label: "Info", color: "hsl(204 94% 74%)" },
    warn: { label: "Warn", color: "hsl(38 92% 50%)" },
    error: { label: "Error", color: "hsl(0 84% 63%)" },
    critical: { label: "Critical", color: "hsl(262 83% 67%)" },
} satisfies ChartConfig;

export function SeverityOverviewChart({ data }: Props) {
    const pieData = data.map((d) => {
        const key = d.type.toLowerCase() as keyof typeof chartConfig;
        return { name: d.type, value: d.value, fill: `var(--color-${key})` };
    });

    return (
        <Card className="h-full overflow-hidden">
            <CardHeader className="items-center pb-2">
                <CardTitle className="text-xl md:text-2xl">Severity Overview</CardTitle>
                <CardDescription>Log severity summary of this month</CardDescription>
            </CardHeader>

            <CardContent className="h-[320px] min-w-0 overflow-hidden">
                <ChartContainer config={chartConfig} className="h-full w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent labelKey="name" />} cursor={false} />
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="55%"
                                outerRadius="80%"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}