import { Badge } from "../ui/badge";

export type LabelType = "Info" | "Warn" | "Error" | "Critical";

export default function CustomBadge({ label }: { label: LabelType }) {
    const styles: Record<LabelType, string> = {
        Info: "text-sky-600 bg-sky-100",
        Warn: "text-amber-600 bg-amber-100",
        Error: "text-red-600 bg-red-100",
        Critical: "text-purple-600 bg-purple-100",
    };

    return (
        <Badge
            className={`rounded-full text-xs font-bold px-2 py-0.5 capitalize ${styles[label]}`}
        >
            {label.toLowerCase()}
        </Badge>
    );
}