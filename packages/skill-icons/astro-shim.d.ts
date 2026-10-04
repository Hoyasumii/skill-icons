// Lets tsc emit src/astro/index.ts; consumers resolve the real .astro types through Astro.
declare module '*.astro' {
  const component: (props: Record<string, unknown>) => unknown;
  export default component;
}
