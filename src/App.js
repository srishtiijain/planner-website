import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';

const DarkPlanner = () => {
  const [view, setView] = useState('month');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [events, setEvents] = useState({});
  const [todos, setTodos] = useState({
    1: [{ id: 1, text: 'review weekly goals', completed: false }],
    2: [{ id: 1, text: 'plan next sprint', completed: false }],
    3: [{ id: 1, text: 'monthly review', completed: false }],
    4: [{ id: 1, text: 'set new objectives', completed: false }]
  });
  const [reminders, setReminders] = useState({
    1: [{ id: 1, time: '09:00', text: 'morning standup' }],
    2: [{ id: 1, time: '14:00', text: 'client meeting' }],
    3: [{ id: 1, time: '10:00', text: 'team sync' }],
    4: [{ id: 1, time: '15:00', text: 'project review' }]
  
  });
  const [newEventDate, setNewEventDate] = useState(null);
  const [eventText, setEventText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [todayReminders, setTodayReminders] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [newReminderTime, setNewReminderTime] = useState('');
  const [newReminderText, setNewReminderText] = useState('');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [currentWeekForAdd, setCurrentWeekForAdd] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for today's reminders
  useEffect(() => {
    if (!isLoading) {
      checkTodayReminders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, todos, reminders, isLoading]);

  const loadData = () => {
    try {
      const eventsData = localStorage.getItem('planner-events');
      const todosData = localStorage.getItem('planner-todos');
      const remindersData = localStorage.getItem('planner-reminders');

      if (eventsData) {
        setEvents(JSON.parse(eventsData));
      }
      if (todosData) {
        setTodos(JSON.parse(todosData));
      }
      if (remindersData) {
        setReminders(JSON.parse(remindersData));
      }
    } catch (error) {
      console.log('loading data from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = () => {
    try {
      localStorage.setItem('planner-events', JSON.stringify(events));
      localStorage.setItem('planner-todos', JSON.stringify(todos));
      localStorage.setItem('planner-reminders', JSON.stringify(reminders));
    } catch (error) {
      console.error('error saving data:', error);
    }
  };

  const checkTodayReminders = () => {
    const allReminders = [];
    Object.keys(reminders).forEach(week => {
      reminders[week].forEach(reminder => {
        allReminders.push({ ...reminder, week });
      });
    });
    
    if (allReminders.length > 0) {
      setTodayReminders(allReminders);
      setShowReminderModal(true);
    }
  };

  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toLowerCase();
  const monthName = currentDate.toLocaleString('default', { month: 'long' }).toLowerCase();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleWeekClick = (week) => {
    setSelectedWeek(week);
    setView('week');
  };

  const handleBackToMonth = () => {
    setView('month');
    setSelectedWeek(null);
  };

  const addEvent = (date) => {
    setNewEventDate(date);
  };

  const saveEvent = () => {
  if (eventText.trim() && newEventDate) {
    const eventKey = `${year}-${month}-${newEventDate}`;
    setEvents({
      ...events,
      [eventKey]: [...(events[eventKey] || []), { id: Date.now(), text: eventText }]
    });
    setEventText('');
    setNewEventDate(null);
  }
};

 const removeEvent (eventKey, eventId) => {
  setEvents({
    ...events,
    [eventKey]: events[eventKey].filter(e => e.id !== eventId)
  });
};

  const toggleTodo = (week, todoId) => {
    setTodos({
      ...todos,
      [week]: todos[week].map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)
    });
  };

  const addTodo = (week) => {
    setCurrentWeekForAdd(week);
    setNewTodoText('');
    setShowTodoModal(true);
  };

  const saveTodo = () => {
    if (newTodoText.trim() && currentWeekForAdd) {
      setTodos({
        ...todos,
        [currentWeekForAdd]: [...(todos[currentWeekForAdd] || []), { id: Date.now(), text: newTodoText.trim(), completed: false }]
      });
      setShowTodoModal(false);
      setNewTodoText('');
      setCurrentWeekForAdd(null);
    }
  };

  const removeTodo = (week, todoId) => {
    setTodos({
      ...todos,
      [week]: todos[week].filter(t => t.id !== todoId)
    });
  };

  const addReminder = (week) => {
    setCurrentWeekForAdd(week);
    setNewReminderTime('');
    setNewReminderText('');
    setShowAddReminderModal(true);
  };

  const saveReminder = () => {
    if (newReminderTime.trim() && newReminderText.trim() && currentWeekForAdd) {
      setReminders({
        ...reminders,
        [currentWeekForAdd]: [...(reminders[currentWeekForAdd] || []), { id: Date.now(), time: newReminderTime.trim(), text: newReminderText.trim() }]
      });
      setShowAddReminderModal(false);
      setNewReminderTime('');
      setNewReminderText('');
      setCurrentWeekForAdd(null);
    }
  };

  const removeReminder = (week, reminderId) => {
    setReminders({
      ...reminders,
      [week]: reminders[week].filter(r => r.id !== reminderId)
    });
  };

  const calculateProgress = (week) => {
    const weekTodos = todos[week] || [];
    if (weekTodos.length === 0) return 0;
    return Math.round((weekTodos.filter(t => t.completed).length / weekTodos.length) * 100);
  };

  const renderCalendar = () => {
    const days = [];
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
  const eventKey = `${year}-${month}-${i}`;
  const hasEvents = events[eventKey] && events[eventKey].length > 0;
      days.push(
        <div key={i} className="calendar-day">
          <div className="date-number">{i}</div>
          {hasEvents && (
              <div className="events-container">
                  {events[eventKey].map(event => (
                <div key={event.id} className="event-pill">
                  <span>{event.text}</span>
                   <button onClick={() => removeEvent(eventKey, event.id)} className="remove-event">
                   <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => addEvent(i)} className="add-event-btn">
            <Plus size={14} />
          </button>
        </div>
      );
    }
    
    return (
      <>
        <div className="day-headers">
          {dayNames.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">{days}</div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="planner-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>loading your planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-container">
      <div className="planner-header">
        {view === 'month' && (
          <div className="month-nav">
            <button className="nav-button" onClick={goToPreviousMonth}>
              <ChevronLeft size={18} />
            </button>
            <h1 className="month-title">{monthName}</h1>
            <button className="nav-button" onClick={goToNextMonth}>
              <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        )}
        {view === 'week' && (
          <h1 className="month-title">week {selectedWeek}</h1>
        )}
        <p className="month-subtitle">{currentMonth}</p>
      </div>

      {view === 'month' ? (
        <div className="main-container">
          <div className="week-selector">
            {[1, 2, 3, 4].map(week => (
              <button
                key={week}
                className="week-button"
                onClick={() => handleWeekClick(week)}
              >
                week {week}
              </button>
            ))}
          </div>

          <div className="calendar-section">
            {renderCalendar()}
          </div>
        </div>
      ) : (
        <div className="week-view">
          <button className="back-button" onClick={handleBackToMonth}>
            <ChevronLeft size={18} />
            back to month
          </button>

          <div className="week-content">
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">to-do list</h3>
                <button className="add-button" onClick={() => addTodo(selectedWeek)}>
                  <Plus size={16} />
                  add to-do
                </button>
              </div>
              <div className="todo-list">
                {todos[selectedWeek]?.map(todo => (
                  <div key={todo.id} className="todo-item">
                    <div
                      className={`checkbox ${todo.completed ? 'checked' : ''}`}
                      onClick={() => toggleTodo(selectedWeek, todo.id)}
                    />
                    <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                      {todo.text}
                    </span>
                    <button 
                      className="delete-button"
                      onClick={() => removeTodo(selectedWeek, todo.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${calculateProgress(selectedWeek)}%` }}
                />
              </div>
              <div className="progress-text">
                {calculateProgress(selectedWeek)}% complete
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">reminders</h3>
                <button className="add-button" onClick={() => addReminder(selectedWeek)}>
                  <Plus size={16} />
                  add reminder
                </button>
              </div>
              <div className="reminder-list">
                {reminders[selectedWeek]?.map(reminder => (
                  <div key={reminder.id} className="reminder-item">
                    <span className="reminder-time">{reminder.time}</span>
                    <span className="reminder-text">{reminder.text}</span>
                    <button 
                      className="delete-button"
                      onClick={() => removeReminder(selectedWeek, reminder.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {newEventDate && (
        <div className="modal-overlay" onClick={() => setNewEventDate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">add event - day {newEventDate}</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="event description"
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveEvent()}
              autoFocus
            />
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={() => setNewEventDate(null)}>
                cancel
              </button>
              <button className="modal-button save" onClick={saveEvent}>
                save
              </button>
            </div>
          </div>
        </div>
      )}

      {showTodoModal && (
        <div className="modal-overlay" onClick={() => setShowTodoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">add new to-do</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="what do you need to do?"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveTodo()}
              autoFocus
            />
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={() => setShowTodoModal(false)}>
                cancel
              </button>
              <button className="modal-button save" onClick={saveTodo}>
                save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddReminderModal && (
        <div className="modal-overlay" onClick={() => setShowAddReminderModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">add new reminder</h3>
            <input
              type="time"
              className="modal-input"
              placeholder="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="reminder text"
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveReminder()}
            />
            <div className="modal-buttons">
              <button className="modal-button cancel" onClick={() => setShowAddReminderModal(false)}>
                cancel
              </button>
              <button className="modal-button save" onClick={saveReminder}>
                save
              </button>
            </div>
          </div>
        </div>
      )}

      {showReminderModal && todayReminders.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowReminderModal(false)}>
          <div className="modal reminder-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">your reminders for today</h3>
            <div className="reminder-popup-list">
              {todayReminders.map((reminder) => (
                <div key={reminder.id} className="reminder-popup-item">
                  <span className="reminder-time">{reminder.time}</span>
                  <span className="reminder-text">{reminder.text}</span>
                  <span className="reminder-week">week {reminder.week}</span>
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="modal-button save" onClick={() => setShowReminderModal(false)}>
                got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkPlanner;
