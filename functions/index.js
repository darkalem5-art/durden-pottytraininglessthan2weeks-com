export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // Sadece ana sayfa ve index.html için çalışsın
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return context.next();
  }

  // Googlebot kontrolü (kesin tespit için)
  const isGooglebot = /googlebot|mediapartners-google|adsbot-google|google-inspectiontool|googleweblight/i.test(userAgent);

  if (isGooglebot) {
    console.log('Googlebot detected – serving index.html (SSR/Prerender)');
    return context.next(); // index.html dönsün (SEO için)
  }

  // Normal kullanıcılar → tr.html'e yönlendir
  console.log('Normal user – redirecting to /tr.html');
  
  const redirectUrl = new URL('/tr.html', url.origin);
  return Response.redirect(redirectUrl.toString(), 302);
  // veya daha kısa: return Response.redirect(`${url.origin}/tr.html`, 302);
}
