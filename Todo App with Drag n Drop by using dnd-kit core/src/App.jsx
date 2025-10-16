import { useState } from "react";
import "./App.css";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

function App() {
  const [value, setValue] = useState();
  const [Tasks, setTasks] = useState([]);
  const [EditTask, setEditTask] = useState(null);
  const status = { TODO: "todo", DOING: "doing", DONE: "done" };

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && value !== "") {
      if (EditTask) {
        const obj = {
          title: value,
          id: EditTask.id,
          status: EditTask.status,
        };
        const filterTasks = Tasks.filter((item) => item.id !== EditTask.id);
        setTasks((prev) => [...filterTasks, obj]);
        setEditTask(null);
      } else {
        const obj = {
          title: value,
          id: Date.now(),
          status: status.TODO,
        };
        setTasks((prev) => [...Tasks, obj]);
      }
      setValue("");
    }
  };

  const handleRemove = (id) => {
    const Task = Tasks.filter((item) => item.id !== id);
    setTasks(Task);
  };

  const handleEdit = (item) => {
    setEditTask(item);
    setValue(item.title);
  };

  const handleDragEnd = (e) => {
    const { over, active } = e;
    if (!over) return;
    const DropingStatus = over.id;
    setTasks((prev) =>
      prev.map((item) =>
        item.id === active.id ? { ...item, status: DropingStatus } : item
      )
    );
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="container">
          <div className="head-content">
            <h1 className="heading">Task Manager</h1>
            <div className="Task-item">
              <input
                type="text"
                placeholder="Add a new task"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="board">
            {/* Todo */}
            <div className="todo">
              <Column
                id={status.TODO}
                title={"Todo"}
                items={Tasks.filter((t) => t.status === status.TODO)}
                onEdit={handleEdit}
                onRemove={handleRemove}
                customClass={"col-todo"}
              />
            </div>

            {/* doing */}
            <div className="doing">
              <Column
                id={status.DOING}
                title={"Doing"}
                items={Tasks.filter((t) => t.status === status.DOING)}
                onEdit={handleEdit}
                onRemove={handleRemove}
                customClass={"col-doing"}
              />
            </div>

            {/* done */}
            <div className="done">
              <Column
                id={status.DONE}
                title={"Done"}
                items={Tasks.filter((t) => t.status === status.DONE)}
                onEdit={handleEdit}
                onRemove={handleRemove}
                customClass={"col-done"}
              />
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
}

export default App;

const Column = ({ id, items, title, onEdit, onRemove, customClass }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} style={{ minHeight: "600px" }}>
      <h1 className={customClass}>{title}</h1>
      {items.length > 0 &&
        items.map((item, index) => (
          <TaskCard
            key={index}
            item={item}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};

const TaskCard = ({ item, onEdit, onRemove }) => {
  const { attributes, setNodeRef, listeners, transform } = useDraggable({
    id: item.id,
  });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
    touchAction: "none", //for mobile drag
    cursor: "grab",
  };
  return (
    <>
      <div
        className="task-item"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
      >
        {item.title}
        <div className="btn-item">
          <span
            className="btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              onEdit(item);
            }}
          >
            ✏️
          </span>
          <span
            className="btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              onRemove(item.id);
            }}
          >
            🗑️
          </span>
        </div>
      </div>
    </>
  );
};
