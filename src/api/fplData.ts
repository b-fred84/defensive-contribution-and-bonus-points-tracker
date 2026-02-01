import type {
  Team,
  Fixture,
  FixtureApi,
  LivePlayer,
  StaticPlayer,
  FixturePlayer,
} from "./types";

export const fetchFixturesAndPlayersForCurrentGameweek = async (
  gameweek: number
): Promise<Fixture[]> => {
  try {
    // fetch team names from bootstrap endpoint
    const teamsResponse = await fetch("fpl/api/bootstrap-static/");
    if (!teamsResponse.ok) throw new Error("Failed to fetch teams");
    const teamsData: { teams: Team[] } = await teamsResponse.json();

    //map team id to team name
    const teamsMap = new Map<number, string>();
    teamsData.teams.forEach((team) => {
      teamsMap.set(team.id, team.name);
    });

    //fetch fixtures
    const fixtureResponse = await fetch("fpl/api/fixtures/");
    if (!fixtureResponse) throw new Error("Failed to fetch fixtures");
    const fixtureData: FixtureApi[] = await fixtureResponse.json();

    const gwFixtures: Fixture[] = fixtureData
      .filter((f) => f.event === gameweek)
      .map((f) => ({
        id: f.id,
        event: f.event,
        team_h: teamsMap.get(f.team_h) ?? "Unknown",
        team_a: teamsMap.get(f.team_a) ?? "Unknown",
        kickoff_time: f.kickoff_time,
      }));

    // Fetch static players data (names etc from bottstrapStatic endpoint)
    const staticPlayersRes = await fetch("/fpl/api/bootstrap-static/");
    const staticPlayersData = await staticPlayersRes.json();
    const staticPlayers: StaticPlayer[] = staticPlayersData.elements;

    // Fetch live players
    const livePlayersRes = await fetch(`/fpl/api/event/${gameweek}/live/`);
    const livePlayersData = await livePlayersRes.json();
    const livePlayers: LivePlayer[] = livePlayersData.elements;

    // Merge players into fixtures
    const fixturesWithPlayers = gwFixtures.map((fix) => {
      const playersForFixture: FixturePlayer[] = livePlayers
        .filter(
          (lp) =>
            lp.stats.minutes > 0 && lp.explain.some((e) => e.fixture === fix.id)
        )
        .map((lp) => {
          const sp = staticPlayers.find((sp) => sp.id === lp.id);
          if (!sp) return null;

          return sp
            ? {
                id: lp.id,
                web_name: sp.web_name,
                team: sp.team,
                element_type: sp.element_type,
                minutes: lp.stats.minutes,
                total_points: lp.stats.total_points,
                bps: lp.stats.bps,
                defensive_contribution: lp.stats.defensive_contribution,
                fixture: fix.id,
              }
            : null;
        })
        .filter((p): p is FixturePlayer => p !== null);

      return { ...fix, players: playersForFixture };
    });

    console.log("Fixtures with players:", fixturesWithPlayers);
    return fixturesWithPlayers;
  } catch (err) {
    console.error(err);
    return [];
  }
};
