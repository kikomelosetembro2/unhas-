import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { StorageService } from '../services/storage';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState<string>('admin@bknails.com');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Por favor, informe seu usuário ou e-mail de administradora.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, digite a senha de acesso.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isValid = StorageService.validateAdminLogin(username, password);

      if (isValid) {
        StorageService.setAdminAuthenticated(true, rememberMe);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage('Credenciais incorretas. Verifique seu usuário e senha.');
      }
    }, 400);
  };

  const handleFillDemoCredentials = () => {
    setUsername('admin@bknails.com');
    setPassword('bknails2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-stone-50/60">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Header with Salon Brand Identity */}
        <div className="bg-stone-950 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Monogram Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-pink-500 text-white mx-auto flex items-center justify-center shadow-md mb-3 border border-pink-400/30">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase text-pink-400 block mb-1">
            Acesso Restrito · Gestão & Designer
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
            B & K NAILS DESIGNER
          </h2>
          <p className="text-xs text-stone-400 mt-1.5 max-w-xs mx-auto">
            Identifique-se para acessar o painel financeiro, agenda de atendimentos e catálogo de preços.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-600" />
                Usuário ou E-mail:
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin@bknails.com ou admin"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-500/20 outline-hidden text-xs sm:text-sm font-medium text-stone-900 transition-all placeholder:text-stone-400"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-pink-600" />
                  Senha de Acesso:
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Mínimo 6 dígitos</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha de administradora"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-500/20 outline-hidden text-xs sm:text-sm font-mono font-medium text-stone-900 transition-all placeholder:text-stone-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded-md border-stone-300 focus:ring-pink-500 accent-pink-600"
                />
                <span>Lembrar neste navegador</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-70 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Entrar no Painel Administrativo</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Helper for Salon Owners */}
          <div className="p-3.5 bg-pink-50/70 border border-pink-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                Acesso Inicial Proprietárias:
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[11px] font-bold text-pink-700 hover:text-pink-800 hover:underline"
              >
                Preencher Dados
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-700 pt-1">
              <div className="bg-white p-1.5 rounded-lg border border-pink-100">
                <span className="text-stone-400 block text-[9px] font-sans">E-mail / Usuário:</span>
                admin@bknails.com
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-pink-100">
                <span className="text-stone-400 block text-[9px] font-sans">Senha Padrão:</span>
                bknails2026
              </div>
            </div>
            <p className="text-[10px] text-stone-500">
              Você pode alterar seu e-mail e senha a qualquer momento na aba <b>Configurações</b> dentro do painel.
            </p>
          </div>

          {/* Back button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-stone-500 hover:text-stone-900 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Catálogo de Clientes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
