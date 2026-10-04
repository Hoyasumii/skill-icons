import type { HTMLImgAttributes } from 'svelte/elements';
import type { IconName, ThemeOption } from '../core/index.js';

export type ImgProps = Omit<HTMLImgAttributes, 'src' | 'srcset' | 'width' | 'height'>;

interface CommonProps extends ImgProps {
  /** 'dark', 'light' or 'auto' to follow the system. Defaults to the provider's theme, then 'dark'. */
  theme?: ThemeOption;
  /** Size of one icon in pixels. Defaults to 48. */
  size?: number;
}

/** Local mode: only icons bundled with this version, fully typed. */
interface LocalMode {
  latest?: false;
  baseUrl?: never;
}

/** Latest mode: any name, loaded from the deployed API at runtime. */
interface LatestMode {
  latest: true;
  /** Deployment to load icons from. Defaults to https://skill-icons.alanreisanjo.workers.dev. */
  baseUrl?: string;
}

export type IconProps = CommonProps &
  ((LocalMode & { name: IconName }) | (LatestMode & { name: string }));

export type IconsProps = CommonProps & {
  /** Icons per line, between 1 and 50. Defaults to 15. */
  perLine?: number;
} & ((LocalMode & { names: readonly IconName[] }) | (LatestMode & { names: readonly string[] }));
