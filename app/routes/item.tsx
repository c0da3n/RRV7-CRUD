import { supabase } from "~/supabase-client";
import type { Route } from "./+types/item";
import { Form, redirect, type ActionFunctionArgs } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Edit Item  ${params.id} | RRv7 Crud` },
    {
      name: "description",
      content: "Edit or delete an item using our Supabase CRUD app.",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;

  if (!id) {
    return { error: "No Item Found" };
  }
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return { error: error.message };
  }

  return { item: data };
}
export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const intent = formData.get("intent");

  if (intent === "delete") {
    const { error } = await supabase.from("items").delete().eq("id", params.id);
    if (error) {
      return { error: error.message };
    }
    return redirect("/");
  } else if (intent === "update") {
    const { error } = await supabase
      .from("items")
      .update({ title, description })
      .eq("id", params.id);
    if (error) {
      return { error: error.message };
    }
    return { updated: true };
  }

  return {};
}

export default function Item({ loaderData, actionData }: Route.ComponentProps) {
  const { item } = loaderData;
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Item</h2>
      {actionData?.error && (
        <div className="bg-red-200 text-red-800 p-2 mb-4 rounded">
          {actionData.error}
        </div>
      )}
      {actionData?.updated && (
        <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">
          Item updated Successfully!
        </div>
      )}
      <Form method="post" className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="text-[16px] font-semibold block text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={item.title}
            className="border broder-gray-300 rounded px-3 py-2 w-full focus:outline-indigo-500"
            required
          />
        </div>
        <div>
          <label className="text-[16px] font-semibold block text-gray-700">
            Description
          </label>
          <textarea
            defaultValue={item.description}
            name="description"
            className="border broder-gray-300 rounded px-3 py-2 w-fulll focus:outline-indigo-500 w-full"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            name="intent"
            value="update"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 "
          >
            Update Item
          </button>
          <button
            type="submit"
            name="intent"
            value="delete"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            Delete Item
          </button>
        </div>
      </Form>
    </div>
  );
}
