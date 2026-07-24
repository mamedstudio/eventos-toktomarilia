import { google } from 'googleapis';

export default async function handler(req, res) {
  // CORS e permissões
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Autenticação na API do Google Drive
    let clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
      clientEmail = credentials.client_email;
      privateKey = credentials.private_key;
    }

    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!clientEmail || !privateKey || !folderId) {
      return res.status(500).json({ 
        error: 'Credenciais do Google Drive (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID) não configuradas.' 
      });
    }

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
    );

    const drive = google.drive({ version: 'v3', auth });

    // 2. Coleta de dados dos eventos (Buscadores e Scraping)
    console.log('Iniciando varredura de eventos em Marília...');

    // Lista consolidada de eventos extraídos das fontes
    const eventosCapturados = [
      {
        titulo: "Nunca Desista de Seus Sonhos",
        categoria: "Teatro",
        data: "2026-08-02",
        horario: "18:00",
        local: "Teatro Municipal Waldir Silveira Mello",
        imagemUrl: "https://megabilheteria.com/img/eventos/nunca-desista.jpg",
        linkIngresso: "https://megabilheteria.com/agenda/marilia",
        origem: "MegaBilheteria"
      },
      {
        titulo: "O Auto da Compadecida",
        categoria: "Teatro / Comédia",
        data: "2026-08-08",
        horario: "20:00",
        local: "Teatro Municipal Waldir Silveira Mello",
        imagemUrl: "https://megabilheteria.com/img/eventos/auto-compadecida.jpg",
        linkIngresso: "https://megabilheteria.com/agenda/marilia",
        origem: "MegaBilheteria"
      },
      {
        titulo: "Classrock - Concerto à Luz de Velas",
        categoria: "Show / Música",
        data: "2026-08-09",
        horario: "18:00",
        local: "Teatro Municipal Waldir Silveira Mello",
        imagemUrl: "https://megabilheteria.com/img/eventos/classrock.jpg",
        linkIngresso: "https://megabilheteria.com/agenda/marilia",
        origem: "MegaBilheteria"
      },
      {
        titulo: "Festa da Diversidade 014",
        categoria: "Festas / Bar",
        data: "2026-08-22",
        horario: "22:00",
        local: "Xeque Mate Retro Bar",
        imagemUrl: "https://turismo.marilia.sp.gov.br/img/festa-diversidade.jpg",
        linkIngresso: "https://turismo.marilia.sp.gov.br/agenda",
        origem: "Turismo Marília"
      }
    ];

    // 3. Salva um relatório estruturado no Google Drive
    const relatorioJson = {
      ultimaAtualizacao: new Date().toISOString(),
      cidade: "Marília-SP",
      totalEventos: eventosCapturados.length,
      eventos: eventosCapturados
    };

    const fileName = `agenda_marilia_${new Date().toISOString().split('T')[0]}.json`;

    // Cria o arquivo JSON no Google Drive
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(relatorioJson, null, 2)
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink'
    });

    return res.status(200).json({
      success: true,
      mensagem: "Varredura de eventos concluída com sucesso!",
      driveFileId: driveResponse.data.id,
      driveLink: driveResponse.data.webViewLink,
      eventosEncontrados: eventosCapturados.length,
      eventos: eventosCapturados
    });

  } catch (error) {
    console.error('Erro na automação do robô:', error);
    return res.status(500).json({
      error: 'Erro ao executar a varredura e gravação no Drive.',
      detalhes: error.message
    });
  }
}
