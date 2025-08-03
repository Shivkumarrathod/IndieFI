"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";

const ProjectList = () => {
  const { data: rawProjects, isLoading } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getAllProjectsLite",
  });

  const projects =
    rawProjects?.[0]?.map((_, i) => ({
      name: rawProjects[0][i],
      symbol: rawProjects[1][i],
      creator: rawProjects[2][i],
      fundraiseCap: rawProjects[3][i],
      totalRaised: rawProjects[4][i],
      finalized: rawProjects[5][i],
      totalStaked: rawProjects[6][i],
      initialSupply: rawProjects[7][i],
    })) ?? [];
  console.log(projects);
  
  return (
    <section className="bg-[#0b1d30] text-white min-h-screen py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">🔥 Live IndieFi Projects</h1>

      {isLoading ? (
        <p className="text-center text-gray-400">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects deployed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#111827] p-6 rounded-xl border border-blue-800/40 shadow hover:shadow-blue-600/30 transition"
            >
              <h2 className="text-xl font-semibold text-blue-300">
                {project.name} <span className="text-sm text-gray-400">({project.symbol})</span>
              </h2>

              <div className="mt-2 text-sm text-gray-400">
                <p>Creator:</p>
                <Address address={project.creator} />
              </div>

              <div className="mt-4 text-sm space-y-1 text-gray-300">
                <p>Initial Supply: {project.initialSupply.toString()}</p>
                <p>
                  Raised: {Number(project.totalRaised) / 1e18} / {Number(project.fundraiseCap) / 1e18} ETH
                </p>
                <p>Staked: {project.totalStaked.toString()}</p>
                <p>Status: {project.finalized ? "✅ Finalized" : "⏳ In Progress"}</p>
              </div>

              <Link href={`/projects/${idx}`}>
                <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 py-2 rounded-md font-semibold">
                  View Project
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectList;
