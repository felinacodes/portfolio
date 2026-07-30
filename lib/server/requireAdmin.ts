import { createAuthClient } from "./auth";

export async function requireAuth() {
  const supabase = await createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: factors, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    console.error(error);
    return null;
  }

  const hasVerifiedMFA = factors.all.some(
    (factor) => factor.factor_type === "totp" && factor.status === "verified",
  );

  if (!hasVerifiedMFA) {
    return user;
  }

  const { data: aal, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalError) {
    console.error(aalError);
    return null;
  }

  if (aal.currentLevel !== "aal2") {
    return null;
  }

  return user;
}
