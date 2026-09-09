import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

const API_URL = "http://localhost:8080";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");

  const [token, setToken] = useState(
    () => localStorage.getItem("claimflow_token")
  );
  const [role, setRole] = useState(
    () => localStorage.getItem("claimflow_role")
  );
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem("claimflow_username")
  );

  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [claims, setClaims] = useState([]);
  const [submittedClaim, setSubmittedClaim] = useState(null);

const [editingClaimId, setEditingClaimId] = useState(null);
const [selectedStatus, setSelectedStatus] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(token);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchClaims();
  }, [token]);

  const fetchClaims = async () => {
    try {
      const response = await fetch(`${API_URL}/api/claims`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load claims");
      }

      const data = await response.json();
      setClaims(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Authentication failed");
      }

      const data = await response.json();

      localStorage.setItem("claimflow_token", data.token);
      localStorage.setItem("claimflow_role", data.role);
      localStorage.setItem("claimflow_username", data.username);

      setToken(data.token);
      setRole(data.role);
      setCurrentUser(data.username);

      setUsername("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("claimflow_token");
    localStorage.removeItem("claimflow_role");
    localStorage.removeItem("claimflow_username");

    setToken(null);
    setRole(null);
    setCurrentUser(null);
    setClaims([]);
    setSubmittedClaim(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          description,
          amount: Number(amount),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to submit claim");
      }

      const data = await response.json();

      setSubmittedClaim(data);
      setClaims((currentClaims) => [...currentClaims, data]);

      setCustomerName("");
      setDescription("");
      setAmount("");
    } catch (error) {
      setError(error.message);
    }
  };

  const updateClaimStatus = async (claimId, status) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/claims/${claimId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to update claim");
      }

      const updatedClaim = await response.json();

      setClaims((currentClaims) =>
        currentClaims.map((claim) =>
          claim.id === updatedClaim.id ? updatedClaim : claim
        )
      );

      setEditingClaimId(null);
      setSelectedStatus("");

    } catch (error) {
      setError(error.message);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              ClaimFlow
            </h1>

            <p className="text-slate-500 mt-2">
              Insurance Claims Processing
            </p>
          </div>

          <div className="flex border-b mb-6">
            <button
              className={`flex-1 pb-3 font-medium ${
                authMode === "login"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500"
              }`}
              onClick={() => {
                setAuthMode("login");
                setError("");
              }}
            >
              Login
            </button>

            <button
              className={`flex-1 pb-3 font-medium ${
                authMode === "register"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500"
              }`}
              onClick={() => {
                setAuthMode("register");
                setError("");
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : authMode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          
          
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                ClaimFlow
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Insurance Claims Processing
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-slate-900">
                {currentUser}
              </p>

              <p className="text-sm text-slate-500">
                {role}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-5">
              Submit a Claim
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Customer Name
                </label>

                <input
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  required
                  rows="3"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
              >
                Submit Claim
              </button>
            </form>
          </section>

          {submittedClaim && (
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-5">
                Claim Submitted
              </h2>

              <div className="space-y-3 text-slate-700">
                <p>
                  <span className="font-medium">Claim ID:</span>{" "}
                  {submittedClaim.id}
                </p>

                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {submittedClaim.customerName}
                </p>

                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  ${submittedClaim.amount}
                </p>

                <p className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                      submittedClaim.status
                    )}`}
                  >
                    {submittedClaim.status.replace("_", " ")}
                  </span>
                </p>
              </div>
            </section>
          )}
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Claims Dashboard
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                All claims in the system
              </p>
            </div>

            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
              {claims.length} claims
            </span>
          </div>

          <div className="space-y-4">
            {claims.length === 0 ? (
              <p className="text-slate-500">
                No claims have been submitted yet.
              </p>
            ) : (
              claims.map((claim) => (
                <div
                  key={claim.id}
                  className="border border-slate-200 rounded-lg p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Claim #{claim.id}
                      </p>

                      <p className="text-slate-700 mt-1">
                        {claim.customerName}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {claim.description}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-semibold text-slate-900">
                        ${claim.amount}
                      </p>

                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                          claim.status
                        )}`}
                      >
                        {claim.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  
                  {role === "MANAGER" && (
                    <div className="mt-4 pt-4 border-t">
                      {editingClaimId === claim.id ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value)}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="">Select status</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                          </select>

                          <button
                            onClick={() =>
                              updateClaimStatus(claim.id, selectedStatus)
                            }
                            disabled={!selectedStatus}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setEditingClaimId(null);
                              setSelectedStatus("");
                            }}
                            className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingClaimId(claim.id);
                            setSelectedStatus(claim.status);
                          }}
                          className="border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                        >
                          Edit Status
                        </button>
                      )}
                    </div>
                  )}


                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;