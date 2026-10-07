import { describe, expect, it } from "vitest";

import { FEEDBACK_MAX_LENGTH, validateFeedback } from "./feedback";

describe("validateFeedback", () => {
  it("accepts a message without email", () => {
    expect(validateFeedback({ message: "Ứng dụng rất tốt", email: "" })).toBeNull();
  });

  it("accepts a message with a valid email", () => {
    expect(validateFeedback({ message: "Hay", email: " ban@example.com " })).toBeNull();
  });

  it("rejects an empty or whitespace-only message", () => {
    expect(validateFeedback({ message: "   ", email: "" })).toBe("Hãy nhập nội dung góp ý.");
  });

  it("rejects a message over the length limit", () => {
    const message = "a".repeat(FEEDBACK_MAX_LENGTH + 1);
    expect(validateFeedback({ message, email: "" })).toBe(
      `Góp ý tối đa ${FEEDBACK_MAX_LENGTH} ký tự.`,
    );
  });

  it("rejects a malformed email", () => {
    expect(validateFeedback({ message: "Hay", email: "khong-phai-email" })).toBe(
      "Email chưa đúng định dạng.",
    );
  });
});
