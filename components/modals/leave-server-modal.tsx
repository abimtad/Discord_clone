"use client";

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/lib/hooks/use-modal-store";
import { Copy, CopyCheck, RefreshCw, Router } from "lucide-react";
import { useState } from "react";
import useOrigin from "@/lib/hooks/use-origin";
import { cn } from "@/lib/utils";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { serverHooks } from "next/dist/server/app-render/entry-base";
import { useRouter } from "next/navigation";

// NOTE: Without <form>, you won't get native form behavior like submission on Enter key press or browser validation fallback.
// You can use RHF without a form tag, but you lose these native conveniences and must handle submission differently.

function LeaveServerModal() {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const server = data?.server;
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/servers/${server?.id}/leave`);
      onOpen("leaveServer", res.data);
      onClose();
      router.refresh();
    } catch (error) {
      console.log("[client:Leave-server]: \n", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-foreground">
            leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to leave the server{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name} ?
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-4">
          <div className="flex justify-between items-center w-full">
            <Button
              disabled={isLoading}
              className="capitalize"
              variant="primary"
              onClick={() => handleLeave()}
            >
              confirm
            </Button>
            <Button
              disabled={isLoading}
              variant="ghost"
              className="capitalize bg-background text-muted-foreground"
              onClick={() => onClose()}
            >
              clear
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveServerModal;
