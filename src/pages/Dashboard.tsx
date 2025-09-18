import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Copy, Plus, ExternalLink, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Debt {
  id: string;
  debtor_name: string;
  amount: number;
  start_date: string;
  pix_key: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    debtorName: '',
    amount: '',
    startDate: '',
    pixKey: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (!session?.user && event !== 'INITIAL_SESSION') {
          navigate('/login');
        }
      }
    );

    // Check for existing session and load debts
    const initializeData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        navigate('/login');
        return;
      }

      await loadDebts();
      setLoading(false);
    };

    initializeData();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDebts = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar cobranças",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setDebts(data || []);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar cobranças",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDebts();
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('debts')
        .insert({
          user_id: user.id,
          debtor_name: formData.debtorName,
          amount: parseFloat(formData.amount),
          start_date: formData.startDate,
          pix_key: formData.pixKey,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao criar cobrança",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setDebts([data, ...debts]);
        setFormData({
          debtorName: '',
          amount: '',
          startDate: '',
          pixKey: '',
        });
        setShowForm(false);

        toast({
          title: "Cobrança criada! 🎯",
          description: `Agora você pode cobrar ${formData.debtorName} com estilo!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao criar cobrança",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyDebtLink = (debtId: string, debtorName: string) => {
    const link = `${window.location.origin}/debt?debtId=${debtId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado! 📋",
      description: `Agora é só mandar para ${debtorName}! 😈`,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="bounce-in">
            <h1 className="text-3xl font-bold bg-gradient-money bg-clip-text text-transparent">
              Olá, {user.user_metadata?.name || user.email}! 👋
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas cobranças e recupere seu dinheiro com humor!
            </p>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-money text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  R$ {debts.reduce((total, debt) => total + Number(debt.amount), 0).toFixed(2)}
                </h3>
                <p className="text-white/80">Total a Receber</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-fun text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{debts.length}</h3>
                <p className="text-white/80">Cobranças Ativas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-trust text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  {debts.filter(d => new Date(d.start_date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </h3>
                <p className="text-white/80">Atrasadas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Debt Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-fun hover:opacity-90 text-white font-bold px-8 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Cobrança
          </Button>
        </div>

        {/* Add Debt Form */}
        {showForm && (
          <Card className="money-glow border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">💸 Criar Nova Cobrança</CardTitle>
              <CardDescription>
                Preencha os dados e prepare-se para cobrar com estilo!
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debtorName">Nome do Devedor</Label>
                    <Input
                      id="debtorName"
                      placeholder="Nome do seu amigo devedor"
                      value={formData.debtorName}
                      onChange={(e) => setFormData({ ...formData, debtorName: e.target.value })}
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor da Dívida (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pixKey">Sua Chave PIX</Label>
                    <Input
                      id="pixKey"
                      placeholder="email@exemplo.com ou CPF"
                      value={formData.pixKey}
                      onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-money hover:opacity-90 text-white flex-1 disabled:opacity-50"
                  >
                    {submitting ? '⏳ Criando...' : '🎯 Criar Cobrança'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="px-8"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Debts List */}
        {debts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📋 Suas Cobranças</CardTitle>
              <CardDescription>
                Clique em "Copiar Link" para enviar a cobrança para seus amigos!
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {debts.map((debt) => (
                  <div
                    key={debt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{debt.debtor_name}</h3>
                        <span className="text-2xl font-bold text-debt pulse-debt">
                          R$ {Number(debt.amount).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Desde: {new Date(debt.start_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyDebtLink(debt.id, debt.debtor_name)}
                        className="bg-gradient-fun hover:opacity-90 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Link
                      </Button>

                      <Button
                        onClick={() => window.open(`/debt?debtId=${debt.id}`, '_blank')}
                        variant="outline"
                        className="border-trust/30 text-trust hover:bg-trust hover:text-trust-foreground"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>

                      {/* 🚨 Botão de Excluir */}
                      <Button
                        onClick={async () => {
                          const { error } = await supabase
                            .from('debts')
                            .delete()
                            .eq('id', debt.id);

                          if (error) {
                            toast({
                              title: "Erro ao excluir cobrança",
                              description: error.message,
                              variant: "destructive",
                            });
                          } else {
                            // Atualiza lista removendo a cobrança localmente
                            setDebts(debts.filter(d => d.id !== debt.id));

                            toast({
                              title: "Cobrança excluída 🗑️",
                              description: `A cobrança de ${debt.debtor_name} foi removida.`,
                            });
                          }
                        }}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}


        {debts.length === 0 && !showForm && (
          <Card className="text-center p-12">
            <CardContent>
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma cobrança ainda!</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira cobrança e comece a recuperar seu dinheiro com humor!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;