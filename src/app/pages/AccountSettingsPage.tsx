import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { PageShell } from "@/app/components/shared";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/lib/api";
import { T } from "@/app/lib/theme";

export function AccountSettingsPage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    country: user?.country || "",
    newsletterOptIn: user?.newsletterOptIn ?? true,
  });
  const [confirmDelete, setConfirmDelete] = useState("");
  const [msg, setMsg] = useState("");

  if (!user) {
    return (
      <PageShell>
        <p>Please <a href="/login">sign in</a> to manage your account.</p>
      </PageShell>
    );
  }

  async function saveProfile() {
    try {
      await api.updateProfile(profile);
      setMsg("Profile updated.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function downloadData() {
    const data = await api.exportAccountData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gysc-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount() {
    try {
      await api.deleteAccount(confirmDelete);
      await logout();
      window.location.href = "/";
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <PageShell>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: T.navy, marginBottom: 8 }}>Account Settings</h1>
      <p style={{ color: T.muted, marginBottom: 28 }}>Manage your profile and data rights.</p>
      {msg && <p style={{ marginBottom: 16, color: T.teal, fontWeight: 600 }}>{msg}</p>}

      <section className="account-panel">
        <h2>Edit profile</h2>
        <div className="auth-fields">
          <input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} placeholder="First name" />
          <input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} placeholder="Last name" />
          <input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="Country" />
          <label className="reg-check">
            <input type="checkbox" checked={profile.newsletterOptIn} onChange={(e) => setProfile({ ...profile, newsletterOptIn: e.target.checked })} />
            Newsletter opt-in
          </label>
        </div>
        <button className="btn btn-teal btn-sm" type="button" onClick={saveProfile}>Save changes</button>
      </section>

      <section className="account-panel">
        <h2>Download my data</h2>
        <p style={{ color: T.body, marginBottom: 12 }}>Export a JSON copy of the personal data GYSC holds about you.</p>
        <button className="btn btn-ghost btn-sm" type="button" onClick={downloadData}><Download size={14} /> Download</button>
      </section>

      <section className="account-panel account-danger">
        <h2>Delete account</h2>
        <p style={{ color: T.body, marginBottom: 12 }}>Type DELETE to confirm. Your record will be anonymized — not permanently erased.</p>
        <input value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} placeholder="Type DELETE" style={{ marginBottom: 12, width: "100%", height: 42, padding: "0 12px", borderRadius: 8, border: `1px solid ${T.border}` }} />
        <button className="btn btn-outline-teal btn-sm" type="button" onClick={deleteAccount} disabled={confirmDelete !== "DELETE"}>
          <Trash2 size={14} /> Delete my account
        </button>
      </section>
    </PageShell>
  );
}
