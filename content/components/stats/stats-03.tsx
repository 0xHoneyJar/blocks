"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const data = [
  {
    name: "Unique visitors",
    stat: "10,450",
    change: "-12.5%",
    changeType: "negative",
  },
  {
    name: "Bounce rate",
    stat: "56.1%",
    change: "+1.8%",
    changeType: "positive",
  },
  {
    name: "Visit duration",
    stat: "5.2min",
    change: "+19.7%",
    changeType: "positive",
  },
];

export default function StatsCards() {
  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 m-3">
      {data.map((item) => (
        <Card key={item.name} className="p-6">
          <CardContent className="p-0">
            <dt className="text-sm font-medium text-muted-foreground">
              {item.name}
            </dt>
            <dd className="mt-2 flex items-baseline space-x-2.5">
              <span className="text-3xl font-semibold text-foreground">
                {item.stat}
              </span>
              <span
                className={cn(
                  item.changeType === "positive"
                    ? "text-green-800 dark:text-green-400"
                    : "text-red-800 dark:text-red-400",
                  "text-sm font-medium"
                )}
              >
                {item.change}
              </span>
            </dd>
          </CardContent>
        </Card>
      ))}
    </dl>
  );
}
