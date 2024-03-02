export interface ArenaTopRanking {
  list: ArenaTopRank[];
  play_style: number;
  status: number;
}

export interface ArenaTopRank {
  a1continue: string;
  area: string;
  arena_class: string;
  grade_dp: string;
  grade_sp: string;
  id: string;
  name: string;
  rank: number;
  rival: string;
  update_date: string;
  win: string;
}
