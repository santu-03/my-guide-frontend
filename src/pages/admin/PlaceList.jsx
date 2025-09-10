import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function PlaceList() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  async function load(p = 1) {
    setLoading(true);
    try {
      const { data } = await api.get(`/places?limit=20&page=${p}`);
      const items = Array.isArray(data?.data) ? data.data : data?.items || [];
      setRows(items);
      setPage(p);
    } catch {
      toast.error("Failed to load places");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this place?")) return;
    try {
      await api.delete(`/places/${id}`);
      toast.success("Deleted");
      load(page);
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleFeatured = async (r) => {
    try {
      const next = !r.featured;
      await api.patch(`/places/${r._id}`, { featured: next });
      toast.success(next ? "Marked as featured" : "Removed from featured");
      setRows((prev) => prev.map((x) => (x._id === r._id ? { ...x, featured: next } : x)));
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <DashboardLayout role="admin" title="Places">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Places</h1>
        <Link to="/dashboard/admin/places/new"><Button>Add Place</Button></Link>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">City</th>
                <th className="text-left p-3">Images</th>
                <th className="text-left p-3">Featured</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4" colSpan={5}>Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="p-4" colSpan={5}>No places yet.</td></tr>
              ) : rows.map((r) => (
                <tr key={r._id} className="border-t dark:border-gray-700">
                  <td className="p-3">{r.name || r.title}</td>
                  <td className="p-3">{r?.location?.city || "—"}</td>
                  <td className="p-3">{Array.isArray(r.images) ? r.images.length : 0}</td>
                  <td className="p-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!r.featured} onChange={() => toggleFeatured(r)} />
                      <span>{r.featured ? "Yes" : "No"}</span>
                    </label>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <Link to={`/places/${r._id}`} className="underline">View</Link>
                    <Link to={`/dashboard/admin/places/${r._id}/edit`} className="underline">Edit</Link>
                    <button onClick={() => remove(r._id)} className="text-red-600 underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => load(Math.max(1, page - 1))} disabled={page <= 1}>Prev</Button>
        <span className="text-sm">Page {page}</span>
        <Button variant="outline" onClick={() => load(page + 1)} disabled={rows.length < 20}>Next</Button>
      </div>
    </DashboardLayout>
  );
}
