import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconPicker } from '@/components/icon-picker';
import { LanguagePicker } from '@/components/language-picker';
import { Options } from '@/components/options';
import { Output } from '@/components/output';
import { SelectedIcons } from '@/components/selected-icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { useBuilderState } from '@/hooks/use-builder-state';
import { useI18n } from '@/i18n';

const REPO_URL = 'https://github.com/Hoyasumii/skill-icons';

export function App() {
  const { state, toggleIcon, moveIcon, clearIcons, setTheme, setPerLine } = useBuilderState();
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-8 px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{t.header.title}</h1>
          <p className="mt-1 text-muted-foreground">{t.header.tagline}</p>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={REPO_URL}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          <LanguagePicker />
          <ThemeToggle />
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{t.steps.choose}</CardTitle>
            <CardDescription>{t.steps.chooseDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <IconPicker selected={state.icons} theme={state.theme} onToggle={toggleIcon} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.steps.customize}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.steps.copy}</CardTitle>
              <CardDescription>{t.steps.copyDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              {state.icons.length > 0 ? (
                <Output icons={state.icons} theme={state.theme} perLine={state.perLine} />
              ) : (
                <p className="text-sm text-muted-foreground">{t.steps.emptyPreview}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
