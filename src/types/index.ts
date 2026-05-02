export interface Participant {
  id: string;
  nome: string;
  pontuacao: number;
  reunioes_marcadas: number;
  reunioes_marcadas_nucleos_diferentes?: number;
  ligacoes_atendidas?: number;
  rank?: number;
}

export interface DashboardData {
  participants: Participant[];
  totalMeetings: number;
  goal: number;
  lastUpdated: Date;
}
