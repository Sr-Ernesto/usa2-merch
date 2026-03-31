import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Usa2 Merch — Ropa de marca USA desde $35,000 COP",
  description: "Nike, Lululemon, Gymshark usadas como nuevas. Drops cada jueves. Recogida gratis Urabá, Antioquia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1377931084349727');
              fbq('track', 'PageView');
              fbq('track', 'ViewContent', {content_name: 'Usa2 Merch Bridge Page'});
            `,
          }}
        />
        {/* PostHog */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
              function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),
              t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
              (p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",
              p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0])
              .parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",
              u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&
              (e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+
              ".people (stub)"},o="init capture register register_once unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing identify alias people.set people.set_once set_config startSessionRecording stopSessionRecording isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);
              e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_KEY"}',{api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"}'});
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        {/* Meta Pixel Noscript */}
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} src="https://www.facebook.com/tr?id=1377931084349727&ev=PageView&noscript=1" alt="" />
        </noscript>
        {children}
      </body>
    </html>
  );
}
