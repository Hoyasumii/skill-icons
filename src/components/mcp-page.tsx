import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '@/components/code-block';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCopy } from '@/hooks/use-copy';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useI18n } from '@/i18n';
import type { Code } from '@/i18n/messages/en';
import { MCP_URL } from '@/lib/links';
import { cn } from '@/lib/utils';
import {
  BADGE_TOOL,
  buildBadge,
  CATEGORY_IDS,
  ICON_COUNT,
  MAX_SUGGESTIONS,
  MCP_EXAMPLES,
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  RESOLUTION_EXAMPLES,
  SEARCH_DEFAULT_LIMIT,
  SEARCH_TOOL,
  searchIcons,
  type McpAnswer,
} from '../../shared/mcp';
import { DEFAULT_PER_LINE, DEFAULT_THEME, MAX_PER_LINE, MIN_PER_LINE } from '../../shared/icons';

const json = (value: unknown) => JSON.stringify(value, null, 2);
/** Exactly the text the server answers with (worker/mcp.ts sends the same JSON). */
const answer = ({ data }: McpAnswer) => json(data);
/** `{ "query": "postgres" }`, for an example's title. */
const inline = (value: unknown) => JSON.stringify(value).replace(/([{:,])/g, '$1 ').replace(/}$/, ' }');

const CLIENTS = {
  claudeCode: {
    lang: 'bash',
    config: `claude mcp add --transport http ${MCP_SERVER_NAME} ${MCP_URL}`,
  },
  cursor: { lang: 'json', config: json({ mcpServers: { [MCP_SERVER_NAME]: { url: MCP_URL } } }) },
  vscode: {
    lang: 'json',
    config: json({ servers: { [MCP_SERVER_NAME]: { type: 'http', url: MCP_URL } } }),
  },
  other: { lang: 'text', config: MCP_URL },
} as const;
type ClientId = keyof typeof CLIENTS;

const SECTION = {
  overview: 'overview',
  install: 'install',
  search: 'search',
  badge: 'badge',
  why: 'why',
};

/** In MCP_EXAMPLES.badge, the trailing "ts" repeats "typescript" and is dropped. */
const [REPEATED_KEPT, REPEATED] = ['typescript', 'ts'];

const code: Code = text => (
  <code key={text} className="font-mono text-[0.9em] font-semibold">
    {text}
  </code>
);

/** How to connect and use the remote MCP server (worker/mcp.ts). Served at /mcp, the server URL itself. */
export function McpPage() {
  const { t } = useI18n();
  useDocumentMeta(t.mcp.meta);

  const toc = [
    { id: SECTION.overview, label: t.mcp.nav.overview },
    { id: SECTION.install, label: t.mcp.nav.install },
    { id: SECTION.search, label: SEARCH_TOOL, mono: true },
    { id: SECTION.badge, label: BADGE_TOOL, mono: true },
    { id: SECTION.why, label: t.mcp.nav.why },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader page="mcp" className="sticky top-0" />

      <div className="mx-auto flex w-full max-w-[1152px] flex-1 flex-wrap items-start gap-12 px-4 pt-10 pb-20">
        <nav aria-labelledby="mcp-toc" className="flex max-w-[232px] flex-[1_1_200px] flex-col gap-1">
          <span
            id="mcp-toc"
            className="px-2.5 pb-2 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase"
          >
            {t.mcp.toc}
          </span>
          {toc.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'flex h-11 items-center rounded-sm px-2.5 text-[15px] text-foreground no-underline hover:bg-muted lg:h-9',
                item.mono && 'font-mono text-[13px]',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <main className="flex max-w-[780px] min-w-0 flex-[999_1_560px] flex-col gap-14">
          <Overview />
          <Install />
          <SearchTool />
          <BadgeTool />
          <Why />
        </main>
      </div>
    </div>
  );
}

function Overview() {
  const { t } = useI18n();
  const { copied, copy } = useCopy();

  return (
    <section id={SECTION.overview} className="flex scroll-mt-20 flex-col gap-5">
      <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {t.mcp.eyebrow(MCP_SERVER_VERSION)}
      </span>
      <h1 className="isolate text-[36px] leading-[1.1] font-bold tracking-[-0.035em] text-balance lg:text-[52px] lg:leading-[1.05]">
        {t.mcp.heading.before}
        {/* Behind the line above, so its descenders stay visible. */}
        <span className="relative -z-10 bg-highlight px-1.5 text-highlight-foreground [box-decoration-break:clone]">
          {t.mcp.heading.highlight}
        </span>
        {t.mcp.heading.after}
      </h1>
      <p className="max-w-[640px] text-lg leading-[27px] text-pretty text-muted-foreground">
        {t.mcp.lead(ICON_COUNT)}
      </p>
      <ul className="flex flex-wrap gap-2">
        {t.mcp.chips.map(chip => (
          <li
            key={chip}
            className="inline-flex h-8 items-center rounded-full border-2 border-border bg-card px-3 text-sm"
          >
            {chip}
          </li>
        ))}
        <li className="inline-flex h-8 items-center rounded-full border-2 border-foreground bg-highlight px-3 text-sm font-semibold text-highlight-foreground">
          {t.mcp.toolsChip(2)}
        </li>
      </ul>
      <div className="flex flex-col gap-2">
        <span
          id="mcp-endpoint"
          className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase"
        >
          {t.mcp.endpoint}
        </span>
        <div className="flex items-stretch gap-2">
          <code
            aria-labelledby="mcp-endpoint"
            className="flex min-h-13 min-w-0 flex-1 items-center rounded-lg border-2 border-foreground bg-card px-3.5 py-3 font-mono text-[15px] break-all"
          >
            {MCP_URL}
          </code>
          <Button
            variant="highlight"
            onClick={() => copy(MCP_URL)}
            className={cn(
              'h-auto min-h-13 min-w-[100px] shrink-0 rounded-lg sm:min-w-[120px] px-4 text-base font-bold',
              copied &&
                'translate-x-[3px] translate-y-[3px] bg-foreground text-background shadow-none hover:bg-foreground',
            )}
          >
            <span aria-live="polite">{copied ? t.mcp.copied : t.mcp.copy}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Install() {
  const { t } = useI18n();
  const [client, setClient] = useState<ClientId>('claudeCode');
  const ids = Object.keys(CLIENTS) as ClientId[];

  return (
    <section id={SECTION.install} className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="text-[32px] font-bold tracking-[-0.02em]">{t.mcp.install.title}</h2>
      <p className="text-base leading-6 text-muted-foreground">{t.mcp.install.intro}</p>
      <Tabs value={client} onValueChange={value => setClient(value as ClientId)} className="gap-4">
        <TabsList
          aria-label={t.mcp.install.label}
          className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-1.5"
        >
          {ids.map(id => (
            <TabsTrigger key={id} value={id}>
              {t.mcp.install.clients[id]}
            </TabsTrigger>
          ))}
        </TabsList>
        {ids.map(id => (
          <TabsContent key={id} value={id} className="gap-4">
            <p className="text-[15px] leading-[22px]">{t.mcp.install.hints[id](code)}</p>
            <div className="relative">
              <CodeBlock
                value={CLIENTS[id].config}
                lang={CLIENTS[id].lang}
                size="full"
                className="[&_pre]:p-3.5! [&_pre]:pr-16! [&_pre]:leading-5!"
              />
              <CopyIconButton key={id} value={CLIENTS[id].config} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function CopyIconButton({ value }: { value: string }) {
  const { t } = useI18n();
  const { copied, copy } = useCopy();
  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <Button
      variant="hairline"
      size="icon"
      aria-label={copied ? t.mcp.install.copied : t.mcp.install.copy}
      onClick={() => copy(value)}
      className={cn(
        'absolute top-2 right-2 bg-card',
        copied && 'bg-foreground text-background hover:bg-foreground',
      )}
    >
      <Icon strokeWidth={copied ? 2.6 : 2.2} />
    </Button>
  );
}

interface Param {
  name: string;
  required?: boolean;
  type: string;
  defaultValue?: string;
  description: string;
}

function ToolCard({
  id,
  name,
  summary,
  params,
  children,
}: {
  id: string;
  name: string;
  summary: ReactNode;
  params: Param[];
  children: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <section
      id={id}
      className="flex scroll-mt-20 flex-col gap-[18px] rounded-[16px] border bg-card p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-[22px] font-semibold break-all">{name}</h2>
        <span className="inline-flex h-7 items-center rounded-full bg-foreground px-2.5 font-mono text-xs text-background">
          {t.mcp.readOnly}
        </span>
      </div>
      <p className="text-[17px] leading-[25px]">{summary}</p>
      <Block title={t.mcp.params}>
        <dl className="flex flex-col overflow-hidden rounded-lg border">
          {params.map(param => (
            <div
              key={param.name}
              className="flex flex-wrap gap-x-4 gap-y-1.5 border-b p-3.5 last:border-b-0"
            >
              <dt className="flex flex-[1_1_180px] flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-[15px] font-semibold">{param.name}</code>
                  <span
                    className={cn(
                      'inline-flex h-[22px] items-center rounded-full px-2 font-mono text-[11px]',
                      param.required
                        ? 'bg-foreground text-background'
                        : 'border bg-card text-muted-foreground',
                    )}
                  >
                    {param.required ? t.mcp.required : t.mcp.optional}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {t.mcp.withDefault(param.type, param.defaultValue ?? '—')}
                </span>
              </dt>
              <dd className="flex-[2_1_260px] text-[15px] leading-[22px]">{param.description}</dd>
            </div>
          ))}
        </dl>
      </Block>
      {children}
    </section>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Example({ value }: { value: string }) {
  return <CodeBlock value={value} lang="json" size="full" className="[&_pre]:p-3.5! [&_pre]:leading-5!" />;
}

function Note({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs leading-[18px] text-muted-foreground">{children}</p>;
}

function NumberedList({ items, accent }: { items: [ReactNode, ReactNode][]; accent?: boolean }) {
  return (
    <ol className="flex flex-col gap-1.5">
      {items.map(([term, text], index) => (
        <li key={index} className="flex items-baseline gap-2.5 text-[15px] leading-[22px]">
          <span
            className={cn(
              'inline-flex h-[22px] min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-semibold',
              accent ? 'bg-highlight text-highlight-foreground' : 'bg-foreground text-background',
            )}
          >
            {index + 1}
          </span>
          <span className="min-w-0">
            <code className="font-mono text-sm font-semibold break-words">{term}</code> — {text}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SearchTool() {
  const { t } = useI18n();
  const s = t.mcp.search;
  const fields = Object.entries(s.fieldList) as [string, string][];

  return (
    <ToolCard
      id={SECTION.search}
      name={SEARCH_TOOL}
      summary={s.summary(code, ICON_COUNT)}
      params={[
        { name: 'query', type: 'string', description: s.params.query },
        { name: 'category', type: 'enum', description: s.params.category },
        {
          name: 'limit',
          type: t.mcp.integer(1, ICON_COUNT),
          defaultValue: String(SEARCH_DEFAULT_LIMIT),
          description: s.params.limit,
        },
      ]}
    >
      <Block title={s.categories}>
        <ul className="flex flex-wrap gap-1.5">
          {CATEGORY_IDS.map(category => (
            <li key={category}>
              <code className="inline-flex h-7 items-center rounded-full border bg-background px-2.5 font-mono text-xs">
                {category}
              </code>
            </li>
          ))}
        </ul>
      </Block>
      <Block title={s.fields}>
        <NumberedList items={fields} />
        <Note>{s.fieldsNote(code)}</Note>
      </Block>
      <Block title={t.mcp.example(inline(MCP_EXAMPLES.search))}>
        <Example value={answer(searchIcons(MCP_EXAMPLES.search))} />
      </Block>
      <Block title={s.noMatch}>
        <p className="text-[15px] leading-[23px]">{s.noMatchText(MAX_SUGGESTIONS)}</p>
        <Example value={answer(searchIcons(MCP_EXAMPLES.searchNoMatch))} />
      </Block>
    </ToolCard>
  );
}

function BadgeTool() {
  const { t } = useI18n();
  const b = t.mcp.badge;
  const steps = RESOLUTION_EXAMPLES.map(
    (examples, index): [ReactNode, ReactNode] => [
      examples
        .map(([input, id]) => (input.toLowerCase() === id ? input : `${input} → ${id}`))
        .join(' · '),
      b.resolutionSteps[index],
    ],
  );

  return (
    <ToolCard
      id={SECTION.badge}
      name={BADGE_TOOL}
      summary={b.summary}
      params={[
        {
          name: 'icons',
          required: true,
          type: t.mcp.atLeast('string[]', 1),
          description: b.params.icons,
        },
        {
          name: 'theme',
          type: '"dark" | "light"',
          defaultValue: `"${DEFAULT_THEME}"`,
          description: b.params.theme,
        },
        {
          name: 'perLine',
          type: t.mcp.integer(MIN_PER_LINE, MAX_PER_LINE),
          defaultValue: String(DEFAULT_PER_LINE),
          description: b.params.perLine,
        },
      ]}
    >
      <Block title={b.resolution}>
        <NumberedList items={steps} accent />
        <Note>{b.resolutionNote}</Note>
      </Block>
      <Block title={b.input}>
        <Example value={json(MCP_EXAMPLES.badge)} />
      </Block>
      <Block title={b.output}>
        <Example value={answer(buildBadge(MCP_EXAMPLES.badge))} />
        <Note>{b.outputNote(code, REPEATED, REPEATED_KEPT)}</Note>
      </Block>
      <Block title={b.unknown}>
        <p className="text-[15px] leading-[23px]">{b.unknownText(code, MAX_SUGGESTIONS)}</p>
        <Example value={answer(buildBadge(MCP_EXAMPLES.badgeUnknown))} />
      </Block>
      <Block title={b.none}>
        <p className="text-[15px] leading-[23px]">{b.noneText(code)}</p>
        <Example value={answer(buildBadge(MCP_EXAMPLES.badgeNone))} />
      </Block>
    </ToolCard>
  );
}

function Why() {
  const { t } = useI18n();

  return (
    <section
      id={SECTION.why}
      className="flex scroll-mt-20 flex-col gap-3.5 rounded-[16px] border-2 border-foreground bg-highlight p-4 text-highlight-foreground shadow-[4px_4px_0_var(--foreground)] sm:p-6"
    >
      <h2 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-balance">
        {t.mcp.why.title}
      </h2>
      <p className="text-[17px] leading-[26px]">{t.mcp.why.text(code)}</p>
      <a
        href={import.meta.env.BASE_URL}
        className="inline-flex min-h-12 items-center self-start rounded-lg border-2 border-highlight-foreground bg-highlight-foreground px-[18px] py-2 text-base font-bold text-highlight no-underline hover:opacity-90"
      >
        {t.mcp.why.cta}
      </a>
    </section>
  );
}
