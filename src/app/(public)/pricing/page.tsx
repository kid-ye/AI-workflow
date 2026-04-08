import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    desc: "Perfect for small teams getting started.",
    features: ["1 AI Agent", "500 calls/mo", "Basic analytics", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$149",
    desc: "For growing businesses with higher call volumes.",
    features: ["5 AI Agents", "5,000 calls/mo", "Advanced analytics", "Priority support", "CRM integration"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored for large-scale operations.",
    features: ["Unlimited agents", "Unlimited calls", "Custom integrations", "Dedicated success manager", "SLA guarantee"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-3">Pricing</Badge>
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          No hidden fees. Scale up or down anytime.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(({ name, price, desc, features, cta, highlight }) => (
          <Card key={name} className={highlight ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              {highlight && <Badge className="w-fit mb-2">Most Popular</Badge>}
              <CardTitle className="text-xl">{name}</CardTitle>
              <div className="text-3xl font-bold">{price}<span className="text-sm font-normal text-muted-foreground">{price !== "Custom" ? "/mo" : ""}</span></div>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={highlight ? "default" : "outline"} className="w-full mt-2">{cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
