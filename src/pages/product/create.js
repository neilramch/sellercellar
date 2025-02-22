import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreateProduct() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // Preview Image
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return alert("You must be logged in!");
  
    if (!form.title || !form.description || !form.price || !form.category || !imageFile) {
      alert("Please fill in all fields and upload an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("sellerEmail", session.user.email);
    formData.append("image", imageFile); // Ensure the file is added
  
    console.log("📤 Sending Form Data:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData, // No headers, FormData sets it automatically
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Product added!");
        console.log("✅ Product Created:", data);
      } else {
        console.error("❌ Error creating product:", data);
        alert("Error creating product: " + data.error);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      alert("Failed to create product.");
    }
  };
  

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Add a Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" className="w-full p-2 border" onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="w-full p-2 border" onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" className="w-full p-2 border" onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" className="w-full p-2 border" onChange={handleChange} />

        <input type="file" accept="image/*" className="w-full p-2 border" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover mt-2" />}

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">Submit</button>
      </form>
    </div>
  );
}
