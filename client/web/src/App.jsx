import { RouterProvider } from 'react-router-dom';
import Router from "./router/Routes.jsx";

export default function App() {
  return (
    <div dir="rtl">
      <RouterProvider router={Router} />
    </div>
  );
}