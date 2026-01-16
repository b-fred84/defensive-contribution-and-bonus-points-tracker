import type { Team, Fixture, FixtureApi, Player, PlayerStats } from "./Types";

export const fetchFixturesForCurrentGameweek = async (
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

    const fixtureResponse = await fetch("fpl/api/fixtures/");
    if (!fixtureResponse) throw new Error("Failed to fetch fixtures");
    const fixtureData: FixtureApi[] = await fixtureResponse.json();

    const gwFixtures = fixtureData
      .filter((f) => f.event === gameweek)
      .map((f) => ({
        id: f.id,
        event: f.event,
        team_h: teamsMap.get(f.team_h) ?? "Unknown",
        team_a: teamsMap.get(f.team_a) ?? "Unknown",
        kickoff_time: f.kickoff_time,
      }));

    console.log("Fixtures for gameweek", gameweek, gwFixtures);
    return gwFixtures;
  } catch (err) {
    console.log(err);
    return [];
  }
};
