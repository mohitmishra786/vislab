# Studio export formats

The workbench **Export** panel supports four embed formats:

| Tab        | Use case                                                |
| ---------- | ------------------------------------------------------- |
| **mdx**    | Astro / MDX blogs with `@vislab/react` islands          |
| **html**   | Static sites with `data-vislab` + `vislab-embed.min.js` |
| **jekyll** | `{% include vislab.html %}` liquid snippet              |
| **iframe** | Sandboxed embed pointing at `vislab widget` output      |

Copy buttons write the active tab to the clipboard. URL query params mirror current props for sharing.
