import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DownloadsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Downloaded Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Downloaded languages for offline use will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
