import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import useLogout from "@/hooks/use-log-out"
import Spinner from "../shared/spinner"
export default function LogoutModal() {
    const { logout, isLoading } = useLogout()

    return (
        <DialogContent className="sm:max-w-[425px] bg-card">
            <DialogHeader>
                <DialogTitle>Logout Confirmation.</DialogTitle>
                <DialogDescription>
                    Are you sure you want to log out?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={() => logout()} variant='destructive' className="cursor-pointer">
                    <Spinner isLoading={isLoading} label={'Logging out...'}>
                        Confirm
                    </Spinner>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
