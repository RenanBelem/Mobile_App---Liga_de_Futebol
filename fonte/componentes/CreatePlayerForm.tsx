/**
 * SRC/componentes/CREATEPLAYERFORM.TSX
 * ===============================
 * PROPÓSITO: Formulário para criar/adicionar novos jogadores
 * - Captura dados do jogador (nome, número, posição, time)
 * - Valida informações com Zod schema
 * - Salva jogador em localStorage via state.ts
 * MOTIVO: Componente de CRUD essencial para gerência de jogadores,
 * permitindo admins e moderadores adicionar atletas à liga
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/componentes/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/componentes/ui/form";
import { useToast } from "@/ganchos/use-toast";
import { teamService } from "@/servicos/apiRoutes";
import { dataGateway } from "@/servicos/dataGateway";
import { Users } from "lucide-react";

const positions = [
  "Goleiro",
  "Zagueiro",
  "Lateral-Esquerdo",
  "Lateral-Direito",
  "Meio-Campista",
  "Meia-Atacante",
  "Atacante",
];

const playerSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  shirtNumber: z.preprocess(
    (value) => (value === '' || value === undefined ? undefined : Number(value)),
    z.number().min(1).max(99, "Número deve estar entre 1 e 99").optional()
  ),
  position: z.string().optional(),
  teamId: z.string().min(1, "Selecione um time"),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

export function CreatePlayerForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const teams = teamService.list();

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      shirtNumber: undefined,
      position: "",
      teamId: "",
    },
  });

  async function onSubmit(data: PlayerFormValues) {
    try {
      setIsLoading(true);
      const nowIso = new Date().toISOString();

      await dataGateway.insert('players', {
        team_id: data.teamId,
        name: data.name,
        number: data.shirtNumber,
        position: data.position || undefined,
        birth_date: undefined,
        nationality: undefined,
        height_cm: undefined,
        weight_kg: undefined,
        dominant_foot: undefined,
        biography: undefined,
        avatar_url: undefined,
        status: 'active',
        joined_date: nowIso,
        created_at: nowIso,
        updated_at: nowIso,
      });

      toast({
        title: "Sucesso!",
        description: `Jogador ${data.name} cadastrado com sucesso!`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao cadastrar jogador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Nome Completo
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Pelé Silva" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número e Posição */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="shirtNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 10" min="1" max="99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posição</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Não informar</SelectItem>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Time */}
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-64">
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Cadastrando..." : "Cadastrar Jogador"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreatePlayerForm;
