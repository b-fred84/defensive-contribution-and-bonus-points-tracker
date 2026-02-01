import { useEffect, useState } from "react";
import { fetchFixturesAndPlayersForCurrentGameweek } from "./api/fplData";
import type { Fixture } from "./api/types";
import FixtureList from "./components/FixturesList";

function App() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    const loadFixtures = async () => {
      const data = await fetchFixturesAndPlayersForCurrentGameweek(21);
      setFixtures(data);
    };

    loadFixtures();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h1>FPL Fixtures</h1>

      <FixtureList fixtures={fixtures}/>
    </div>
  );
}

export default App;
