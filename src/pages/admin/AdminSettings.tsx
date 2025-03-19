import { useState } from "react";
import AdminNavigation from "@/components/AdminNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Settings, Key, Mail, Bell, Shield, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  // console.log(user)
  // Mock data - in a real application, this would be fetched from an API
  const [settings, setSettings] = useState({
    email: user.email,
    notifications: {
      emailAlerts: true,
      systemAlerts: true,
      userRegistrations: false,
      doctorRegistrations: true,
      paymentAlerts: true,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30, // minutes
    },
  });

  const handleSaveSettings = (section: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings updated",
        description: `Your ${section} settings have been saved successfully.`,
      });
    }, 1000);
  };

  const handleToggleSetting = (category: string, setting: string) => {
    if (category === "notifications") {
      setSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          [setting]:
            !settings.notifications[
              setting as keyof typeof settings.notifications
            ],
        },
      });
    } else if (category === "security") {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          [setting]:
            !settings.security[setting as keyof typeof settings.security],
        },
      });
    }
  };

  const handleSessionTimeoutChange = (value: string) => {
    const timeout = parseInt(value);
    if (!isNaN(timeout) && timeout > 0) {
      setSettings({
        ...settings,
        security: {
          ...settings.security,
          sessionTimeout: timeout,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-mindease-background">
      <AdminNavigation />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
        <p className="text-gray-600 mb-8">
          Configure your admin account and system preferences
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <a
                    href="#account"
                    className="flex items-center px-3 py-2 rounded-md bg-mindease-primary/10 text-mindease-primary font-medium"
                  >
                    <Mail className="mr-3 h-5 w-5" />
                    Account Settings
                  </a>
                  <a
                    onClick={() => {
                      alert("coming soon!");
                    }}
                    // href="#notifications"
                    className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Bell className="mr-3 h-5 w-5" />
                    Notification Preferences (not available)
                  </a>
                  <a
                    onClick={() => {
                      alert("coming soon!");
                    }}
                    // href="#security"
                    className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Security Settings (not available)
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card id="account">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your administrator account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      disabled={true}
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                      placeholder="admin@mindease.com"
                    />
                    <p className="text-sm text-muted-foreground">
                      This email will be used for admin notifications and
                      account recovery
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      disabled={true}
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="new-password">
                      New Password (Optional)
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <p className="text-sm text-muted-foreground">
                      Password must be at least 8 characters and include upper
                      and lowercase letters, a number, and a special character
                    </p>
                  </div>

                  <Button
                    onClick={() => handleSaveSettings("account")}
                    disabled={isLoading}
                    className="bg-mindease-primary hover:bg-mindease-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button> */}
                </div>
              </CardContent>
            </Card>

            {/* <Card id="notifications">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what events trigger admin notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive system alerts via email
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="email-alerts"
                          checked={settings.notifications.emailAlerts}
                          onChange={() =>
                            handleToggleSetting("notifications", "emailAlerts")
                          }
                          className="w-5 h-5 rounded text-mindease-primary focus:ring-mindease-primary/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">System Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Notifications for system issues and performance
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="system-alerts"
                          checked={settings.notifications.systemAlerts}
                          onChange={() =>
                            handleToggleSetting("notifications", "systemAlerts")
                          }
                          className="w-5 h-5 rounded text-mindease-primary focus:ring-mindease-primary/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">User Registrations</h4>
                        <p className="text-sm text-muted-foreground">
                          Alerts for new user sign-ups
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="user-registrations"
                          checked={settings.notifications.userRegistrations}
                          onChange={() =>
                            handleToggleSetting(
                              "notifications",
                              "userRegistrations"
                            )
                          }
                          className="w-5 h-5 rounded text-mindease-primary focus:ring-mindease-primary/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Doctor Registrations</h4>
                        <p className="text-sm text-muted-foreground">
                          Alerts for new doctor applications
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="doctor-registrations"
                          checked={settings.notifications.doctorRegistrations}
                          onChange={() =>
                            handleToggleSetting(
                              "notifications",
                              "doctorRegistrations"
                            )
                          }
                          className="w-5 h-5 rounded text-mindease-primary focus:ring-mindease-primary/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Payment Alerts</h4>
                        <p className="text-sm text-muted-foreground">
                          Notifications for payment issues
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="payment-alerts"
                          checked={settings.notifications.paymentAlerts}
                          onChange={() =>
                            handleToggleSetting(
                              "notifications",
                              "paymentAlerts"
                            )
                          }
                          className="w-5 h-5 rounded text-mindease-primary focus:ring-mindease-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSaveSettings("notification")}
                    disabled={isLoading}
                    className="bg-mindease-primary hover:bg-mindease-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card> */}

            {/* <Card id="security">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure advanced security options for your admin account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Require a second form of verification when signing in
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="two-factor"
                          checked={settings.security.twoFactorAuth}
                          onChange={() =>
                            handleToggleSetting("security", "twoFactorAuth")
                          }
                          className="w-5 h-5 rounded text-mindease-primary focus:ring-mindease-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">
                        Session Timeout (minutes)
                      </Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        min="5"
                        max="120"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          handleSessionTimeoutChange(e.target.value)
                        }
                      />
                      <p className="text-sm text-muted-foreground">
                        Automatically sign out after inactivity period (5-120
                        minutes)
                      </p>
                    </div>

                    <div className="p-4 border rounded bg-yellow-50 border-yellow-200">
                      <div className="flex items-start">
                        <Key className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            API Access Keys
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your admin account has access to sensitive API keys.
                            Please ensure these are kept secure and rotated
                            regularly.
                          </p>
                          <Button
                            variant="outline"
                            className="mt-3 text-xs h-8 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                          >
                            Manage API Keys
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSaveSettings("security")}
                    disabled={isLoading}
                    className="bg-mindease-primary hover:bg-mindease-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Security Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
