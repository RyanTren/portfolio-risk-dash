import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { authApi, type UserProfile } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../hooks/useAlert";
import AlertPopUp from "../../components/ui/alert";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { alert, showAlert } = useAlert();

  // Profile form
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile();
        setProfile(response.data);
        setDisplayName(response.data.displayName || "");
        setEmail(response.data.email);
      } catch {
        showAlert("danger", "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [showAlert]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showAlert("warning", "Email is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert("warning", "Please enter a valid email address.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await authApi.updateProfile({
        displayName: displayName || undefined,
        email,
      });
      setProfile(response.data);
      showAlert("success", "Profile updated successfully!");
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 400) {
        showAlert("danger", "Email already taken.");
      } else {
        showAlert("danger", "Failed to update profile.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      showAlert("warning", "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      showAlert("warning", "New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("warning", "New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showAlert("success", "Password changed successfully!");
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 400) {
        showAlert("danger", "Current password is incorrect.");
      } else {
        showAlert("danger", "Failed to change password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {/* Profile Info Card */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
            {(profile?.displayName || profile?.username || "?")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile?.displayName || profile?.username}</h2>
            <p className="text-muted-foreground">@{profile?.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Role</span>
            <p className="font-medium">{profile?.role}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Member Since</span>
            <p className="font-medium">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Google Linked</span>
            <p className="font-medium">{profile?.hasGoogleLinked ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border mb-6">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="How should we call you?"
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
              disabled={isSaving}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      {!profile?.hasGoogleLinked && (
        <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter current password"
                autoComplete="current-password"
                disabled={isChangingPassword}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                disabled={isChangingPassword}
              />
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={isChangingPassword}
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      )}

      {alert && <AlertPopUp color={alert.color} title={alert.title} />}
    </div>
  );
}
