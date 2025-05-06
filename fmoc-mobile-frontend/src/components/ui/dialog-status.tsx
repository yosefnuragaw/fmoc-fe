"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Circle } from "lucide-react";

export default function StatusHistoryPopup({
    statusHistory,
    open,
    onClose,
}: {
    statusHistory: { status: string; time: string }[];
    open: boolean;
    onClose: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white max-sm:w-5/6 rounded-xl min-w-0">
                <DialogHeader>
                    <DialogTitle>Riwayat Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {statusHistory.map((item, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Circle className="h-3 w-3 text-approved" />
                                <span className="font-medium">{item.status}</span>
                            </div>
                            <p className="text-sm text-gray-500">{item.time}</p>
                            {index !== statusHistory.length - 1 && <Separator />}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
