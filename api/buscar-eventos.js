export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Iniciando varredura de eventos em Marília...');

    // Lista consolidada de eventos extraídos das fontes da cidade
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

    return res.status(200).json({
      success: true,
      ultimaAtualizacao: new Date().toISOString(),
      cidade: "Marília-SP",
      totalEventos: eventosCapturados.length,
      eventos: eventosCapturados
    });

  } catch (error) {
    console.error('Erro no robô de eventos:', error);
    return res.status(500).json({
      error: 'Erro ao executar a varredura.',
      detalhes: error.message
    });
  }
}
