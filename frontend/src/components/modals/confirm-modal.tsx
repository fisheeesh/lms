import { DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import Spinner from "../shared/spinner";
import { Button } from "../ui/button";
import useLogDelete from "@/hooks/use-log-delete";

interface Props {
    id: number
}

export default function ConfirmModal({ id }: Props) {
    const { deleteLog, isLoading } = useLogDelete()

    return (
        <DialogContent className="sm:max-w-[500px] bg-card">
            <DialogHeader>
                <DialogTitle>Delete Confirmation.</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete user? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">Cancel</Button>
                </DialogClose>
                <Button
                    onClick={() => deleteLog(id)}
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
