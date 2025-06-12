import { Outlet, useParams } from "react-router-dom";

const CabangLayout = () => {
    const { namaCabang } = useParams();
    return (
        <Outlet namaCabang={namaCabang}/>
    );
};


export default CabangLayout;