import { useEffect, useState } from "react";
import {
  fetchFixturesAndPlayersForCurrentGameweek,
  fetchCurrentGameweek,
} from "./api/fplData";
import type { Fixture } from "./api/types";
import FixtureList from "./components/FixturesList";

function App() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    const loadFixtures = async () => {
      const currentGw = await fetchCurrentGameweek();
      console.log("Current GW:", currentGw);
      const data = await fetchFixturesAndPlayersForCurrentGameweek(currentGw);
      setFixtures(data);
    };

    loadFixtures();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h1>FPL Fixtures</h1>

      <FixtureList fixtures={fixtures} />
    </div>
  );
}

export default App;
