/**
 * SRC/COMPONENTS/CREATEPLAYERFORM.TSX
 * ===============================
 * PROPÓSITO: Formulário para criar/adicionar novos jogadores
 * - Captura dados do jogador (nome, número, posição, time)
 * - Valida informações com Zod schema
 * - Salva jogador no localStorage via state.ts
 * MOTIVO: Componente de CRUD essencial para gerência de jogadores,
 * permitindo admins e moderadores adicionar atletas à liga
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { teams } from "@/data/mock";
import { addPlayer } from "@/data/state";
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
  photoUrl: z.string().url("URL de foto inválida").optional().or(z.literal('')),
  userId: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof playerSchema>;

export function CreatePlayerForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      shirtNumber: undefined,
      position: "",
      teamId: "",
      photoUrl: "",
      userId: "",
    },
  });

  async function onSubmit(data: PlayerFormValues) {
    try {
      setIsLoading(true);
      
      // Salva o jogador em localStorage
      const newPlayer = addPlayer({
        name: data.name,
        number: data.shirtNumber,
        position: data.position || undefined,
        teamId: data.teamId,
        photoUrl: data.photoUrl || undefined,
        userId: data.userId || undefined,
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
                  {/* URL da foto */}
            <FormField
              control={form.control}
                    name="photoUrl"
              render={({ field }) => (
                <FormItem>
                        <FormLabel>URL da Foto (Opcional)</FormLabel>
                  <FormControl>
                          <Input type="url" placeholder="Ex: https://meusite.com/jogador.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

                  {/* ID de usuário */}
              control={form.control}
              name="weight"
                    name="userId"
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                        <FormLabel>ID de Usuário Vinculado (Opcional)</FormLabel>
                    <Input type="number" placeholder="Ex: 75" min="40" max="150" step="0.1" {...field} />
                          <Input placeholder="Ex: u1717070707000" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Data de Nascimento */}
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CPF (Opcional) */}
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 123.456.789-00" {...field} />
                </FormControl>
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
