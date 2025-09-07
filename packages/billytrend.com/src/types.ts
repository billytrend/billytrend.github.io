import type { ComponentType } from 'react';

export type Frontmatter = { title?: string; date?: string; [key: string]: unknown };
export type MdxModule = { default: ComponentType; frontmatter?: Frontmatter; meta?: Frontmatter };
