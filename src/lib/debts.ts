import { supabase } from "../integrations/supabase/client";

export async function deleteDebt(id: string) {
  const { error } = await supabase
    .from("debts") // ou "debts", depende do nome da sua tabela no Supabase
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir cobrança:", error);
    throw error;
  }
}
