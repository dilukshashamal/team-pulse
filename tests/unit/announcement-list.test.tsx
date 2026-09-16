import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { afterEach, expect, it, vi } from "vitest";
import { AnnouncementList } from "@/components/announcements/announcement-list";

afterEach(() => { vi.unstubAllGlobals(); });

it("offers sign-in instead of retry when loading returns 401", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
  vi.stubGlobal("fetch", fetchMock);
  render(<SWRConfig value={{ provider: () => new Map() }}><AnnouncementList /></SWRConfig>);
  expect(await screen.findByRole("alert")).toHaveTextContent("Your session has expired");
  expect(screen.getByRole("link", { name: "Sign in again" })).toHaveAttribute("href", "/login");
  expect(screen.queryByRole("button", { name: "Try again" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "New announcement" })).not.toBeInTheDocument();
});

it("offers sign-in when the session expires while publishing", async () => {
  vi.stubGlobal("fetch", vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] })))
    .mockResolvedValueOnce(new Response(null, { status: 401 })));
  render(<SWRConfig value={{ provider: () => new Map() }}><AnnouncementList /></SWRConfig>);
  await screen.findByText("A fresh start.");
  fireEvent.click(screen.getByRole("button", { name: "New announcement" }));
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Team update" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "An important update" } });
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Your session has expired");
  expect(screen.getByRole("link", { name: "Sign in again" })).toHaveAttribute("href", "/login");
  expect(screen.queryByText("Announcement published.")).not.toBeInTheDocument();
});

it("shows the saved announcement without requiring another successful GET", async () => {
  const announcement = {
    id: "saved-post", title: "Saved update", body: "Persisted announcement body",
    createdAt: "2026-09-16T10:00:00.000Z", updatedAt: "2026-09-16T10:00:00.000Z",
    author: { id: "author", name: "Test Author" },
  };
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ data: announcement }), { status: 201 }))
    .mockRejectedValue(new Error("Network unavailable"));
  vi.stubGlobal("fetch", fetchMock);
  render(<SWRConfig value={{ provider: () => new Map(), revalidateOnFocus: false }}><AnnouncementList /></SWRConfig>);
  await screen.findByText("A fresh start.");
  fireEvent.click(screen.getByRole("button", { name: "New announcement" }));
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: announcement.title } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: announcement.body } });
  fireEvent.click(screen.getByRole("button", { name: "Publish" }));
  await screen.findByRole("heading", { name: announcement.title });
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Announcement published"));
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
