import { APP_NAME } from "@/lib/constants";
import { SiLogseq } from "react-icons/si";
import { Link } from "react-router";

export default function Logo() {

    return (
        <Link to="/" className="flex items-center cursor-pointer gap-4">
            <SiLogseq className='size-5' />
            <h1 className="font-mich tracking-wider text-[10px] md:text-xs dark:bg-gradient-to-r dark:from-purple-400 dark:via-pink-500 dark:to-blue-500 dark:bg-clip-text dark:text-transparent">
                {APP_NAME}
            </h1>
        </Link>
    )
}
