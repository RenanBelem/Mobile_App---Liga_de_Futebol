import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addTournament } from "@/dados/state";
import { useToast } from "@/ganchos/use-toast";
import { useState } from "react";
import { Trophy, CalendarDays, Flag, Layers, CircleDot } from "lucide-react";

const tournamentSchema = z.object({
  name: z.string().min(3, { message: "Nome precisa ter pelo menos 3 letras." }),
  leagueId: z.string().min(1, { message: "Informe o ID da liga." }),
  type: z.enum(["league", "cup"], {
    required_error: "Selecione o tipo de torneio.",
  }),
  season: z.string().min(2, { message: "Informe a temporada." }),
  status: z.enum(["draft", "ongoing", "finished"], {
    required_error: "Selecione o status.",
  }),
});

type TournamentFormValues = z.infer<typeof tournamentSchema>;

export default function CreateTournamentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TournamentFormValues>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: "",
      leagueId: "l1",
      type: "league",
      season: new Date().getFullYear().toString(),
      status: "draft",
    },
  });

  function onSubmit(data: TournamentFormValues) {
    try {
      setIsLoading(true);

      addTournament({
        name: data.name,
        leagueId: data.leagueId,
        type: data.type,
        season: data.season,
        status: data.status,
      });

      toast({
        title: "Sucesso!",
        description: `Torneio ${data.name} cadastrado com sucesso!`,
      });

      form.reset({
        name: "",
        leagueId: data.leagueId,
        type: data.type,
        season: data.season,
        status: "draft",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar torneio. Tente novamente.",
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
          <Trophy className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Cadastrar Torneio</h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Flag className="w-3 h-3" /> Nome do torneio
          </label>
          <input
            {...form.register("name")}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: Campeonato Principal 2026"
          />
          {form.formState.errors.name && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> ID da liga
          </label>
          <input
            {...form.register("leagueId")}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
            placeholder="Ex: l1"
          />
          {form.formState.errors.leagueId && (
            <span className="text-destructive text-xs mt-1 block">{form.formState.errors.leagueId.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CircleDot className="w-3 h-3" /> Tipo
            </label>
            <select
              {...form.register("type")}
              className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
            >
              <option value="league" className="bg-background text-foreground">Campeonato</option>
              <option value="cup" className="bg-background text-foreground">Copa</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3" /> Temporada
            </label>
            <input
              {...form.register("season")}
              className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
              placeholder="Ex: 2026"
            />
            {form.formState.errors.season && (
              <span className="text-destructive text-xs mt-1 block">{form.formState.errors.season.message}</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <CircleDot className="w-3 h-3" /> Status
          </label>
          <select
            {...form.register("status")}
            className="w-full p-2.5 bg-background/40 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
          >
            <option value="draft" className="bg-background text-foreground">Rascunho</option>
            <option value="ongoing" className="bg-background text-foreground">Em andamento</option>
            <option value="finished" className="bg-background text-foreground">Finalizado</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-md hover:bg-primary/90 transition-colors mt-2"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Torneio"}
        </button>
      </form>
    </div>
  );
}
