# Third-party widget registration

VisLab exposes `registerVislabWidget` so external packages can add widgets at runtime.

```ts
import { registerVislabWidget } from "@vislab/registry";
import type { VislabWidget } from "@vislab/registry";

class HelloWidget implements VislabWidget {
  constructor(private el: HTMLElement) {
    el.textContent = "Hello from a third-party widget";
    el.setAttribute("data-vislab-widget", "hello-demo");
  }
  destroy() {
    this.el.replaceChildren();
  }
}

registerVislabWidget({
  id: "hello-demo",
  globalName: "HelloDemo",
  displayName: "Hello demo",
  category: "algorithms",
  customElementTag: "vislab-hello-demo",
  props: [{ name: "themeName", type: "string", optional: true }],
  create: (el) => new HelloWidget(el),
});
```

After registration, React `VislabMount component="HelloDemo"` and `data-vislab="HelloDemo"` work if the embed/runtime shares the same registry instance.

**Note:** The IIFE embed bundle ships a fixed registry; third-party registration is intended for ESM apps that import `@vislab/registry` directly.
