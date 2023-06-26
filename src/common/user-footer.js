import React from "react";
import logo from "../assets/images/logo.png"

class UserFooter extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }
    render() {
        return <footer id="footer" className="userFooter">
            <footer className="bg-dark" id="tempaltemo_footer">
                <div className="container footer-center">
                    <div className="row">
                        <div className="col-md-4 pt-5">
                        <img src={logo} alt="Logo" href="/home" className="logo-image"style={{ width: "180px", height: "45px" }}/>
                            <ul className="list-unstyled text-light footer-link-list">
                            <h6 style={{marginTop:"3px"}}>Địa chỉ: 97 Man Thiện, P.Tăng Nhơn Phú A, Quận 9, TP.HCM</h6>
                            <h6 style={{marginTop:"3px"}}>BOOKSTORE nhận đặt hàng trực tuyến và giao hàng tận nơi. Hỗ trợ đặt mua và nhận hàng trực tiếp tại cửa hàng.</h6>
                                <h6 style={{marginTop:"3px"}}>Mở cửa: 09H00 - 21H00</h6>
                                <h6>Phone:<a className="text-decoration-none" href="tel:+84985800754"
                                >0985800754</a></h6>
                                <h6>Email: <a className="text-decoration-none" href="mailto: N19DCCN222@student.ptithcm.edu.vn"
                                >N19DCCN222@student.ptithcm.edu.vn</a></h6>
                            </ul>
                        </div>
                        <div className="col-md-2 pt-5">
                            <h6 className="h6 fw-bolder text-light border-bottom pb-3 border-light">Dịch vụ và hỗ trợ</h6>
                            <ul className="list-unstyled text-light footer-link-list">
                                <h6><a className="text-decoration-none" href="#">Tìm kiếm</a></h6>
                                <h6><a className="text-decoration-none" href="#">Giới thiệu</a></h6>
                                <h6><a className="text-decoration-none" href="#">Chính sách đổi trả</a></h6>
                                <h6><a className="text-decoration-none" href="#">Chính sách dịch vụ</a></h6>
                                <h6><a className="text-decoration-none" href="#">Chính sách bảo mật</a></h6>
                                <h6><a className="text-decoration-none" href="#">Điều khoản dịch vụ</a></h6>
                            </ul>
                        </div>

                        <div className="col-md-2 pt-5">
                            <h6 className="h6 fw-bolder text-light border-bottom pb-3 border-light">Thông tin liên kết:</h6>
                            <h6 className="text-light">Hãy kết nối với chúng tôi:</h6>
                            {/* <!-- Facebook --> */}
                            <a className="btn btn-primary btn-floating m-1" href="#!" role="button"><i
                                className="fa fa-facebook"></i></a>
                            {/* <!-- Twitter --> */}
                            <a className="btn btn-primary btn-floating m-1" href="#!" role="button"><i
                                className="fa fa-phone"></i></a>
                            {/* <!-- Instagram --> */}
                            <a className="btn btn-primary btn-floating m-1" href="#!" role="button"><i
                                className="fa fa-instagram"></i></a>
                        </div>

                        <div className="col-md-4 pt-5">
                            <h6 className="h6 fw-bolder text-light border-bottom pb-3 border-light">Fanpage</h6>
                            <ul className="list-unstyled text-light footer-link-list">
                                <iframe
                                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100092752586014&tabs=timeline&width=300&height=80&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=false&appId=1248011112739638"
                                    width="300" height="80" style={{border:"none",overflow:"hidden", visibility: "visible",width: "720px", height: "140px"}}scrolling="no"
                                    frameBorder="0" allowFullScreen="true"
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                                <h6>Cửa hàng hoạt động tất cả các ngày trong tuần</h6>
                                <h6>Quý khách vui lòng đến đúng khung giờ mở cửa trên để mua hàng.</h6>
                                <h6> Chân thành cảm ơn!</h6>
                            </ul>



                        </div>
                    </div>
                </div>

            </footer>
        </footer>


    }
}

export default UserFooter;