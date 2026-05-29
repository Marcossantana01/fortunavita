"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TopbarProps = {
  userName: string;
  userRole: string;
  userAvatar: string;
  panelTitle?: string;
  actionLabel?: string;
};

type SystemDoc = {
  href: string;
  objective: string;
  owner: "admin" | "gestor" | "consultor" | "recepcao" | "financeiro" | "todos";
  station: string;
  terms: string[];
  title: string;
  workflow: string;
};

type InternalMessage = {
  area_destino?: string;
  area_origem?: string;
  assunto?: string;
  created_at?: string;
  id?: string;
  mensagem?: string;
  respondido_em?: string;
  respondido_por?: string;
  resposta?: string;
  remetente_nome?: string;
  status?: string;
  titulo?: string;
};

const communicationAreas = [
  "Administracao",
  "Gestao",
  "Consultores",
  "Recepcao",
  "Financeiro",
  "Suporte",
];

const systemDocs: SystemDoc[] = [
  {
    href: "/admin",
    objective: "Acompanhar usuarios, consultores, leads, clientes, pendencias e resumo financeiro do sistema.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["dashboard", "inicio", "indicadores", "painel administrativo", "visao geral"],
    title: "Admin - Pagina Inicial",
    workflow: "Use esta tela para enxergar a operacao completa, identificar gargalos e entrar nos modulos administrativos.",
  },
  {
    href: "/admin/leads",
    objective: "Consultar a base de leads cadastrados, origem, interesse, consultor responsavel e status.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["lead", "leads", "origem", "indicacao", "google", "instagram"],
    title: "Admin - Leads",
    workflow: "Serve para auditar entradas comerciais, conferir distribuicao e acompanhar a qualidade dos canais.",
  },
  {
    href: "/admin/clientes",
    objective: "Visualizar clientes ativos, dados de contato, objetivo financeiro, patrimonio e consultor responsavel.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["cliente", "clientes", "carteira", "patrimonio", "objetivo"],
    title: "Admin - Clientes",
    workflow: "Use para revisar a carteira geral e validar se cada cliente esta com responsavel e dados essenciais.",
  },
  {
    href: "/admin/usuarios",
    objective: "Controlar perfis de acesso, cargos, permissoes e status dos usuarios do sistema.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["usuario", "usuarios", "acesso", "permissao", "perfil"],
    title: "Admin - Usuarios",
    workflow: "E a area para revisar quem pode entrar no sistema e qual funcao cada pessoa exerce.",
  },
  {
    href: "/admin/consultores",
    objective: "Gerenciar consultores, modalidade de atendimento, especialidade, status e carteira atribuida.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["consultor", "consultores", "equipe", "modalidade", "comercial"],
    title: "Admin - Consultores",
    workflow: "Use para acompanhar capacidade comercial, ativar ou revisar consultores e equilibrar distribuicao de carteira.",
  },
  {
    href: "/admin/financeiro",
    objective: "Consultar receitas, despesas, comissoes, vencimentos e status financeiro.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["financeiro", "receita", "despesa", "comissao", "vencimento"],
    title: "Admin - Financeiro",
    workflow: "Serve para uma leitura administrativa do caixa, sem substituir as rotinas detalhadas do setor financeiro.",
  },
  {
    href: "/admin/fornecedores",
    objective: "Organizar fornecedores, prestadores, categorias, contatos e situacao cadastral.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["fornecedor", "fornecedores", "prestador", "cnpj", "parceiro"],
    title: "Admin - Fornecedores",
    workflow: "Use para centralizar dados de parceiros externos e manter contatos prontos para a operacao.",
  },
  {
    href: "/admin/agenda",
    objective: "Ver compromissos administrativos, comerciais e operacionais por data, cliente e consultor.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["agenda", "reuniao", "compromisso", "horario", "calendario"],
    title: "Admin - Agenda",
    workflow: "Ajuda a conferir a movimentacao da equipe e antecipar conflitos ou compromissos importantes.",
  },
  {
    href: "/admin/relatorios",
    objective: "Consolidar indicadores de leads, clientes, usuarios, agenda, receitas, despesas e fornecedores.",
    owner: "admin",
    station: "Administracao geral",
    terms: ["relatorio", "relatorios", "indicador", "metricas", "resultado"],
    title: "Admin - Relatorios",
    workflow: "Use para leitura executiva da operacao antes de decisoes e reunioes de acompanhamento.",
  },
  {
    href: "/gestor",
    objective: "Acompanhar a performance da equipe comercial, metas, carteira, agenda e atividades recentes.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["gestor", "equipe", "performance", "metas", "comercial"],
    title: "Gestor - Pagina Inicial",
    workflow: "E a estacao de trabalho do gestor para decidir prioridades, cobrar retorno e acompanhar conversao.",
  },
  {
    href: "/gestor/equipe",
    objective: "Visualizar consultores, dados de contato, modalidade de atendimento, status, leads, clientes e comissao prevista.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["equipe", "consultores", "carteira", "comissao", "modalidade"],
    title: "Gestor - Equipe",
    workflow: "Use esta tela para acompanhar a producao individual, identificar consultores sobrecarregados e redistribuir oportunidades.",
  },
  {
    href: "/gestor/leads",
    objective: "Acompanhar leads da equipe, status comercial, origem, prioridade e consultor responsavel.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["leads", "lead", "distribuicao", "origem", "prioridade", "status"],
    title: "Gestor - Leads",
    workflow: "E a area para revisar se os leads estao sendo tratados, corrigir filas paradas e garantir retorno rapido.",
  },
  {
    href: "/gestor/clientes",
    objective: "Consultar clientes da equipe, objetivo financeiro, renda, patrimonio, consultor responsavel e status.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["clientes", "cliente", "carteira", "patrimonio", "renda", "objetivo"],
    title: "Gestor - Clientes",
    workflow: "Use para conferir a carteira atendida por cada consultor e observar oportunidades de acompanhamento ou expansao.",
  },
  {
    href: "/gestor/metas",
    objective: "Acompanhar metas mensais por consultor, comissao prevista, comissao realizada e percentual de atingimento.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["metas", "meta", "atingimento", "comissao", "resultado"],
    title: "Gestor - Metas",
    workflow: "Serve para comparar resultado contra meta, orientar conversas de performance e priorizar acoes da equipe.",
  },
  {
    href: "/gestor/agenda",
    objective: "Visualizar compromissos da equipe por data, horario, cliente, consultor, tipo, status e local.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["agenda", "reuniao", "compromisso", "calendario", "atendimento"],
    title: "Gestor - Agenda",
    workflow: "Ajuda a enxergar a rotina comercial, evitar conflitos de agenda e confirmar se os retornos importantes estao marcados.",
  },
  {
    href: "/gestor/relatorios",
    objective: "Consolidar indicadores por consultor, como leads do dia, agenda, tarefas, comissao, clientes, negocios e conversao.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["relatorios", "relatorio", "indicadores", "conversao", "negocios", "tarefas"],
    title: "Gestor - Relatorios",
    workflow: "Use para preparar reunioes de acompanhamento, avaliar produtividade e tomar decisoes com base na operacao real.",
  },
  {
    href: "/gestor/chamados",
    objective: "Acompanhar chamados abertos pela equipe, assunto, categoria, prioridade, status, solicitante e descricao.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["chamados", "chamado", "suporte", "prioridade", "solicitante"],
    title: "Gestor - Chamados",
    workflow: "Serve para monitorar demandas internas, cobrar resolucao e remover bloqueios que atrapalham o atendimento comercial.",
  },
  {
    href: "/gestor/equipe/novo-consultor",
    objective: "Cadastrar novo consultor com nome, contato, modalidade, dados de acesso e informacoes operacionais.",
    owner: "gestor",
    station: "Gestao comercial",
    terms: ["novo consultor", "cadastro", "consultor", "equipe", "acesso"],
    title: "Gestor - Novo Consultor",
    workflow: "Use quando uma nova pessoa entra na equipe e precisa ser criada com dados suficientes para atuar no painel.",
  },
  {
    href: "/consultor",
    objective: "Mostrar ao consultor seus leads, clientes, agenda, propostas, tarefas e contratos.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["consultor", "meus leads", "clientes", "propostas", "contratos"],
    title: "Consultor - Pagina Inicial",
    workflow: "E a rotina diaria para atender contatos, mover oportunidades e manter clientes acompanhados.",
  },
  {
    href: "/consultor/leads",
    objective: "Listar os leads atribuidos ao consultor, com origem, interesse, prioridade, status e dados de contato.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["meus leads", "leads", "lead", "contato", "origem", "prioridade"],
    title: "Consultor - Meus Leads",
    workflow: "Use esta tela para fazer o primeiro contato, registrar andamento e transformar oportunidades em clientes.",
  },
  {
    href: "/consultor/clientes",
    objective: "Acompanhar clientes sob responsabilidade do consultor, perfil financeiro, objetivo, documentos e status.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["meus clientes", "clientes", "cliente", "documentos", "perfil financeiro", "carteira"],
    title: "Consultor - Meus Clientes",
    workflow: "E a area de acompanhamento da carteira, onde o consultor revisa dados, prepara atendimento e identifica proximos passos.",
  },
  {
    href: "/consultor/clientes/cadastro",
    objective: "Cadastrar um novo cliente com dados pessoais, contato, objetivo financeiro, renda, patrimonio e documentos.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["cadastro cliente", "novo cliente", "documentos", "renda", "patrimonio"],
    title: "Consultor - Cadastro de Cliente",
    workflow: "Use quando um lead vira cliente ou quando for necessario formalizar uma nova pessoa na carteira.",
  },
  {
    href: "/consultor/agenda",
    objective: "Visualizar compromissos, reunioes e retornos do consultor por data, horario, cliente, tipo e status.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["agenda", "reuniao", "retorno", "compromisso", "horario"],
    title: "Consultor - Agenda",
    workflow: "Ajuda a organizar a rotina diaria, garantir retornos no prazo e evitar perda de follow-up com clientes e leads.",
  },
  {
    href: "/consultor/propostas",
    objective: "Acompanhar propostas abertas, valor, produto, etapa, status e cliente relacionado.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["propostas", "proposta", "valor", "produto", "negociacao"],
    title: "Consultor - Propostas",
    workflow: "Use para controlar negociacoes em andamento, revisar o que precisa de retorno e priorizar fechamentos.",
  },
  {
    href: "/consultor/tarefas",
    objective: "Organizar tarefas pendentes, responsaveis, prazos, prioridades e atividades relacionadas ao atendimento.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["tarefas", "tarefa", "pendencias", "prazo", "prioridade"],
    title: "Consultor - Tarefas",
    workflow: "Serve como lista operacional do dia, mantendo o consultor focado no que precisa ser feito para cada cliente ou lead.",
  },
  {
    href: "/consultor/contratos",
    objective: "Consultar contratos, etapa de formalizacao, status, valores, cliente e pendencias documentais.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["contratos", "contrato", "formalizacao", "documentos", "assinatura"],
    title: "Consultor - Contratos",
    workflow: "Use para acompanhar negocios fechados ate a conclusao formal, evitando atrasos por documento ou assinatura.",
  },
  {
    href: "/consultor/chamado",
    objective: "Abrir chamado de suporte com assunto, categoria, prioridade e descricao do problema ou solicitacao.",
    owner: "consultor",
    station: "Atendimento consultivo",
    terms: ["chamado", "suporte", "problema", "solicitacao", "prioridade"],
    title: "Consultor - Chamado",
    workflow: "Use quando houver bloqueio operacional, duvida de sistema ou necessidade de apoio da equipe interna.",
  },
  {
    href: "/recepcao",
    objective: "Organizar agenda, contatos, reunioes, recados e encaminhamentos da recepcao.",
    owner: "recepcao",
    station: "Recepcao e atendimento",
    terms: ["recepcao", "contatos", "recados", "encaminhamentos", "reunioes"],
    title: "Recepcao - Pagina Inicial",
    workflow: "Use para registrar demandas de entrada e garantir que cada contato siga para o responsavel correto.",
  },
  {
    href: "/recepcao/agenda",
    objective: "Acompanhar compromissos da recepcao, horarios, pessoas, contatos, local, tipo e status.",
    owner: "recepcao",
    station: "Recepcao e atendimento",
    terms: ["agenda", "horario", "compromisso", "atendimento", "retorno"],
    title: "Recepcao - Agenda",
    workflow: "Use para organizar retornos, confirmar compromissos e manter a equipe informada sobre a rotina do dia.",
  },
  {
    href: "/recepcao/contatos",
    objective: "Registrar e consultar contatos recebidos por telefone, WhatsApp, site, indicacao ou atendimento presencial.",
    owner: "recepcao",
    station: "Recepcao e atendimento",
    terms: ["contatos", "contato", "telefone", "whatsapp", "site", "indicacao"],
    title: "Recepcao - Contatos",
    workflow: "E a tela para transformar cada contato em registro organizado, evitando perda de informacao antes do encaminhamento.",
  },
  {
    href: "/recepcao/reunioes",
    objective: "Controlar reunioes marcadas, participantes, pauta, horario, local, responsavel e situacao.",
    owner: "recepcao",
    station: "Recepcao e atendimento",
    terms: ["reunioes", "reuniao", "participantes", "pauta", "sala", "local"],
    title: "Recepcao - Reunioes",
    workflow: "Use para preparar a agenda de reunioes, confirmar presencas e apoiar consultores e gestores antes do atendimento.",
  },
  {
    href: "/recepcao/recados",
    objective: "Registrar recados recebidos, pessoa de origem, destinatario, prioridade, mensagem e status de retorno.",
    owner: "recepcao",
    station: "Recepcao e atendimento",
    terms: ["recados", "recado", "mensagem", "retorno", "destinatario", "prioridade"],
    title: "Recepcao - Recados",
    workflow: "Serve para garantir que mensagens importantes sejam repassadas e acompanhadas ate o retorno final.",
  },
  {
    href: "/recepcao/encaminhamentos",
    objective: "Direcionar contatos, demandas e recados para consultores, gestores ou setores responsaveis.",
    owner: "recepcao",
    station: "Recepcao e atendimento",
    terms: ["encaminhamentos", "encaminhamento", "direcionar", "responsavel", "setor"],
    title: "Recepcao - Encaminhamentos",
    workflow: "Use para registrar para quem a demanda foi enviada, acompanhar pendencias e manter rastreabilidade do atendimento.",
  },
  {
    href: "/financeiro",
    objective: "Controlar receitas, despesas, contas a pagar, contas a receber e relatorios financeiros.",
    owner: "financeiro",
    station: "Controle financeiro",
    terms: ["financeiro", "contas", "a pagar", "a receber", "fluxo de caixa"],
    title: "Financeiro - Pagina Inicial",
    workflow: "E a estacao de trabalho para baixa, conferencia, previsao e leitura do fluxo financeiro.",
  },
  {
    href: "/financeiro/receitas",
    objective: "Consultar entradas financeiras, cliente relacionado, categoria, valor, data, status e comprovacao.",
    owner: "financeiro",
    station: "Controle financeiro",
    terms: ["receitas", "receita", "entrada", "recebimento", "faturamento", "comprovante"],
    title: "Financeiro - Receitas",
    workflow: "Use para conferir valores recebidos, identificar entradas pendentes de conciliacao e manter o caixa atualizado.",
  },
  {
    href: "/financeiro/despesas",
    objective: "Registrar e acompanhar despesas operacionais, categoria, descricao, valor, vencimento e status de pagamento.",
    owner: "financeiro",
    station: "Controle financeiro",
    terms: ["despesas", "despesa", "saida", "pagamento", "custo", "operacional"],
    title: "Financeiro - Despesas",
    workflow: "Serve para controlar saidas, organizar custos por categoria e evitar pagamentos sem classificacao correta.",
  },
  {
    href: "/financeiro/a-receber",
    objective: "Acompanhar titulos a receber, vencimentos, clientes, valores em aberto, atrasos e status de baixa.",
    owner: "financeiro",
    station: "Controle financeiro",
    terms: ["a receber", "contas a receber", "titulo", "vencimento", "atraso", "baixa"],
    title: "Financeiro - A Receber",
    workflow: "Use para prever entradas, cobrar pendencias e confirmar quando um recebimento deve ser baixado.",
  },
  {
    href: "/financeiro/a-pagar",
    objective: "Controlar contas a pagar, fornecedores, vencimentos, valores, prioridade e situacao de pagamento.",
    owner: "financeiro",
    station: "Controle financeiro",
    terms: ["a pagar", "contas a pagar", "fornecedor", "vencimento", "pagamento", "prioridade"],
    title: "Financeiro - A Pagar",
    workflow: "Ajuda a organizar o calendario de pagamentos, priorizar vencimentos e evitar atrasos operacionais.",
  },
  {
    href: "/financeiro/relatorios",
    objective: "Consolidar indicadores financeiros, fluxo de caixa, receitas, despesas, saldo, pendencias e previsoes.",
    owner: "financeiro",
    station: "Controle financeiro",
    terms: ["relatorios", "relatorio", "fluxo de caixa", "saldo", "indicadores", "previsao"],
    title: "Financeiro - Relatorios",
    workflow: "Use para fechar analises do periodo, apoiar decisoes administrativas e apresentar a saude financeira da operacao.",
  },
  {
    href: "/login",
    objective: "Autenticar o usuario e direcionar para o painel correto conforme o perfil de acesso.",
    owner: "todos",
    station: "Acesso ao sistema",
    terms: ["login", "entrar", "senha", "acesso", "perfil"],
    title: "Login e direcionamento",
    workflow: "Apos entrar, o sistema identifica o papel do usuario e abre a estacao de trabalho correspondente.",
  },
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function roleToOwner(role: string): SystemDoc["owner"] {
  const normalizedRole = normalize(role);

  if (normalizedRole.includes("gestor")) return "gestor";
  if (normalizedRole.includes("consultor")) return "consultor";
  if (normalizedRole.includes("recepcao")) return "recepcao";
  if (normalizedRole.includes("financeiro")) return "financeiro";

  return "admin";
}

function roleToArea(role: string): string {
  const owner = roleToOwner(role);

  if (owner === "admin") return "Administracao";
  if (owner === "gestor") return "Gestao";
  if (owner === "consultor") return "Consultores";
  if (owner === "recepcao") return "Recepcao";
  if (owner === "financeiro") return "Financeiro";

  return "Administracao";
}

function formatMessageTime(value?: string): string {
  if (!value) {
    return "agora";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "agora";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

export default function Topbar({
  userName,
  userRole,
  panelTitle = "Painel Administrativo",
  actionLabel,
}: TopbarProps) {
  const [displayName, setDisplayName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [docSearch, setDocSearch] = useState("");
  const [isDocSearchOpen, setIsDocSearchOpen] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatMessages, setChatMessages] = useState<InternalMessage[]>([]);
  const [chatSubject, setChatSubject] = useState("");
  const [chatText, setChatText] = useState("");
  const [activeRequestId, setActiveRequestId] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUpdatingRequest, setIsUpdatingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState("em andamento");
  const [responseText, setResponseText] = useState("");
  const [selectedArea, setSelectedArea] = useState("Gestao");
  const hasLoadedRequestsRef = useRef(false);
  const previousPendingCountRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadStoredUser = window.setTimeout(() => {
      const storedUser = window.localStorage.getItem("fortuna_vita_usuario");

      if (!storedUser) {
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser) as { foto_url?: string | null; nome?: string };

        if (parsedUser.nome) {
          setDisplayName(parsedUser.nome);
        }

        if (parsedUser.foto_url) {
          setAvatarUrl(parsedUser.foto_url);
        }
      } catch {
        window.localStorage.removeItem("fortuna_vita_usuario");
      }
    }, 0);

    return () => window.clearTimeout(loadStoredUser);
  }, []);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        setIsDocSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const currentOwner = roleToOwner(userRole);
  const currentArea = roleToArea(userRole);
  const availableChatAreas = communicationAreas.filter((area) => area !== currentArea);
  const activeChatArea = selectedArea === currentArea ? availableChatAreas[0] ?? selectedArea : selectedArea;
  const pendingRequestCount = useMemo(() => chatMessages.filter((message) => (
    message.area_destino === currentArea
    && String(message.status ?? "aberta").toLowerCase() !== "concluida"
  )).length, [chatMessages, currentArea]);
  const roleDocs = useMemo(() => {
    const allowedDocs = systemDocs.filter((doc) => doc.owner === currentOwner || doc.owner === "todos");
    const search = normalize(docSearch.trim());

    if (!search) {
      return allowedDocs.slice(0, 10);
    }

    return allowedDocs
      .filter((doc) => normalize([
        doc.title,
        doc.objective,
        doc.workflow,
        doc.station,
        doc.terms.join(" "),
      ].join(" ")).includes(search))
      .slice(0, 6);
  }, [currentOwner, docSearch]);

  const stationDoc = systemDocs.find((doc) => doc.owner === currentOwner && doc.href.endsWith("")) ?? systemDocs.find((doc) => doc.owner === currentOwner);
  const filteredMessages = useMemo(() => chatMessages.filter((message) => {
    const origin = String(message.area_origem ?? "");
    const destination = String(message.area_destino ?? "");

    return (origin === currentArea && destination === activeChatArea)
      || (origin === activeChatArea && destination === currentArea);
  }), [activeChatArea, chatMessages, currentArea]);
  const selectedRequest = filteredMessages.find((message) => message.id === activeRequestId);

  useEffect(() => {
    let isMounted = true;

    function playRequestAlert() {
      try {
        const audioWindow = window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        };
        const AudioContextClass = window.AudioContext || audioWindow.webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gain.gain.setValueAtTime(0.001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.28);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch {
        // Browsers can block audio before user interaction.
      }
    }

    function loadRequests() {
      fetch("/api/comunicacao-interna")
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((data: { messages?: InternalMessage[] }) => {
          if (!isMounted) {
            return;
          }

          const messages = Array.isArray(data.messages) ? data.messages : [];
          const nextPendingCount = messages.filter((message) => (
            message.area_destino === currentArea
            && String(message.status ?? "aberta").toLowerCase() !== "concluida"
          )).length;

          if (hasLoadedRequestsRef.current && nextPendingCount > previousPendingCountRef.current) {
            playRequestAlert();
          }

          hasLoadedRequestsRef.current = true;
          previousPendingCountRef.current = nextPendingCount;
          setChatMessages(messages);
          setChatError("");
        })
        .catch(() => {
          if (isMounted && isChatOpen) {
            setChatError("Nao foi possivel carregar o historico registrado.");
          }
        });
    }

    loadRequests();
    const intervalId = window.setInterval(loadRequests, 8000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [currentArea, isChatOpen]);

  useEffect(() => {
    if (!selectedRequest) {
      setResponseText("");
      setRequestStatus("em andamento");
      return;
    }

    setActiveRequestId(String(selectedRequest.id ?? ""));
    setResponseText(String(selectedRequest.resposta ?? ""));
    setRequestStatus(String(selectedRequest.status ?? "em andamento"));
  }, [selectedRequest?.id]);

  function getAreaInitials(area: string): string {
    return area
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function getLastAreaRequest(area: string): InternalMessage | undefined {
    return [...chatMessages].reverse().find((message) => {
      const origin = String(message.area_origem ?? "");
      const destination = String(message.area_destino ?? "");

      return (origin === currentArea && destination === area)
        || (origin === area && destination === currentArea);
    });
  }

  async function handleCreateRequest() {
    const message = chatText.trim();
    const title = chatSubject.trim() || `${message.slice(0, 54)}${message.length > 54 ? "..." : ""}`;

    if (!message || isSendingMessage) {
      setChatError("Informe a descricao da requisicao.");
      return;
    }

    const optimisticMessage: InternalMessage = {
      area_destino: activeChatArea,
      area_origem: currentArea,
      assunto: chatSubject.trim() || "Comunicacao interna",
      created_at: new Date().toISOString(),
      id: `local-${Date.now()}`,
      mensagem: message,
      remetente_nome: displayName,
      status: "aberta",
      titulo: title,
    };

    setIsSendingMessage(true);
    setChatError("");
    setChatMessages((messages) => [...messages, optimisticMessage]);
    setChatSubject("");
    setChatText("");

    const response = await fetch("/api/comunicacao-interna", {
      body: JSON.stringify({
        area_destino: activeChatArea,
        area_origem: currentArea,
        assunto: chatSubject.trim() || "Comunicacao interna",
        mensagem: message,
        remetente_nome: displayName,
        remetente_tipo: userRole,
        titulo: title,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    setIsSendingMessage(false);

    if (!response.ok) {
      setChatError("Requisicao exibida localmente, mas o registro no banco falhou. Verifique a tabela comunicacao_interna.");
      setChatMessages((messages) => messages.map((item) => (
        item.id === optimisticMessage.id ? { ...item, status: "falha no registro" } : item
      )));
      return;
    }

    setChatMessages((messages) => messages.map((item) => (
      item.id === optimisticMessage.id ? { ...item, status: "aberta" } : item
    )));
  }

  async function handleUpdateRequest() {
    if (!selectedRequest?.id || selectedRequest.id.startsWith("local-") || isUpdatingRequest) {
      setChatError("Aguarde a requisicao ser registrada no banco antes de responder.");
      return;
    }

    if (!responseText.trim()) {
      setChatError("Informe a resposta da requisicao.");
      return;
    }

    setIsUpdatingRequest(true);
    setChatError("");

    const response = await fetch("/api/comunicacao-interna", {
      body: JSON.stringify({
        id: selectedRequest.id,
        respondido_por: displayName,
        resposta: responseText.trim(),
        status: requestStatus,
      }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });

    setIsUpdatingRequest(false);

    if (!response.ok) {
      setChatError("Nao foi possivel atualizar a requisicao no banco.");
      return;
    }

    setChatMessages((messages) => messages.map((message) => (
      message.id === selectedRequest.id
        ? {
            ...message,
            respondido_em: new Date().toISOString(),
            respondido_por: displayName,
            resposta: responseText.trim(),
            status: requestStatus,
          }
        : message
    )));
  }

  return (
    <header className="dashboard-topbar">
      <div className="topbar-sidebar-context">
        <span className="topbar-sidebar-mark" aria-hidden="true" />
        <strong>{panelTitle}</strong>
      </div>

      <div className="topbar-search" role="search">
        <span aria-hidden="true">S</span>
        <input
          aria-label="Buscar documentacao do sistema"
          onBlur={() => window.setTimeout(() => setIsDocSearchOpen(false), 160)}
          onChange={(event) => setDocSearch(event.target.value)}
          onFocus={() => setIsDocSearchOpen(true)}
          placeholder="Buscar documentacao, tela ou rotina..."
          ref={searchInputRef}
          value={docSearch}
        />
        <kbd>Ctrl K</kbd>
        {isDocSearchOpen && (
          <div className="doc-search-panel">
            <div className="doc-search-station">
              <span>{stationDoc?.station ?? "Estacao de trabalho"}</span>
              <strong>{userRole}</strong>
              <p>{stationDoc?.workflow ?? "Busque uma tela para ver objetivo, uso e rotina do usuario."}</p>
            </div>

            <div className="doc-search-results">
              {roleDocs.length > 0 ? roleDocs.map((doc) => (
                <a href={doc.href} key={doc.title}>
                  <span>{doc.station}</span>
                  <strong>{doc.title}</strong>
                  <p>{doc.objective}</p>
                  <em>{doc.workflow}</em>
                </a>
              )) : (
                <div className="doc-search-empty">
                  Nenhuma documentacao encontrada para essa busca.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {actionLabel && actionLabel.trim() !== "" && (
          <button className="topbar-primary-action" type="button">
            {actionLabel}
          </button>
        )}
        <button
          className={`topbar-icon-button${isChatOpen ? " is-active" : ""}${pendingRequestCount > 0 ? " has-pending" : ""}`}
          aria-label="Chat interno"
          onClick={() => setIsChatOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span aria-hidden="true">N</span>
          {pendingRequestCount > 0 && <i>{pendingRequestCount}</i>}
        </button>
        {isChatOpen && (
          <div className="internal-chat-panel" role="dialog" aria-label="Chat interno">
            <div className="internal-chat-header">
              <div>
                <span>Comunicacao interna</span>
                <strong>{currentArea}</strong>
              </div>
              <button aria-label="Fechar chat interno" onClick={() => setIsChatOpen(false)} type="button">
                x
              </button>
            </div>

            <div className="internal-chat-body">
              <aside className="internal-chat-areas" aria-label="Areas">
                {availableChatAreas.map((area) => {
                  const lastRequest = getLastAreaRequest(area);

                  return (
                    <button
                      className={area === activeChatArea ? "active" : ""}
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setActiveRequestId("");
                      }}
                      type="button"
                    >
                      <span className="internal-chat-avatar">{getAreaInitials(area)}</span>
                      <strong>{area}</strong>
                      <em>{lastRequest?.titulo || lastRequest?.assunto || "Sem requisicoes registradas"}</em>
                      <small>{lastRequest ? formatMessageTime(lastRequest.created_at) : "novo"}</small>
                    </button>
                  );
                })}
              </aside>

              <section className="internal-chat-thread" aria-label={`Conversa com ${activeChatArea}`}>
                <div className="internal-chat-thread-title">
                  <span className="internal-chat-avatar">{getAreaInitials(activeChatArea)}</span>
                  <div>
                    <strong>{activeChatArea}</strong>
                    <em>Canal interno com requisicoes registradas</em>
                  </div>
                  <button onClick={() => setActiveRequestId("")} type="button">Nova requisicao</button>
                </div>

                <div className="internal-chat-messages">
                  {filteredMessages.length > 0 ? filteredMessages.map((message, index) => {
                    const isMine = message.area_origem === currentArea;
                    const isSelected = message.id === selectedRequest?.id;

                    return (
                      <article
                        className={`internal-chat-message${isMine ? " mine" : ""}${isSelected ? " selected" : ""}`}
                        key={message.id ?? `${message.created_at}-${index}`}
                        onClick={() => setActiveRequestId(String(message.id ?? ""))}
                      >
                        <span>{message.status ?? "aberta"}</span>
                        <strong>{message.titulo || message.assunto || "Requisicao interna"}</strong>
                        <p>{message.mensagem}</p>
                        <em>{message.remetente_nome ?? message.area_origem} - {formatMessageTime(message.created_at)}</em>
                        {message.resposta && (
                          <div className="internal-chat-reply">
                            <span>Resposta</span>
                            <p>{message.resposta}</p>
                            <em>{message.respondido_por} - {formatMessageTime(message.respondido_em)}</em>
                          </div>
                        )}
                      </article>
                    );
                  }) : (
                    <div className="internal-chat-empty">
                      Nenhuma requisicao registrada entre {currentArea} e {activeChatArea}.
                    </div>
                  )}
                </div>

                {chatError && <p className="internal-chat-error">{chatError}</p>}

                <div className="internal-chat-compose">
                  {!selectedRequest && (
                    <input
                      aria-label="Titulo da requisicao"
                      onChange={(event) => setChatSubject(event.target.value)}
                      placeholder="Titulo da requisicao, opcional"
                      value={chatSubject}
                    />
                  )}
                  {selectedRequest && (
                    <select
                      aria-label="Status da requisicao"
                      onChange={(event) => setRequestStatus(event.target.value)}
                      value={requestStatus}
                    >
                      <option value="aberta">Aberta</option>
                      <option value="em andamento">Em andamento</option>
                      <option value="respondida">Respondida</option>
                      <option value="concluida">Concluida</option>
                    </select>
                  )}
                  <textarea
                    aria-label={selectedRequest ? "Responder requisicao" : "Descricao da requisicao"}
                    onChange={(event) => selectedRequest ? setResponseText(event.target.value) : setChatText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void (selectedRequest ? handleUpdateRequest() : handleCreateRequest());
                      }
                    }}
                    placeholder={selectedRequest ? "Digite a resposta abaixo da requisicao selecionada..." : "Descreva a requisicao..."}
                    value={selectedRequest ? responseText : chatText}
                  />
                  <button
                    disabled={selectedRequest ? !responseText.trim() || isUpdatingRequest : !chatText.trim() || isSendingMessage}
                    onClick={() => void (selectedRequest ? handleUpdateRequest() : handleCreateRequest())}
                    type="button"
                  >
                    {selectedRequest
                      ? isUpdatingRequest ? "Salvando..." : "Responder"
                      : isSendingMessage ? "Criando..." : "Enviar"}
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
        <div className="topbar-profile" aria-label={`Usuario logado: ${displayName}`}>
          {avatarUrl && !avatarError ? (
            <img
              alt=""
              className="topbar-avatar-image"
              onError={() => setAvatarError(true)}
              src={avatarUrl}
            />
          ) : (
            <span className="topbar-avatar" aria-hidden="true">{initials}</span>
          )}
          <strong>{displayName}</strong>
        </div>
      </div>
    </header>
  );
}
