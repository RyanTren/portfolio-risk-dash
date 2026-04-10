// import { useEffect, useState } from "react";
// import { deletePortfolio } from "../api/api";
// import type { Portfolio } from "../../src/types/portfolio";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAlert } from "../hooks/useAlert";


// export const handleDelete = async (id: number) => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
//     const { alert, setAlert } = useAlert();

//     useEffect(() => {
//     if (!alert) return;

//     const timer = setTimeout(() => {
//         setAlert(null);
//     }, 3000);

//     return () => clearTimeout(timer);
//     }, [alert]);

//   if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
//     try {
//         await deletePortfolio(id);
//         setAlert({ color: "success", title: "Delete successful!" });
//         setTimeout(() => navigate("/portfolios"), 800);
//     } 
    
//     catch (err) {
//       console.error("Delete failed", err);
//       setAlert({
//         color: "danger",
//         title: "Delete Failed!",
//       });
//     }
// };