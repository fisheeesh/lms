import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart";
import CommonFilter from "../shared/common-filter";
import { TSFILTER } from "@/lib/constants";

export const description = "Logs' Source Comparison Line Chart";

interface SourceComparisons {
    date: string;
    api: number;
    firewall: number;
    crowdstrike: number;
    aws: number;
    m365: number;
    ad: number;
}

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

const dateFmt = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
});
const numFmt = new Intl.NumberFormat();

function ComparisonTooltip({
    active,
    label,
    payload,
}: TooltipProps<ValueType, NameType>) {
    if (!active || !payload?.length) return null;

    const labelStr =
        typeof label === "string" || typeof label === "number"
            ? dateFmt.format(new Date(label))
            : "";

    return (
        <div className="rounded-md border bg-popover p-2 text-popover-foreground shadow-sm">
            <div className="text-xs font-medium opacity-80">{labelStr}</div>
            <ul className="mt-1 space-y-1">
                {payload.map((p) => {
                    const key = String(p.dataKey) as keyof typeof chartConfig;
                    const cfg = chartConfig[key];
                    return (
                        <li key={String(p.dataKey)} className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: p.color ?? (p.stroke as string) }}
                            />
                            <span className="text-xs">{cfg?.label ?? String(p.name)}</span>
                            <span className="ml-auto text-xs font-semibold">
                                {numFmt.format(Number(p.value ?? 0))}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

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

            <CardContent className="h-[385px] min-w-0 overflow-hidden">
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
                                tickFormatter={(v: string) =>
                                    new Intl.DateTimeFormat(undefined, {
                                        month: "short",
                                        day: "numeric",
                                    }).format(new Date(v))
                                }
                            />
                            <Tooltip
                                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                                content={<ComparisonTooltip />}
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