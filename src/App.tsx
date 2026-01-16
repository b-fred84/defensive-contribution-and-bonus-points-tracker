import { useEffect, useState } from "react";
import { fetchFixturesForCurrentGameweek } from "./api/FplData";
import type { Fixture } from "./api/Types";

function App() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    const loadFixtures = async () => {
      const data = await fetchFixturesForCurrentGameweek(21);
      setFixtures(data);
    };

    loadFixtures();
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h1>FPL Fixtures</h1>

      {fixtures.map((f) => (
        <div
          key={f.id}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            marginBottom: "8px",
            borderRadius: "4px",
          }}
        >
          <div>
            <strong>{f.team_h}</strong> vs <strong>{f.team_a}</strong>
          </div>
          <div>Kickoff: {new Date(f.kickoff_time).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
