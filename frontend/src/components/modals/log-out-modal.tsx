import { authApi } from "@/api"
import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import useUserStore from "@/store/user-store"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import Spinner from "../shared/spinner"
export default function LogoutModal() {
    const navigate = useNavigate()
    const { clearUser } = useUserStore()

    const { mutate, isPending: isLoading } = useMutation({
        mutationFn: async () => {
            const res = await authApi.post("logout")

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            return res.data
        },
        onSuccess: () => {
            clearUser()
            navigate('/login', { replace: true })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            })
        }
    })

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
                <Button type="submit" onClick={() => mutate()} variant='destructive' className="cursor-pointer">
                    <Spinner isLoading={isLoading} label={'Logging out...'}>
                        Confirm
                    </Spinner>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
