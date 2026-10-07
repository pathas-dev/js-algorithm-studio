import SpaceSky from './SpaceSky';

export default function LoadingScreen() {
  const english = new URLSearchParams(location.search).get('lang') === 'en';
  return <main className="studio-loading" aria-label={english ? 'Algorithms, for what it’s worth' : '이젠 아무래도 좋을 알고리즘'}>
    <SpaceSky />
    <div className="loading-content">
      <div className="brand loading-brand"><img className="brand-mark" src="/favicon.svg" width="32" height="32" alt="" />{english ? 'Algorithms, for what it’s worth' : '이젠 아무래도 좋을 알고리즘'}</div>
      <div className="loading-orbit" aria-hidden="true"><span className="loading-planet" /><span className="loading-moon" /></div>
      <div className="loading-status" role="status" aria-live="polite"><p>{english ? 'Gathering a little universe' : '작은 우주를 모으는 중'}<span aria-hidden="true">…</span></p><span>{english ? 'Loading…' : '불러오는 중…'}</span></div>
    </div>
  </main>;
}
