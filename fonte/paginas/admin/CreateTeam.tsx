/**
 * SRC/paginas/ADMIN/CREATETEAM.TSX
 * ===============================
 * PROPÓSITO: Página/componente admin para criar time
 * - Formulário de criação de times com validação
 * - Define schema com Zod para validar dados
 * - Integra com React Hook Form para gestão de formulário
 * MOTIVO: Componente de admin para gestão de times,
 * permitindo que admins criem novos times na liga
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Definimos o "Schema" de validação com o Zod
const teamSchema = z.object({
  name: z.string().min(3, { message: "O nome do time precisa ter pelo menos 3 letras." }),
  shortName: z.string().max(3, { message: "A sigla deve ter no máximo 3 letras (ex: FLA)." }),
  logoUrl: z.string().url({ message: "Insira uma URL válida para o escudo." }).optional().or(z.literal('')),
  foundationYear: z.string().regex(/^\d{4}$/, { message: "Ano inválido." }).optional(),
});

// Inferimos a tipagem do TypeScript a partir do schema
type TeamFormValues = z.infer<typeof teamSchema>;

export default function CreateTeamForm() {
  // 2. Inicializamos o react-hook-form com o resolver do Zod
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      shortName: "",
      logoUrl: "",
      foundationYear: "",
    },
  });

  // 3. Função que será chamada no submit válido
  function onSubmit(data: TeamFormValues) {
    console.log("Dados prontos para salvar:", data);
    
    // TODO: Aqui entrará a lógica para salvar no banco mockado ou real
    // TODO: Aqui você vai gerar o AuditLog (ex: action: "CREATE", entity: "TEAM")
    
    // form.reset(); // Limpa o form após salvar
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Cadastrar Novo Time</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo: Nome do Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Time *</label>
          <input 
            {...form.register("name")} 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Sociedade Esportiva Palmeiras"
          />
          {form.formState.errors.name && (
            <span className="text-red-500 text-sm">{form.formState.errors.name.message}</span>
          )}
        </div>

        {/* Campo: Sigla */}
        <div>
          <label className="block text-sm font-medium mb-1">Sigla *</label>
          <input 
            {...form.register("shortName")} 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 uppercase"
            placeholder="Ex: PAL"
            maxLength={3}
          />
          {form.formState.errors.shortName && (
            <span className="text-red-500 text-sm">{form.formState.errors.shortName.message}</span>
          )}
        </div>

        {/* Campo: URL do Escudo (Temporário até termos upload) */}
        <div>
          <label className="block text-sm font-medium mb-1">URL do Escudo</label>
          <input 
            {...form.register("logoUrl")} 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
          {form.formState.errors.logoUrl && (
            <span className="text-red-500 text-sm">{form.formState.errors.logoUrl.message}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded-md font-bold hover:bg-blue-700 transition"
        >
          Salvar Time
        </button>
      </form>
    </div>
  );
}