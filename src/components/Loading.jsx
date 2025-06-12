import LoadingCards from "./cards/LoadingCards";

const Loading = () => {
  return (
    <div className="w-full p-6 rounded-2xl bg-white shadow-md space-y-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <LoadingCards />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      <div className="h-10 bg-gray-300 rounded-lg w-1/4"></div>
    </div>
  );
};

export default Loading;
