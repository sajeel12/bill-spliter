import { useState } from "react";
import type { Person } from "./lib/billSplitter";
import { splitBill } from "./lib/billSplitter";

type Transaction = { from: string; to: string; amount: number };

function App() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "", paid: 0 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addPerson = () => {
    setPeople([...people, { id: Date.now().toString(), name: "", paid: 0 }]);
  };

  const updatePerson = (
    id: string,
    field: keyof Person,
    value: string | number
  ) => {
    setPeople(
      people.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "paid" ? Number(value) || 0 : value }
          : p
      )
    );
  };

  const removePerson = (id: string) => {
    if (people.length > 1) {
      setPeople(people.filter((p) => p.id !== id));
    }
  };

  const calculate = () => {
    if (people.some((p) => !p.name.trim())) {
      alert("Names required");
      return;
    }
    setTransactions(splitBill(people));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Bill Splitter</h1>
          {people.map((person) => (
            <div key={person.id} className="flex gap-2 mb-3">
              <input
                value={person.name}
                onChange={(e) =>
                  updatePerson(person.id, "name", e.target.value)
                }
                placeholder="Name"
                className="flex-1 border rounded px-3 py-2"
              />
              <input
                type="number"
                value={person.paid || ""}
                onChange={(e) =>
                  updatePerson(person.id, "paid", e.target.value)
                }
                placeholder="0"
                className="w-24 border rounded px-3 py-2"
              />
              {people.length > 1 && (
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-red-500 font-bold px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button
              onClick={addPerson}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex-1"
            >
              + Add Person
            </button>
            <button
              onClick={calculate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-1 font-medium"
            >
              Split Bill
            </button>
          </div>

          {transactions.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="font-semibold mb-3">Settlement</h2>
              <ul className="space-y-2">
                {transactions.map((t, i) => (
                  <li
                    key={i}
                    className="bg-green-50 text-green-800 p-3 rounded font-mono"
                  >
                    {t.from} → {t.to}: {t.amount.toFixed(2)} pkr
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-center items-center flex-col ">
          <p className="text-gray-500"> Powered by Sajeel </p>
          <p className="text-gray-500">msajeelahmad2001@gmail.com</p>
        </div>
      </div>
    </>
  );
}

export default App;
