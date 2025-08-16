import { useState , useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const HEROES_DATA = [
  { id: 1, heroName: "Spider-Man", realName: "Peter Parker", universe: "Marvel" },
  { id: 2, heroName: "Iron Man", realName: "Tony Stark", universe: "Marvel" },
  { id: 3, heroName: "Captain America", realName: "Steve Rogers", universe: "Marvel" },
  { id: 4, heroName: "Black Widow", realName: "Natasha Romanoff", universe: "Marvel" },
  { id: 5, heroName: "Thor", realName: "Thor Odinson", universe: "Marvel" },
  { id: 6, heroName: "Hulk", realName: "Bruce Banner", universe: "Marvel" },
  { id: 7, heroName: "Black Panther", realName: "T'Challa", universe: "Marvel" },
  { id: 8, heroName: "Doctor Strange", realName: "Stephen Strange", universe: "Marvel" },
  { id: 9, heroName: "Wolverine", realName: "Logan", universe: "Marvel" },
  { id: 10, heroName: "Scarlet Witch", realName: "Wanda Maximoff", universe: "Marvel" },
];

const THS = [
  { key: "id", label: "ID" },
  { key: "heroName", label: "Super Hero" },
  { key: "realName", label: "Real Name" },
  { key: "universe", label: "Universe" },
  { key: "actions", label: "Actions" },
];

function SortIcon({ direction }) {
  if (!direction) return <span className="ml-1 opacity-40">↕</span>;
  return <span className="ml-1">{direction === "asc" ? "↑" : "↓"}</span>;
}

export default function App() {
  const [q, setQ] = useState("");
  const [universe, setUniverse] = useState("All");
  const [sort, setSort] = useState({ key: "id", direction: "asc" });
  const [heroes, setHeroes] = useState(HEROES_DATA);

  const universes = useMemo(
    () => ["All", ...Array.from(new Set(HEROES_DATA.map((h) => h.universe)))],
    []
  );

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    let rows = heroes.filter(
      (h) =>
        (universe === "All" || h.universe === universe) &&
        (text === "" ||
          h.heroName.toLowerCase().includes(text) ||
          h.realName.toLowerCase().includes(text) ||
          String(h.id).includes(text))
    );
    rows.sort((a, b) => {
      const { key, direction } = sort;
      const dir = direction === "asc" ? 1 : -1;
      if (a[key] < b[key]) return -1 * dir;
      if (a[key] > b[key]) return 1 * dir;
      return 0;
    });
    return rows;
  }, [q, universe, sort, heroes]);

  const onSort = (key) => {
    if (key === "actions") return;
    setSort((s) => {
      if (s.key === key) {
        return { key, direction: s.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleDelete = (id) => {
    setHeroes((prev) => prev.filter((h) => h.id !== id));
  };

  const handleEdit = (id) => {
    const name = prompt("Enter new hero name:");
    if (!name) return;
    setHeroes((prev) =>
      prev.map((h) => (h.id === id ? { ...h, heroName: name } : h))
    );
  };

  const handleAdd = () => {
    const heroName = prompt("Enter hero name:");
    const realName = prompt("Enter real name:");
    const universe = prompt("Enter universe:");
    if (!heroName || !realName || !universe) return;

    const newHero = {
      id: heroes.length ? Math.max(...heroes.map((h) => h.id)) + 1 : 1,
      heroName,
      realName,
      universe,
    };
    setHeroes((prev) => [...prev, newHero]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Marvel Heroes – Table with Actions</h1>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by hero, real name, or id..."
              className="w-full rounded-2xl bg-neutral-900 border border-neutral-800 px-4 py-2 outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">Universe</label>
            <select
              value={universe}
              onChange={(e) => setUniverse(e.target.value)}
              className="w-full rounded-2xl bg-neutral-900 border border-neutral-800 px-4 py-2 outline-none focus:ring-2 focus:ring-red-600"
            >
              {universes.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Hero Button */}
        <div className="mb-4 text-right">
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-sm"
          >
            ➕ Add Hero
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 shadow-xl">
          <table className="w-full border-collapse">
            <thead className="bg-neutral-900/70">
              <tr>
                {THS.map((th) => (
                  <th
                    key={th.key}
                    onClick={() => onSort(th.key)}
                    className="text-left text-sm font-semibold px-4 py-3 select-none cursor-pointer hover:bg-neutral-900 transition"
                  >
                    <span className="inline-flex items-center">
                      {th.label}
                      {th.key !== "actions" && (
                        <SortIcon
                          direction={sort.key === th.key ? sort.direction : undefined}
                        />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((h, i) => (
                <tr key={h.id} className={i % 2 ? "bg-neutral-950" : "bg-neutral-900/40"}>
                  <td className="px-4 py-3 text-sm tabular-nums">{h.id}</td>
                  <td className="px-4 py-3 font-medium">{h.heroName}</td>
                  <td className="px-4 py-3 text-neutral-300">{h.realName}</td>
                  <td className="px-4 py-3">{h.universe}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(h.id)}
                      className="px-3 py-1 rounded-xl text-sm bg-blue-600 hover:bg-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="px-3 py-1 rounded-xl text-sm bg-red-600 hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
