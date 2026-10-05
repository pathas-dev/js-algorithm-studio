import { useEffect, useMemo, useRef, useState } from 'react';
import type { ThemedToken } from 'shiki';

const highlighter = Promise.all([
  import('shiki/core'), import('shiki/engine/javascript'),
  import('shiki/langs/javascript.mjs'), import('shiki/themes/github-dark.mjs'),
]).then(([core, engine, javascript, dark]) => core.createHighlighterCore({
  themes: [dark.default], langs: [javascript.default], engine: engine.createJavaScriptRegexEngine(),
}));

export default function CodePanel({ source, activeCode, language }: { source: string; activeCode: string; language: 'ko' | 'en' }) {
  const [tokens, setTokens] = useState<ThemedToken[][]>();
  const scroller = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLSpanElement>(null);
  const lines = useMemo(() => source.trimEnd().split('\n'), [source]);
  const lineIndex = lines.findIndex((line) => line.includes(activeCode));
  useEffect(() => {
    let cancelled = false;
    setTokens(undefined);
    highlighter.then((engine) => {
      const result = engine.codeToTokens(source.trimEnd(), { lang: 'javascript', theme: 'github-dark' });
      if (!cancelled) setTokens(result.tokens);
    }).catch(() => { /* Plain source remains readable if highlighting fails. */ });
    return () => { cancelled = true; };
  }, [source]);
  useEffect(() => {
    const centerActiveLine = () => {
      if (active.current && scroller.current) {
        scroller.current.scrollTop = Math.max(0, active.current.offsetTop - scroller.current.clientHeight / 2);
      }
    };
    centerActiveLine();
    const observer = new ResizeObserver(centerActiveLine);
    if (scroller.current) observer.observe(scroller.current);
    return () => observer.disconnect();
  }, [lineIndex, tokens]);
  return (
    <section className="source-panel" aria-label={language === 'ko' ? '실행 코드' : 'Executing code'}>
      <div className="source-heading"><span>JavaScript</span><span>{language === 'ko' ? '실행 위치' : 'Executing line'} {lineIndex + 1}</span></div>
      <div className="source-scroll" ref={scroller} tabIndex={0}>
        <pre><code>{lines.map((line, index) => (
          <span className={`code-line ${index === lineIndex ? 'active-line' : ''}`} key={index} ref={index === lineIndex ? active : undefined} aria-current={index === lineIndex ? 'step' : undefined}>
            <span className="line-number" aria-hidden="true">{index + 1}</span>
            <span className="code-content">{tokens?.[index] ? tokens[index].map((token, tokenIndex) => <span key={tokenIndex} style={{ color: token.color?.toLowerCase() === '#6a737d' ? '#9db3a5' : token.color }}>{token.content}</span>) : line || ' '}</span>
          </span>
        ))}</code></pre>
      </div>
    </section>
  );
}
