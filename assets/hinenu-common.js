/* =====================================================================
   hinenu-common.js — the parts that must look and behave the same on
   every page: the site footer (back to top → partners → book a lecture →
   contact), the accessibility toolbar, and the idle scroll cue.

   Loaded as a plain (non-defer) <script> right before each page's own
   inline script, so the markup exists by the time that script wires the
   language toggle: every string here carries data-en / data-en-html and
   is translated by the page's own applyLang().

   Per-page opt-outs live on the script tag:
     data-lecture="no"    skip the "book a lecture" band (the lectures page)
     data-apply="…"       href for "leave your details" (default: the
                          page's own apply modal, via [data-apply])
   ===================================================================== */
(function(){
  "use strict";

  var me   = document.currentScript;
  var base = me ? me.src.replace(/assets\/hinenu-common\.js.*$/, '') : '';
  var opt  = function(name, dflt){
    var v = me && me.getAttribute('data-' + name);
    return (v === null || v === undefined) ? dflt : v;
  };
  var wantLecture = opt('lecture', 'yes') !== 'no';
  var applyHref   = opt('apply', '');           /* '' = use the page's own apply modal */
  /* the contact form itself - Google shows its own confirmation on submit */
  var CONTACT_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLScwekWYxeq32W6NTyIqAtag3YfI4pgbmclfrPuLaL5WLtj-pA/viewform';

  var WA   = 'https://chat.whatsapp.com/CubXiRIeUYWAgvHBDRQHbx?mode=gi_t';
  var IG   = 'https://www.instagram.com/hinenu_israel';
  var FB   = 'https://www.facebook.com/p/%D7%94%D7%A0%D7%A0%D7%95%D6%BC-61565788381476/';
  var MAIL = 'roee@hinenu.org.il';
  var MAIL_SHAKED = 'shaked@hinenu.org.il';
  var A11Y_MAIL = 'romishmuelov@gmail.com';
  var a11yHref  = base + 'mitzpe-gvolot/accessibility.html';

  /* ---------- icons (stroked, on a 24px grid — no rounded-box chrome) ---------- */
  var ICON = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 5.5h19v13h-19z"/><path d="M2.5 6l9.5 7 9.5-7"/></svg>',
    ig:   '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="4.6"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none"/></svg>',
    wa:   '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.6z"/><path d="M9 8.6c.3-.1.6 0 .8.3l.8 1.4c.1.3.1.6-.1.8l-.5.6c-.1.2-.2.4 0 .7.4.7 1.2 1.5 1.9 1.9.3.2.5.1.7-.1l.6-.5c.2-.2.5-.2.8-.1l1.4.8c.3.2.4.5.3.8-.2.7-.9 1.3-1.7 1.4-2.6.2-6.2-3.4-6-6 .1-.8.6-1.5 1.3-1.7z" fill="currentColor" stroke="none"/></svg>',
    form: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 2.8h14v18.4H5z"/><path d="M8.4 8h7.2M8.4 12h7.2M8.4 16h4.4"/></svg>',
    up:   '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20V5"/><path d="M5.4 11.4 12 4.7l6.6 6.7"/></svg>',
    mic:  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.8a2.9 2.9 0 0 1 2.9 2.9v6a2.9 2.9 0 0 1-5.8 0v-6A2.9 2.9 0 0 1 12 2.8z"/><path d="M5.6 11.3a6.4 6.4 0 0 0 12.8 0"/><path d="M12 17.7V21M8.6 21h6.8"/></svg>',
    fb:   '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="4.6"/><path d="M15.4 8.2h-1.6c-.9 0-1.5.6-1.5 1.5V11h3l-.4 2.6h-2.6V21"/><path d="M10 13.6h2.3"/></svg>',
    a11y: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="4.3" r="1.9" fill="currentColor" stroke="none"/><path d="M4.4 8.2h15.2"/><path d="M12 8.6v5.2"/><path d="m12 13.8-3 7.1M12 13.8l3 7.1"/></svg>'
  };

  /* ---------- the partners, one list for the whole site ---------- */
  var PARTNERS = [
    ['b-pershing.png',   'Pershing Square Philanthropies',   'Pershing Square Philanthropies',   0],
    ['l-uja.svg',        'UJA-Federation of New York',       'UJA-Federation of New York',       1],
    ['b-juf.jpg',        'Jewish United Fund',               'Jewish United Fund',               0],
    ['l-bayarea.webp',   'JCF Bay Area',                     'JCF Bay Area',                     0],
    ['l-jfedla.webp',    'Jewish Federation of Los Angeles', 'Jewish Federation of Los Angeles', 0],
    ['l-metrowest.webp', 'JCF MetroWest',                    'JCF MetroWest',                    0],
    ['l-natan.webp',     'Natan Fund',                       'Natan Fund',                       0],
    ['l-anfield.webp',   'Anfield Ltd',                      'Anfield Ltd',                      0],
    ['b-rothschild.png', 'קרן אדמונד דה רוטשילד',              'Edmond de Rothschild Foundation',  0],
    ['l-berkowitz.webp', 'Berkowitz Family Foundation',      'Berkowitz Family Foundation',      0],
    ['p-hashomer.png',   'השומר החדש',                        'HaShomer HaChadash',               0],
    ['p-lev-echad.png',  'לב אחד',                            'Lev Echad',                        0],
    ['p-machlifim.png',  'מחליפים מילה',                      'Machlifim Mila',                   0],
    ['p-homeward.png',   'הביתה',                             'Homeward',                         0],
    ['p-tkuma.png',      'מנהלת תקומה',                       'Tkuma Administration',             0],
    ['p-honey.jpg',      'The Honey Foundation for Israel',  'The Honey Foundation for Israel',  0],
    ['l-hapoalim.svg',   'בנק הפועלים',                       'Bank Hapoalim',                    1]
  ];

  function esc(s){ return String(s).replace(/"/g, '&quot;'); }

  function partnerGroup(dup){
    return PARTNERS.map(function(p){
      return '<span class="hn-logo"' + (dup ? ' aria-hidden="true"' : '') + '>' +
               '<img src="' + base + 'assets/' + p[0] + '"' + (p[3] ? ' class="slim"' : '') +
                    ' alt="' + (dup ? '' : esc(p[1])) + '"' +
                    (dup ? '' : ' data-en-alt="' + esc(p[2]) + '"') +
                    ' loading="lazy" decoding="async">' +
               '<em class="hn-logo-name" data-en="' + esc(p[2]) + '">' + p[1] + '</em>' +
             '</span>';
    }).join('');
  }

  /* ---------- styles ---------- */
  var css = [
'.hn-foot{background:#000;padding:0;color:#F2F0E9;font-family:"Heebo","Rubik",system-ui,-apple-system,"Segoe UI",sans-serif;font-weight:400;border-top:1px solid rgba(242,240,233,.14);position:relative;z-index:5}',
'.hn-foot *{box-sizing:border-box}',
'.hn-foot a{color:inherit;font-weight:inherit}',
'.hn-in{max-width:1180px;margin:0 auto;padding:0 24px}',

/* partners */
'.hn-partners{padding:26px 0 30px;text-align:center}',
'.hn-lbl{margin:0 0 22px;font-weight:800;font-size:12.5px;letter-spacing:3px;color:#fff}',
'.hn-marquee{position:relative;overflow:hidden;direction:ltr}',
'.hn-marquee::before,.hn-marquee::after{content:"";position:absolute;top:0;bottom:0;width:90px;z-index:2;pointer-events:none}',
'.hn-marquee::before{left:0;background:linear-gradient(to right,#000,transparent)}',
'.hn-marquee::after{right:0;background:linear-gradient(to left,#000,transparent)}',
'.hn-track{display:flex;width:max-content;animation:hnMarq 46s linear infinite}',
'.hn-marquee:hover .hn-track,.hn-marquee:focus-within .hn-track{animation-play-state:paused}',
'@keyframes hnMarq{to{transform:translateX(-50%)}}',
'.hn-group{display:flex;align-items:center;gap:46px;padding-left:46px}',
'.hn-logo{position:relative;display:flex;align-items:center;justify-content:center;height:70px}',
'.hn-logo img{height:52px;width:auto;opacity:.85;filter:grayscale(1) invert(1);transition:opacity .2s ease,transform .2s ease}',
'.hn-logo img.slim{height:31px}',
'.hn-logo:hover img{opacity:1;transform:translateY(-3px)}',
'.hn-logo-name{position:absolute;bottom:0;left:50%;transform:translateX(-50%) translateY(5px);white-space:nowrap;font-style:normal;font-weight:700;font-size:11.5px;letter-spacing:.02em;color:#fff;background:#4257E6;padding:3px 9px;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;z-index:3}',
'.hn-logo:hover .hn-logo-name{opacity:1;transform:translateX(-50%) translateY(0)}',

/* the last row of the page — nothing lives below it */
'.hn-actions{border-top:1px solid rgba(242,240,233,.14)}',
'.hn-actions .hn-in{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px;padding-top:30px;padding-bottom:34px}',
'.hn-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font:inherit;font-weight:800;font-size:16px;padding:15px 30px;border:1px solid transparent;text-decoration:none;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease,color .2s ease}',
'.hn-btn svg{width:20px;height:20px}',
'.hn-btn-solid{background:#4257E6;color:#fff}',
'.hn-btn-solid:hover{background:#5468f0;transform:translateY(-2px)}',
'.hn-btn-ghost{background:none;color:#F2F0E9;border-color:rgba(242,240,233,.35)}',
'.hn-btn-ghost:hover{background:#F2F0E9;border-color:#F2F0E9;color:#000;transform:translateY(-2px)}',
'.hn-btn-ghost svg{transition:transform .25s ease}',
'#hnTop:hover svg{transform:translateY(-3px)}',
'.hn-a11y-link{font-size:13px;color:#9A9C93;text-decoration:none;border-bottom:1px solid rgba(242,240,233,.3);padding-bottom:2px}',
'.hn-a11y-link:hover{color:#fff;border-color:#fff}',

/* the fallback contact dialog, for a page with none of its own */
'.hn-dlg{position:fixed;inset:0;z-index:120;display:flex;align-items:flex-start;justify-content:center;padding:8vh 20px 40px;background:rgba(10,12,24,.66);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);overflow-y:auto}',
'.hn-dlg[hidden]{display:none}',
'.hn-dlg-card{position:relative;width:100%;max-width:440px;background:#fff;color:#1A1C2E;padding:30px 26px 26px;font-family:"Heebo","Rubik",system-ui,sans-serif;text-align:start}',
'.hn-dlg-card h3{margin:0 0 18px;font-size:24px;font-weight:800}',
'.hn-dlg-close{position:absolute;top:10px;inset-inline-start:12px;background:none;border:none;font-size:18px;line-height:1;color:#565870;cursor:pointer}',
'.hn-rows{display:flex;flex-direction:column;gap:10px}',
'.hn-row{display:flex;align-items:center;gap:13px;padding:13px 15px;border:1px solid #EAE8E2;text-decoration:none;color:inherit;transition:border-color .2s ease,background .2s ease}',
'.hn-row:hover{border-color:#4257E6;background:#F3F2FC}',
'.hn-row svg{width:22px;height:22px;flex:0 0 22px;color:#4257E6}',
'.hn-row b{display:block;font-weight:800;font-size:15px}',
'.hn-row i{display:block;font-style:normal;font-size:13px;color:#565870;margin-top:2px;unicode-bidi:plaintext}',
'.hn-row-txt{min-width:0}',

/* the "we got it" dialog */
'.hn-ok-card{text-align:center;max-width:400px;padding:34px 26px 28px}',
'.hn-ok-mark{width:56px;height:56px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;background:#4257E6;color:#fff}',
'.hn-ok-mark svg{width:30px;height:30px}',
'.hn-ok-bad .hn-ok-mark{background:#C1272D}',
'.hn-ok-title{margin:0 0 8px;font-size:23px;font-weight:800}',
'.hn-ok-body{margin:0 0 22px;font-size:15px;line-height:1.6;color:#3E405A}',
'.hn-ok .hn-btn{width:100%}',
/* these rows draw their own icon — keep the page-wide channel mask off them */
'.hn-dlg a::before,.hn-foot a::before,.hn-foot button::before{content:none !important}',

/* idle scroll cue */
'.hn-cue{position:fixed;left:50%;bottom:26px;z-index:55;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;opacity:0;transform:translateX(-50%) translateY(14px);transition:opacity .5s ease,transform .5s ease}',
'.hn-cue.on{opacity:1;transform:translateX(-50%) translateY(0)}',
'.hn-cue span{font-family:"Heebo","Rubik",system-ui,sans-serif;font-weight:700;font-size:11px;letter-spacing:.24em;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.85)}',
'.hn-cue i{display:block;width:1px;height:38px;background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.9));position:relative;animation:hnCue 2.1s ease-in-out infinite}',
'.hn-cue i::after{content:"";position:absolute;left:50%;bottom:0;width:10px;height:10px;border-left:1.4px solid #fff;border-bottom:1.4px solid #fff;transform:translate(-50%,4px) rotate(-45deg)}',
'@keyframes hnCue{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(8px);opacity:1}}',
/* the lectures page parks its own bar in the same spot */
'.dock.on ~ .hn-cue{opacity:0}',
/* the floating CTAs get out of the way once the footer is on screen */
'body.hn-at-foot .qcta,body.hn-at-foot .dock{opacity:0 !important;pointer-events:none !important}',
'body.hn-at-foot .qcta{transform:translateY(26px) !important}',

/* accessibility widget */
'.hn-a11y-btn{position:fixed;inset-inline-end:22px;bottom:22px;z-index:70;width:46px;height:46px;display:flex;align-items:center;justify-content:center;background:#4257E6;color:#fff;border:none;cursor:pointer;box-shadow:0 10px 26px rgba(0,0,0,.5);transition:transform .2s ease,background .2s ease}',
'.hn-a11y-btn:hover{transform:translateY(-2px);background:#5468f0}',
'.hn-a11y-btn svg{width:24px;height:24px}',
'.hn-a11y{position:fixed;inset-inline-end:22px;bottom:80px;z-index:71;width:286px;max-width:calc(100vw - 32px);background:#14152A;color:#F2F0E9;border:1px solid rgba(242,240,233,.2);padding:18px;font-family:"Heebo","Rubik",system-ui,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.6)}',
'.hn-a11y[hidden]{display:none}',
'.hn-a11y h4{margin:0 0 4px;font-size:15.5px;font-weight:800;color:#fff}',
'.hn-a11y .hn-a11y-sub{margin:0 0 14px;font-size:12px;color:#9A9C93}',
'.hn-a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
'.hn-a11y-grid button{background:none;border:1px solid rgba(242,240,233,.22);color:#F2F0E9;font:inherit;font-size:12.5px;font-weight:600;padding:10px 8px;cursor:pointer;text-align:center;transition:background .18s ease,border-color .18s ease}',
'.hn-a11y-grid button:hover{border-color:#4257E6;background:rgba(66,87,230,.16)}',
'.hn-a11y-grid button[aria-pressed="true"]{background:#4257E6;border-color:#4257E6;color:#fff}',
'.hn-a11y-foot{margin-top:14px;padding-top:12px;border-top:1px solid rgba(242,240,233,.16);font-size:11.5px;line-height:1.7;color:#9A9C93}',
'.hn-a11y-foot a{color:#F2F0E9}',
'.hn-a11y-close{position:absolute;inset-inline-start:10px;top:8px;background:none;border:none;color:#9A9C93;font-size:17px;cursor:pointer;line-height:1}',

/* what the accessibility settings actually do */
'html.hn-links a{text-decoration:underline !important;text-underline-offset:3px}',
'html.hn-readable *{font-family:Arial,"Heebo",sans-serif !important;letter-spacing:.01em !important}',
'html.hn-contrast{background:#000 !important}',
'html.hn-contrast body,html.hn-contrast body *{background-color:#000 !important;color:#fff !important;border-color:#fff !important;text-shadow:none !important}',
'html.hn-contrast img,html.hn-contrast video{filter:grayscale(1) contrast(1.25)}',
'html.hn-still *,html.hn-still *::before,html.hn-still *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}',
'html.hn-still video{visibility:hidden}',

'@media (max-width:760px){',
'  .hn-actions .hn-in{flex-direction:column}',
'  .hn-btn{width:100%}',
'  .hn-logo{height:56px}.hn-logo img{height:38px}.hn-logo img.slim{height:24px}',
'  .hn-group{gap:34px;padding-left:34px}',
'  .hn-a11y-btn{inset-inline-end:14px;bottom:22px;width:42px;height:42px}',
'  .hn-a11y{inset-inline-end:14px;bottom:74px}',
   /* on phones the apply CTA goes full width and the video button sits above it,
      so the toolbar stacks on top of both instead of landing on them */
'  body.hn-has-fab .hn-a11y-btn{bottom:126px}',
'  body.hn-has-fab .hn-a11y{bottom:178px}',
'  .hn-cue{bottom:92px}',
'}',
'@media (prefers-reduced-motion:reduce){ .hn-track{animation:none} .hn-cue i{animation:none} }'
  ].join('\n');

  var style = document.createElement('style');
  style.id = 'hn-common-css';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- footer ---------- */
  var applyAttr = applyHref ? 'href="' + applyHref + '"' : 'href="#" data-apply';

  var html =
  '<section class="hn-partners" aria-label="השותפים שלנו" data-en-aria-label="Our partners">' +
    '<p class="hn-lbl" data-en="Our partners">השותפים שלנו</p>' +
    '<div class="hn-marquee"><div class="hn-track">' +
      '<div class="hn-group">' + partnerGroup(false) + '</div>' +
      '<div class="hn-group" aria-hidden="true">' + partnerGroup(true) + '</div>' +
    '</div></div>' +
  '</section>' +
  '<section class="hn-actions" id="site-contact"><div class="hn-in">' +
    '<button type="button" class="hn-btn hn-btn-solid" id="hnContact">' + ICON.mail +
      '<span data-en="Contact us">צרו קשר</span></button>' +
    (wantLecture ?
    '<a class="hn-btn hn-btn-ghost" href="' + base + 'harzaot.html">' + ICON.mic +
      '<span data-en="Lectures">הרצאות</span></a>' : '') +
    '<button type="button" class="hn-btn hn-btn-ghost" id="hnTop">' + ICON.up +
      '<span data-en="Back to top">חזרה למעלה</span></button>' +
    '<a class="hn-a11y-link" href="' + a11yHref + '" data-en="Accessibility statement">הצהרת נגישות</a>' +
  '</div></section>';

  var foot = document.createElement('footer');
  foot.className = 'hn-foot';
  foot.setAttribute('dir', 'rtl');
  foot.innerHTML = html;
  document.body.appendChild(foot);

  /* ---------- "צרו קשר": the page's own dialog where there is one, ours where there isn't ---------- */
  (function(){
    var own = document.getElementById('contactModal');
    var fallback = null;

    function buildFallback(){
      var d = document.createElement('div');
      d.className = 'hn-dlg';
      d.hidden = true;
      d.setAttribute('role', 'dialog');
      d.setAttribute('aria-modal', 'true');
      d.setAttribute('aria-label', 'צרו קשר');
      d.setAttribute('data-en-aria-label', 'Contact us');
      d.setAttribute('dir', 'rtl');
      d.innerHTML =
        '<div class="hn-dlg-card">' +
          '<button type="button" class="hn-dlg-close" aria-label="סגירה" data-en-aria-label="Close">✕</button>' +
          '<h3 data-en="Contact us">צרו קשר</h3>' +
          '<div class="hn-rows">' +
            '<a class="hn-row" href="mailto:' + MAIL + '">' + ICON.mail +
              '<span class="hn-row-txt"><b data-en="Roee Azizi">רועי עזיזי</b>' +
              '<i data-en="Founder &amp; CEO · ' + MAIL + '">מייסד ומנכ״ל · ' + MAIL + '</i></span></a>' +
            '<a class="hn-row" href="mailto:' + MAIL_SHAKED + '">' + ICON.mail +
              '<span class="hn-row-txt"><b data-en="Shaked Wolk">שקד וולק</b>' +
              '<i data-en="Director, the Pioneering Center · ' + MAIL_SHAKED + '">מנהלת המרכז לחלוציות · ' + MAIL_SHAKED + '</i></span></a>' +
            '<a class="hn-row" href="' + IG + '" target="_blank" rel="noopener">' + ICON.ig +
              '<span class="hn-row-txt"><b data-en="Instagram">אינסטגרם</b><i>@hinenu_israel</i></span></a>' +
            '<a class="hn-row" href="' + FB + '" target="_blank" rel="noopener">' + ICON.fb +
              '<span class="hn-row-txt"><b data-en="Facebook">פייסבוק</b><i>הננוּ</i></span></a>' +
            '<a class="hn-row" href="' + WA + '" target="_blank" rel="noopener">' + ICON.wa +
              '<span class="hn-row-txt"><b data-en="WhatsApp group">קבוצת הוואטסאפ</b>' +
              '<i data-en="Updates on the entrepreneurship evenings">עדכונים על ערבי היזמות</i></span></a>' +
            '<a class="hn-row" href="' + CONTACT_FORM + '" target="_blank" rel="noopener">' + ICON.form +
              '<span class="hn-row-txt"><b data-en="Leave your details">השארת פרטים</b></span></a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(d);
      function close(){ d.hidden = true; document.body.style.overflow = ''; }
      d.querySelector('.hn-dlg-close').addEventListener('click', close);
      d.addEventListener('click', function(e){ if(e.target === d) close(); });
      document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !d.hidden) close(); });
      return d;
    }

    /* built now, not on first click, so the page's applyLang() sees its strings */
    if(!own) fallback = buildFallback();

    function open(e){
      if(e) e.preventDefault();
      var d = own || fallback;
      d.hidden = false;
      document.body.style.overflow = 'hidden';
      var c = d.querySelector('.modal-close, .cmodal-close, .hn-dlg-close');
      if(c) c.focus();
    }
    document.getElementById('hnContact').addEventListener('click', open);
    /* the lectures page points its header "צרו קשר" here */
    document.querySelectorAll('a[href="#site-contact"]').forEach(function(a){
      a.addEventListener('click', open);
    });
  })();

  /* the page's own floating CTA steps aside once the footer is on screen */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries){
      document.body.classList.toggle('hn-at-foot', entries[0].isIntersecting);
    }, { threshold:0 }).observe(foot);
  }

  document.getElementById('hnTop').addEventListener('click', function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
                 document.documentElement.classList.contains('hn-still');
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---------- form plumbing every page can share ----------
     window.hinenuPost(url, formData) -> Promise<boolean>
       Posts through a hidden iframe. fetch(..., {mode:'no-cors'}) can't be used
       here: it hands back an opaque response that resolves even when Google
       refused the answer, so a page using it says "received" over a failed send.
       The iframe leaving about:blank is the only completion signal the browser
       gives us — reading its location then throws, and that throw is success.

     window.hinenuReceived(opts) — the styled "we got it" dialog.
  ------------------------------------------------------------------------- */
  window.hinenuPost = function(url, fd){
    return new Promise(function(resolve){
      var frameName = 'hn-post-' + Date.now();
      var iframe = document.createElement('iframe');
      iframe.setAttribute('name', frameName);
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;left:-9999px';
      var form = document.createElement('form');
      form.action = url; form.method = 'POST'; form.target = frameName;
      form.style.display = 'none';
      fd.forEach(function(v, k){
        var i = document.createElement('input');
        i.type = 'hidden'; i.name = k; i.value = v;
        form.appendChild(i);
      });
      var settled = false;
      var timer = setTimeout(function(){ finish(false); }, 12000);
      function finish(ok){
        if(settled) return;
        settled = true;
        clearTimeout(timer);
        setTimeout(function(){ try{ form.remove(); iframe.remove(); }catch(e){} }, 0);
        resolve(ok);
      }
      /* about:blank = not yet. A document we can still read means we never left
         our own origin (network error page, block) - only a cross-origin read
         that throws is Google actually answering. */
      function outcome(){
        try{
          return iframe.contentWindow.location.href === 'about:blank' ? 'blank' : 'readable';
        }catch(e){
          return 'cross-origin';
        }
      }
      iframe.addEventListener('load', function(){
        var o = outcome();
        if(o !== 'blank') finish(o === 'cross-origin');
      });
      iframe.src = 'about:blank';
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();
    });
  };

  /* window.hinenuSend(readable, googleUrl, googleFd) -> Promise<boolean>
     Sends every submission twice:
       · Formspree, which answers with a readable JSON response (so success and
         failure are actually knowable) and mails the submission on,
       · the Google Form, which keeps filling the sheet the team already uses.
     A cross-origin form POST into a hidden iframe can never be read, so the
     Google leg alone can only ever say "the browser finished something". When
     Formspree gives a real answer, that answer wins. */
  var FORMSPREE = 'https://formspree.io/f/xnjygrae';
  window.hinenuSend = function(readable, googleUrl, googleFd){
    var toFormspree = fetch(FORMSPREE, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(readable || {})
    }).then(function(r){ return r.ok; }).catch(function(){ return null; });

    var toGoogle = (googleUrl && googleFd) ? window.hinenuPost(googleUrl, googleFd)
                                           : Promise.resolve(null);

    return Promise.all([toFormspree, toGoogle]).then(function(r){
      var fs = r[0], g = r[1];
      if(fs === true) return true;          /* Formspree confirmed it */
      if(fs === false) return g === true;   /* Formspree refused - fall back to the mirror */
      return g !== false;                   /* Formspree unreachable - the mirror is all we have */
    });
  };

  var okDlg = null;
  window.hinenuReceived = function(opts){
    opts = opts || {};
    if(!okDlg){
      okDlg = document.createElement('div');
      okDlg.className = 'hn-dlg hn-ok';
      okDlg.hidden = true;
      okDlg.setAttribute('role', 'dialog');
      okDlg.setAttribute('aria-modal', 'true');
      okDlg.setAttribute('dir', 'rtl');
      okDlg.innerHTML =
        '<div class="hn-dlg-card hn-ok-card">' +
          '<div class="hn-ok-mark" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5 10-11"/></svg>' +
          '</div>' +
          '<h3 class="hn-ok-title"></h3>' +
          '<p class="hn-ok-body"></p>' +
          '<button type="button" class="hn-btn hn-btn-solid hn-ok-close"><span></span></button>' +
        '</div>';
      document.body.appendChild(okDlg);
      var close = function(){ okDlg.hidden = true; document.body.style.overflow = ''; };
      okDlg.querySelector('.hn-ok-close').addEventListener('click', close);
      okDlg.addEventListener('click', function(e){ if(e.target === okDlg) close(); });
      document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !okDlg.hidden) close(); });
    }
    var en = document.documentElement.getAttribute('lang') === 'en';
    okDlg.querySelector('.hn-ok-title').textContent = opts.title ||
      (en ? 'We got it' : 'קיבלנו');
    okDlg.querySelector('.hn-ok-body').textContent = opts.body ||
      (en ? "Thanks — we'll be in touch soon." : 'תודה, נחזור אליכם בקרוב.');
    okDlg.querySelector('.hn-ok-close span').textContent = en ? 'Close' : 'סגירה';
    okDlg.classList.toggle('hn-ok-bad', !!opts.failed);
    okDlg.hidden = false;
    document.body.style.overflow = 'hidden';
    okDlg.querySelector('.hn-ok-close').focus();
  };

  /* ---------- idle scroll cue: shows itself once the reader has gone still ---------- */
  (function(){
    var cue = document.createElement('div');
    cue.className = 'hn-cue';
    cue.setAttribute('aria-hidden', 'true');
    cue.innerHTML = '<span data-en="Scroll">גללו</span><i></i>';
    document.body.appendChild(cue);

    var timer = null, IDLE = 3200;
    function atBottom(){
      return (window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight - 260);
    }
    function hide(){ cue.classList.remove('on'); }
    function arm(){
      clearTimeout(timer);
      timer = setTimeout(function(){
        /* the hero has a scroll hint of its own — this one only takes over once
           the reader is inside the page and has gone still */
        if(window.pageYOffset < 60) return;
        if(!atBottom() && document.body.scrollHeight > window.innerHeight * 1.4) cue.classList.add('on');
      }, IDLE);
    }
    ['scroll','wheel','touchstart','keydown','pointerdown'].forEach(function(ev){
      window.addEventListener(ev, function(){ hide(); arm(); }, { passive:true });
    });
    window.addEventListener('resize', arm, { passive:true });
    arm();
  })();

  /* ---------- accessibility toolbar ---------- */
  (function(){
    var KEY = 'hinenu-a11y';
    var DEFAULTS = { font:0, contrast:false, links:false, readable:false, still:false };
    var state = {};
    Object.keys(DEFAULTS).forEach(function(k){ state[k] = DEFAULTS[k]; });
    try{
      var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      Object.keys(DEFAULTS).forEach(function(k){ if(k in saved) state[k] = saved[k]; });
    }catch(e){}

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hn-a11y-btn';
    btn.id = 'hnA11yBtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'hnA11yPanel');
    btn.setAttribute('aria-label', 'תפריט נגישות');
    btn.setAttribute('data-en-aria-label', 'Accessibility menu');
    btn.innerHTML = ICON.a11y;

    var panel = document.createElement('div');
    panel.className = 'hn-a11y';
    panel.id = 'hnA11yPanel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.setAttribute('data-en-aria-label', 'Accessibility settings');
    panel.innerHTML =
      '<button type="button" class="hn-a11y-close" id="hnA11yClose" aria-label="סגירה" data-en-aria-label="Close">✕</button>' +
      '<h4 data-en="Accessibility">נגישות</h4>' +
      '<p class="hn-a11y-sub" data-en="Your settings are kept on this device.">ההגדרות נשמרות במכשיר שלכם.</p>' +
      '<div class="hn-a11y-grid">' +
        '<button type="button" data-act="font-up" data-en="Larger text">הגדלת טקסט</button>' +
        '<button type="button" data-act="font-down" data-en="Smaller text">הקטנת טקסט</button>' +
        '<button type="button" data-act="contrast" aria-pressed="false" data-en="High contrast">ניגודיות גבוהה</button>' +
        '<button type="button" data-act="links" aria-pressed="false" data-en="Highlight links">הדגשת קישורים</button>' +
        '<button type="button" data-act="readable" aria-pressed="false" data-en="Readable font">גופן קריא</button>' +
        '<button type="button" data-act="still" aria-pressed="false" data-en="Stop motion">עצירת אנימציות</button>' +
        '<button type="button" data-act="reset" data-en="Reset">איפוס</button>' +
        '<button type="button" data-act="statement" data-en="Statement">הצהרת נגישות</button>' +
      '</div>' +
      '<div class="hn-a11y-foot">' +
        '<span data-en="Accessibility officer: Romi Shmuelov">רכזת נגישות: רומי שמואלוב</span><br>' +
        '<a href="mailto:' + A11Y_MAIL + '">' + A11Y_MAIL + '</a>' +
      '</div>';

    if(document.querySelector('.qcta')) document.body.classList.add('hn-has-fab');
    document.body.appendChild(btn);
    document.body.appendChild(panel);

    var root = document.documentElement;
    function paint(){
      root.classList.toggle('hn-contrast', state.contrast);
      root.classList.toggle('hn-links', state.links);
      root.classList.toggle('hn-readable', state.readable);
      root.classList.toggle('hn-still', state.still);
      root.style.fontSize = state.font ? (100 + state.font * 10) + '%' : '';
      /* "stop motion" has to actually stop the background films, not just hide them */
      document.querySelectorAll('video').forEach(function(v){
        try{ state.still ? v.pause() : (v.autoplay && v.play().catch(function(){})); }catch(e){}
      });
      panel.querySelectorAll('[data-act]').forEach(function(b){
        var a = b.getAttribute('data-act');
        if(typeof state[a] === 'boolean') b.setAttribute('aria-pressed', String(state[a]));
      });
      try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
    }

    panel.addEventListener('click', function(e){
      var b = e.target.closest ? e.target.closest('[data-act]') : null;
      if(!b) return;
      var act = b.getAttribute('data-act');
      if(act === 'font-up')        state.font = Math.min(state.font + 1, 4);
      else if(act === 'font-down') state.font = Math.max(state.font - 1, -1);
      else if(act === 'reset')     Object.keys(DEFAULTS).forEach(function(k){ state[k] = DEFAULTS[k]; });
      else if(act === 'statement'){ window.location.href = a11yHref; return; }
      else if(act in state)        state[act] = !state[act];
      paint();
    });

    function close(){ panel.hidden = true; btn.setAttribute('aria-expanded','false'); }
    btn.addEventListener('click', function(){
      panel.hidden = !panel.hidden;
      btn.setAttribute('aria-expanded', String(!panel.hidden));
      if(!panel.hidden) panel.querySelector('[data-act]').focus();
    });
    document.getElementById('hnA11yClose').addEventListener('click', function(){ close(); btn.focus(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !panel.hidden){ close(); btn.focus(); } });
    document.addEventListener('click', function(e){
      if(panel.hidden) return;
      if(!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close();
    });

    paint();
  })();
})();
