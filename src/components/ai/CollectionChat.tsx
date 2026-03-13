'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkTicketCompletenessAction } from '@/lib/actions/ai';

interface CollectionChatProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (additionalInfo: string) => void;
  onSkip: () => void;
  ticketData: {
    title: string;
    description: string;
    categoryId: string;
  };
}

import { useRef } from 'react';

// ... inside CollectionChat component ...
export function CollectionChat({
  isOpen,
  onClose,
  onComplete,
  onSkip,
  ticketData
}: CollectionChatProps) {
  const [answers, setAnswers] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);
  const [missingInfo, setMissingInfo] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const hasSkipped = useRef(false);

  const handleSkip = () => {
    if (hasSkipped.current) return;
    hasSkipped.current = true;
    onSkip();
  };

  // Initialize: call AI to check completeness
  useEffect(() => {
    async function checkCompleteness() {
      if (!isOpen || hasSkipped.current) return;
      
      setIsLoading(true);
      try {
        const result = await checkTicketCompletenessAction(ticketData);
        setQuestions(result.questions);
        setMissingInfo(result.missingInfo);
        setIsComplete(result.isComplete);
        
        // If it's already complete, we could auto-skip, but for now let's show success or wait for user
        if (result.isComplete && result.questions.length === 0) {
           handleSkip(); // Auto-complete if everything is fine
        }
      } catch (error) {
        console.error('Erro na coleta de IA:', error);
        handleSkip(); // Skip on error to not block the user
      } finally {
        setIsLoading(false);
      }
    }

    checkCompleteness();
  }, [isOpen, ticketData]); // Removed handleSkip from deps to avoid re-triggering

  const handleConfirm = () => {
    onComplete(answers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden border-white/10 bg-zinc-950 text-white">
        <DialogHeader className="p-6 pb-2 border-b border-white/5">
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Bot className="w-5 h-5" />
            Assistente de Abertura I9
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isLoading ? 'Analisando seu chamado com IA...' : 'Refinando detalhes para uma resolução mais rápida.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-zinc-500">Nossos agentes de IA estão analisando sua descrição...</p>
            </div>
          ) : (
            <>
              {/* Missing Info Badges */}
              {missingInfo.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {missingInfo.map((info, idx) => (
                    <Badge key={idx} variant="outline" className="flex items-center gap-1 border-amber-500/20 bg-amber-500/10 text-amber-500">
                      <AlertCircle className="w-3 h-3" />
                      {info}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Chat Interface */}
              <div className="space-y-4">
                <AnimatePresence>
                  {questions.map((question, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none text-sm max-w-[85%]">
                        {question}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {answers && (
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary p-3 rounded-2xl rounded-tr-none text-sm text-primary-foreground max-w-[85%]">
                      {answers}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-white/10 space-y-4 bg-white/5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">
              Sua resposta adicional
            </label>
            <Textarea
              placeholder="Digite aqui as informações solicitadas pela IA..."
              value={answers}
              onChange={(e) => setAnswers(e.target.value)}
              className="min-h-[100px] resize-none bg-black/40 border-white/10 focus-visible:ring-primary"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-between items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              disabled={isLoading}
              className="text-zinc-500 hover:text-white"
            >
              Ignorar e Criar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={isLoading || !answers.trim()}
              className="gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              {isLoading ? 'Processando...' : (
                <>
                  <Send className="w-4 h-4" />
                  Confirmar e Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
