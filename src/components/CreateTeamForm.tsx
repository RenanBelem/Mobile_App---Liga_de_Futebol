/**
 * SRC/COMPONENTS/CREATETEAMFORM.TSX
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
import { Plus, Shield, Type, Image as ImageIcon, Calendar, UploadCloud } from "lucide-react";
import { addTeam } from "@/data/state";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// 1. Atualizamos o schema: sai "logoUrl", entra "logo"
const teamSchema = z.object({
  name: z.string().min(3, { message: "O nome do time precisa ter pelo menos 3 letras." }),
  shortName: z.string().max(4, { message: "A sigla deve ter no máximo 4 letras." }),
  logo: z.any().optional(), // Usamos "any" por enquanto para aceitar o objeto FileList do HTML
  foundationYear: z.string().regex(/^\d{4}$/, { message: "Ano inválido." }).optional().or(z.literal('')),
});

type TeamFormValues = z.infer<typeof teamSchema>;

export default function CreateTeamForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      shortName: "",
      foundationYear: "",
    },
  });

  // 2. Observamos o campo "logo" em tempo real
  const logoFile = form.watch("logo");
  
  // 3. Geramos uma URL temporária no navegador para mostrar o preview
  const previewUrl = logoFile && logoFile.length > 0 ? URL.createObjectURL(logoFile[0]) : null;

  function onSubmit(data: TeamFormValues) {
    try {
      setIsLoading(true);
      
      // Salva o time em localStorage
      const newTeam = addTeam({
        name: data.name,
        shortName: data.shortName,
        foundationYear: data.foundationYear || undefined,
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

        {/* 4. Novo Campo: Upload de Escudo com Preview */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" /> Escudo do Time
          </label>
          
          <div className="flex items-center gap-4">
            {/* Círculo de Preview */}
            <div className="w-16 h-16 rounded-full bg-background/40 border-2 border-dashed border-border flex items-center justify-center overflow-hidden shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview do escudo" className="w-full h-full object-cover" />
              ) : (
                <UploadCloud className="w-6 h-6 text-muted-foreground/50" />
              )}
            </div>

            {/* Input de Arquivo Customizado com Tailwind */}
            <input 
              type="file" 
              accept="image/*"
              {...form.register("logo")} 
              className="w-full text-sm text-foreground 
                file:mr-4 file:py-2.5 file:px-4 
                file:rounded-md file:border-0 
                file:text-xs file:font-semibold file:uppercase file:tracking-wider
                file:bg-primary/20 file:text-primary 
                hover:file:bg-primary/30 transition-all cursor-pointer"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground p-3 rounded-md font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-6"
        >
          <Plus className="w-5 h-5" /> Salvar Time
        </button>
      </form>
    </div>
  );
}