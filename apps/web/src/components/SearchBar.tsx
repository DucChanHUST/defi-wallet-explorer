import { FormEvent, useEffect, useState } from "react";

interface SearchBarProps {
  initialAddress?: string;
  onSearch: (address: string) => void;
  loading: boolean;
}

export function SearchBar({
  initialAddress = "",
  onSearch,
  loading,
}: SearchBarProps) {
  const [address, setAddress] = useState(initialAddress);
  useEffect(() => setAddress(initialAddress), [initialAddress]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = address.trim();
    if (normalized) onSearch(normalized);
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-3xl gap-2">
      <label className="sr-only" htmlFor="wallet-address">
        Wallet address
      </label>
      <input
        id="wallet-address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Search a wallet address…"
        className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
      />
      <button
        type="submit"
        disabled={loading || !address.trim()}
        className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Loading" : "Explore"}
      </button>
    </form>
  );
}
