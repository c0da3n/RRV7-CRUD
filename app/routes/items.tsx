import { supabase } from "~/supabase-client";
import type { Route } from "./+types/items";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "All Your Items | RRv7 Crud" },
    {
      name: "description",
      content:
        "Manage ytour items - view, create, and update items using our Supabase CRUD app.",
    },
  ];
}

export async function loader() {
  const { data, error } = await supabase.from("items").select("*");

  if (error) {
    return { error: error.message };
  }

  return { items: data };
}

export default function Items({ loaderData }: Route.ComponentProps) {
  const { error, items } = loaderData;
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">List of Items</h2>
      {error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">{error}</div>
      )}
      <ul className="space-y-4">
        {items?.map((item) => (
          <Link
            to={`/items/${item.id}`}
            className="block text-indigo-600"
            key={item.id}
          >
            <li className="p-4 bg-white rounded shadow">
              <span className="font-semibold text-xl">{item.title}</span>
              <p className="text-gray-700">{item.description}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
