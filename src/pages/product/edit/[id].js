import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });

  useEffect(() => {
    if (!id) return;
    
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setForm(data);
    }

    fetchProduct();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" value={form.title} placeholder="Title" className="w-full p-2 border" onChange={handleChange} />
        <textarea name="description" value={form.description} placeholder="Description" className="w-full p-2 border" onChange={handleChange} />
        <input type="number" name="price" value={form.price} placeholder="Price" className="w-full p-2 border" onChange={handleChange} />
        <input type="text" name="category" value={form.category} placeholder="Category" className="w-full p-2 border" onChange={handleChange} />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Update Product</button>
      </form>
    </div>
  );
}
