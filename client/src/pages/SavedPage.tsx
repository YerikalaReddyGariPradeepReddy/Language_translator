import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SavedPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Saved Translations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Saved translations will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
