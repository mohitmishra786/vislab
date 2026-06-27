# VisLab examples

Standalone embed examples (issue #34). Run from monorepo root:

```bash
pnpm run build
pnpm --filter @vislab/cli exec vislab build -o ./dist/vislab
```

| Example       | Path                                 |
| ------------- | ------------------------------------ |
| Plain HTML    | [html/index.html](./html/index.html) |
| CLI scaffolds | `vislab new my-site --template html` |

Published npm examples will mirror these after the first release.
