"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1d40] to-[#020617] text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Build Your Micro-Economy with <span className="text-blue-400">IndieFi</span>
        </motion.h1>
        <motion.p
          className="mt-6 text-lg md:text-xl max-w-2xl text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Launch a token, fundraise from backers, and power your app with crypto-native utilities — all in minutes.
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/launch">
            <button className="px-6 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 transition shadow-xl hover:shadow-blue-600/50">
              🚀 Launch Your Token
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Wallet Info */}
      {/* <section className="bg-[#111827] py-10 text-center border-t border-gray-800">
        <h2 className="text-lg mb-2 font-semibold text-gray-400">Connected Wallet</h2>
        <div className="inline-block px-4 py-2 bg-gray-900 rounded-xl">
          <Address address={connectedAddress} />
        </div>
      </section> */}

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          🛠 What You Can Build
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          {[
            {
              title: "🎯 Launch Token",
              desc: "Create an ERC20 token with supply, name, and symbol for your app or project.",
            },
            {
              title: "💸 Fundraise",
              desc: "Accept ETH contributions with goal tracking, refunds, and cap enforcement.",
            },
            {
              title: "📈 Stake & Burn",
              desc: "Allow users to stake tokens to unlock features or burn them to reduce supply.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-[#1f2937] to-[#0f172a] p-6 rounded-2xl shadow-md border border-blue-800/20 hover:shadow-blue-600/30 transition transform hover:scale-[1.02]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-400">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-center py-6 mt-auto border-t border-gray-800 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} IndieFi — Powering Indie Developers Everywhere.</p>
        <div className="mt-2 space-x-4">
          <Link href="/projects" className="hover:text-blue-400 transition">
            Browse Projects
          </Link>
          <Link href="/dashboard" className="hover:text-blue-400 transition">
            My Dashboard
          </Link>
          <Link href="https://github.com" target="_blank" className="hover:text-blue-400 transition">
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
