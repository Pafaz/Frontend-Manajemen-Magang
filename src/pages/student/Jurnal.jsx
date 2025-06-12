import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import AddJurnalModal from "../../components/modal/AddJurnalModal";
import DetailJurnalModal from "../../components/modal/DetailJurnalModal";
import "../../components/cards/calendar-custom.css";

const Jurnal = () => {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  
  const fetchJurnal = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/jurnal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jurnalData = response.data.data.map((jurnal) => ({
        id: jurnal.id,
        title: "Mengisi",
        start: jurnal.tanggal,
        allDay: true,
        extendedProps: {
          deskripsi: jurnal.deskripsi,
          created_at: jurnal.created_at,
          bukti: jurnal.bukti?.path || null,
          originalData: jurnal,
        },
        backgroundColor: "#ECFDF5",
        textColor: "#059669",
        borderColor: "#D1FAE5",
      }));

      setEvents(jurnalData);
    } catch (error) {
      console.error("Gagal mengambil data jurnal", error);
    }
  };

  useEffect(() => {
    fetchJurnal();
  }, []);

  const formatMonthYear = (date) => {
    const options = { month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("id-ID", options).format(date);
  };

  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newDate = calendarApi.getDate();
      setCurrentDate(newDate);
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      updateTitle();
    }
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    const viewMap = {
      day: "timeGridDay",
      week: "timeGridWeek",
      month: "dayGridMonth",
    };

    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewMap[newView]);
      updateTitle();
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateTitle();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateTitle();
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateTitle();
    }
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowDetailModal(true);
  };

  const handleAddJurnal = () => {
    setEditMode(false);
    setSelectedJournal(null);
    setShowAddModal(true);
  };

  const handleEditClick = (journal) => {
    if (!journal) return console.log("Data jurnal tidak ditemukan.");

    setEditMode(true);
    setSelectedJournal(journal);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditMode(false);
    setSelectedJournal(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEvent(null);
  };

  const onJurnalSubmitSuccess = () => {
    fetchJurnal();
    closeAddModal();
  };

  return (
    <div className="calendar-wrapper">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-content">
          <div className="left-section">
            <button className="add-event-btn" onClick={handleAddJurnal}>
              <span className="plus-icon">+</span> Tambah Jurnal
            </button>
            <h2 className="month-title">{formatMonthYear(currentDate)}</h2>
          </div>

          <div className="center-section">
            <div className="view-options">
              <button
                className={`view-btn ${view === "day" ? "active" : ""}`}
                onClick={() => handleViewChange("day")}
              >
                Day
              </button>
              <button
                className={`view-btn ${view === "week" ? "active" : ""}`}
                onClick={() => handleViewChange("week")}
              >
                Week
              </button>
              <button
                className={`view-btn ${view === "month" ? "active" : ""}`}
                onClick={() => handleViewChange("month")}
              >
                Month
              </button>
            </div>
          </div>

          <div className="right-section">
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={handlePrev}>
                <span>‹</span>
              </button>
              <button className="nav-btn next" onClick={handleNext}>
                <span>›</span>
              </button>
              <button className="today-btn" onClick={handleToday}>
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          height="auto"
          dayMaxEvents={3}
          fixedWeekCount={false}
          firstDay={1}
          aspectRatio={1.5}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          eventContent={(arg) => (
            <div className="text-green-600 text-sm text-center p-3 font-semibold">
              Mengisi
            </div>
          )}
          dayCellDidMount={(info) => {
            const dateStr = info.date.toISOString().split("T")[0];
            const hasEvent = events.some((event) => event.start === dateStr);
            if (!hasEvent) {
              info.el.style.backgroundColor = "#f9fafb"; // tanggal tanpa event
            }
          }}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddJurnalModal
          isOpen={showAddModal}
          onClose={closeAddModal}
          editMode={editMode}
          selectedJournal={selectedJournal}
          onSubmitSuccess={onJurnalSubmitSuccess}
        />
      )}

      {showDetailModal && selectedEvent && (
        <DetailJurnalModal
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          event={selectedEvent}
          onEditClick={handleEditClick}
        />
      )}
    </div>
  );
};

export default Jurnal;
