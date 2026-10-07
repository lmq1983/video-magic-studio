export const FEEDBACK_MAX_LENGTH = 1000;

export type FeedbackInput = { message: string; email: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a Vietnamese error message, or null when the feedback can be sent. */
export function validateFeedback({ message, email }: FeedbackInput): string | null {
  const text = message.trim();
  if (!text) return "Hãy nhập nội dung góp ý.";
  if (text.length > FEEDBACK_MAX_LENGTH) return `Góp ý tối đa ${FEEDBACK_MAX_LENGTH} ký tự.`;
  const contact = email.trim();
  if (contact && !EMAIL_PATTERN.test(contact)) return "Email chưa đúng định dạng.";
  return null;
}
