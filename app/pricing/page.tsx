'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import Tabs from '@/components/ui/tabs'
import PriceFeatureRow from '@/components/ui/priceFeatureRow'
import ComparisonTable from '@/components/ui/comparisonTable'
import {
  ProIcon,
  TeamIcon,
  FreeIcon,
  SaveIcon,
  AIIcon,
  FolderIcon,
  FilesIcon,
  PDFIcon,
  WordIcon,
  VisualizationIcon,
  SummaryIcon,
  ExcelIcon,
  CSVIcon,
  JsonIcon,
  RoundCheckIcon,
  GlobeIcon,
} from '@/public/icons/color'
import {
  AnalyzeIcon,
  InvestigateIcon,
  StrategyIcon
} from '@/public/icons/mono'
import pricingData from '@/data/pricing.json'
import comparisonData from '@/data/comparePricing.json'

type PricingInterval = 'monthly' | 'yearly'

interface PricingPlan {
  id: string
  name: string | React.ReactNode
  price: number | { monthly: number; yearly: number }
  description: string
  features: Array<{ label: string; icon: string }>
  ctaText: string
  ctaVariant: 'primary' | 'secondary' | 'outline'
}

const iconMap: Record<string, React.ReactNode> = {
  AIIcon: <AIIcon size={16} />,
  FolderIcon: <FolderIcon size={16} />,
  FilesIcon: <FilesIcon size={16} />,
  PDFIcon: <PDFIcon size={16} />,
  WordIcon: <WordIcon size={16} />,
  VisualizationIcon: <VisualizationIcon size={16} />,
  SummaryIcon: <SummaryIcon size={16} />,
  ExcelIcon: <ExcelIcon size={16} />,
  CSVIcon: <CSVIcon size={16} />,
  JsonIcon: <JsonIcon size={16} />,
  AnalyzeIcon: <AnalyzeIcon size={16} />,
  InvestigateIcon: <InvestigateIcon size={16} />,
  SaveIcon: <SaveIcon size={16} />,
  RoundCheckIcon: <RoundCheckIcon size={16} />,
  GlobeIcon: <GlobeIcon size={16} />,
  StrategyIcon: <StrategyIcon size={16} />
}

const planIconMap: Record<string, React.ReactNode> = {
  free: <FreeIcon size={80} />,
  pro: <ProIcon size={80} />,
  team: (
    <div className="dark:[&_svg_path]:fill-white [&_svg_path]:fill-current">
      <TeamIcon size={80} />
    </div>
  )
}

const pricingPlans: PricingPlan[] = pricingData.plans.map((plan: any) => ({
  ...plan,
  name: (
    <div className="flex items-center gap-2">
      {planIconMap[plan.id]}
    </div>
  )
}))

const PricingPage = () => {
  const [interval, setInterval] = useState<PricingInterval>('monthly')

  const getPrice = (plan: PricingPlan) => {
    if (typeof plan.price === 'object') {
      return interval === 'yearly' ? plan.price.yearly : plan.price.monthly
    }
    return plan.price
  }

  const getPriceLabel = () => {
    return interval === 'yearly' ? '/year' : '/month'
  }

  const tabItems = [
    {
      id: 'monthly',
      label: 'Monthly',
      content: null
    },
    {
      id: 'yearly',
      label: 'Yearly (20% off)',
      content: null
    }
  ]

  const renderPricingCards = () => {
    return pricingPlans.map((plan) => {
      const isPro = plan.id === 'pro'
      const price = getPrice(plan)
      const isFree = plan.id === 'free'
      const monthlyPrice = typeof plan.price === 'object' ? plan.price.monthly : plan.price
      const yearlyTotal = monthlyPrice * 12

      return (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            'relative rounded-2xl border border-border bg-surface p-8 flex flex-col',
            isPro && 'border-4 border-black/20 dark:border-white/20 shadow-lg pricing-pro-border'
          )}
        >
          <style jsx global>{`
            @keyframes rainbow-slide {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 200% 50%;
              }
            }

            .pricing-pro-border {
              position: relative;
              border: 4px solid transparent;
              background-clip: padding-box;
            }

            .pricing-pro-border::before {
              content: '';
              position: absolute;
              inset: -4px;
              border-radius: 16px;
              padding: 4px;
              background: linear-gradient(
                90deg,
                #ff4d4f,
                #ff7a45,
                #ffa940,
                #fadb14,
                #52c41a,
                #13c2c2,
                #1677ff,
                #722ed1,
                #eb2f96,
                #ff4d4f
              );
              background-size: 200% 100%;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              animation: rainbow-slide 3s linear infinite;
              pointer-events: none;
            }
          `}</style>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>

          <div className="mb-6">
            <span className="text-6xl font-bold text-foreground">
              {isFree ? '$0' : `$${price}`}
            </span>
            {!isFree && (
              <span className="text-sm text-muted-foreground ml-2">{getPriceLabel()}</span>
            )}
            {!isFree && interval === 'yearly' && typeof plan.price === 'object' && (
              <span className="text-sm text-green-600 dark:text-green-400 ml-2 line-through">
                ${yearlyTotal}
              </span>
            )}
          </div>

          <ul className="space-y-3 flex-1 mb-8">
            {plan.features.map((feature, index) => (
              <PriceFeatureRow 
                key={index}
                icon={iconMap[feature.icon] || <SaveIcon size={24} />}
                label={feature.label}
              />
            ))}
          </ul>

          <button
            className={cn(
              'w-full py-3 rounded-full font-medium transition-all duration-200',
              plan.ctaVariant === 'primary' && 'bg-accent text-white hover:bg-accent/90',
              plan.ctaVariant === 'secondary' && 'bg-fill-muted text-foreground hover:bg-fill-moderate',
              plan.ctaVariant === 'outline' && 'border border-border text-foreground hover:bg-fill-alpha-subtle'
            )}
          >
            {plan.ctaText}
          </button>
        </motion.div>
      )
    })
  }

  return (
    <div
      className="
        container 
        mx-auto 
        px-6 
        py-12
        md:px-10
        lg:px-12
        xl:px-20
      "
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold font-text text-foreground mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your analytics needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-16">
        <Tabs 
          items={tabItems} 
          variant="pill" 
          defaultActiveId="monthly"
          onTabChange={(id) => setInterval(id as PricingInterval)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderPricingCards()}
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold font-text text-foreground text-center mb-8">Compare Plans</h2>
        <ComparisonTable features={comparisonData.features} />
      </div>
    </div>
  )
}

export default PricingPage