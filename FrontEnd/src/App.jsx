import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import  NotFoundPage from "./NotFoundPage";
import ChatPage from "./features/Chat/Components/ChatPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedInUserAsync, updateToken } from "./features/Auth/AuthSlice";
import Protected from "./features/Auth/Component/protected";


// "proxy": "http://127.0.0.1:5000",
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/chat",
    element: (
      <Protected>
        <ChatPage />
      </Protected>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  const token = useSelector((state) => state.auth.loggedINUserToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchLoggedInUserAsync());
    } else {
      const checkIfToken = localStorage.getItem("token");

      if (checkIfToken) {
        dispatch(updateToken(checkIfToken));
      } else {
        // console.log("No token on local storage: ", checkIfToken);
      }
    }
  }, [token, dispatch]);

  return (
    <div className="background-image bg-fixed">
      <ChakraProvider>
          <RouterProvider router={router} />
      </ChakraProvider>
    </div>
  );
}

export default App;
