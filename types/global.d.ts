declare module '*.scss';
declare module '*.sass';
declare module '*.css';
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}

declare module '*.jpeg' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}

declare module '*.png' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}

declare module '*.webp' {
  const content: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default content;
}