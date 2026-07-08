"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WaveIcon } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-dvh bg-[#F7F4F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <WaveIcon className="w-14 h-14 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Área restrita</h1>
          <p className="text-sm text-[#8B4F1E] mt-1">
            Dashboard da fonoaudióloga
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#FDDFC4] p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-sm font-semibold text-[#8B4F1E] mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="camila@exemplo.com"
              required
              autoComplete="email"
              className="w-full h-12 px-4 rounded-xl border-2 border-[#FDDFC4] bg-white text-[#2C1A0E] text-base focus:outline-none focus:border-[#F5A877] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#8B4F1E] mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full h-12 px-4 rounded-xl border-2 border-[#FDDFC4] bg-white text-[#2C1A0E] text-base focus:outline-none focus:border-[#F5A877] transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Entrar
          </Button>
        </form>
      </div>
    </main>
  );
}
