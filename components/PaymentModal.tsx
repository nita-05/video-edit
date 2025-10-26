'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    popular: boolean;
  };
}

export default function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [step, setStep] = useState<'trial' | 'payment' | 'success'>('trial');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartFreeTrial = async () => {
    setIsProcessing(true);
    
    // Simulate API call for free trial
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('payment');
    setIsProcessing(false);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setStep('success');
    setIsProcessing(false);
  };

  const handleComplete = () => {
    onClose();
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {step === 'trial' && 'Start Your Free Trial'}
                {step === 'payment' && 'Complete Your Subscription'}
                {step === 'success' && 'Welcome to VEDIT!'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {step === 'trial' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {plan.name} Plan
                  </h3>
                  <p className="text-gray-300">{plan.description}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Free Trial</span>
                    <span className="text-green-400 font-bold">14 Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Then</span>
                    <span className="text-white font-bold">{plan.price}/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">What you get:</h4>
                  {plan.features && plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartFreeTrial}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Starting Trial...</span>
                    </div>
                  ) : (
                    'Start Free Trial - No Payment Required'
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  No credit card required. Cancel anytime during trial.
                </p>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Trial Ending Soon
                  </h3>
                  <p className="text-gray-300">
                    Your free trial ends in 3 days. Continue with full access.
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{plan.name} Plan</span>
                    <span className="text-white font-bold">{plan.price}/{plan.period}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Billing starts after trial</span>
                    <span className="text-green-400 text-sm">Auto-renewal</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : (
                    `Continue for ${plan.price}/${plan.period}`
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  Secure payment processing. Cancel anytime.
                </p>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-300">
                    Welcome to VEDIT Professional! You now have full access to all features.
                  </p>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Subscription Active</span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Next billing</span>
                    <span className="text-white">30 days</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Go to Dashboard
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
