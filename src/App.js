import "font-awesome/css/font-awesome.min.css";
import "./assets/css/app.css";
import {Route, Routes} from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthContextProvider } from "./context/AuthProvider";
import NotFoundPage from "./NotFoundPage ";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage";
import InforProductPage from "./pages/InforProductPage";
import ProfileUserPage from "./pages/ProfileUserPage";
import OrderPage from "./pages/OrderPage";
import DashBoardPage from "./pages/DashBoardPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import ReceiptPage from "./pages/ReceiptPage";
import OrderManagerPage from "./pages/OrderManagerPage";
import StatisticalPage from "./pages/StatisticalPage";
import CustomerPage from "./pages/CustomerPage";

function App()
{
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const permission = tokens
    ? jwtDecode(tokens?.data?.accessToken)?.authorities
    : null;
    return (
      <AuthContextProvider>
        <Routes>
        <Route path='/login' element={<LoginPage/>} />
        { permission === 'ADMIN' ? 
        <>
              <Route path="/" element={< DashBoardPage/>} />
              <Route path="/category" element={< CategoryPage/>} />
              <Route path="/product" element={< ProductPage/>} />
              <Route path="/customer" element={< CustomerPage/>} />
              <Route path="/receipt" element={< ReceiptPage/>} />
              <Route path="/order" element={< OrderManagerPage/>} />
              <Route path="/statistical" element={< StatisticalPage/>} />
        </>
        :(
          <>
          <Route path='/' element={<HomePage/>} />
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/shop' element={<ShopPage/>}/>
          <Route path='/cart' element={<CartPage/>}/>
          <Route path='/search' element={<SearchPage/>}/>
          <Route path='/shop/:id' element={<ShopPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/product/:id' element={<InforProductPage/>}/>
          <Route path='/profile' element={<ProfileUserPage/>}/>
          <Route path='/order' element={<OrderPage/>}/>
          </>
        )
      }
      <Route path='*' element={<NotFoundPage/>} />s
        </Routes>
      </AuthContextProvider>
    );
}


export default App;