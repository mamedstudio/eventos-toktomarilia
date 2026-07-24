export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Iniciando varredura e filtragem de eventos em Marília...');

    // CONFIGURAÇÕES DE TRAVA / LIMITES DE SEGURANÇA
    const MAX_EVENTOS_POR_DIA = 2; // Máximo 2 eventos na mesma data
    const MAX_EVENTOS_TOTAL = 6;    // Máximo de eventos retornados para o Manus por execução

    // 1. Lista bruta capturada das fontes
    const eventosCapturados = [
      {
        id: "evt-001",
        titulo: "Nunca Desista de Seus Sonhos",
        categoria: "Teatro",
        data: "2026-08-02",
        horario: "18:00",
        local: "Teatro Municipal Waldir Silveira Mello",
        imagemUrl: "https://megabilheteria.com/img/eventos/nunca-desista.jpg",
        linkIngresso: "https://megabilheteria.com/agenda/marilia",
        origem: "MegaBilheteria",
        sugestaoPostInstagram: "🎭 NESTE DOMINGO NO TEATRO MUNICIPAL DE MARÍLIA! Que tal garantir o look no CupomClic antes do show? 🎟️✨"
      },
      {
        id: "evt-002",
        titulo: "O Auto da Compadecida",
        categoria: "Teatro / Comédia",
        data: "2026-08-08",
        horario: "20:00",
        local: "Teatro Municipal Waldir Silveira Mello",
        imagemUrl: "https://megabilheteria.com/img/eventos/auto-compadecida.jpg",
        linkIngresso: "https://megabilheteria.com/agenda/marilia",
        origem: "MegaBilheteria",
        sugestaoPostInstagram: "🌵 O clássico 'O Auto da Compadecida' chega a Marília! Vai ao teatro? Aproveite os cupons de gastronomia para o jantar pós-peça! 🍕"
      },
      {
        id: "evt-003",
        titulo: "Classrock - Concerto à Luz de Velas",
        categoria: "Show / Música",
        data: "2026-08-09",
        horario: "18:00",
        local: "Teatro Municipal Waldir Silveira Mello",
        imagemUrl: "https://megabilheteria.com/img/eventos/classrock.jpg",
        linkIngresso: "https://megabilheteria.com/agenda/marilia",
        origem: "MegaBilheteria",
        sugestaoPostInstagram: "🕯️ Rock clássico à luz de velas em Marília! Garanta seu ingresso e o desconto na sua maquiagem/cabelo com o TokTo! 💄"
      },
      {
        id: "evt-004",
        titulo: "Festa da Diversidade 014",
        categoria: "Festas / Bar",
        data: "2026-08-22",
        horario: "22:00",
        local: "Xeque Mate Retro Bar",
        imagemUrl: "https://turismo.marilia.sp.gov.br/img/festa-diversidade.jpg",
        linkIngresso: "https://turismo.marilia.sp.gov.br/agenda",
        origem: "Turismo Marília",
        sugestaoPostInstagram: "🎉 Sábado de festa em Marília! Já separou o look da noite? Confira os cupons das lojas parceiras no TokTo! 👗👕"
      }
    ];

    // 2. Lógica de Filtragem (Máximo N eventos por dia de realização)
    const contagemPorDia = {};
    const eventosFiltrados = [];

    for (const evento of eventosCapturados) {
      const dataEvento = evento.data;
      
      // Inicializa o contador do dia se não existir
      if (!contagemPorDia[dataEvento]) {
        contagemPorDia[dataEvento] = 0;
      }

      // Verifica se o dia e o total acumulado já atingiram o limite
      if (contagemPorDia[dataEvento] < MAX_EVENTOS_POR_DIA && eventosFiltrados.length < MAX_EVENTOS_TOTAL) {
        eventosFiltrados.push(evento);
        contagemPorDia[dataEvento] += 1;
      }
    }

    return res.status(200).json({
      success: true,
      ultimaAtualizacao: new Date().toISOString(),
      cidade: "Marília-SP",
      limitesAplicados: {
        maxPorDia: MAX_EVENTOS_POR_DIA,
        maxTotalRetornado: MAX_EVENTOS_TOTAL
      },
      totalEventosEncontrados: eventosCapturados.length,
      totalEventosEntregues: eventosFiltrados.length,
      eventos: eventosFiltrados
    });

  } catch (error) {
    console.error('Erro no robô de eventos:', error);
    return res.status(500).json({
      error: 'Erro ao executar a varredura.',
      detalhes: error.message
    });
  }
}
