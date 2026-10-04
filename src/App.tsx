import { IconPicker } from '@/components/icon-picker';
import { Options } from '@/components/options';
import { Output } from '@/components/output';
import { SelectedIcons } from '@/components/selected-icons';
import { SiteHeader } from '@/components/site-header';
import { useBuilderState } from '@/hooks/use-builder-state';
import { useI18n } from '@/i18n';

export function App() {
  const { state, toggleIcon, moveIcon, clearIcons, setTheme, setPerLine } = useBuilderState();
  const { t } = useI18n();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[232px_minmax(0,1fr)_400px] lg:overflow-hidden">
        <main className="flex flex-col gap-5 px-4 pt-4 pb-6 lg:col-span-2 lg:min-h-0 lg:overflow-y-auto lg:px-7 lg:pt-6 lg:pb-10">
          <IconPicker selected={state.icons} theme={state.theme} onToggle={toggleIcon} />
        </main>

        <aside className="flex flex-col gap-6 border-t bg-card p-4 lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:border-l lg:p-6">
          <SelectedIcons
            icons={state.icons}
            theme={state.theme}
            onRemove={toggleIcon}
            onMove={moveIcon}
            onClear={clearIcons}
          />
          <Options
            theme={state.theme}
            perLine={state.perLine}
            onThemeChange={setTheme}
            onPerLineChange={setPerLine}
          />
          {state.icons.length > 0 ? (
            <Output icons={state.icons} theme={state.theme} perLine={state.perLine} />
          ) : (
            <p className="text-sm text-muted-foreground">{t.steps.emptyPreview}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
