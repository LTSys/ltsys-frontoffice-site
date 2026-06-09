import { useState } from 'react';
import { FrontofficeLayout } from '../components/FrontofficeLayout';
import { MessageSquare, Info, Send } from 'lucide-react';

function Duvidas() {
  const [question, setQuestion] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = () => {
    if (question.trim() === '') {
      alert('Por favor, digite sua dúvida antes de publicar.');
      return;
    }

    // Mock submission
    console.log('Question submitted:', { question, isPublic });
    alert('Dúvida publicada com sucesso!');
    setQuestion('');
  };

  return (
    <FrontofficeLayout activeItem="Dúvidas">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8 text-[#0A2540]" />
          <h1 className="text-3xl font-bold text-[#0A2540]">Dúvidas</h1>
        </div>
        <p className="text-gray-600 text-lg">Tire suas dúvidas com a mentora</p>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          {/* Textarea Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0A2540] mb-3">
              Sua dúvida
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua dúvida aqui..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Visibility Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0A2540] mb-3">
              Visibilidade
            </label>
            <div className="flex gap-4">
              {/* Public Option */}
              <button
                onClick={() => setIsPublic(true)}
                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                  isPublic
                    ? 'border-[#0A2540] bg-[#0A2540]/5 text-[#0A2540]'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isPublic ? 'border-[#0A2540]' : 'border-gray-400'
                  }`}>
                    {isPublic && (
                      <div className="w-3 h-3 rounded-full bg-[#0A2540]"></div>
                    )}
                  </div>
                  <span className="font-semibold">Público</span>
                  <span className="text-sm text-gray-500">
                    Visível para todos os mentorados
                  </span>
                </div>
              </button>

              {/* Private Option */}
              <button
                onClick={() => setIsPublic(false)}
                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                  !isPublic
                    ? 'border-[#0A2540] bg-[#0A2540]/5 text-[#0A2540]'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !isPublic ? 'border-[#0A2540]' : 'border-gray-400'
                  }`}>
                    {!isPublic && (
                      <div className="w-3 h-3 rounded-full bg-[#0A2540]"></div>
                    )}
                  </div>
                  <span className="font-semibold">Privado</span>
                  <span className="text-sm text-gray-500">
                    Visível apenas para a coordenadora
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Information Message */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 space-y-1">
                <p>
                  <strong>Dúvidas públicas</strong> podem ser visualizadas por todos os mentorados.
                </p>
                <p>
                  <strong>Dúvidas privadas</strong> serão enviadas apenas para a coordenadora.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#0A2540] text-white px-6 py-4 rounded-lg hover:bg-[#1a3a5f] transition-all font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <Send className="w-5 h-5" />
            Publicar
          </button>
        </div>
      </div>

      {/* Recent Questions Section (Optional Future Enhancement) */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-bold text-[#0A2540] mb-4">Dúvidas Recentes</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Nenhuma dúvida publicada ainda.</p>
        </div>
      </div>
    </FrontofficeLayout>
  );
}

export default Duvidas;