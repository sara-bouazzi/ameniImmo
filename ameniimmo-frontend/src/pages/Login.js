import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokens = await loginUser(username, password);
      login(tokens); // stocke les tokens dans le contexte + localStorage
      // affichage console pour debug : vérifie access/refresh
      // eslint-disable-next-line no-console
      console.log('Login successful, tokens:', tokens);
      // navigation vers la page d'accueil ou dashboard
      navigate('/');
    } catch (err) {
      // err peut être un objet retourné par DRF, ou un message plus détaillé.
      const msg = err?.detail || err?.non_field_errors || err?.message || JSON.stringify(err);
      setError(msg || "Erreur de connexion");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
