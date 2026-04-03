interface Document { id: string; content: string; keywords: string[]; }

const KNOWLEDGE_BASE: Document[] = [
  {
    id: 'faq_slow_net',
    content: 'Agar internet slow hai: 1) Phone restart karein 2) Airplane mode on/off karein 3) APN settings check karein (APN: airtelgprs.com) 4) Network mode 4G/LTE set karein. Agar 3 din se zyada problem hai toh 121 par call karein.',
    keywords: ['slow', 'net', 'internet', 'network', 'speed', 'lag', 'fast', 'bandwidth'],
  },
  {
    id: 'faq_recharge',
    content: 'Recharge options: 1) Airtel Thanks app 2) airtel.in website 3) Nearest Airtel store 4) *121# USSD. Payment: UPI, credit/debit card, net banking, wallets sab accepted. Failed recharge mein amount 3-5 days mein refund hota hai.',
    keywords: ['recharge', 'topup', 'renew', 'pack', 'validity', 'expire', 'extend'],
  },
  {
    id: 'faq_data',
    content: 'Data balance: *121# dial karein ya Airtel Thanks app. Daily limit exceed hone par speed 64kbps ho jaati hai. Data booster pack ₹19 mein 1GB extra milta hai. International roaming data alag pack se activate hota hai.',
    keywords: ['data', 'balance', 'gb', 'mb', 'usage', 'bacha', 'limit', 'booster', 'extra'],
  },
  {
    id: 'faq_bill',
    content: 'Postpaid bill: Airtel Thanks app mein milega. Bill cycle 10th ko generate hota hai. Due date 15th hoti hai. AutoPay setup karne par ₹50 discount milta hai. Dispute ke liye 121 par call karein ya airtel.in/support.',
    keywords: ['bill', 'invoice', 'payment', 'due', 'amount', 'charge', 'postpaid', 'autopay', 'discount'],
  },
  {
    id: 'faq_roaming',
    content: 'National roaming: Sabhi unlimited plans mein free. International roaming: iRoam packs available — USA/Canada ₹999/day, Europe ₹1299/day, Asia ₹799/day. Activate karne ke liye 121 par call karein ya Thanks app use karein.',
    keywords: ['roaming', 'travel', 'international', 'abroad', 'iroam', 'foreign', 'country'],
  },
  {
    id: 'faq_port',
    content: 'Number port (MNP): PORT <10-digit number> likhkar 1900 par SMS karein. UPC code milega. Nearest Airtel store mein jaayein with ID proof. Process 7 working days. Porting ke dauran service 2-4 hours ke liye band ho sakti hai.',
    keywords: ['port', 'mnp', 'switch', 'change', 'operator', 'jio', 'vi', 'bsnl', 'transfer'],
  },
  {
    id: 'faq_5g',
    content: '5G availability: Airtel 5G abhi 100+ cities mein available hai. Check karne ke liye Thanks app mein 5G coverage map dekhein. 5G ke liye 5G compatible phone aur 5G SIM chahiye. Existing 4G SIM upgrade free hai — store visit karein.',
    keywords: ['5g', 'five g', 'upgrade', 'fast', 'new', 'coverage', 'compatible'],
  },
  {
    id: 'faq_sim',
    content: 'SIM related: Lost SIM block karne ke liye 121 par call karein (24/7). Duplicate SIM same number par milti hai — store visit with ID proof. eSIM activation Thanks app se hoti hai. SIM swap 4 hours mein complete hoti hai.',
    keywords: ['sim', 'lost', 'block', 'duplicate', 'esim', 'swap', 'new sim', 'replace'],
  },
  {
    id: 'faq_ott',
    content: 'OTT benefits: Postpaid 599+ plans mein Amazon Prime, Airtel Xstream Premium, Wynk Music free milta hai. Activate karne ke liye Thanks app > My Benefits section. Ek baar activate hone ke baad plan renewal par auto-renew hota hai.',
    keywords: ['ott', 'amazon', 'prime', 'netflix', 'hotstar', 'xstream', 'wynk', 'subscription', 'free'],
  },
  {
    id: 'faq_customer_care',
    content: 'Customer care: 121 (free, 24/7) — Airtel customers ke liye. 198 — complaints ke liye. WhatsApp: +91-9999-555-121. Email: airtel.presence@in.airtel.com. Chat: airtel.in website ya Thanks app. Store locator: airtel.in/store-locator.',
    keywords: ['help', 'support', 'contact', 'care', 'complaint', 'escalate', 'call', 'email', 'chat', '121'],
  },
  {
    id: 'faq_payment_failed',
    content: 'Payment failed: Amount 3-5 working days mein refund hota hai original payment method mein. Agar 7 din baad bhi nahi aaya toh 121 par call karein transaction ID ke saath. UPI failures ke liye apna bank bhi check karein.',
    keywords: ['failed', 'refund', 'deducted', 'not recharged', 'money', 'debit', 'transaction'],
  },
  {
    id: 'faq_plans_compare',
    content: 'Popular plans: ₹199 (28 days, 1GB/day), ₹299 (28 days, 1.5GB/day), ₹399 (28 days, 2GB/day + Disney+Hotstar), ₹599 (30 days, 2.5GB/day + Amazon Prime), ₹999 (84 days, 2GB/day). Best value: ₹599 plan with OTT benefits.',
    keywords: ['plan', 'compare', 'best', 'cheap', 'affordable', '199', '299', '399', '599', '999'],
  },
];

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
}

function score(doc: Document, queryTokens: string[]): number {
  let hits = 0;
  for (const qt of queryTokens) {
    if (doc.keywords.some((k) => k.includes(qt) || qt.includes(k))) hits += 2;
    if (doc.content.toLowerCase().includes(qt)) hits += 0.5;
  }
  return hits;
}

export const ragService = {
  retrieve: (query: string, topK = 1): Document[] => {
    const tokens = tokenize(query);
    return KNOWLEDGE_BASE
      .map((doc) => ({ doc, score: score(doc, tokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(({ doc }) => doc);
  },
};
