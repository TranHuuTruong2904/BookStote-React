import React, {useState, useContext} from "react";
import { NavLink } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { Link } from "react-router-dom";
import './../assets/css/sidebar1.css'
import { Dropdown } from "react-bootstrap";
import AuthContext from "../context/AuthProvider";
import PerfectScrollbar from "react-perfect-scrollbar";

const Sidebar1 = ({children}) => {
    const [isOpen, setIsOpen] = useState(true);
    const {user, logout} = useContext(AuthContext);
    const toggle = () => setIsOpen (!isOpen);

    const menuItem = [
        {
            icon: <i className="fa fa-dashboard me-0"></i>,
            path: "/",
            name: "Trang chủ",
        },
        {
            icon: <i className="fa fa-user-circle me-0"></i>,
            path: "/customer",
            name: "Khách hàng",
        },
        {
            icon: <i className="fa fa-tags me-0"></i>,
            path: "/category",
            name: "Danh mục SP",
        },
        {
            icon: <i className="fa fa-product-hunt me-0"></i>,
            path: "/product",
            name: "Sản phẩm",
        },
        {
            icon: <i className="fa fa-cart-plus me-0"></i>,
            path: "/order",
            name: "Đơn hàng",
        }, 
        {
            icon: <i className="fa fa-archive me-0" ></i>,
            path: "/receipt",
            name: "Phiếu nhập",
        },
        {
            icon: <i className="fa fa-bar-chart me-0" ></i>,
            path: "/statistical",
            name: "Thống kê",
        },
    ]

    return (
        <div className="container-sidebar">
            <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo"><img alt="" width="180" height="120" src={require('./../assets/images/admin.png')}/></h1>
                   <div style={{marginLeft: isOpen ? "20px" : "0px"}} className="bars">
                       {/* <FaBars onClick={toggle}/> */}
                       {/* <!-- Top navigation--> */}
                    {/* <Header onToggle={()=> {this.setState(({
                        isActive: !this.state.isActive
                    }))}} isActive={this.state.isActive}/> */}
                   </div>
               </div>
               <PerfectScrollbar>
                    {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
                    }
               </PerfectScrollbar>
        
               <div className="fixed-bottom-dropdown" style={{width: isOpen ? "200px" : "50px"}}>
                    <Dropdown className="">
                    <i class="fa fa-fw fa-user text-light"></i>
                        <Dropdown.Toggle variant="light" id="dropdown-logout" className="button-admin"></Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu dropdown-menu dropdown-menu-end">
                            <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                            <Dropdown.Item as={NavLink} to="/profile">Xem thông tin</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar1;

