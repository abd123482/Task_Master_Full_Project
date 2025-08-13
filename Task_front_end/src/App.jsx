import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

class TaskItem extends Component {
  render() {
    const { task, onModify, onDelete, onStatusChange } = this.props;
    const { title, description, priority, deadline, status } = task;

    const getPriorityClass = () => {
      switch (priority.toLowerCase()) {
        case "low": return "priority-low";
        case "medium": return "priority-medium";
        case "high": return "priority-high";
        default: return "";
      }
    };

    const getStatusClass = () => {
      switch (status) {
        case "TO_DO": return "status-todo";
        case "IN_PROGRESS": return "status-progress";
        case "DONE": return "status-done";
        default: return "";
      }
    };

    return (
      <div id="list" data-status={status}>
        <div id="st_tit_list">
          <div id="title_list">{title}</div>
          <div id="priority_list" className={getPriorityClass()}>{priority}</div>
        </div>
        <div id="description_list">{description}</div>
        <div id="deadline_list">Deadline: <span id="deadline_value">{deadline}</span></div>
        <div className="status-container">
          <button className={`status-btn ${getStatusClass()}`} onClick={() => onStatusChange(task)}>
            {status.replace("_", " ")}
          </button>
        </div>
        <div id="mod_del_list">
          <div className="modify" onClick={() => onModify(task)}>Modify</div>
          <div className="delete" onClick={() => onDelete(task.id)}>Delete</div>
        </div>
      </div>
    );
  }
}

class TaskForm extends Component {
  render() {
    const { task, onChange, onSubmit, isEditing } = this.props;
    return (
      <div className="create">
        <div className="create_a_list"><i className="fas fa-plus-circle"></i> {isEditing ? "Update Task" : "Create New Task"}</div>
        <div className="one_line">
          <div className="Title">
            <div className="T"><i className="fas fa-heading"></i> Title*</div>
            <input type="text" placeholder="Enter task title" className="input_title" 
                   value={task.title} onChange={(e) => onChange("title", e.target.value)} required />
          </div>
          <div className="deadline_container">
            <div className="deadline"><i className="far fa-calendar-alt"></i> Deadline*</div>
            <input type="date" id="date" name="date" 
                   value={task.deadline} onChange={(e) => onChange("deadline", e.target.value)} required />
          </div>
          <div className="pr_cr">
            <div className="priorityB"><i className="fas fa-exclamation-circle"></i> Priority</div>
            <select className="priority-create" name="priority" 
                    value={task.priority} onChange={(e) => onChange("priority", e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
        <div className="description_container">
          <label htmlFor="description"><i className="far fa-edit"></i> Description</label>
          <textarea id="description" rows="4" placeholder="Enter task description..." 
                   value={task.description} onChange={(e) => onChange("description", e.target.value)} />
        </div>
        <div className="status-selection">
          <label htmlFor="status"><i className="fas fa-check-circle"></i> Initial Status</label>
          <select id="status" name="status" 
                  value={task.status} onChange={(e) => onChange("status", e.target.value)}>
            <option value="TO_DO">To do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <button className="add" onClick={onSubmit}>
          <i className="fas fa-save"></i> {isEditing ? "Update" : "Create Task"}
        </button>
      </div>
    );
  }
}

class App extends Component {
  state = {
    task: {
      title: "",
      description: "",
      priority: "LOW",
      deadline: "",
      status: "TO_DO"
    },
    tasks: [],
    isEditing: false,
    currentId: null,
    filters: {
      priority: "all",
      status: "all"
    }
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      this.setState({ tasks: response.data });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  handleChange = (field, value) => {
    this.setState(prev => ({
      task: { ...prev.task, [field]: value }
    }));
  };

  handleSubmit = async () => {
    const { task, isEditing, currentId } = this.state;
    
    if (!task.title || !task.deadline) {
      alert("Title and deadline are required!");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, task);
      } else {
        await axios.post(API_URL, task);
      }
      this.fetchTasks();
      this.setState({
        task: { title: "", description: "", priority: "LOW", deadline: "", status: "TO_DO" },
        isEditing: false,
        currentId: null
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  handleModify = (task) => {
    this.setState({
      task: { ...task },
      isEditing: true,
      currentId: task.id
    });
  };

  handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      this.fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  handleStatusChange = async (task) => {
    const newStatus = 
      task.status === "TO_DO" ? "IN_PROGRESS" :
      task.status === "IN_PROGRESS" ? "DONE" : "TO_DO";

    try {
      await axios.put(`${API_URL}/${task.id}`, { ...task, status: newStatus });
      this.fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  handleFilterChange = (filterType, value) => {
    this.setState(prev => ({
      filters: { ...prev.filters, [filterType]: value }
    }));
  };

  applyFilters = () => {
    const { priority, status } = this.state.filters;
    this.setState(prev => ({
      tasks: prev.tasks.map(task => ({
        ...task,
        display: (priority === "all" || task.priority === priority) &&
                 (status === "all" || task.status === status)
      }))
    }));
  };

  resetFilters = () => {
    this.setState({
      filters: { priority: "all", status: "all" }
    }, this.applyFilters);
  };

  render() {
    const { task, tasks, isEditing, filters } = this.state;
    return (
      <div>
        <div id="title" onClick={() => window.location.reload()}>TaskMaster</div>
        <div className="container">
          <div className="st_pr">
            <div className="pr">
              <label><i className="fas fa-flag"></i> Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => this.handleFilterChange("priority", e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="st">
              <label><i className="fas fa-tasks"></i> Status</label>
              <select
                value={filters.status}
                onChange={(e) => this.handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="TO_DO">To do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
          <button className="filt" onClick={this.applyFilters}>
            <i className="fas fa-filter"></i> Apply Filters
          </button>
          <button className="filt reset-filt" onClick={this.resetFilters}>
            <i className="fas fa-redo"></i> Reset
          </button>
          
          <TaskForm 
            task={task} 
            onChange={this.handleChange} 
            onSubmit={this.handleSubmit} 
            isEditing={isEditing} 
          />
          
          <div id="tasks-container">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onModify={this.handleModify}
                onDelete={this.handleDelete}
                onStatusChange={this.handleStatusChange}
              />
            ))}
          </div>
        </div>
        <footer>© by NAS.rO</footer>
      </div>
    );
  }
}

export default App;