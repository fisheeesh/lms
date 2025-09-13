import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams } from "react-router";

interface Props {
    filterValue: string
}

export default function CustomCalendar({ filterValue }: Props) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [open, setOpen] = useState(false)
    const param = searchParams.get(filterValue);
    const [date, setDate] = useState<Date | undefined>(param ? new Date(param) : undefined);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const onSelectDate = (newDate: Date | undefined, close: boolean) => {
        if (date && newDate && date.toDateString() === newDate.toDateString()) {
            //* Same day clicked again → clear
            setDate(undefined);
            searchParams.delete(filterValue);
            setSearchParams(searchParams, { replace: true });
            if (close) setOpen(false);
            return;
        }

        if (newDate) {
            setDate(newDate);
            searchParams.set(filterValue, newDate.toISOString());
            setSearchParams(searchParams, { replace: true });
        } else {
            setDate(undefined);
            searchParams.delete(filterValue);
            setSearchParams(searchParams, { replace: true });
        }

        if (close) setOpen(false);
    };

    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                id="date"
                className="justify-between font-normal min-h-[44px] font-en"
            >
                {date ? formatDate(date) : "Select date"}
                <ChevronDownIcon />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
                className="font-en"
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => onSelectDate(date, true)}
            />
        </PopoverContent>
    </Popover>
}
