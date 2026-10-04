import type { HTMLAttributes } from 'astro/types';
import type { IconName, ThemeOption } from '../core/index.js';

export type { IconName, Theme, ThemeOption } from '../core/index.js';

export type ImgProps = Omit<HTMLAttributes<'img'>, 'src' | 'srcset' | 'width' | 'height'>;

interface CommonProps extends ImgProps {
  /** 'dark', 'light' or 'auto' to follow the system. Defaults to 'dark'. */
  theme?: ThemeOption;
  /** Size of one icon in pixels. Defaults to 48. */
  size?: number;
}

/** Local mode: only icons bundled with this version, fully typed. */
interface LocalMode {
  latest?: false;
  baseUrl?: never;
}

/** Latest mode: any name, loaded from the deployed API at request time. */
interface LatestMode {
  latest: true;
  /** Deployment to load icons from. Defaults to https://skillicons.dev. */
  baseUrl?: string;
}

export type IconProps = CommonProps &
  ((LocalMode & { name: IconName }) | (LatestMode & { name: string }));

export type IconsProps = CommonProps & {
  /** Icons per line, between 1 and 50. Defaults to 15. */
  perLine?: number;
} & ((LocalMode & { names: readonly IconName[] }) | (LatestMode & { names: readonly string[] }));
