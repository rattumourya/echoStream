
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import withAuth from "@/components/with-auth";
import { useAuth } from "@/context/auth-context";
import ProtectedLayout from "@/components/protected-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


function SettingsPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!auth.currentUser) {
      toast({ title: 'Error', description: 'Not authenticated.', variant: 'destructive'});
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      });
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { name: data.name });

      toast({
        title: "Profile Updated",
        description: "Your name has been updated successfully."
      })
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your profile.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpgrade = () => {
      toast({
          title: "Coming Soon!",
          description: "Premium features are under development."
      })
  }

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
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                             <Input placeholder="Your Email" {...field} disabled />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold font-headline">Subscription</h2>
            <p className="text-muted-foreground">Manage your subscription plan.</p>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Plan</span>
                    {userProfile?.isPremium ? (
                       <Badge>Premium</Badge>
                    ) : (
                       <Badge variant="secondary">Free</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {userProfile?.isPremium 
                      ? "You have access to all features." 
                      : "Upgrade to premium to listen to all songs."}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                {!userProfile?.isPremium && (
                  <Button onClick={handleUpgrade}>
                      <Star className="mr-2 h-4 w-4" /> Go Premium
                  </Button>
                )}
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
