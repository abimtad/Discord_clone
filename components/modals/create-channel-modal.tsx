"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ChannelType } from "@/lib/generated/prisma";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import { Server } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Chanel name is required." })
    .refine((name) => name.toLocaleLowerCase() !== "general", {
      message: "Channel name can not be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

// NOTE: Without <form>, you won't get native form behavior like submission on Enter key press or browser validation fallback.
// You can use RHF without a form tag, but you lose these native conveniences and must handle submission differently.

function CreateChannelModal() {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "TEXT",
    },
  });

  const isModalOpen = isOpen && type === "createChannel";
  const server = data.server;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/channels?serverId=${server?.id}`, values);
      form.reset();
      onClose();
    } catch (error: any) {
      console.log("Create Channel:", error.message);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      form.reset();
      router.refresh();
      window.location.reload();
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create a Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 text-black focus-visible:ring-offset-0 outline-0"
                        placeholder="Enter Channel name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-zinc-300/50 border-0 outline-none ring-offset-0 capitalize text-black focus-visible:ring-offset-0">
                          <SelectValue defaultValue="Select a Channel Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-300/50  text-black border-0">
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize border-0 rounded-none data-[highlighted]:bg-zinc-300"
                            >
                              {type.toLocaleLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannelModal;
