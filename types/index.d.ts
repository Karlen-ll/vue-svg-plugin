declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?raw' {
  const src: string;
  export default src;
}

declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue';

  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}

// declare module '*.svg?component' {
//   import { defineComponent } from 'vue';
//   const Component: ReturnType<typeof defineComponent>;
//   export default Component;
// }
