import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// TODO: Thay bằng Google Analytics Measurement ID thực tế
const GA_ID = "";
// TODO: Thay bằng Facebook Pixel ID thực tế  
const FB_PIXEL_ID = "";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

// Initialize GA4
const initGA = () => {
  if (!GA_ID) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
};

// Initialize Facebook Pixel
const initFBPixel = () => {
  if (!FB_PIXEL_ID) return;
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq("init", FB_PIXEL_ID);
};

let initialized = false;

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      initGA();
      initFBPixel();
      initialized = true;
    }
  }, []);

  // Track page views
  useEffect(() => {
    if (GA_ID) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
    if (FB_PIXEL_ID) {
      window.fbq("track", "PageView");
    }
  }, [location]);
};

// Track custom events
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (GA_ID) {
    window.gtag("event", eventName, params);
  }
  if (FB_PIXEL_ID) {
    window.fbq("trackCustom", eventName, params);
  }
};

// Track lead submission
export const trackLeadSubmission = (source: string) => {
  if (GA_ID) {
    window.gtag("event", "generate_lead", { event_category: "engagement", event_label: source });
  }
  if (FB_PIXEL_ID) {
    window.fbq("track", "Lead", { content_name: source });
  }
};
