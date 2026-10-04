import { CodeBlock } from '@/components/code-block';
import { CopyButton } from '@/components/copy-button';
import { SectionLabel } from '@/components/section-label';
import { SiteHeader } from '@/components/site-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/i18n';
import { MCP_URL } from '@/lib/links';

const SERVER_NAME = 'skill-icons';
const ADD_COMMAND = `claude mcp add --transport http ${SERVER_NAME} ${MCP_URL}`;
const MCP_JSON = JSON.stringify(
  { mcpServers: { [SERVER_NAME]: { type: 'http', url: MCP_URL } } },
  null,
  2,
);

/** How to connect the remote MCP server (worker/mcp.ts) to Claude. Served at /mcp, the server URL itself. */
export function McpPage() {
  const { t } = useI18n();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader page="mcp" />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 pt-8 pb-16 lg:pt-14">
          <section className="flex flex-col gap-4">
            <SectionLabel>{t.mcp.eyebrow}</SectionLabel>
            <h2 className="text-[32px] leading-[1.05] font-bold tracking-[-0.03em] text-balance lg:text-[44px]">
              {t.mcp.heading}
            </h2>
            <p className="text-[17px] leading-relaxed text-pretty text-muted-foreground">
              {t.mcp.lede}
            </p>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 lg:p-5">
            <SectionLabel>{t.mcp.serverUrl}</SectionLabel>
            <CodeBlock value={MCP_URL} lang="text" />
            <CopyButton value={MCP_URL} label={t.mcp.copyUrl} />
            <p className="font-mono text-xs text-muted-foreground">{t.mcp.free}</p>
          </section>

          <section className="flex flex-col gap-3">
            <SectionLabel>{t.mcp.install}</SectionLabel>
            <Tabs defaultValue="claude">
              <TabsList aria-label={t.mcp.install}>
                <TabsTrigger value="claude">{t.mcp.clients.claude}</TabsTrigger>
                <TabsTrigger value="code">{t.mcp.clients.code}</TabsTrigger>
              </TabsList>

              <TabsContent value="claude" className="gap-4 pt-2">
                <ol className="flex flex-col gap-3">
                  {t.mcp.claudeSteps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-[15px] leading-snug">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-highlight font-mono text-xs font-semibold text-highlight-foreground">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="font-mono text-xs text-muted-foreground">{t.mcp.claudeNote}</p>
              </TabsContent>

              <TabsContent value="code" className="gap-3 pt-2">
                <p className="text-[15px]">{t.mcp.codeIntro}</p>
                <CodeBlock value={ADD_COMMAND} lang="bash" />
                <CopyButton value={ADD_COMMAND} label={t.mcp.copyCommand} />
                <p className="pt-2 text-[15px]">{t.mcp.codeScope}</p>
                <CodeBlock value={MCP_JSON} lang="json" tall />
                <CopyButton value={MCP_JSON} label={t.mcp.copyConfig} />
              </TabsContent>
            </Tabs>
          </section>

          <section className="flex flex-col gap-3">
            <SectionLabel>{t.mcp.tools}</SectionLabel>
            <ul className="flex flex-col gap-3">
              {t.mcp.toolList.map(tool => (
                <li key={tool.name} className="flex flex-col gap-1.5 rounded-xl border bg-card p-4">
                  <code className="font-mono text-[13px] font-semibold">{tool.name}</code>
                  <p className="text-[15px] leading-snug text-muted-foreground">{tool.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <SectionLabel>{t.mcp.tryIt}</SectionLabel>
            <ul className="flex flex-col gap-2">
              {t.mcp.prompts.map(prompt => (
                <li
                  key={prompt}
                  className="border-l-4 border-highlight py-1 pl-3 text-[15px] leading-snug"
                >
                  “{prompt}”
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
