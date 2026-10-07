import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FEEDBACK_MAX_LENGTH, validateFeedback, type FeedbackInput } from "@/lib/feedback";

type FeedbackDialogProps = {
  /** Element that opens the dialog (rendered with `asChild`). */
  trigger: ReactNode;
  /** Called with the trimmed feedback once it passes validation. */
  onSubmit: (feedback: FeedbackInput) => void;
};

export function FeedbackDialog({ trigger, onSubmit }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function changeOpen(next: boolean) {
    setOpen(next);
    if (!next) setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validateFeedback({ message, email });
    if (problem) {
      setError(problem);
      return;
    }
    onSubmit({ message: message.trim(), email: email.trim() });
    setMessage("");
    setEmail("");
    changeOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-brand/40 bg-popover">
        <DialogHeader>
          <DialogTitle className="font-display">Gửi góp ý</DialogTitle>
          <DialogDescription>
            Cho chúng tôi biết bạn thích gì hoặc cần cải thiện điều gì.
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback-message">Nội dung góp ý</Label>
            <Textarea
              id="feedback-message"
              value={message}
              maxLength={FEEDBACK_MAX_LENGTH}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ví dụ: Tôi muốn có thêm mẫu caption…"
              className="min-h-28"
              aria-invalid={error !== null}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feedback-email">Email (không bắt buộc)</Label>
            <Input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ban@example.com"
            />
          </div>
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" variant="gold">
              Gửi góp ý
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
