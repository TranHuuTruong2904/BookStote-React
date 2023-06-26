import React, { useState } from "react";
import adminLayout from "../admin/adminLayout"
import Chart from 'react-apexcharts'
import { useEffect } from "react";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";

const DashBoardPage = () => {

    const [load, setLoad] = useState(false);
    const [listProduct, setListProduct] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [listOrder, setListOrder] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);

    async function getAllProduct() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product/all`)
        setLoad(true);
        setListProduct(result?.data?.data);
    }

    async function getAllCategory() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category/all`)
        setLoad(true);
        setListCategory(result?.data?.data);
    }

    async function getOrder() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/order/all`)
        setLoad(true);
        setListOrder(result?.data?.data);
    }

    async function getCustomer() {
        const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/user/all`)
        setLoad(true);
        setListCustomer(result?.data?.data);
    }

    useEffect(() => {
        getAllProduct();
        getAllCategory();
        getOrder();
        getCustomer();
    }, []);


    return (
        <>
            <div className="container-fluid">
                <div className="row g-3 my-2">
                    <div className="col-md-3">
                        <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                            <div>
                                <h3 className="fs-2">{listProduct.length}</h3>
                                <p className="fs-5">Products</p>
                            </div>
                            <i className="fa fa-product-hunt p-3 fs-1"></i>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                            <div>
                                <h3 className="fs-2">{listCategory.length}</h3>
                                <p className="fs-5">Catrgoris</p>
                            </div>
                            <i className="fa fa-tags p-3 fs-1"></i>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                            <div>
                                <h3 className="fs-2">{listOrder.length}</h3>
                                <p className="fs-5">Orders</p>
                            </div>
                            <i className="fa fa-truck p-3 fs-1"></i>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
                            <div>
                                <h3 className="fs-2">{listCustomer.length}</h3>
                                <p className="fs-5">Customers</p>
                            </div>
                            <i className="fa fa-user-circle p-3 fs-1"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default adminLayout(DashBoardPage);