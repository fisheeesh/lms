const severityLegends = [
    { label: "Info", color: "#60A5FA" },
    { label: "Warn", color: "#F59E0B" },
    { label: "Error", color: "#EF4444" },
    { label: "Critical", color: "#8B5CF6" }
];

export default function SeverityLegend({ type }: { type: "row" | "col" }) {
    const styles = {
        row: "flex gap-3 mt-3 md:-mt-0 justify-center w-full mb-2",
        col: "flex flex-col gap-y-4",
    };

    return (
        <div className={styles[type]}>
            {severityLegends.map((legend, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className={`w-3 h-3 rounded-full`}
                        style={{ backgroundColor: legend.color }}
                    />
                    <p className="text-sm lg:text-base">{legend.label}</p>
                </div>
            ))}
        </div>
    );
}