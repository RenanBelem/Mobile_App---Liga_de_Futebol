/**
 * SRC/COMPONENTS/CREATEUSERFORM.TSX
 * ===============================
 * PROPÓSITO: Formulário para criar/registrar novos usuários
 * - Captura dados de cadastro (nome, email, senha, função)
 * - Valida informações com Zod schema
 * - Salva usuário no localStorage via state.ts
 * MOTIVO: Componente de CRUD essencial para gerência de acesso,
 * permitindo registro de novos usuários (jogadores, fãs, moderadores)
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Mail, Lock, User, Phone, Shield } from "lucide-react";
import { addUser } from "@/data/state";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const userSchema = z.object({
  name: z.string().min(3, { message: "Nome precisa ter pelo menos 3 letras." }),
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Senha precisa ter pelo menos 6 caracteres." }),
  confirmPassword: z.string(),
  role: z.enum(["player", "fan", "moderator", "admin"], {
    required_error: "Selecione uma função.",
  }),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "fan",
      phone: "",
    },
  });

  function onSubmit(data: UserFormValues) {
    try {
      setIsLoading(true);
      
      // Salva o usuário em localStorage
      const newUser = addUser({
        name: data.name,
        email: data.email,
        role: data.role as 'admin' | 'moderator' | 'player' | 'fan',
        phone: data.phone || undefined,
      });

      toast({
        title: "Sucesso!",
        description: `Usuário ${data.name} cadastrado com sucesso!`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const roleLabels = {
    fan: "Torcedor",
    player: "Jogador",
    moderator: "Moderador",
    admin: "Administrador",
  };

  return (
    <div className="glass-card rounded-lg p-5 border border-border/50">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <UserPlus className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Cadastrar Usuário</h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3 h-3" /> Nome completo
          </label>
          <input
            {...form.register("name")}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: João da Silva"
          />
          {form.formState.errors.name && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.name.message}</span>
          )}
        </div>

        {/* E-mail */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3 h-3" /> E-mail
          </label>
          <input
            {...form.register("email")}
            type="email"
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: joao@email.com"
          />
          {form.formState.errors.email && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.email.message}</span>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3 h-3" /> Telefone <span className="text-muted-foreground/50 normal-case">(opcional)</span>
          </label>
          <input
            {...form.register("phone")}
            type="tel"
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: (11) 99999-0000"
          />
        </div>

        {/* Função */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Função
          </label>
          <select
            {...form.register("role")}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value} className="bg-background text-foreground">
                {label}
              </option>
            ))}
          </select>
          {form.formState.errors.role && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.role.message}</span>
          )}
        </div>

        {/* Senha */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Senha
            </label>
            <input
              {...form.register("password")}
              type="password"
              className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
              placeholder="••••••"
            />
            {form.formState.errors.password && (
              <span className="text-destructive text-xs mt-1 block">{form.formState.errors.password.message}</span>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Confirmar
            </label>
            <input
              {...form.register("confirmPassword")}
              type="password"
              className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
              placeholder="••••••"
            />
            {form.formState.errors.confirmPassword && (
              <span className="text-destructive text-xs mt-1 block">{form.formState.errors.confirmPassword.message}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-md hover:bg-primary/90 transition-colors mt-2"
        >
          Cadastrar Usuário
        </button>
      </form>
    </div>
  );
}
