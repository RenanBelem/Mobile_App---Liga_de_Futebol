/**
 * SRC/componentes/CREATETEAMFORM.TSX
 * ===============================
 * PROPÓSITO: Formulário para criar/adicionar novos times
 * - Captura dados do time (nome, sigla, fundação, logo)
 * - Valida informações com Zod schema
 * - Salva time no localStorage via state.ts
 * MOTIVO: Componente de CRUD essencial para gerência de times,
 * permitindo admins cadastrar novos times na liga
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Shield, Type, Image as ImageIcon, Calendar, Palette } from "lucide-react";
import { useToast } from "@/ganchos/use-toast";
import { useState } from "react";
import { dataGateway } from "@/servicos/dataGateway";

const teamSchema = z.object({
  name: z.string().min(3, { message: "O nome do time precisa ter pelo menos 3 letras." }),
  shortName: z.string().max(4, { message: "A sigla deve ter no máximo 4 letras." }).optional().or(z.literal('')),
  logoUrl: z.string().url({ message: "URL do escudo inválida." }).optional().or(z.literal('')),
  coverImageUrl: z.string().url({ message: "URL da imagem de capa inválida." }).optional().or(z.literal('')),
  uniformUrl: z.string().url({ message: "URL do uniforme inválida." }).optional().or(z.literal('')),
  primaryColor: z.string().optional(),
  foundationYear: z.string().regex(/^\d{4}$/, { message: "Ano inválido." }).optional().or(z.literal('')),
});

type TeamFormValues = z.infer<typeof teamSchema>;

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

export default function CreateTeamForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      shortName: "",
      logoUrl: "",
      coverImageUrl: "",
      uniformUrl: "",
      primaryColor: "",
      foundationYear: "",
    },
  });

  async function onSubmit(data: TeamFormValues) {
    try {
      setIsLoading(true);
      const nowIso = new Date().toISOString();

      await dataGateway.insert('teams', {
        league_id: 'l1',
        name: data.name,
        slug: toSlug(data.name),
        colors: data.primaryColor || '#dc2626',
        secondary_color: undefined,
        abbreviation: data.shortName?.toUpperCase() || undefined,
        founded_year: data.foundationYear ? Number(data.foundationYear) : undefined,
        city: undefined,
        state: undefined,
        logo_url: data.logoUrl || data.uniformUrl || undefined,
        banner_url: data.coverImageUrl || undefined,
        description: undefined,
        stadium_name: undefined,
        president_name: undefined,
        coach_name: undefined,
        created_at: nowIso,
        updated_at: nowIso,
        is_active: true,
      });

      toast({
        title: "Sucesso!",
        description: `Time ${data.name} cadastrado com sucesso!`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar time. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-lg p-5 border border-border/50">
      
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Cadastrar Novo Time</h2>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo: Nome */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Type className="w-3 h-3" /> Nome do Time
          </label>
          <input 
            {...form.register("name")} 
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: Sociedade Esportiva Palmeiras"
          />
          {form.formState.errors.name && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.name.message}</span>
          )}
        </div>

        {/* Sigla e Fundação */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Sigla
            </label>
            <input 
              {...form.register("shortName")} 
              className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all uppercase"
              placeholder="Ex: PALM"
              maxLength={4}
            />
            {form.formState.errors.shortName && (
              <span className="text-destructive text-xs mt-1 block">{form.formState.errors.shortName.message}</span>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Fundação
            </label>
            <input 
              {...form.register("foundationYear")} 
              className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
              placeholder="Ex: 1914"
              maxLength={4}
            />
            {form.formState.errors.foundationYear && (
              <span className="text-destructive text-xs mt-1 block">{form.formState.errors.foundationYear.message}</span>
            )}
          </div>
        </div>

        {/* Cor principal */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3 h-3" /> Cor principal <span className="text-muted-foreground/50 normal-case">(opcional)</span>
          </label>
          <input
            {...form.register("primaryColor")}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: #dc2626"
          />
        </div>

        {/* URL do escudo */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> URL do escudo <span className="text-muted-foreground/50 normal-case">(opcional)</span>
          </label>
          <input
            {...form.register("logoUrl")}
            type="url"
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: https://meusite.com/escudo.png"
          />
          {form.formState.errors.logoUrl && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.logoUrl.message}</span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> Imagem de capa <span className="text-muted-foreground/50 normal-case">(opcional)</span>
          </label>
          <input
            {...form.register("coverImageUrl")}
            type="url"
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: https://meusite.com/capa.png"
          />
          {form.formState.errors.coverImageUrl && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.coverImageUrl.message}</span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> Uniforme titular <span className="text-muted-foreground/50 normal-case">(opcional)</span>
          </label>
          <input
            {...form.register("uniformUrl")}
            type="url"
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: https://meusite.com/uniforme.png"
          />
          {form.formState.errors.uniformUrl && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.uniformUrl.message}</span>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground p-3 rounded-md font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-6"
        >
          <Plus className="w-5 h-5" /> {isLoading ? "Salvando..." : "Salvar Time"}
        </button>
      </form>
    </div>
  );
}