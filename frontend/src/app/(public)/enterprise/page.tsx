import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plug, Users, LifeBuoy } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Enterprise Security", desc: "SOC 2 Type II, HIPAA, and GDPR compliant infrastructure." },
  { icon: Plug, title: "Custom Integrations", desc: "Connect to your CRM, helpdesk, or any internal system via API." },
  { icon: Users, title: "Dedicated Team", desc: "A dedicated success team to onboard and scale with you." },
  { icon: LifeBuoy, title: "24/7 SLA Support", desc: "Priority support with guaranteed response times." },
];

export default function EnterprisePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-3">Enterprise</Badge>
        <h1 className="text-4xl font-bold mb-4">Built for scale</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Enterprise-grade reliability, security, and support for teams handling millions of calls.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Icon className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button size="lg">Talk to Sales</Button>
      </div>
    </div>
  );
}
