import React from "react";
import Calendar from "../../components/Calendar";
import GreetingsBox from "../../components/cards/GreetingsBox";
import AssignmentsTable from "../../components/cards/AssignmentsTable";
import RecommendedSection from "../../components/cards/RecommendedSection";
import ActivityChart from "../../components/charts/ActivityChart";
import EventsSection from "../../components/cards/EventSection";
import TahapCard from "../../components/cards/TahapCards";
import Card from "../../components/cards/Card";
import Title from "../../components/Title";
import StudentsList from "../../components/cards/StudentList";

const MentorDashboard = () => {
  return (
    <div className="w-full h-full pb-10">
      {/* GreetingsBox yang full width */}
      <div className="w-full mb-5">
        <GreetingsBox />
      </div>
      <div className="w-full">
        <TahapCard />
      </div>
      
      <div className="flex w-full gap-5 items-stretch h-full">
        <div className="flex-[8] w-60 flex flex-col gap-5 h-[870px]">
          <div className="flex-1 h-96">
            <AssignmentsTable />
          </div>
        </div>
        
        {/* Kalender + Events Section di Kanan */}
        <div className="flex-[3] flex flex-col gap-5 h-[450px] mt-5">
          <Card className="px-1 py-1 flex-1 h-full">
            <EventsSection />
          </Card>
          
          <Card className="px-2 py-2 flex-1 h-[450px]">
            <StudentsList />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;