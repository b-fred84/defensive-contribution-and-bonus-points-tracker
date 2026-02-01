export interface Team {
  id: number;
  name: string;
  short_name: string;
}

//for fetching from api
export interface FixtureApi {
  id: number;
  event: number;
  team_h: number;
  team_a: number;
  kickoff_time: string;
}

//for displaying with team names rather than id numbers
export interface Fixture {
  id: number;
  event: number;
  team_h: string;
  team_a: string;
  kickoff_time: string;
}

export interface StaticPlayer {
  id: number;
  web_name: string;
  team: number;
  element_type: number; //position id 1=gk, 2=def, 3=mid, 4=fwd
}

export interface LivePlayer {
  id: number;
  stats: {
    minutes: number;
    total_points: number;
    defensive_contribution: number;
    bps: number;
  };
  explain: {
    fixture: number;
  }[];
}

//for display player data on ui
export interface FixturePlayer {
  id: number;
  web_name: string;
  team: number;
  element_type: number; // 1=gk, 2=def, 3=mid, 4=fwd
  minutes: number;
  total_points: number;
  bps: number;
  defensive_contribution: number;
  fixture: number;
}
