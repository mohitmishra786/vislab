import { describe, expect, it, vi } from "vitest";
import { createLiveSummary } from "./widgetRuntime";

describe("createLiveSummary", () => {
  it("sets initial chrome text and tracks get()", () => {
    const setChrome = vi.fn();
    const summary = createLiveSummary(setChrome, "hello");
    expect(setChrome).toHaveBeenCalledWith("hello");
    expect(summary.get()).toBe("hello");
  });

  it("updates chrome and get() on set()", () => {
    const setChrome = vi.fn();
    const summary = createLiveSummary(setChrome, "a");
    summary.set("b");
    expect(setChrome).toHaveBeenLastCalledWith("b");
    expect(summary.get()).toBe("b");
  });
});
