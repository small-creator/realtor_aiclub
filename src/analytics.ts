declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    })
  }
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView')
  }
}

export function trackCourseClick(contentLocation: string, url: string) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click_course', {
      event_category: 'outbound',
      event_label: contentLocation,
      utm_content: contentLocation,
      link_url: url,
    })
  }
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: '중개사AI클럽 정규과정 VOD',
      content_category: 'course',
      content_ids: ['317917'],
      content_type: 'product',
      utm_content: contentLocation,
    })
  }
}
