import {
  ActivityIcon,
  CloudIcon,
  CodeIcon,
  CpuIcon,
  CreditCardIcon,
  DatabaseIcon,
  FlaskConicalIcon,
  Gamepad2Icon,
  InfinityIcon,
  LayoutGridIcon,
  LockIcon,
  MessageCircleIcon,
  MonitorIcon,
  PenToolIcon,
  ServerIcon,
  SparklesIcon,
  SquareKanbanIcon,
  SquareTerminalIcon,
  WrenchIcon,
  type LucideIcon,
} from 'lucide-react';
import type { IconCategory } from '../../shared/icon-categories';

const CATEGORY_ICONS: Record<IconCategory, LucideIcon> = {
  language: CodeIcon,
  frontend: MonitorIcon,
  backend: ServerIcon,
  database: DatabaseIcon,
  cloud: CloudIcon,
  devops: InfinityIcon,
  tooling: WrenchIcon,
  testing: FlaskConicalIcon,
  observability: ActivityIcon,
  auth: LockIcon,
  ide: SquareTerminalIcon,
  ai: SparklesIcon,
  design: PenToolIcon,
  game: Gamepad2Icon,
  payments: CreditCardIcon,
  os: CpuIcon,
  social: MessageCircleIcon,
  productivity: SquareKanbanIcon,
};

/** The glyph next to a category's name; `null` is "all". */
export const categoryIcon = (category: IconCategory | null): LucideIcon =>
  category ? CATEGORY_ICONS[category] : LayoutGridIcon;
