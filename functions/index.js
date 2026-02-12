export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const country = request.headers.get('cf-ipcountry');

  // Sadece ana sayfa ve index.html için çalışsın
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Bot kontrolü
  const isSearchBot =
    /googlebot|mediapartners-google|adsbot-google|google-inspectiontool|googleweblight|yandexbot|yandex/i.test(
      userAgent
    );

  if (isSearchBot) {
    console.log('Search bot detected – serving index.html');
    return context.next();
  }

  // Türkiye IP kontrolü
  if (country === 'TR') {
    console.log('TR visitor detected – redirecting to /tr.html');
    return Response.redirect(`${url.origin}/tr.html`, 302);
  }

  // Diğer ülkeler → index.html
  console.log('Non-TR visitor – serving index.html');
  return context.next();
}
