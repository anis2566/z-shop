import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ProductModal = ({open, onClose}:Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
              <DialogHeader>
                <DialogTitle>Products</DialogTitle>
              </DialogHeader>
              <Input placeholder="Search product..." />
        </DialogContent>
    </Dialog>
  )
}
