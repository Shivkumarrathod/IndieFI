"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CreateProjectForm = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [fundraiseCap, setFundraiseCap] = useState("");

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const handleCreate = async () => {
    try {
      await writeYourContractAsync({
        functionName: "createProject",
        args: [
          name,
          symbol,
          BigInt(initialSupply),       // example: "1000000"
          BigInt(fundraiseCap),        // example: parseEther("1") → "1000000000000000000"
        ],
      });

      alert("✅ Project created!");
      setName("");
      setSymbol("");
      setInitialSupply("");
      setFundraiseCap("");
    } catch (e) {
      console.error("❌ Error creating project:", e);
      alert("❌ Transaction failed. Check console.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg mt-12 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">🚀 Create IndieFi Project</h2>

      <input
        placeholder="Project Name"
        className="w-full p-2 mb-3 rounded-md bg-gray-800 border border-gray-700"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Token Symbol"
        className="w-full p-2 mb-3 rounded-md bg-gray-800 border border-gray-700"
        value={symbol}
        onChange={e => setSymbol(e.target.value.toUpperCase())}
      />
      <input
        placeholder="Initial Supply (e.g., 1000000)"
        type="number"
        className="w-full p-2 mb-3 rounded-md bg-gray-800 border border-gray-700"
        value={initialSupply}
        onChange={e => setInitialSupply(e.target.value)}
      />
      <input
        placeholder="Fundraise Cap in Wei (e.g., 1000000000000000000)"
        type="number"
        className="w-full p-2 mb-6 rounded-md bg-gray-800 border border-gray-700"
        value={fundraiseCap}
        onChange={e => setFundraiseCap(e.target.value)}
      />

      <button
        className="btn btn-primary w-full"
        onClick={handleCreate}
      >
        🚀 Create Project
      </button>
    </div>
  );
};

export default CreateProjectForm;
