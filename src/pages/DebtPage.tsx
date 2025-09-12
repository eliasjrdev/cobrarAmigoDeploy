import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

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

const funnyMessages = [
  "Lembra do nosso acordo? A fatura chegou! 💸",
  "O Pix da felicidade está aqui! 🎉",
  "Amigo que é amigo paga a conta! 😂",
  "A gente ama você, mas sua dívida não! ❤️💔",
  "Um dia a conta chega, hoje chegou a sua! ⏰",
  "O valor é baixo, mas a amizade é alta. Paga logo! 🤝💰",
  "Sua dívida está fazendo aniversário! 🎂🎈",
  "O PIX não morde, pode mandar! 🦷💳",
  "Hora de transformar promessa em PIX! ✨💸",
  "Sua consciência pesada? Liberte-se pagando! 😇💰",
  "O dinheiro não cresce em árvore, mas sua dívida sim! 🌳📈",
  "Pagar dívida é como academia: quanto mais espera, pior fica! 💪😅"
];

const DebtPage = () => {
  const [searchParams] = useSearchParams();
  const [debt, setDebt] = useState<Debt | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { toast } = useToast();
  
  const debtId = searchParams.get('debtId');

  useEffect(() => {
    if (!debtId) return;
    
    const loadDebt = async () => {
      try {
        const { data, error } = await supabase
          .from('debts')
          .select('*')
          .eq('id', debtId)
          .single();
        
        if (error || !data) {
          console.error('Debt not found:', error);
        } else {
          setDebt(data);
        }
      } catch (err) {
        console.error('Error loading debt:', err);
      }
    };
    
    loadDebt();
  }, [debtId]);

  useEffect(() => {
    if (debt) {
      // Generate PIX QR Code
      const pixData = `${debt.pix_key}|${debt.amount.toString()}|${debt.debtor_name}`;
      QRCode.toDataURL(pixData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(url => {
        setQrCodeUrl(url);
      }).catch(err => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [debt]);

  useEffect(() => {
    // Rotate messages every 4 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const copyPixKey = () => {
    if (debt?.pix_key) {
      navigator.clipboard.writeText(debt.pix_key);
      toast({
        title: "PIX copiado! 📋",
        description: "Cola aí no seu app de pagamentos! 💳",
      });
    }
  };

  const daysSinceDebt = debt ? Math.floor((Date.now() - new Date(debt.start_date).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (!debt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🤔</div>
            <h1 className="text-2xl font-bold mb-2">Cobrança não encontrada!</h1>
            <p className="text-muted-foreground mb-4">
              Parece que esta cobrança não existe ou foi removida.
            </p>
            <Button onClick={() => window.location.href = '/'} className="bg-gradient-trust">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-debt/10 via-background to-secondary/10">
      {/* Animated message banner */}
      <div className="bg-gradient-fun text-white py-4 overflow-hidden relative">
        <div className="scroll-infinite whitespace-nowrap text-lg font-bold">
          {funnyMessages[currentMessageIndex]} 
          &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
          {funnyMessages[(currentMessageIndex + 1) % funnyMessages.length]}
          &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
          {funnyMessages[(currentMessageIndex + 2) % funnyMessages.length]}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header with debtor name */}
          <div className="text-center bounce-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Olá, <span className="bg-gradient-fun bg-clip-text text-transparent">{debt.debtor_name}!</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Você tem uma pendência financeira esperando... 😅
            </p>
          </div>

          {/* Debt amount - main focus */}
          <Card className="debt-glow border-debt/30 bg-gradient-to-r from-debt/5 to-debt/10 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <p className="text-2xl font-semibold text-muted-foreground">
                  Valor da sua dívida:
                </p>
                <div className="pulse-debt">
                  <h2 className="text-6xl md:text-8xl font-black bg-gradient-debt bg-clip-text text-transparent">
                    R$ {Number(debt.amount).toFixed(2)}
                  </h2>
                </div>
                
                {daysSinceDebt > 0 && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                    <p className="text-lg">
                      <span className="font-bold text-debt">
                        {daysSinceDebt} {daysSinceDebt === 1 ? 'dia' : 'dias'}
                      </span> desde {new Date(debt.start_date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {daysSinceDebt > 30 ? 'Tempo demais, não acha? 🤨' : 
                       daysSinceDebt > 7 ? 'Já passou da hora! ⏰' : 
                       'Ainda dá tempo de resolver rapidinho! 😉'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR Code section */}
          <Card className="money-glow border-primary/30">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-money bg-clip-text text-transparent">
                💳 Pague agora com PIX!
              </h3>
              
              {/* Real QR Code for PIX */}
              <div className="bg-white p-8 rounded-lg inline-block mb-6 shadow-lg">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code PIX para pagamento"
                    className="w-48 h-48 rounded"
                  />
                ) : (
                  <div className="w-48 h-48 bg-black/10 rounded border-2 border-dashed border-black/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-black/60">Gerando QR Code...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  Ou copie a chave PIX:
                </p>
                
                <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-lg">
                  <code className="flex-1 text-sm bg-background px-3 py-2 rounded border">
                    {debt.pix_key}
                  </code>
                  <Button
                    onClick={copyPixKey}
                    className="bg-gradient-money hover:opacity-90 text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                
                <p className="text-2xl font-bold text-primary mt-8">
                  A hora de resolver isso é <span className="bg-gradient-debt bg-clip-text text-transparent">AGORA!</span> ⚡
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fun footer */}
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Feito com 💚 (e um pouco de cobrança) pelo CobraAmigo
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Criar minha própria cobrança 🚀
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtPage;