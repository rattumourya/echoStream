
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import withAuth from "@/components/with-auth";
import { useAuth } from "@/context/auth-context";
import ProtectedLayout from "@/components/protected-layout";

function SettingsPage() {
  const { user } = useAuth();
  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-headline font-bold">Settings</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold font-headline">Profile</h2>
            <p className="text-muted-foreground">Update your personal information.</p>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.displayName || 'Echo User'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || 'user@example.com'} disabled />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold font-headline">Account</h2>
            <p className="text-muted-foreground">Manage your account settings.</p>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>Permanently delete your account and all of your content.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

export default withAuth(SettingsPage);
