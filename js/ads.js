/*
  REELX21 ADS — Adsterra
  Jangan menambahkan kode iklan yang sama dua kali.
*/

// Popunder
(function () {
  const s = document.createElement('script');
  s.src = 'https://pl31219981.profitableratecpmnetwork.com/4b/c4/ab/4bc4ab60ca5e880efb21d062653454fa.js';
  s.async = true;
  document.body.appendChild(s);
})();

function createNativeAd() {
  const wrap = document.createElement('div');
  wrap.className = 'ad-card native-ad-card';
  wrap.innerHTML = `
    <div class="ad-label">Advertisement</div>
    <div class="native-ad-inner">
      <script async="async" data-cfasync="false" src="https://pl31219982.profitableratecpmnetwork.com/3aa18f7d19d00c5f3e431ff7f5862c08/invoke.js"></script>
      <div id="container-3aa18f7d19d00c5f3e431ff7f5862c08"></div>
    </div>
  `;
  return wrap;
}

function createBannerAd() {
  const wrap = document.createElement('div');
  wrap.className = 'ad-card banner-ad-card';
  wrap.innerHTML = `
    <div class="ad-label">Advertisement</div>
    <div class="banner-300x250">
      <script>
        atOptions = {
          'key' : '675c10933e2594cc195b507386e29ca0',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script src="https://www.highrevenueformat.com/675c10933e2594cc195b507386e29ca0/invoke.js"></script>
    </div>
    <div class="banner-320x50">
      <script>
        atOptions = {
          'key' : '0d65024ed563b2d8591d025a3750e236',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      </script>
      <script src="https://www.highrevenueformat.com/0d65024ed563b2d8591d025a3750e236/invoke.js"></script>
    </div>
  `;
  return wrap;
}

window.Reelx21Ads = { createNativeAd, createBannerAd };
