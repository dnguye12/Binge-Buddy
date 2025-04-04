"use client";

import useConversation from "@/app/hooks/useConversation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SendHorizonal, VoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MyUploadButton from "@/components/MyUploadButton";

interface ConversationFormProps {
  isVote: boolean;
}

const formSchema = z.object({
  message: z.string().min(1, {
    message: "Empty message",
  }),
});

const ConversationForm = ({ isVote }: ConversationFormProps) => {
  const { conversationId } = useConversation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/message", { ...values, conversationId });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (result: any) => {
    axios.post("/api/message", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  const handleInitVote = () => {
    axios.post("/api/message", {
      isVote: true,
      conversationId,
    });
  };

  return (
    <div className="flex w-full items-center gap-2 border-t bg-white px-4 py-4 lg:gap-4">
      {!isVote && <MyUploadButton handleUpload={handleUpload} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-center gap-2 lg:gap-4"
        >
          <div className="flex-1 drop-shadow">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="border-0 bg-neutral-100 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Write a message"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!isVote && (
            <Button
              onClick={handleInitVote}
              type="button"
              size="icon"
              variant={"outline"}
              disabled={isLoading}
              className="cursor-pointer shadow-md"
            >
              <VoteIcon />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading}
            className="cursor-pointer shadow-md"
          >
            <SendHorizonal />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ConversationForm;
