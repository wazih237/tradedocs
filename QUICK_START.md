# TradeDocs Quick Start Guide

## Files Created

### 1. **src/data/templates.ts** (57 KB, 1,765 lines)
Complete product catalog with 165 templates across 28 categories.

**Usage:**
```typescript
import { templates, categories } from '@/data/templates';

// Get all templates
const allTemplates = templates;

// Get all categories
const allCategories = categories;
```

### 2. **src/lib/types.ts** (1.8 KB, 95 lines)
TypeScript type definitions for the entire application.

**Key Types:**
- `Template`: Individual product
- `Category`: Product category
- `Order`: Purchase order
- `User`: Customer profile
- `LemonSqueezyCheckout`: Payment session
- `TemplateSearchParams`: Search filters

### 3. **src/lib/utils.ts** (8.1 KB, 335 lines)
50+ utility functions for search, filtering, pricing, and formatting.

**Key Functions:**
```typescript
import { 
  searchTemplates,
  getTemplatesByCategory,
  getFeaturedTemplates,
  calculateBundlePrice,
  formatPrice 
} from '@/lib/utils';

// Search with filters
const results = searchTemplates({
  query: 'inspection',
  category: 'sgs-inspection',
  minPrice: 100,
  maxPrice: 200,
  sortBy: 'popularity'
});

// Format pricing
const price = formatPrice(99); // "$99"
```

### 4. **src/lib/supabase.ts** (8.6 KB, 367 lines)
Supabase database and authentication setup.

**Key Operations:**
```typescript
import { supabaseDB, supabaseAuth, getBrowserClient } from '@/lib/supabase';

// Create order
const order = await supabaseDB.createOrder({
  user_id: 'user-123',
  template_ids: ['cert-1', 'cert-2'],
  total_price: 199,
  currency: 'USD',
  email: 'buyer@example.com',
  status: 'pending'
});

// Authenticate
const { data } = await supabaseAuth.signInWithEmail('user@example.com');
```

### 5. **src/lib/lemonsqueezy.ts** (13 KB, 513 lines)
Payment processing via Lemon Squeezy API.

**Key Operations:**
```typescript
import lemonSqueezy from '@/lib/lemonsqueezy';

// Create checkout
const checkout = await lemonSqueezy.createCheckout(
  [{ productVariantId: 'variant-1', quantity: 1 }],
  'customer@example.com'
);
// Returns: { checkoutUrl: '...', checkoutId: '...' }

// Verify webhook
const isValid = lemonSqueezy.verifyWebhookSignature(
  body,
  signature,
  WEBHOOK_SECRET
);

// Process webhook
const event = await lemonSqueezy.processWebhookEvent(webhookPayload);
```

## Template Highlights

### Most Popular Categories (by template count):
1. China Import/Export (8) - Mandatory trading compliance
2. Contracts & Agreements (8) - Core trading documents
3. Shipping & Logistics (8) - Transport documentation
4. SGS Inspection (7) - Third-party verification
5. Trade Finance (7) - Payment instruments

### Key Features
- **165 templates** covering all aspects of commodity trade
- **Regulatory references**: GAFTA, FOSFA, UCP 600, GACC, GB 7718, etc.
- **Price range**: $35-$499
- **Status classification**: Mandatory, Recommended, Optional
- **Popularity scoring**: 1-100 based on trading importance

### Commodity Types
Grains, Metals, Oils, Seeds, Chemicals, Agricultural Products, Food, Beverages, Energy, Textiles, Forest Products, and more.

## Environment Variables

Create a `.env.local` file:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Lemon Squeezy
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=your-store-id
LEMON_SQUEEZY_API_KEY=your-api-key
LEMON_SQUEEZY_WEBHOOK_SECRET=your-webhook-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase Tables

Create these tables in your Supabase project:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  stripe_customer_id TEXT
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  template_ids TEXT[] NOT NULL,
  total_price INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  checkout_url TEXT,
  download_url TEXT
);

-- Order downloads table
CREATE TABLE order_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  download_url TEXT NOT NULL,
  template_ids TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes Example

```typescript
// app/api/checkout/route.ts
import { createCheckout } from '@/lib/lemonsqueezy';

export async function POST(request: Request) {
  const { templateIds, email } = await request.json();
  
  const checkout = await createCheckout(
    templateIds.map(id => ({ productVariantId: id, quantity: 1 })),
    email
  );
  
  return Response.json(checkout);
}
```

## Component Usage Example

```typescript
// app/templates/[id]/page.tsx
import { getTemplateById, getRelatedTemplates, formatPrice } from '@/lib/utils';

export default function TemplatePage({ params }) {
  const template = getTemplateById(params.id);
  const related = getRelatedTemplates(params.id);
  
  return (
    <div>
      <h1>{template?.name}</h1>
      <p>{template?.description}</p>
      <p>{formatPrice(template?.price || 0)}</p>
      
      <section>
        <h2>Related Templates</h2>
        {related.map(t => (
          <div key={t.id}>{t.name}</div>
        ))}
      </section>
    </div>
  );
}
```

## Search Implementation

```typescript
// app/search/page.tsx
import { searchTemplates } from '@/lib/utils';

export default function SearchPage({ searchParams }) {
  const results = searchTemplates({
    query: searchParams.q,
    category: searchParams.category,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sortBy: searchParams.sort
  });
  
  return (
    <div>
      <h1>Search Results</h1>
      {results.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
```

## Webhook Handler

```typescript
// app/api/webhook/lemonsqueezy/route.ts
import { verifyWebhookSignature, processWebhookEvent } from '@/lib/lemonsqueezy';
import { supabaseDB } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-signature');
  
  if (!verifyWebhookSignature(body, signature, process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const payload = JSON.parse(body);
  const event = await processWebhookEvent(payload);
  
  if (event.action === 'order_completed') {
    await supabaseDB.updateOrderStatus(event.orderId, 'completed');
  }
  
  return Response.json({ ok: true });
}
```

## Next Steps

1. Set up Supabase project and create tables
2. Configure Lemon Squeezy and get API keys
3. Create environment variables
4. Build pages for:
   - Homepage with featured templates
   - Category browse pages
   - Template detail pages
   - Search results
   - Shopping cart
   - Checkout
   - Order confirmation
   - User dashboard
5. Implement components using the utility functions
6. Set up webhook handler for payments

## File Locations

All files are in `/sessions/fervent-intelligent-bohr/mnt/outputs/tradedocs/`:

- `src/data/templates.ts` - Product catalog
- `src/lib/types.ts` - TypeScript types
- `src/lib/utils.ts` - Utility functions
- `src/lib/supabase.ts` - Database integration
- `src/lib/lemonsqueezy.ts` - Payment integration
