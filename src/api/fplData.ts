import type {
  Team,
  Fixture,
  ApiFixture,
  ApiLivePlayer,
  ApiStaticPlayer,
  Player,
} from "./types";

//FETCH HELPERS

const fetchTeamsMap = async (): Promise<Map<number, string>> => {
  const res = await fetch("/fpl/api/bootstrap-static/");
  if (!res.ok) throw new Error("Failed to fetch teams");

  const data: { teams: Team[] } = await res.json();

  return new Map(data.teams.map((t) => [t.id, t.name]));
};

const fetchFixtures = async (): Promise<ApiFixture[]> => {
  const res = await fetch("/fpl/api/fixtures/");
  if (!res.ok) throw new Error("Failed to fetch fixtures");

  return res.json();
};

const fetchStaticPlayersMap = async (): Promise<
  Map<number, ApiStaticPlayer>
> => {
  const res = await fetch("/fpl/api/bootstrap-static/");
  if (!res.ok) throw new Error("Failed to fetch static players");
  const data: { elements: ApiStaticPlayer[] } = await res.json();
  return new Map(data.elements.map((p) => [p.id, p]));
};

const fetchLivePlayers = async (gameweek: number): Promise<ApiLivePlayer[]> => {
  const res = await fetch(`/fpl/api/event/${gameweek}/live/`);
  if (!res.ok) throw new Error("Failed to fetch live players");
  const data = await res.json();
  return data.elements;
};

//Mapping helper
const toPlayer = (
  lp: ApiLivePlayer,
  sp: ApiStaticPlayer,
  fixtureId: number
): Player => ({
  id: lp.id,
  web_name: sp.web_name,
  team: sp.team,
  element_type: sp.element_type,
  minutes: lp.stats.minutes,
  total_points: lp.stats.total_points,
  bps: lp.stats.bps,
  defensive_contribution: lp.stats.defensive_contribution,
  fixture: fixtureId,
});

export const fetchFixturesAndPlayersForCurrentGameweek = async (
  gameweek: number,
): Promise<Fixture[]> => {
  try {
    const teamsMap = await fetchTeamsMap();
    const fixtureData = await fetchFixtures();
    const staticPlayersMap = await fetchStaticPlayersMap();
    const livePlayers = await fetchLivePlayers(gameweek);

    //map fixtures to shape that fits UI model
    const gwFixtures: Fixture[] = fixtureData
      .filter((f) => f.event === gameweek)
      .map((f) => ({
        id: f.id,
        event: f.event,
        team_h: teamsMap.get(f.team_h) ?? "Unknown",
        team_a: teamsMap.get(f.team_a) ?? "Unknown",
        kickoff_time: f.kickoff_time,
      }));

    // Attach players into fixtures
    const fixturesWithPlayers = gwFixtures.map((fix) => {
      const playersForFixture: Player[] = livePlayers
        .filter(
          (lp) =>
            lp.stats.minutes > 0 &&
            lp.explain.some((e) => e.fixture === fix.id),
        )
        .map((lp) => {
          const sp = staticPlayersMap.get(lp.id);
          return sp ? toPlayer(lp, sp, fix.id) : null;
        })
        .filter((p): p is Player => p !== null);

      return { ...fix, playersForFixture };
    });

    console.log("Fixtures with players:", fixturesWithPlayers);
    return fixturesWithPlayers;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchCurrentGameweek = async (): Promise<number> => {
  const res = await fetch("/fpl/api/bootstrap-static/");
  if (!res.ok) throw new Error("Failed to fetch bootstrap data");

  const data = await res.json();
  const currentEvent = data.events.find((e: any) => e.is_current);

  if (!currentEvent) throw new Error("No current gameweek found");
  return currentEvent.id;
};
