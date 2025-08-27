"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/lib/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  imageUrl: z.string().min(1, { message: "Server image is required." }),
});

// NOTE: Without <form>, you won't get native form behavior like submission on Enter key press or browser validation fallback.
// You can use RHF without a form tag, but you lose these native conveniences and must handle submission differently.

function InviteServerModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState();

  const isModalOpen = isOpen && type === "invite";

  const handleClose = (open: boolean) => {
    if (!open) {
      window.location.reload();
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friend
          </DialogTitle>
          <div className="flex gap-x-2">
            <Input />
            {copied ? <CopyCheck /> : <Copy />}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default InviteServerModal;
