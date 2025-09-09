import Loader from "@/components/shared/loader";
import Navbar from "@/components/shared/nav-bar";
import { Outlet, useNavigation } from "react-router";

export default function DashboardRootLayout() {
    const navigation = useNavigation()
    if (navigation.state !== 'idle') {
        return <Loader />
    }

    return (
        <section>
            <Navbar />
            <div className="pt-20 md:pt-24 max-w-[1440px] mx-auto px-4 pb-5">
                <Outlet />
            </div>
        </section>
    )
}
