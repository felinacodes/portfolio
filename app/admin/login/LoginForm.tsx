"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

type TotpFactor = {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [factor, setFactor] = useState<TotpFactor | null>(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [enableFactor, setEnableFactor] = useState(false);

  const router = useRouter();

  async function login() {
    setLoading(true);
    setError("");

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const enabled = await isMFAEnabled();

    if (enabled) {
      setVerifying(true);
    } else {
      setEnableFactor(true);
    }

    setLoading(false);
  }

  async function isMFAEnabled() {
    const { data, error } = await supabaseClient.auth.mfa.listFactors();

    if (error || !data) {
      console.error(error);
      return false;
    }

    const totpFactor = data.all.find((factor) => factor.factor_type === "totp");

    return totpFactor?.status === "verified";
  }

  const skip2FA = () => {
    router.push("/admin");
    router.refresh();
  };

  const enableTFA = async () => {
    setLoading(true);
    const { data: factors, error } =
      await supabaseClient.auth.mfa.listFactors();

    if (error || !factors) {
      setLoading(false);
      console.error(error);
      return;
    }

    const existingFactor = factors.all.find(
      (factor) => factor.factor_type === "totp",
    );

    if (existingFactor?.status === "unverified") {
      const { error: unenrollError } = await supabaseClient.auth.mfa.unenroll({
        factorId: existingFactor.id,
      });

      if (unenrollError) {
        console.error(unenrollError);
        setLoading(false);
        return;
      }
    }

    const { data: enrolled, error: enrollError } =
      await supabaseClient.auth.mfa.enroll({
        factorType: "totp",
      });

    if (enrollError || !enrolled) {
      console.error(enrollError);
      setLoading(false);
      return;
    }

    setFactor(enrolled as TotpFactor);
    setLoading(false);
  };

  const getTOTPFactor = async () => {
    const { data, error } = await supabaseClient.auth.mfa.listFactors();

    if (error || !data) {
      console.error(error);
      setLoading(false);
      return null;
    }

    return data.all.find(
      (factor) => factor.factor_type === "totp" && factor.status === "verified",
    );
  };

  const verifyTFA = async () => {
    setLoading(true);
    const factor = await getTOTPFactor();

    if (!factor) {
      setError("No verified 2FA factor found");
      setLoading(false);
      return;
    }

    const { data: challenge, error: challengeError } =
      await supabaseClient.auth.mfa.challenge({
        factorId: factor.id,
      });

    if (challengeError) {
      console.error(challengeError);
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabaseClient.auth.mfa.verify({
      factorId: factor.id,
      challengeId: challenge.id,
      code: otp,
    });

    if (verifyError) {
      setError("Invalid authentication code");
      setLoading(false);
      return;
    }

    const { data: aal } =
      await supabaseClient.auth.mfa.getAuthenticatorAssuranceLevel();

    console.log(aal);

    if (aal?.currentLevel === "aal2") {
      router.push("/admin");
      router.refresh();
    }
  };

  const verifySetupTFA = async () => {
    setLoading(true);
    setError("");
    if (!factor) return;

    const { error } = await supabaseClient.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code: otp,
    });

    if (error) {
      setError("Invalid authentication code");
      setLoading(false);
      return;
    }

    setFactor(null);
    setOtp("");
    setEnableFactor(false);

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className="flex flex-col gap-4 p-8 justify-center items-center
       bg-myPink border-2 border-gray-200 rounded-xl "
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          className="
            w-full 
            border-2 
            rounded-lg 
            focus:outline-none 
            focus:border-gray-400
            focus:ring-2
            focus:ring-gray-200
            "
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative w-full">
          <input
            className="
            w-full 
            border-2 
            rounded-lg 
            focus:outline-none 
            focus:border-gray-400
            focus:ring-2
            focus:ring-gray-200
            pr-10
            "
            type={showPassword ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-gray-500
            hover:text-gray-700
            cursor-pointer
            "
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          className="
        border-2 
        rounded-lg 
        bg-gray-200 
        text-gray-700 
        hover:bg-gray-300 
        transition-colors
        px-4 py-2
        mt-4
        cursor-pointer
        "
          disabled={loading}
          onClick={login}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      {enableFactor && !factor && (
        <>
          <button
            disabled={loading}
            onClick={enableTFA}
            className="
            border-2 
            rounded-lg 
            bg-gray-200 
            px-4 py-2
            cursor-pointer  
            "
          >
            Enable 2FA
          </button>
          <button
            onClick={() => skip2FA()}
            className="
            border-2 
            rounded-lg 
            bg-gray-200 
            px-4 py-2
            cursor-pointer  
          "
          >
            Skip 2FA for now
          </button>
        </>
      )}
      <div>
        {factor?.totp && (
          <div
            className="
            flex flex-col
            gap-4
            p-8
            justify-center items-center"
          >
            <p>Scan this QR code with Google Authenticator or Authy.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={factor.totp.qr_code}
              alt="Scan QR code"
              className="w-48 h-48"
            />

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="border rounded-lg p-2"
            />

            <button onClick={verifySetupTFA} className="border rounded-lg p-2 ">
              Verify
            </button>
          </div>
        )}
      </div>
      {verifying && (
        <>
          <p>Enter the code from your authenticator app.</p>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="border rounded-lg p-2"
          />
          <button
            disabled={loading}
            onClick={verifyTFA}
            className="
            border-2 
            rounded-lg 
            bg-gray-200 
            px-4 py-2 mt-2
            cursor-pointer
          "
          >
            Verify
          </button>
        </>
      )}
    </div>
  );
}
