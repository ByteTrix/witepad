
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { useState } from 'react'

const Pricing = () => {
  const { user } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 3 documents',
        'Basic drawing tools',
        'Export to PNG',
        'Community support'
      ],
      popular: false,
      buttonText: user ? 'Current Plan' : 'Get Started',
      disabled: !!user
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'per month',
      features: [
        'Unlimited documents',
        'Advanced drawing tools',
        'Real-time collaboration',
        'Export to PNG, SVG, PDF',
        'Priority support',
        'Version history'
      ],
      popular: true,
      buttonText: 'Upgrade to Pro',
      disabled: false
    },
    {
      name: 'Team',
      price: '$29',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team management',
        'Advanced permissions',
        'SSO integration',
        'Custom branding',
        'Dedicated support'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      disabled: false
    }
  ]

  const handlePlanSelect = (planName: string) => {
    if (!user && planName === 'Free') {
      setAuthDialogOpen(true)
    } else {
      // Handle other plan selections
      console.log(`Selected plan: ${planName}`)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-white to-orange-400 bg-clip-text text-transparent mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your creative needs. Start free and scale as you grow.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-orange-500/10 to-purple-500/10 border-2 border-orange-400/30'
                    : 'bg-gray-900/50 border border-gray-700'
                } backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-black'
                      : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
                  } transition-all duration-200`}
                  onClick={() => handlePlanSelect(plan.name)}
                  disabled={plan.disabled}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-900/50 rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
                <p className="text-gray-300">Our Free plan is available forever with no time limits. Upgrade when you're ready for more features.</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300">We accept all major credit cards and PayPal for your convenience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  )
}

export default Pricing
