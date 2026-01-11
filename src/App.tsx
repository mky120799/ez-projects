import { Routes, Route, useNavigate } from "react-router-dom";
import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { TreeView } from "./components/tree-view/TreeView";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px" }}>
      <span className="tree-view-card" onClick={() => navigate("/tree")}>
        Tree View
      </span>

      <span className="kanban-board-card" onClick={() => navigate("/kanban")}>
        Kanban Board
      </span>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tree" element={<TreeView />} />
      <Route path="/kanban" element={<KanbanBoard />} />
    </Routes>
  );
}

export default App;
