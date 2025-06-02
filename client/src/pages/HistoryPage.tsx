import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Translation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Translation history will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
