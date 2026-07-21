import { describe, expect, it } from "vitest";
import { buildStaticA11ySvg } from "./staticExport";

describe("buildStaticA11ySvg", () => {
  it("includes title, summary, and svg root", () => {
    const canvas = {
      clientWidth: 400,
      clientHeight: 200,
      toDataURL: () => "data:image/png;base64,abc",
    } as unknown as HTMLCanvasElement;

    const svg = buildStaticA11ySvg({
      title: "CPU pipeline",
      summary: "Stages IF to WB",
      canvas,
    });
    expect(svg).toContain("<svg");
    expect(svg).toContain("CPU pipeline");
    expect(svg).toContain("Stages IF to WB");
    expect(svg).toContain('role="img"');
    expect(svg).toContain("data:image/png;base64,abc");
  });

  it("escapes XML special characters", () => {
    const canvas = {
      clientWidth: 100,
      clientHeight: 100,
      toDataURL: () => {
        throw new Error("tainted");
      },
    } as unknown as HTMLCanvasElement;
    const svg = buildStaticA11ySvg({
      title: "A & B <C>",
      summary: 'Say "hi"',
      canvas,
    });
    expect(svg).toContain("A &amp; B &lt;C&gt;");
    expect(svg).toContain("&quot;hi&quot;");
  });
});
