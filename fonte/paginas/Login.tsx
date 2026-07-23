import { FormEvent, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/ganchoss/use-toast";
import { getUsers } from "@/dados/state";

type LoginProps = {
  onLoginSuccess: (login: string) => void;
};

const DEFAULT_CREDENTIALS = [
  { login: "admin@liga.com", password: "senha123" },
  { login: "moderator@liga.com", password: "senha123" },
  { login: "carlos.silva@email.com", password: "senha123" },
  { login: "admin", password: "senha123" },
];

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const localUsers = useMemo(() => getUsers(), []);

  const isValidCredentials = (loginValue: string, passwordValue: string) => {
    const normalizedLogin = loginValue.trim().toLowerCase();

    const existsInDefault = DEFAULT_CREDENTIALS.some(
      (credential) =>
        credential.login.toLowerCase() === normalizedLogin &&
        credential.password === passwordValue,
    );

    const existsInLocalUsers =
      passwordValue === "senha123" &&
      localUsers.some((user) => user.email.toLowerCase() === normalizedLogin);

    return existsInDefault || existsInLocalUsers;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!login.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe login e senha para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    if (!isValidCredentials(login, password)) {
      setIsLoading(false);
      toast({
        title: "Credenciais inválidas",
        description: "Verifique login e senha e tente novamente.",
        variant: "destructive",
      });
      return;
    }

    onLoginSuccess(login.trim());
    setIsLoading(false);

    toast({
      title: "Acesso liberado",
      description: "Login realizado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card w-full rounded-2xl border border-border/70 p-6"
      >
        <div className="mb-6 text-left">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-black">Entrar na Liga</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use seu login e senha para acessar a aplicacao.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Login
            </label>
            <input
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="Ex: admin@liga.com"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              className="w-full rounded-md border border-border bg-background/50 px-3 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Dica: usuario de exemplo admin@liga.com com senha senha123.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;