import { describe, expect, it } from "vitest";
import {
  createVislabComponent,
  getVislabEntryByGlobalName,
  vislabRegistry,
} from "./registry";

describe("vislabRegistry", () => {
  it("has 17 entries with unique ids and globalNames", () => {
    expect(vislabRegistry).toHaveLength(17);
    const ids = new Set(vislabRegistry.map((e) => e.id));
    const names = new Set(vislabRegistry.map((e) => e.globalName));
    expect(ids.size).toBe(17);
    expect(names.size).toBe(17);
  });

  it("every entry defines props schema", () => {
    for (const entry of vislabRegistry) {
      expect(entry.props).toBeDefined();
      expect(entry.props?.length).toBeGreaterThan(0);
      expect(entry.props?.some((p) => p.name === "themeName")).toBe(true);
    }
  });

  it("createVislabComponent throws for unknown widget and paints alert", () => {
    const el = document.createElement("div");
    expect(() => createVislabComponent("NotAWidget", el)).toThrow(
      "Unknown VisLab component",
    );
    const alert = el.querySelector("[data-vislab-error][role='alert']");
    expect(alert).toBeTruthy();
    expect(alert?.textContent).toMatch(/NotAWidget/);
  });
});

describe("widget lifecycle", () => {
  for (const entry of vislabRegistry) {
    it(`${entry.globalName} mounts and destroys cleanly`, () => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      const widget = entry.create(container, {});
      expect(
        container.querySelector("[data-vislab-widget], canvas"),
      ).toBeTruthy();
      expect(() => widget.destroy()).not.toThrow();
      container.remove();
    });
  }
});

describe("prop parsing", () => {
  it("CpuPipeline accepts stages array", () => {
    const entry = getVislabEntryByGlobalName("CpuPipeline");
    if (!entry) throw new Error("CpuPipeline not in registry");
    const container = document.createElement("div");
    const widget = entry.create(container, {
      stages: ["IF", "ID", "EX"],
      autoPlay: false,
    });
    expect(container.textContent).toContain("CPU pipeline");
    widget.destroy();
  });

  it("CacheSimulator accepts policy prop", () => {
    const entry = getVislabEntryByGlobalName("CacheSimulator");
    if (!entry) throw new Error("CacheSimulator not in registry");
    const container = document.createElement("div");
    const widget = entry.create(container, { policy: "fifo" });
    expect(container.textContent).toContain("Policy: FIFO");
    widget.destroy();
  });
});
