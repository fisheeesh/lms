import { DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import Spinner from "../shared/spinner";
import { Button } from "../ui/button";

export default function ConfirmModal() {
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
                <Button type="submit" variant='destructive' className="cursor-pointer">
                    <Spinner isLoading={false} label={'Deleting...'}>
                        Confirm
                    </Spinner>
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
