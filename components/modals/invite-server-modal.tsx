"use client";

import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/lib/hooks/use-modal-store";
import { Copy, CopyCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import useOrigin from "@/lib/hooks/use-origin";
import { cn } from "@/lib/utils";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";

// NOTE: Without <form>, you won't get native form behavior like submission on Enter key press or browser validation fallback.
// You can use RHF without a form tag, but you lose these native conveniences and must handle submission differently.

function InviteServerModal() {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log("data:", data);
  const origin = useOrigin();
  const inviteUrl = `${origin}/invite/${data.server?.inviteCode}`;

  const isModalOpen = isOpen && type === "invite";

  const onCopy = async () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  const onNew = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `/api/servers/${data.server?.id}/inviteCode`
      );

      onOpen("invite", { server: response?.data });
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-foreground">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Let Your friends join this server via the invite link below !
          </DialogDescription>
        </DialogHeader>
        <div className="p-8 flex flex-col space-y-3">
          <Label htmlFor="copy" className="uppercase text-xs text-zinc-500">
            server invite link :{" "}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              disabled={isLoading || copied}
              id="copy"
              className="dark:bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              value={inviteUrl}
              readOnly
            />
            <Button disabled={isLoading || copied} onClick={onCopy} size="icon">
              {copied ? (
                <CopyCheck className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <Button
            size="sm"
            onClick={onNew}
            disabled={isLoading || copied}
            variant="link"
            className="pl-0 self-start text-xs text-zinc-500"
          >
            <p className="uppercase">regenerate link</p>
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteServerModal;
