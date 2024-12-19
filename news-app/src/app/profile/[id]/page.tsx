import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function ProfilePage({ params }) {
  const { id } = params; 
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const result = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFTOKEN": "DfyvzaJx8uZ8GwROBCDv95byl8VoHOyiSyTiDmp5IKOsS5zAh5Xea1IIgwdnEU3i",
      Authorization: `Bearer ${sessionToken?.value}`,
    },
  })
    .then(async (res) => {
      const payload = await res.json();
      const data = {
        status: res.status,
        payload,
      };
      if (!res.ok) throw data;
      return data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      return null;
    });

  if (!result) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Error loading user data</h2>
      </div>
    );
  }

  const userData = result.payload;

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Save profile functionality not implemented yet.");
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  defaultValue={userData?.username || ""}
                  className="border rounded-md w-full p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="datetime"
                  className="border rounded-md w-full p-2"
                  defaultValue={
                    userData?.birthday || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  defaultValue={userData?.email || ""}
                  className="border rounded-md w-full p-2"
                  required
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="numberphone"
                  placeholder="Enter your phone number"
                  defaultValue={userData?.phone || ""}
                  className="border rounded-md w-full p-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                defaultValue={userData?.address || ""}
                className="border rounded-md w-full p-2"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">About Me</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe yourself"
                defaultValue={userData?.description || ""}
                className="border rounded-md w-full p-2"
              />
            </div>
          </div>

          <div className="text-right mt-4">
            <button
              type="submit"
              className="bg-yellow-400 text-white text-lg px-8 py-2 rounded-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
