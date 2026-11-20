document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealTargets = document.querySelectorAll('.object-card, .flow-step, .rule-panel');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
revealTargets.forEach((target) => observer.observe(target));

// Host cards flip between the portrait front and a printed-style information back.
const hostCardStyles = document.createElement('style');
hostCardStyles.textContent = `
.host-card{aspect-ratio:519 / 708;min-height:0;perspective:1200px;cursor:pointer;outline:none;background:transparent;border:0;border-radius:14px;overflow:visible;box-shadow:none}
.host-card:hover{transform:translateY(-8px) rotate(-.5deg);box-shadow:none}
.host-card:focus-visible{box-shadow:0 0 0 4px rgba(184,130,220,.45);border-radius:14px}
.host-card-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.72,.2,1)}
.host-card.is-flipped .host-card-inner{transform:rotateY(180deg)}
.host-card-face{position:absolute;inset:0;min-height:390px;backface-visibility:hidden;border:1px solid rgba(81,48,106,.28);border-radius:14px;overflow:hidden;box-shadow:0 16px 28px rgba(48,24,66,.12)}
.host-card-front{background:linear-gradient(150deg,#24152f 0%,#57376e 58%,#a27fba 100%);display:flex;flex-direction:column;justify-content:flex-end}
.host-card:nth-child(2n) .host-card-front{background:linear-gradient(150deg,#32182f 0%,#713f65 55%,#c293ad 100%)}
.host-card:nth-child(3n) .host-card-front{background:linear-gradient(150deg,#21172f 0%,#4c306b 55%,#9679b2 100%)}
.host-card-back{transform:rotateY(180deg);background:#fff;display:block;padding:0}
.host-card-back-image{display:block;width:100%;height:100%;object-fit:fill}
.host-card-image:before{display:none}
.host-card-back-mark,.host-card-back-hint{font:600 9px var(--display);letter-spacing:.16em;color:#79528e}.host-card-back-no{font:600 50px var(--display);line-height:1;color:#8f65a8;position:absolute;top:45px;left:22px}.host-card-back-crest{font-size:62px;line-height:1;text-align:center;color:#80529a;margin-top:38px}.host-card-back-copy{border-top:1px solid rgba(81,48,106,.26);border-bottom:1px solid rgba(81,48,106,.26);padding:20px 0;margin:8px 0;text-align:center}.host-card-back-copy small{font:600 10px var(--display);letter-spacing:.2em;color:#8f65a8}.host-card-back-copy strong{display:block;font-size:21px;line-height:1.55;letter-spacing:.12em;margin:12px 0}.host-card-back-copy span{font:600 10px var(--display);letter-spacing:.16em;color:#79528e}
.host-card-image{height:auto;min-height:0;flex:1}.host-card-01 .host-card-image img,.host-card-02 .host-card-image img,.host-card-03 .host-card-image img{width:100%;height:100%;object-fit:contain;border-radius:14px;transform:translate(-16px,24px) scale(1.14)}.host-card:hover .host-card-image img{transform:translate(-16px,24px) scale(1.18)}.host-card-03 .host-card-image img{transform:translate(-20px,24px) scale(1.14)}.host-card-03:hover .host-card-image img{transform:translate(-20px,24px) scale(1.18)}.host-card-meta{background:linear-gradient(180deg,rgba(31,17,42,0),rgba(31,17,42,.72) 30%)}.host-gallery-note{margin:110px 0 0;text-align:center;color:var(--violet);font-family:var(--serif);font-size:clamp(22px,2.8vw,32px);font-weight:700;letter-spacing:.06em}
@media(max-width:800px){.host-card-image{height:auto;min-height:0}}
`;
document.head.append(hostCardStyles);

document.querySelectorAll('.host-card').forEach((card, index) => {
  const image = card.querySelector('.host-card-image');
  const meta = card.querySelector('.host-card-meta');
  if (!image || !meta) return;

  const cardNo = String(index + 1).padStart(2, '0');
  const role = meta.querySelector('small')?.textContent || 'THE NIGHT PLAYER';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `ホストカード ${cardNo}。タップして裏面を見る`);

  const inner = document.createElement('div');
  inner.className = 'host-card-inner';
  const front = document.createElement('div');
  front.className = 'host-card-face host-card-front';
  const back = document.createElement('div');
  back.className = 'host-card-face host-card-back';
  front.append(image, meta);
  back.innerHTML = `<img class="host-card-back-image" src="card-ura.png" alt="ホストカードの裏面素材">`;
  inner.append(front, back);
  card.replaceChildren(inner);

  const toggle = () => {
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
    card.setAttribute('aria-label', flipped ? `ホストカード ${cardNo}。タップして写真を見る` : `ホストカード ${cardNo}。タップして裏面を見る`);
  };
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
  });
});
