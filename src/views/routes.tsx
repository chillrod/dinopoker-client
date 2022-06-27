import { Route, Routes, useNavigate } from "react-router-dom";
import { MessageBox } from "../components/molecules/message-box/message-box";
import { ToastProvider } from "../services/toast-provider";
import { Home } from "./Home";
import { Poker } from "./Poker";

export const Router = () => {
  return (
    <>
      <MessageBox />
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Poker />} />
      </Routes>
    </>
  );
};
