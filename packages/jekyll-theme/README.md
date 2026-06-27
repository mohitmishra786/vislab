# vislab-jekyll

Jekyll theme assets for posts that embed [VisLab](https://github.com) visualizations.

## Assets

From the monorepo root, copy built scripts into this theme (or your site that uses the theme):

```bash
pnpm exec turbo run build --filter=@vislab/components --filter=@vislab/web-components
mkdir -p assets/js
cp ../../packages/web-components/dist/index.global.js assets/js/vislab-embed.min.js
cp ../../packages/components/dist/index.global.js assets/js/vislab.min.js
```

Or use the CLI:

```bash
pnpm --filter @vislab/cli exec vislab build -o packages/jekyll-theme/assets/js
```

## Layout

Use `layout: viz-post` and optional overrides:

```yaml
---
layout: viz-post
title: "CPU pipeline"
vislab_embed: /assets/js/vislab-embed.min.js
# vislab_legacy: /assets/js/vislab.min.js   # optional: also load global VisLab for window.VisLab includes
---
```

## Include (data-vislab)

```liquid
{% include vislab.html id="s1" component="StorageComparison" %}

{% include vislab.html id="c1" component="CpuPipeline" props='{"stages":["IF","ID","EX","MEM","WB"]}' %}
```

`vislab-embed.min.js` registers custom elements and auto-mounts `[data-vislab]` on `DOMContentLoaded`.

## Iframe embed

For maximum isolation, generate a folder with `vislab widget -c CpuPipeline -o path/to/site/assets/vizlab` and:

```liquid
{% include vislab_iframe.html src="/assets/vizlab/cpupipeline/index.html" height="500" %}
```
