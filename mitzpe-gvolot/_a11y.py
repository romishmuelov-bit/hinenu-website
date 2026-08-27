# -*- coding: utf-8 -*-
"""Accessibility + mobile audit across every page, in a real browser."""
from playwright.sync_api import sync_playwright

PAGES = ['index.html', 'lomdim.html', 'overim.html', 'poalim.html', 'accessibility.html']
BASE = 'http://127.0.0.1:8777/'

AUDIT = """(function(){
  function lum(c){
    var m = c.match(/[\\d.]+/g).map(Number);
    var a = m.slice(0,3).map(function(v){ v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); });
    return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];
  }
  function parse(c){ var m=c.match(/[\d.]+/g).map(Number); return {r:m[0],g:m[1],b:m[2],a:m.length>3?m[3]:1}; }
  /* composite translucent panels down the ancestor chain - otherwise a 4% pale
     overlay on navy reads as solid pale and every ratio comes out wrong */
  function bgOf(el){
    var stack=[];
    while(el && el !== document.documentElement){
      var bc=getComputedStyle(el).backgroundColor;
      if(bc && bc!=='rgba(0, 0, 0, 0)'){ var c=parse(bc); if(c.a>0){ stack.push(c); if(c.a>=1) break; } }
      el = el.parentElement;
    }
    stack.push({r:19,g:52,b:88,a:1});
    var out=stack[stack.length-1];
    for(var i=stack.length-2;i>=0;i--){
      var f=stack[i];
      out={r:f.r*f.a+out.r*(1-f.a), g:f.g*f.a+out.g*(1-f.a), b:f.b*f.a+out.b*(1-f.a), a:1};
    }
    return 'rgb('+out.r+','+out.g+','+out.b+')';
  }
  var low = [];
  [].slice.call(document.querySelectorAll('p,li,h1,h2,h3,h4,a,label,span,cite,button'))
    .forEach(function(el){
      if(!el.textContent.trim()) return;
      var r = el.getBoundingClientRect(); if(!r.width || !r.height) return;
      if(el.querySelector('p,li,h1,h2,h3,h4')) return;
      var cs = getComputedStyle(el);
      if(parseFloat(cs.opacity) === 0 || cs.visibility === 'hidden') return;
      var L1 = lum(cs.color), L2 = lum(bgOf(el));
      var ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
      var px = parseFloat(cs.fontSize);
      var big = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight) >= 700);
      var need = big ? 3 : 4.5;
      if(ratio < need) low.push({t: el.textContent.trim().slice(0,26), px: Math.round(px),
                                 ratio: +ratio.toFixed(2), need: need});
    });

  var imgs = [].slice.call(document.querySelectorAll('img'));
  var labels = [].slice.call(document.querySelectorAll('input,select,textarea'));
  var hs = [].slice.call(document.querySelectorAll('h1,h2,h3,h4')).map(function(h){return +h.tagName[1];});
  var jump = [];
  for(var i=1;i<hs.length;i++) if(hs[i] - hs[i-1] > 1) jump.push(hs[i-1]+'->'+hs[i]);

  return {
    lowContrast: low.slice(0,6),
    lowCount: low.length,
    imgsMissingAlt: imgs.filter(function(i){return i.getAttribute('alt') === null;}).length,
    inputsUnlabelled: labels.filter(function(i){
      return !i.id || !document.querySelector('label[for="'+i.id+'"]');
    }).length,
    h1Count: document.querySelectorAll('h1').length,
    headingJumps: jump,
    skipLink: !!document.querySelector('.skip'),
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    a11yLink: !!document.querySelector('a[href*="accessibility"]'),
    linksNoText: [].slice.call(document.querySelectorAll('a')).filter(function(a){
      return !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])');
    }).length
  };
})()"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for page in PAGES:
        for w, tag in ((1440, 'desk'), (390, 'phone')):
            pg = b.new_page(viewport={'width': w, 'height': 880})
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto(BASE + page, wait_until='networkidle')
            try:
                pg.wait_for_function('!window.__stats || window.__stats().settled===window.__stats().total',
                                     timeout=60000)
            except Exception:
                pass
            pg.evaluate("document.querySelectorAll('img').forEach(function(i){i.loading='eager'})")
            pg.wait_for_timeout(1400)
            r = pg.evaluate(AUDIT)
            ov = pg.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
            tiny = pg.evaluate("""[].slice.call(document.querySelectorAll('a,button')).filter(function(e){
                var r=e.getBoundingClientRect();
                return r.width>0 && (r.height<24 || r.width<24);}).length""")
            print('%-20s %-5s overflow=%-5s lowContrast=%-3d noAlt=%d unlabelled=%d h1=%d jumps=%s skip=%s a11y=%s tinyTargets=%d err=%d'
                  % (page, tag, ov, r['lowCount'], r['imgsMissingAlt'], r['inputsUnlabelled'],
                     r['h1Count'], r['headingJumps'] or '-', r['skipLink'], r['a11yLink'], tiny, len(errs)))
            if r['lowContrast']:
                for c in r['lowContrast'][:3]:
                    print('        low: "%s" %dpx ratio %.2f (needs %.1f)' % (c['t'], c['px'], c['ratio'], c['need']))
            pg.close()
    b.close()
