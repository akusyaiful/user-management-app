import SearchBar from "@/components/SearchBar";
import UserTable from "@/components/UserTable";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <SearchBar />
      <UserTable />
    </div>
  );
}
