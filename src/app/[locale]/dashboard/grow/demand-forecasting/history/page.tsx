"use client";
import RunHistory from "./components/RunHistory";

export default function HistoryPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <RunHistory
        runs={[]}
        isLoading={false}
        onRefresh={() => console.log("refresh")}
      />
    </div>
  )
}