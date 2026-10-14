import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Notes
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const responseText = await response.text();

      console.log("Status:", response.status);
      console.log("Response:", responseText);

      if (response.ok) {
        alert("Login successful!");

        setPage("dashboard");

        // Get notes after login
        getNotes();
      } else if (response.status === 401) {
        alert("Invalid email or password");
      } else {
        alert("Backend error: " + response.status);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to the backend.");
    }
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      name === "" ||
      registerEmail === "" ||
      registerPassword === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const response = await fetch(
        "https://smartnotes-backend-6sas.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Registration successful! Please login.");

        setName("");
        setRegisterEmail("");
        setRegisterPassword("");

        setPage("login");
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Cannot connect to the backend.");
    }
  };

  // =========================
  // GET ALL NOTES
  // =========================

  const getNotes = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/notes"
      );

      if (response.ok) {
        const data = await response.json();

        console.log("Notes:", data);

        setNotes(data);
      } else {
        alert("Could not load notes");
      }
    } catch (error) {
      console.error("Get notes error:", error);
      alert("Cannot connect to notes backend.");
    }
  };

  // =========================
  // ADD NOTE
  // =========================

  const handleAddNote = async () => {
    if (title === "" || content === "") {
      alert("Please enter title and content");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        }
      );

      if (response.ok) {
        alert("Note added successfully!");

        setTitle("");
        setContent("");

        getNotes();
      } else {
        alert("Failed to add note");
      }
    } catch (error) {
      console.error("Add note error:", error);
      alert("Cannot connect to backend.");
    }
  };

  // =========================
  // EDIT NOTE
  // =========================

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);

    setEditingId(note.id);
  };

  // =========================
  // UPDATE NOTE
  // =========================

  const handleUpdateNote = async () => {
    if (title === "" || content === "") {
      alert("Please enter title and content");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: content,
          }),
        }
      );

      if (response.ok) {
        alert("Note updated successfully!");

        setTitle("");
        setContent("");
        setEditingId(null);

        getNotes();
      } else {
        alert("Failed to update note");
      }
    } catch (error) {
      console.error("Update note error:", error);
      alert("Cannot connect to backend.");
    }
  };

  // =========================
  // DELETE NOTE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Note deleted successfully!");

        getNotes();
      } else {
        alert("Failed to delete note");
      }
    } catch (error) {
      console.error("Delete note error:", error);
      alert("Cannot connect to backend.");
    }
  };

  // =========================
  // LOAD NOTES
  // =========================

  useEffect(() => {
    if (page === "dashboard") {
      getNotes();
    }
  }, [page]);

  // =========================
  // LOGIN PAGE
  // =========================

  if (page === "login") {
    return (
      <div className="auth-container">
        <div className="auth-box">

          <h1>SmartNotes</h1>

          <h2>Login</h2>

          <p className="subtitle">
            Login to manage your notes and tasks
          </p>

          <form onSubmit={handleLogin}>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
              Login
            </button>

          </form>

          <p className="switch-text">
            Don't have an account?

            <span onClick={() => setPage("register")}>
              {" "}Register
            </span>
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // REGISTER PAGE
  // =========================

  if (page === "register") {
    return (
      <div className="auth-container">
        <div className="auth-box">

          <h1>SmartNotes</h1>

          <h2>Create Account</h2>

          <p className="subtitle">
            Register to start managing your notes
          </p>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={registerEmail}
              onChange={(e) =>
                setRegisterEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Enter Password"
              value={registerPassword}
              onChange={(e) =>
                setRegisterPassword(e.target.value)
              }
            />

            <button type="submit">
              Register
            </button>

          </form>

          <p className="switch-text">
            Already have an account?

            <span onClick={() => setPage("login")}>
              {" "}Login
            </span>
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <h1>SmartNotes</h1>

        <button
          onClick={() => {
            setPage("login");
            setEmail("");
            setPassword("");
          }}
        >
          Logout
        </button>

      </header>

      <div className="dashboard-content">

        <h2>Welcome to SmartNotes!</h2>

        <p>
          Manage your personal notes and daily tasks in one place.
        </p>

        {/* NOTE FORM */}

        <div className="note-form">

          <h2>
            {editingId
              ? "Edit Note"
              : "Add New Note"}
          </h2>

          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

          {editingId ? (
            <div>
              <button onClick={handleUpdateNote}>
                Update Note
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={handleAddNote}>
              Add Note
            </button>
          )}

        </div>

        {/* NOTES */}

        <div className="dashboard-section">

          <h2>My Notes</h2>

          {notes.length === 0 ? (
            <p>
              No notes available. Add your first note!
            </p>
          ) : (
            notes.map((note) => (

              <div className="card" key={note.id}>

                <h3>{note.title}</h3>

                <p>{note.content}</p>

                <button
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(note.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))
          )}

        </div>

        {/* TASKS */}

        <div className="dashboard-section">

          <h2>My Tasks</h2>

          <div className="card">

            <p>
              Complete SmartNotes project
            </p>

            <button>
              Mark Completed
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
http://localhost:8080
