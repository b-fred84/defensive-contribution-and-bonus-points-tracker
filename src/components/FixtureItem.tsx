import type { Fixture } from "../api/types";

interface Props {
  fixture: Fixture;
}

export default function FixtureItem({ fixture }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "4px",
      }}
    >
      <div>
        <strong>{fixture.team_h}</strong> vs <strong>{fixture.team_a}</strong>
      </div>
      <div>Kickoff: {new Date(fixture.kickoff_time).toLocaleString()}</div>
    </div>
  );
}
