import { palette } from "@/tokens/colours";
import { ThemeToggle } from "./theme-toggle";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-8 py-24">
        <header className="flex items-baseline justify-between border-b border-border pb-8 mb-24">
          <div>
            <p className="font-sans text-caption uppercase text-muted">
              v0.1 — step 2
            </p>
            <h1 className="font-serif text-display mt-4">Design system</h1>
          </div>
          <ThemeToggle />
        </header>

        <Section label="Typography">
          <div className="space-y-12">
            <TypeRow meta="display · serif" className="font-serif text-display">
              Strategy, taste, and code.
            </TypeRow>
            <TypeRow meta="h1 · serif" className="font-serif text-h1">
              Built with all three.
            </TypeRow>
            <TypeRow meta="h1 · sans" className="font-sans text-h1">
              Built with all three.
            </TypeRow>
            <TypeRow
              meta="h2 · sans · medium"
              className="font-sans text-h2 font-medium"
            >
              Selected work
            </TypeRow>
            <TypeRow
              meta="h3 · sans · medium"
              className="font-sans text-h3 font-medium"
            >
              Agent · Product · Brand
            </TypeRow>
            <TypeRow
              meta="body-lg · sans"
              className="font-sans text-body-lg max-w-prose"
            >
              Most AI gets built by people who only have one. I build products
              with all three — for companies that care how AI feels, not just
              what it does.
            </TypeRow>
            <TypeRow
              meta="body · sans"
              className="font-sans text-body max-w-prose"
            >
              Short, declarative, weighted sentences. Elegant typography doing
              most of the work.
            </TypeRow>
            <TypeRow
              meta="small · sans · muted"
              className="font-sans text-small text-muted max-w-prose"
            >
              Supporting detail, captions, metadata.
            </TypeRow>
            <TypeRow
              meta="caption · sans · muted"
              className="font-sans text-caption uppercase text-muted"
            >
              Ex-Google · Founder · Builder
            </TypeRow>
          </div>
        </Section>

        <Section label="Colour — semantic">
          <p className="font-sans text-small text-muted mb-8 max-w-prose">
            Theme-aware tokens. Values swap when [data-theme=&quot;light&quot;]
            is set on &lt;html&gt;. Toggle above to preview.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Swatch token="background" css="bg-background" bordered />
            <Swatch token="foreground" css="bg-foreground" />
            <Swatch token="muted" css="bg-muted" />
            <Swatch token="border" css="bg-border" />
            <Swatch token="surface" css="bg-surface" bordered />
            <Swatch token="accent" css="bg-accent" />
          </div>
        </Section>

        <Section label="Colour — palette">
          <p className="font-sans text-small text-muted mb-8 max-w-prose">
            Fixed values. These don&apos;t change with theme; semantic tokens
            above are composed from them.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            <Swatch token="ink" color={palette.ink} />
            <Swatch token="paper" color={palette.paper} bordered />
            <Swatch token="clay" color={palette.clay.DEFAULT} />
            <Swatch token="clay-hover" color={palette.clay.hover} />
            <span />
            <span />
            {Object.entries(palette.grey).map(([k, v]) => (
              <Swatch
                key={k}
                token={`grey-${k}`}
                color={v}
                bordered={Number(k) <= 100}
              />
            ))}
          </div>
        </Section>

        <Section label="Spacing rhythm">
          <p className="font-sans text-small text-muted mb-8 max-w-prose">
            Tailwind&apos;s 4px base, disciplined to multiples of 8 for page
            rhythm.
          </p>
          <div className="space-y-3">
            {[2, 4, 8, 12, 16, 24, 32, 48].map((n) => (
              <div key={n} className="flex items-center gap-6">
                <span className="font-sans text-caption w-24 text-muted">
                  {n} · {n * 4}px
                </span>
                <div
                  className="h-3 bg-accent"
                  style={{ width: `${n * 4}px` }}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section label="Motion">
          <dl className="text-small font-sans border-t border-border">
            <MotionRow label="duration / fast" value="150ms" />
            <MotionRow label="duration / base" value="300ms" />
            <MotionRow label="duration / slow" value="600ms" />
            <MotionRow
              label="ease / out-soft"
              value="cubic-bezier(0.22, 1, 0.36, 1)"
            />
            <MotionRow
              label="ease / out-expo"
              value="cubic-bezier(0.16, 1, 0.3, 1)"
            />
          </dl>
        </Section>

        <footer className="pt-16 border-t border-border">
          <p className="font-sans text-caption uppercase text-muted">
            preview route · delete before launch
          </p>
        </footer>
      </div>
    </main>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-32">
      <h2 className="font-sans text-caption uppercase text-muted mb-12">
        {label}
      </h2>
      {children}
    </section>
  );
}

function TypeRow({
  meta,
  className,
  children,
}: {
  meta: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-[10rem_1fr] gap-4 items-baseline">
      <span className="font-sans text-caption text-muted uppercase">
        {meta}
      </span>
      <div className={className}>{children}</div>
    </div>
  );
}

function Swatch({
  token,
  css,
  color,
  bordered,
}: {
  token: string;
  css?: string;
  color?: string;
  bordered?: boolean;
}) {
  const borderClass = bordered ? "border border-border" : "";
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-20 ${css ?? ""} ${borderClass}`}
        style={color ? { backgroundColor: color } : undefined}
      />
      <span className="font-sans text-caption text-muted">{token}</span>
      {color && (
        <span className="font-sans text-caption text-muted opacity-60">
          {color}
        </span>
      )}
    </div>
  );
}

function MotionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[14rem_1fr] gap-4 border-b border-border py-3">
      <dt className="text-muted">{label}</dt>
      <dd
        className="text-foreground"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
      >
        {value}
      </dd>
    </div>
  );
}
