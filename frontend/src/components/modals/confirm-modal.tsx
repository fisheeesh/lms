import { DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import Spinner from "../shared/spinner";
import { Button } from "../ui/button";
import useLogDelete from "@/hooks/use-log-delete";
import useDeleteUser from "@/hooks/use-delete-user";

interface Props {
    type: 'log' | 'user'
    id: number
}

export default function ConfirmModal({ type, id }: Props) {
    const { deleteLog, logLoading } = useLogDelete()
    const { deleteUser, userLoading } = useDeleteUser()

    const current = type === 'log' ? 'Log' : 'User'
    const isLoading = type === 'log' ? logLoading : userLoading

    return (
        <DialogContent className="sm:max-w-[500px] bg-card">
            <DialogHeader>
                <DialogTitle>Delete Confirmation. {current} #<span className="font-en">{id}</span></DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this {current}? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                <Button
                    onClick={() => type === 'log' ? deleteLog(id) : deleteUser(id)}
                    type="submit"
                    variant='destructive'
                    className="cursor-pointer">
                    <Spinner isLoading={isLoading} label={'Deleting...'}>
                        Confirm
                    </Spinner>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
