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
  shirtNumber: z.coerce.number().min(1).max(99, "Número deve estar entre 1 e 99"),
  position: z.enum(
    [
      "Goleiro",
      "Zagueiro",
      "Lateral-Esquerdo",
      "Lateral-Direito",
      "Meio-Campista",
      "Meia-Atacante",
      "Atacante",
    ] as const,
    { errorMap: () => ({ message: "Selecione uma posição válida" }) }
  ),
  teamId: z.string().min(1, "Selecione um time"),
  height: z.coerce.number().min(150).max(230, "Altura deve estar entre 150cm e 230cm"),
  weight: z.coerce.number().min(40).max(150, "Peso deve estar entre 40kg e 150kg"),
  birthDate: z.string().min(1, "Selecione uma data").refine((date) => {
    if (!date) return false;
    const birth = new Date(date);
    if (isNaN(birth.getTime())) return false;
    const age = new Date().getFullYear() - birth.getFullYear();
    return age >= 13 && age <= 80;
  }, "Idade deve estar entre 13 e 80 anos"),
  cpf: z.string().optional(),
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
      position: "Atacante",
      teamId: "",
      height: undefined,
      weight: undefined,
      birthDate: "",
      cpf: "",
    },
  });

  async function onSubmit(data: PlayerFormValues) {
    try {
      setIsLoading(true);
      
      // Salva o jogador em localStorage
      const newPlayer = addPlayer({
        name: data.name,
        number: data.shirtNumber,
        position: data.position,
        teamId: data.teamId,
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

          {/* Altura e Peso */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 180" min="150" max="230" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 75" min="40" max="150" step="0.1" {...field} />
                  </FormControl>
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
