import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FeedbackDialog } from "./feedback-dialog";
import { Button } from "./ui/button";

function setup() {
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  render(<FeedbackDialog onSubmit={onSubmit} trigger={<Button>Phản hồi</Button>} />);
  return { onSubmit, user };
}

describe("FeedbackDialog", () => {
  it("opens the form when the trigger is clicked", async () => {
    const { user } = setup();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Phản hồi" }));

    expect(screen.getByRole("dialog", { name: "Gửi góp ý" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nội dung góp ý")).toBeInTheDocument();
  });

  it("shows an error and does not submit an empty message", async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole("button", { name: "Phản hồi" }));

    await user.click(screen.getByRole("button", { name: "Gửi góp ý" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Hãy nhập nội dung góp ý.");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("submits trimmed feedback, then closes and resets the form", async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole("button", { name: "Phản hồi" }));

    await user.type(screen.getByLabelText("Nội dung góp ý"), "  Thêm mẫu caption  ");
    await user.type(screen.getByLabelText("Email (không bắt buộc)"), "ban@example.com");
    await user.click(screen.getByRole("button", { name: "Gửi góp ý" }));

    expect(onSubmit).toHaveBeenCalledWith({
      message: "Thêm mẫu caption",
      email: "ban@example.com",
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Phản hồi" }));
    expect(screen.getByLabelText("Nội dung góp ý")).toHaveValue("");
  });

  it("rejects a malformed email", async () => {
    const { onSubmit, user } = setup();
    await user.click(screen.getByRole("button", { name: "Phản hồi" }));

    await user.type(screen.getByLabelText("Nội dung góp ý"), "Hay");
    await user.type(screen.getByLabelText("Email (không bắt buộc)"), "sai-email");
    await user.click(screen.getByRole("button", { name: "Gửi góp ý" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Email chưa đúng định dạng.");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
