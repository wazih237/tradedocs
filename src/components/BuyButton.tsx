'use client';

import { useState } from 'react';
import { ShoppingCart, Loader } from 'lucide-react';

interface BuyButtonProps {
  templateId: string;
  price: number;
  name: string;
  checkoutUrl?: string;
  onPurchaseStart?: () => void;
  onPurchaseError?: (error: Error) => void;
}

export default function BuyButton({
  templateId,
  price,
  name,
  checkoutUrl,
  onPurchaseStart,
  onPurchaseError,
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      onPurchaseStart?.();

      if (checkoutUrl) {
        // Redirect to Lemon Squeezy checkout
        window.location.href = checkoutUrl;
      } else {
        // Fallback: Make API call to create checkout session
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId,
            price,
            name,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initiate checkout');
        }

        const data = await response.json();

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error('No checkout URL received');
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message);
      onPurchaseError?.(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
          isLoading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Buy Now - ${price.toFixed(2)}</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            Error: {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Additional Info */}
      <p className="text-xs text-gray-600 mt-3 text-center">
        Secure checkout powered by Lemon Squeezy
      </p>
    </div>
  );
}
