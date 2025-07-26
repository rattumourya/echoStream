
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, ShieldAlert } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

declare global {
    interface Window {
        confirmationResult?: ConfirmationResult;
    }
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      toast({
        title: 'Google Sign-In Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a production app, you would use a RecaptchaVerifier here.
      // For this development environment, we will rely on test numbers.
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, {
          // @ts-ignore
          'size': 'invisible',
          'callback': () => {}
      });
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: 'OTP Sent!', description: 'Please check your phone for the verification code.' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Failed to Send OTP',
        description: 'Please check the phone number and reCAPTCHA configuration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!window.confirmationResult) {
        toast({ title: 'Error', description: 'Please request an OTP first.', variant: 'destructive'});
        setLoading(false);
        return;
    }

    try {
      await window.confirmationResult.confirm(otp);
      router.push('/');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Invalid OTP',
        description: 'The OTP you entered is incorrect. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
                <AppLogo className="h-10 w-10 text-primary" />
                <h1 className="text-3xl font-bold font-headline">EchoStream</h1>
            </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your personalized library.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="phone">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
            <TabsContent value="phone" className="space-y-4 pt-4">
              {!otpSent ? (
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                   <Alert>
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>For Development Only</AlertTitle>
                    <AlertDescription>
                      Use a test number like <b className="font-mono">+1 650-555-3434</b> with the OTP <b className="font-mono">123456</b>.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 123 456 7890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </form>
              )}
               <div id="recaptcha-container"></div>
            </TabsContent>
            <TabsContent value="google" className="pt-4">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <Chrome className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
