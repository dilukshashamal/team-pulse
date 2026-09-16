import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { signOut } from "next-auth/react";
import { UserMenu } from "@/components/layout/user-menu";

vi.mock("next-auth/react", () => ({ signOut: vi.fn() }));

it("allows logout to be retried after a network failure", async () => {
  vi.mocked(signOut).mockRejectedValueOnce(new Error("Network unavailable"));
  const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
  try {
    render(<UserMenu user={{ name: "Test User" }} />);
    const button = screen.getByRole("button", { name: "Log out of TeamPulse" });
    fireEvent.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to log out");
    expect(button).toBeEnabled();
    expect(log).toHaveBeenCalled();
  } finally {
    log.mockRestore();
  }
});
