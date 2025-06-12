import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'
import './calendar-custom.css'
import TambahJadwalPresentasi from '../../components/modal/TambahJadwalPresentasi'
import EventDetailModal from '../../components/modal/DetailsPresentasi'

const Calendar = () => {
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef(null)
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState(null)
  
  // Events state
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Sample participants data (bisa digunakan sebagai fallback)
  const sampleParticipants = [
    [
      { id: 1, name: 'Budi Santoso', photo: '/assets/img/Profil.png', projectStage: 'Tahap 1', status: 'hadir' },
      { id: 2, name: 'Dewi Lestari', photo: '/assets/img/Profil.png', projectStage: 'Tahap 1', status: 'hadir' },
      { id: 3, name: 'Eko Prasetyo', photo: '/assets/img/Profil.png', projectStage: 'Tahap 1', status: 'tidak hadir' }
    ],
    [
      { id: 4, name: 'Farida Wijaya', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'hadir' },
      { id: 5, name: 'Gunawan Hidayat', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'hadir' },
      { id: 6, name: 'Heni Mulyani', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'tidak hadir' },
      { id: 7, name: 'Indra Kusuma', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'hadir' }
    ]
  ];

  // Fetch jadwal presentasi from API
  useEffect(() => {
    const fetchJadwalPresentasi = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jadwal-presentasi`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
          }
        )

        if (response.data.status === "success") {
          // Transform API data to FullCalendar events format
          const transformedEvents = response.data.data.map((jadwal, index) => {
            // Determine colors based on tipe
            let backgroundColor, textColor, borderColor, title
            
            if (jadwal.tipe === 'online') {
              backgroundColor = '#FEF9C3' // Yellow for online
              textColor = '#CA8A04'
              borderColor = '#FEF9C3'
              title = 'Presentasi Online'
            } else {
              backgroundColor = '#E6EFFF' // Blue for offline
              textColor = '#3B82F6'
              borderColor = '#E6EFFF'
              title = 'Presentasi Offline'
            }

            return {
              id: jadwal.id, // Use API id
              title: title,
              start: jadwal.tanggal, // Format: YYYY-MM-DD
              backgroundColor,
              textColor,
              borderColor,
              extendedProps: {
                apiId: jadwal.id, // Store original API id
                status: jadwal.status, // dijadwalkan/selesai
                tipe: jadwal.tipe, // online/offline
                kuota: jadwal.kuota,
                startTime: jadwal.waktu_mulai,
                endTime: jadwal.waktu_selesai,
                zoomLink: jadwal.link_zoom || '',
                location: jadwal.lokasi || '',
                // Use sample participants as fallback - nanti bisa diganti dengan API participants
                participants: sampleParticipants[index % sampleParticipants.length] || []
              }
            }
          })
          
          setEvents(transformedEvents)
          console.log('Jadwal presentasi loaded:', transformedEvents)
        } else {
          setError("Failed to fetch jadwal presentasi")
        }
      } catch (err) {
        console.error("Error fetching jadwal presentasi:", err)
        setError(
          err.response?.data?.message || 
          "Terjadi kesalahan saat mengambil data jadwal presentasi"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchJadwalPresentasi()
  }, [])
  
  // Format the current date to display month and year
  const formatMonthYear = (date) => {
    const options = { month: 'long', year: 'numeric' }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }
  
  // Update the title when calendar view changes
  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const newDate = calendarApi.getDate()
      setCurrentDate(newDate)
    }
  }
  
  // Update title on initial load
  useEffect(() => {
    if (calendarRef.current) {
      updateTitle()
    }
  }, [])
  
  const handleViewChange = (newView) => {
    setView(newView)
    
    // Map our simplified view names to FullCalendar view names
    const viewMap = {
      'day': 'timeGridDay',
      'week': 'timeGridWeek',
      'month': 'dayGridMonth'
    }
    
    // Change the calendar view
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewMap[newView])
      updateTitle()
    }
  }
  
  // Navigation handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev()
      updateTitle()
    }
  }
  
  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next()
      updateTitle()
    }
  }
  
  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today()
      updateTitle()
    }
  }
  
  // Handle dates changes
  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart)
  }

  // Handle event click to show detail modal
  const handleEventClick = (clickInfo) => {
    console.log('Event clicked:', clickInfo.event)
    const eventId = clickInfo.event.extendedProps.apiId || clickInfo.event.id
    setSelectedEventId(eventId)
    setShowDetailModal(true)
  }

  // Handle add new event
  const handleAddEvent = () => {
    setShowAddModal(true)
  }
  
  // Handle add event form submission
  const handleAddEventSubmit = (responseData) => {
    // When form is submitted successfully, refresh the calendar data
    // Or add the new event directly to the events array
    
    if (responseData && responseData.data) {
      const newJadwal = responseData.data
      
      // Determine colors based on tipe
      let backgroundColor, textColor, borderColor, title
      
      if (newJadwal.tipe === 'online') {
        backgroundColor = '#FEF9C3' // Yellow for online
        textColor = '#CA8A04'
        borderColor = '#FEF9C3'
        title = 'Presentasi Online'
      } else {
        backgroundColor = '#E6EFFF' // Blue for offline
        textColor = '#3B82F6'
        borderColor = '#E6EFFF'
        title = 'Presentasi Offline'
      }

      const newEvent = {
        id: newJadwal.id,
        title: title,
        start: newJadwal.tanggal,
        backgroundColor,
        textColor,
        borderColor,
        extendedProps: {
          apiId: newJadwal.id,
          status: newJadwal.status,
          tipe: newJadwal.tipe,
          kuota: newJadwal.kuota,
          startTime: newJadwal.waktu_mulai,
          endTime: newJadwal.waktu_selesai,
          zoomLink: newJadwal.link_zoom || '',
          location: newJadwal.lokasi || '',
          participants: [] // Start with empty participants list
        }
      }
      
      // Add the new event to the events array
      setEvents(prevEvents => [...prevEvents, newEvent])
      
      console.log('New jadwal added to calendar:', newEvent)
    }
    
    // Close the modal
    setShowAddModal(false)
  }

  // Handle close detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedEventId(null)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="calendar-wrapper">
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">Loading jadwal presentasi...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="calendar-wrapper">
        <div className="flex justify-center items-center p-8">
          <div className="text-red-500">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="calendar-wrapper">
      {/* Header outside the card */}
      <div className="calendar-header">
        <div className="header-content">
          {/* Left section */}
          <div className="left-section">
            <button className="add-event-btn" onClick={handleAddEvent}>
              <span className="plus-icon">+</span> Tambah Jadwal
            </button>
            <h2 className="month-title">{formatMonthYear(currentDate)}</h2>
          </div>
          
          {/* Center section - Day Week Month */}
          <div className="center-section">
            <div className="view-options">
              <button 
                className={`view-btn ${view === 'day' ? 'active' : ''}`}
                onClick={() => handleViewChange('day')}
              >
                Day
              </button>
              <button 
                className={`view-btn ${view === 'week' ? 'active' : ''}`}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button 
                className={`view-btn ${view === 'month' ? 'active' : ''}`}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
            </div>
          </div>
          
          {/* Right section */}
          <div className="right-section">
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={handlePrev}>
                <span>‹</span>
              </button>
              <button className="nav-btn next" onClick={handleNext}>
                <span>›</span>
              </button>
              <button className="today-btn" onClick={handleToday}>Today</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar inside the card */}
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
          firstDay={1} // Start week on Monday
          dayCellClassNames="calendar-day"
          dayHeaderClassNames="day-header"
          eventClassNames="calendar-event"
          aspectRatio={1.5}
          datesSet={handleDatesSet} // Listen for date changes
          eventClick={handleEventClick} // Listen for event clicks
        />
      </div>
      
      {/* Add Event Modal */}
      <TambahJadwalPresentasi 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEventSubmit}
      />
      
      {/* Event Detail Modal */}
      <EventDetailModal
        show={showDetailModal}
        onClose={handleCloseDetailModal}
        eventId={selectedEventId}
      />
    </div>
  )
}

export default Calendar