"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

const ProjectDetails = () => {
  const { id } = useParams();
  const projectId = id
  const { address: connectedAddress } = useAccount();
  const [amount, setAmount] = useState("0.1"); // ETH amount

  const { data: project, isLoading } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getProjectInfo",
    args: [projectId],
  });

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourContract" });

  const handleFinalize = async () => {
    try {
      await writeContractAsync({
        functionName: "finalizeFundraise",
        args: [projectId],
      });
    } catch (err) {
      console.error("Finalize error:", err);
    }
  };

  const handleContribute = async () => {
    try {
      await writeContractAsync({
        functionName: "contribute",
        args: [projectId],
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("Contribute error:", err);
    }
  };

  const handleRefund = async () => {
    try {
      await writeContractAsync({
        functionName: "refund",
        args: [projectId],
      });
    } catch (err) {
      console.error("Refund error:", err);
    }
  };

  return (
    <section className="min-h-screen px-6 py-12 bg-[#0b1d30] text-white">
      {isLoading || !project ? (
        <p className="text-center text-gray-400">Loading project...</p>
      ) : (
        <div className="max-w-3xl mx-auto p-6 rounded-xl border border-blue-700 bg-[#111827] shadow-lg space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">
              {project[0]} <span className="text-sm text-gray-500">({project[1]})</span>
            </h1>
            <p className="text-sm mt-2 text-gray-300">
              Creator: <Address address={project[2]} />
            </p>
          </div>

          <div className="space-y-2 text-gray-200">
            <p>🎯 Fundraising Target: {Number(project[3]) / 1e18} ETH</p>
            <p>💰 Total Raised: {Number(project[4]) / 1e18} ETH</p>
            <p>📦 Initial Supply: {project[7].toString()}</p>
            <p>💎 Total Staked: {project[6].toString()}</p>
            <p>Status: {project[5] ? "✅ Finalized" : "⏳ In Progress"}</p>
          </div>

          <div className="pt-4">
            {connectedAddress?.toLowerCase() === project[2].toLowerCase() ? (
              <button
                onClick={handleFinalize}
                className="btn btn-primary bg-blue-600 hover:bg-blue-700 w-full"
                disabled={project[5]}
              >
                Finalize Fundraise
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <input
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="input input-bordered bg-gray-800 text-white w-full"
                    placeholder="Amount in ETH"
                  />
                </div>
                <button
                  onClick={handleContribute}
                  className="btn bg-green-600 hover:bg-green-700 w-full"
                  disabled={project[5]}
                >
                  Contribute
                </button>
                <button
                  onClick={handleRefund}
                  className="btn bg-red-600 hover:bg-red-700 w-full"
                  disabled={project[5]}
                >
                  Request Refund
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetails;
