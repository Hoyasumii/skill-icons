import { useMemo, useRef, useState } from 'react';
import { CategoryRail, CategorySidebar } from '@/components/category-nav';
import { Dock } from '@/components/dock';
import { ExportPanel } from '@/components/export-panel';
import { IconGrid } from '@/components/icon-grid';
import { McpPage } from '@/components/mcp-page';
import { PresetList } from '@/components/preset-list';
import { SavedStacks } from '@/components/saved-stacks';
import { SearchInput } from '@/components/search-input';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import type { StackProps } from '@/components/stack-tray';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Slide } from '@/components/ui/slide';
import { useBuilderState } from '@/hooks/use-builder-state';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useIsWide } from '@/hooks/use-is-wide';
import { usePop } from '@/hooks/use-pop';
import { useSavedStacks } from '@/hooks/use-saved-stacks';
import { useI18n } from '@/i18n';
import { categoryIcon } from '@/lib/category-icons';
import { filterIcons } from '@/lib/icons';
import { POP_ALL } from '@/lib/motion';
import { PRESETS } from '@/lib/presets';
import type { Format, FrameworkId } from '@/lib/snippets';
import { isStackSelected, toggleStack } from '@/lib/stack-selection';
import type { IconCategory } from '../shared/icon-categories';
import type { Page } from '../shared/page-meta';

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function App({ page }: { page: Page }) {
  return page === 'mcp' ? <McpPage /> : <Builder />;
}

function Builder() {
  const builder = useBuilderState();
  const { state } = builder;
  const { t } = useI18n();
  useDocumentMeta(t.meta);
  const wide = useIsWide();
  const { pop, isPopping } = usePop();
  const saved = useSavedStacks();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<IconCategory | null>(null);
  const [liftedId, setLiftedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const exportRef = useRef<HTMLButtonElement>(null);
  const [format, setFormat] = useState<Format>('markdown');
  const [framework, setFramework] = useState<FrameworkId>('react');

  const matches = useMemo(() => filterIcons(query, null), [query]);
  const filtered = useMemo(
    () => (category ? matches.filter(icon => icon.category === category) : matches),
    [matches, category],
  );
  // Removing the lifted icon some other way (grid, clear all) drops the lift with it.
  const lifted = liftedId && state.icons.includes(liftedId) ? liftedId : null;

  const toggle = (name: string) => {
    if (!state.icons.includes(name)) pop(name);
    builder.toggleIcon(name);
  };

  /** Presets and saved stacks combine: a tap selects one, another tap deselects it. */
  const selectStack = (names: readonly string[]) => {
    const adding = !isStackSelected(names, state.icons);
    const allStacks = [...PRESETS.map(preset => preset.icons), ...saved.stacks.map(s => s.icons)];
    builder.setIcons(toggleStack(state.icons, names, allStacks));
    if (adding) pop(POP_ALL);
  };

  const stack: StackProps = {
    icons: state.icons,
    theme: state.theme,
    lifted,
    isPopping,
    onLift: name => setLiftedId(lifted === name ? null : name),
    onMove: offset => {
      if (!lifted) return;
      const from = state.icons.indexOf(lifted);
      builder.moveIcon(from, from + offset);
      pop(lifted);
    },
    onRemove: () => {
      if (lifted) builder.toggleIcon(lifted);
      setLiftedId(null);
    },
  };

  // With nothing picked there's nothing to show: the panel and the dock step aside.
  const hasIcons = state.icons.length > 0;
  if (!hasIcons && sheetOpen) setSheetOpen(false);

  const exportPanel = (
    <ExportPanel
      compact={!wide}
      stack={stack}
      perLine={state.perLine}
      format={format}
      framework={framework}
      savedCount={saved.stacks.length}
      onSave={name => saved.save(name, state.icons)}
      onShuffle={() => {
        builder.setIcons(shuffled(state.icons));
        pop(POP_ALL);
      }}
      onClear={builder.clearIcons}
      onThemeChange={builder.setTheme}
      onPerLineChange={builder.setPerLine}
      onFormatChange={setFormat}
      onFrameworkChange={setFramework}
      title={state.title}
      onTitleChange={builder.setTitle}
    />
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[232px_minmax(0,1fr)_400px]">
        <CategorySidebar value={category} matches={matches} onChange={setCategory} />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-[1_0_auto] flex-col gap-5 px-4 pt-4 pb-6 lg:px-7 lg:pt-6 lg:pb-10">
            <SearchInput value={query} onChange={setQuery} />
            <CategoryRail value={category} matches={matches} onChange={setCategory} />
            <PresetList selected={state.icons} theme={state.theme} onToggle={selectStack} />
            <SavedStacks
              stacks={saved.stacks}
              selected={state.icons}
              theme={state.theme}
              onToggle={selectStack}
              onRemove={saved.remove}
              onClear={saved.clear}
            />
            <IconGrid
              icons={filtered}
              title={t.picker.gridTitle(
                category ? t.categories[category] : t.picker.allIcons,
                filtered.length,
              )}
              titleIcon={categoryIcon(category)}
              query={query}
              selected={state.icons}
              theme={state.theme}
              isPopping={name => isPopping(name, false)}
              onToggle={toggle}
              onClearSearch={() => setQuery('')}
            />
            <SiteFooter page="builder" variant="compact" />
          </div>

          <Dock stack={stack} exportRef={exportRef} onExport={() => setSheetOpen(true)} />
        </main>

        {wide ? (
          // The column keeps its width so the grid never reflows. Empty, it's a dashed rule
          // like the badge title's; the panel slides in over it.
          <div className="relative min-h-0 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 border-l-2 border-dashed"
            />
            <Slide open={hasIcons} from="right" className="relative h-full">
              <aside
                aria-label={t.stack.export}
                className="h-full overflow-y-auto border-l bg-card p-6"
              >
                {exportPanel}
              </aside>
            </Slide>
          </div>
        ) : (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent
              onCloseAutoFocus={e => {
                e.preventDefault();
                exportRef.current?.focus();
              }}
            >
              {exportPanel}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
