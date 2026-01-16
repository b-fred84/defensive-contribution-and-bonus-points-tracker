export interface Team {
  id: number;
  name: string;
  short_name: string;
}

export interface FixtureApi {
  id: number;
  event: number;
  team_h: number;
  team_a: number;
  kickoff_time: string;
}

export interface Fixture {
  id: number;
  event: number;
  team_h: string;
  team_a: string;
  kickoff_time: string;
}

export interface Player {
  id: number;
  web_name: string;
  team: number;
  element_type: number; //position id 1=gk, 2=def, 3=mid, 4=fwd
  stats: PlayerStats;
  explain?: {
    fixture: number;
  };
}

export interface PlayerStats {
  minutes: number;
  total_points: number;
  defensive_contribution: number;
  bps: number;
}
