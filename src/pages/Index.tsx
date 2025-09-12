import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, DollarSign, Users, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bounce-in">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-money bg-clip-text text-transparent">💰 CobraAmigo</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Cobre seus amigos com 
              <span className="bg-gradient-fun bg-clip-text text-transparent"> estilo e humor!</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A forma mais divertida de lembrar seus amigos sobre aquela dinheirama que eles te devem. 
              Com QR codes, mensagens engraçadas e muito mais! 🎉
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-money hover:opacity-90 text-white font-bold px-8 py-4 text-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Começar Agora - Grátis!
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-trust bg-clip-text text-transparent">
            Como funciona? 🤔
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="money-glow border-primary/20 hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">📝</div>
                <h4 className="text-xl font-bold mb-3">1. Crie a Cobrança</h4>
                <p className="text-muted-foreground">
                  Cadastre o nome do devedor, valor, data e sua chave PIX. Simples assim!
                </p>
              </CardContent>
            </Card>

            <Card className="money-glow border-secondary/20 hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🔗</div>
                <h4 className="text-xl font-bold mb-3">2. Compartilhe o Link</h4>
                <p className="text-muted-foreground">
                  Copie o link da cobrança e mande pro seu amigo. Prepare-se para as risadas!
                </p>
              </CardContent>
            </Card>

            <Card className="money-glow border-trust/20 hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💸</div>
                <h4 className="text-xl font-bold mb-3">3. Receba o Pagamento</h4>
                <p className="text-muted-foreground">
                  Seu amigo vê a página divertida, escaneia o QR code e paga na hora!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Por que usar o CobraAmigo? 🌟
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-money p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Totalmente Gratuito</h4>
                <p className="text-muted-foreground">
                  Sem taxas, sem pegadinhas. Crie quantas cobranças quiser!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-fun p-3 rounded-full">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Humor Garantido</h4>
                <p className="text-muted-foreground">
                  Mensagens engraçadas que vão fazer seu amigo rir (e pagar)!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-trust p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Preserva a Amizade</h4>
                <p className="text-muted-foreground">
                  Cobre de forma leve e descontraída, sem criar constrangimento.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-debt p-3 rounded-full">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Resultados Rápidos</h4>
                <p className="text-muted-foreground">
                  QR code PIX para pagamento instantâneo. Receba na hora!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">
            Pronto para recuperar seu dinheiro? 💪
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de pessoas que já recuperaram suas dívidas com humor e estilo!
          </p>
          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-money hover:opacity-90 text-white font-bold px-12 py-4 text-xl"
          >
            Começar Agora - É Grátis! 🚀
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border/50">
        <p className="text-muted-foreground">
          Feito com 💚 e muito humor | CobraAmigo © 2024
        </p>
      </footer>
    </div>
  );
};

export default Index;
