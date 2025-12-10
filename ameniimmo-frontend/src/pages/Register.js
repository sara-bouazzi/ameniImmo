import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    role: "visiteur", // par défaut
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation côté client
    if (formData.password !== formData.password2) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Inscription réussie:", response);
      setSuccess(true);
      // Redirection après 2 secondes
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // Gérer les erreurs DRF
      if (err.username) {
        setError(`Nom d'utilisateur: ${err.username.join(", ")}`);
      } else if (err.email) {
        setError(`Email: ${err.email.join(", ")}`);
      } else if (err.password) {
        setError(`Mot de passe: ${err.password.join(", ")}`);
      } else if (err.non_field_errors) {
        setError(err.non_field_errors.join(", "));
      } else {
        setError(err.detail || "Erreur lors de l'inscription");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Inscription
        </h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Inscription réussie ! Redirection vers la connexion...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: jean_dupont"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="exemple@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Min. 8 caractères"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Retapez votre mot de passe"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Type de compte
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="visiteur">Visiteur (Cherche un bien)</option>
              <option value="owner">Propriétaire (Publier des annonces)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Les comptes admin sont créés par l'administrateur
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
