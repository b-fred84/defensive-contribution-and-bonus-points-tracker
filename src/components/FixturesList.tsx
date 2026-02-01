import type { Fixture } from "../api/types";
import FixtureItem from "./FixtureItem";

interface Props {
  fixtures: Fixture[];
}

export default function FixtureList({ fixtures }: Props) {
  return (
    <>
      {fixtures.map((f) => (
        <FixtureItem key={f.id} fixture={f} />
      ))}
    </>
  );
}
