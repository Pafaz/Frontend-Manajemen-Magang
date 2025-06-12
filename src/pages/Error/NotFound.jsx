import {Link} from "react-router-dom"
const NotFound = () => {
  return (
    <div className="w-full">
      <img src="/assets/img/404.png" alt="404 Not Found" className="w-1/3 mx-auto"/>
      <h1 className="font-bold text-center text-slate-900 text-6xl">404 Not Found</h1>
      <div className="flex justify-center">
      <Link to={`/`} className="bg-color-blue py-2 px-6 text-center text-white rounded-lg mt-5">Back</Link>
      </div>
    </div>
  )
}

export default NotFound