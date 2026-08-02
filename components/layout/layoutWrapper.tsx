'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import AltHeader from './altHeader'
import SidebarWrapper from './sidebarWrapper'
import Footer from '@/components/layout/footer'
import CookieBanner from '../ui/cookieBanner'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Pages that should not show sidebar
  const hideSidebar = pathname === '/blog' || 
                      pathname === '/blog-detail' || 
                      pathname === '/pricing' || 
                      pathname === '/login' || 
                      pathname === '/signin' || 
                      pathname === '/onboarding' || 
                      pathname === '/profile' ||
    pathname === '/not-found' ||
  pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/refund-policy' ||
  pathname === '/cookie' ||
  pathname === '/intro' 

  // Pages that should not show header
  const hideHeader = pathname === '/login' || 
                     pathname === '/signin' ||
                     pathname === '/not-found' ||
  pathname === '/intro' 

  // Pages that should show AltHeader
  const showAltHeader = pathname === '/blog' || 
                        pathname === '/blog-detail' || 
                        pathname === '/pricing' || 
                        pathname === '/profile' ||
  pathname === '/intro' 

  // Pages that should show footer
  const showFooter = pathname === '/about' || 
                     pathname === '/blog' || 
                     pathname === '/blog-detail' || 
    pathname === '/pricing' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/refund-policy' ||
  pathname === '/cookie' ||
  pathname === '/intro' 

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {!hideSidebar && (
        <div className="hidden lg:block h-full overflow-hidden shrink-0">
          <SidebarWrapper />
        </div>
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto main-scroll-container scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-foreground">
          {!hideHeader && (
            <>
              {showAltHeader ? (
                <div className="sticky top-0 z-50">
                  <AltHeader />
                </div>
              ) : (
                <div className="lg:hidden sticky top-0 z-50">
                  <Header />
                </div>
              )}
            </>
          )}
          {children}
          {showFooter && <Footer />}
        <CookieBanner 
        onAccept={() => console.log('Cookies accepted')}
        onReject={() => console.log('Cookies rejected')}
      />
        </div>
      </div>
    </div>
  )
}