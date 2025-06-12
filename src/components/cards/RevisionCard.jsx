import { Link } from "react-router-dom";
import Title from "../Title";
import Card from "./Card";

const RevisionCard = ({ title, desc }) => {
  return (
    <Link to={`#`}>
      <Card className="rounded-lg border border-slate-400/[0.5] flex justify-between py-2.5">
        <div className="flex gap-3 items-center">
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex justify-center items-center">
            <i className="bi bi-repeat text-2xl text-blue-500"></i>
          </div>
          <div className="flex flex-col">
            <Title className="text-sm">{title}</Title>
            <p className="text-slate-400 text-xs">{desc}</p>
          </div>
        </div>
        <button>
          <i className="bi bi-chevron-right text-lg text-gray-400"></i>
        </button>
      </Card>
    </Link>
  );
};

export default RevisionCard;
