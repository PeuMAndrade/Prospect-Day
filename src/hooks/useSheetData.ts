import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardData, Participant } from '../types';

const REFRESH_INTERVAL = 5000; // 5 segundos
const DEFAULT_GOAL = 30; // Meta padrão caso não definida

type ParticipantRow = {
  id?: string | number;
  nome?: string;
  pontuacao?: string | number;
  reunioes_marcadas?: string | number;
  reunioes_marcadas_nucleos_diferentes?: string | number;
  ligacoes_atendidas?: string | number;
};

type AppsScriptPayload = {
  participants?: ParticipantRow[];
  totalMeetings?: number;
  goal?: number;
  lastUpdated?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  return fallback;
}

/**
 * Hook customizado para gerenciar a busca e sincronização de dados do Google Sheets.
 * @param sheetUrl URL pública JSON do Apps Script
 */
export function useSheetData(sheetUrl?: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeRequestIdRef = useRef(0);

  const normalizeParticipants = useCallback((rows: ParticipantRow[]) => {
    return rows
      .map((row, index) => ({
        id: row.id?.toString() || index.toString(),
        nome: row.nome || 'Sem Nome',
        pontuacao: Number(row.pontuacao) || 0,
        reunioes_marcadas: Number(row.reunioes_marcadas) || 0,
        reunioes_marcadas_nucleos_diferentes: Number(row.reunioes_marcadas_nucleos_diferentes) || 0,
        ligacoes_atendidas: Number(row.ligacoes_atendidas) || 0,
      }))
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .map((participant, index) => ({ ...participant, rank: index + 1 }));
  }, []);

  const buildDashboardData = useCallback((participants: Participant[], goal = DEFAULT_GOAL) => {
    const totalMeetings = participants.reduce(
      (acc, curr) => acc + curr.reunioes_marcadas + (curr.reunioes_marcadas_nucleos_diferentes || 0),
      0,
    );

    return {
      participants,
      totalMeetings,
      goal,
      lastUpdated: new Date(),
    };
  }, []);

  const fetchData = useCallback(async () => {
    const requestId = ++activeRequestIdRef.current;

    try {
      setLoading(true);
      setError(null);

      // Se não houver URL, usamos dados simulados para demonstração inicial
      if (!sheetUrl) {
        const mockData: Participant[] = [
          { id: '1', nome: 'Ana Silva', pontuacao: 450, reunioes_marcadas: 12 },
          { id: '2', nome: 'Bruno Costa', pontuacao: 520, reunioes_marcadas: 15 },
          { id: '3', nome: 'Carla Dias', pontuacao: 380, reunioes_marcadas: 10 },
          { id: '4', nome: 'Daniel Oliveira', pontuacao: 310, reunioes_marcadas: 8 },
          { id: '5', nome: 'Eduarda Santos', pontuacao: 290, reunioes_marcadas: 7 },
          { id: '6', nome: 'Felipe Lima', pontuacao: 250, reunioes_marcadas: 6 },
          { id: '7', nome: 'Gisele Rocha', pontuacao: 210, reunioes_marcadas: 5 },
          { id: '8', nome: 'Hugo Martins', pontuacao: 180, reunioes_marcadas: 4 },
        ].sort((a, b) => b.pontuacao - a.pontuacao)
         .map((p, i) => ({ ...p, rank: i + 1 }));

        if (requestId !== activeRequestIdRef.current) {
          return;
        }

        setData({
          participants: mockData,
          totalMeetings: mockData.reduce(
            (acc, curr) => acc + curr.reunioes_marcadas + (curr.reunioes_marcadas_nucleos_diferentes || 0),
            0,
          ),
          goal: DEFAULT_GOAL,
          lastUpdated: new Date(),
        });
        setLoading(false);
        return;
      }

      const response = await fetch(sheetUrl);
      if (!response.ok) {
        throw new Error(`Falha ao buscar JSON: ${response.status} ${response.statusText}`);
      }

      const payload = (await response.json()) as AppsScriptPayload;
      const payloadParticipants = Array.isArray(payload.participants) ? payload.participants : [];
      const participants = normalizeParticipants(payloadParticipants);

      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      // Mantemos a meta coletiva fixa no app para evitar divergencia com payload remoto.
      setData(buildDashboardData(participants, DEFAULT_GOAL));
      setLoading(false);
    } catch (err) {
      if (requestId !== activeRequestIdRef.current) {
        return;
      }

      setError(`Erro na conexão: ${getErrorMessage(err, 'Falha desconhecida.')}`);
      setLoading(false);
    }
  }, [buildDashboardData, normalizeParticipants, sheetUrl]);

  useEffect(() => {
    const runFetch = () => {
      void fetchData().catch((err: unknown) => {
        setError(`Erro na conexão: ${getErrorMessage(err, 'Falha desconhecida.')}`);
        setLoading(false);
      });
    };

    runFetch();
    const timer = setInterval(runFetch, REFRESH_INTERVAL);

    return () => {
      // Invalida respostas pendentes para evitar race condition no StrictMode.
      activeRequestIdRef.current++;
      clearInterval(timer);
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
