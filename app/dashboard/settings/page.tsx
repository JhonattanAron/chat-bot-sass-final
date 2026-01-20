"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Assuming you're using next-auth
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Bell,
  Mail,
  Smartphone,
  Trash2,
  Key,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ApiKeyManager } from "@/components/api-key-manager";
import { useSettingsStore } from "@/store/SettingsStore";
import { useToast } from "@/hooks/use-toast";
import { PlansCheckout } from "@/components/checkout-form";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const {
    profile,
    notifications,
    billing,
    isLoading,
    isSaving,
    error,
    fetchAllData,
    updateProfile,
    updatePassword,
    updateNotifications,
    deleteAccount,
    clearError,
  } = useSettingsStore();

  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationForm, setNotificationForm] = useState(notifications);

  // Get user ID from session
  const userId = session?.binding_id;

  useEffect(() => {
    if (userId && status === "authenticated") {
      //fetchAllData(userId);
    }
  }, [userId, status, fetchAllData]);

  useEffect(() => {
    setProfileForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      company: profile.company,
    });
  }, [profile]);

  useEffect(() => {
    setNotificationForm(notifications);
  }, [notifications]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    await updateProfile(profileForm, userId);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    await updatePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      userId
    );
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast({
      title: "Success",
      description: "Password updated successfully",
    });
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    await updateNotifications(notificationForm, userId);
    toast({
      title: "Success",
      description: "Notification preferences updated successfully",
    });
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;

    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      await deleteAccount(userId);
    }
  };

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Authentication Required</h3>
            <p className="text-sm text-muted-foreground">
              Please log in to access your settings.
            </p>
            <Button
              className="mt-4"
              onClick={() => (window.location.href = "/auth/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Loading your settings...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and preferences.
            {session?.user?.name && (
              <span className="block text-sm mt-1">
                Logged in as:{" "}
                <span className="font-medium">{session.user.name}</span>
              </span>
            )}
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="glass-effect border border-border/50">
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground"
            >
              Account
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground"
            >
              <Key className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="text-xl">Profile</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        id="first-name"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            firstName: e.target.value,
                          })
                        }
                        className="glass-effect border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            lastName: e.target.value,
                          })
                        }
                        className="glass-effect border-border/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="glass-effect border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileForm.company}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          company: e.target.value,
                        })
                      }
                      className="glass-effect border-border/50"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Save changes
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="text-xl">Password</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="glass-effect border-border/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="glass-effect border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="glass-effect border-border/50"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Update password
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="futuristic-card border-destructive/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-destructive">
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="destructive"
                    className="bg-gradient-to-r from-destructive to-destructive/80"
                  >
                    Danger
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-destructive/20 bg-gradient-to-r from-destructive/5 to-destructive/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all of your data.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-destructive to-destructive/80"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleNotificationSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <Label
                          htmlFor="email-notifications"
                          className="font-normal"
                        >
                          Email Notifications
                        </Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationForm.email}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            email: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <Label
                          htmlFor="push-notifications"
                          className="font-normal"
                        >
                          Push Notifications
                        </Label>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notificationForm.push}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            push: checked,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <Label
                          htmlFor="sms-notifications"
                          className="font-normal"
                        >
                          SMS Notifications
                        </Label>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notificationForm.sms}
                        onCheckedChange={(checked) =>
                          setNotificationForm({
                            ...notificationForm,
                            sms: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-6">
                    <h4 className="text-sm font-medium">Notification Types</h4>
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bot-activity" className="font-normal">
                          Bot Activity
                        </Label>
                        <Switch
                          id="bot-activity"
                          checked={notificationForm.botActivity}
                          onCheckedChange={(checked) =>
                            setNotificationForm({
                              ...notificationForm,
                              botActivity: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="billing-updates"
                          className="font-normal"
                        >
                          Billing Updates
                        </Label>
                        <Switch
                          id="billing-updates"
                          checked={notificationForm.billingUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationForm({
                              ...notificationForm,
                              billingUpdates: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="new-features" className="font-normal">
                          New Features
                        </Label>
                        <Switch
                          id="new-features"
                          checked={notificationForm.newFeatures}
                          onCheckedChange={(checked) =>
                            setNotificationForm({
                              ...notificationForm,
                              newFeatures: checked,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="marketing" className="font-normal">
                          Marketing & Promotions
                        </Label>
                        <Switch
                          id="marketing"
                          checked={notificationForm.marketing}
                          onCheckedChange={(checked) =>
                            setNotificationForm({
                              ...notificationForm,
                              marketing: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Save preferences
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <ApiKeyManager userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
