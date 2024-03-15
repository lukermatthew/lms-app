"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter } from "@prisma/client";

interface ChapterUrlFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Url is required",
  }),
});

export const ChapterUrlForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterUrlFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: initialData?.url || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Settings2Icon className="h-4 w-4 mr-2" />
              Change
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">
          {initialData.url && (
            <iframe
              width="100%"
              height="500"
              src={initialData.url}
              frameBorder="0"
              allowFullScreen
              title="Embedded YouTube Video"
            ></iframe>
          )}
        </p>
      )}
      {isEditing && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'www.youtube.com/.....' "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!isValid || isSubmitting}
              >
                Save
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};
