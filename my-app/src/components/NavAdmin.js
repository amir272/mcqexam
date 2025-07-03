import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar, Image } from 'react-bootstrap';
import {
    Warehouse, LayoutDashboard, PlusCircle, PackagePlus, Library,
    FolderPlus, Beaker, LogOut, Menu, X, ShoppingCart, BarChart2
} from 'lucide-react';

const styles = `
  .sidebar { background-color: #0f172a; transition: all 0.3s ease-in-out; min-height: 100vh; }
  .sidebar .nav-link { color: #94a3b8; border-radius: 0.5rem; margin-bottom: 0.25rem; padding: 0.75rem 1rem; white-space: nowrap; }
  .sidebar .nav-link:hover { background-color: #1e293b; color: #f1f5f9; }
  .sidebar .nav-link.active { background-color: rgba(56, 189, 248, 0.2); color: #7dd3fc; }
  .sidebar-header { border-bottom: 1px solid #1e293b; }
  .content-wrapper { background-color: #f8fafc; height: calc(100vh - 65px); overflow-y: auto; }
`;

const NavAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const sidebarColClass = isSidebarOpen ? 'col-lg-2 col-md-3' : 'col-auto';

    return (
        <>
            <style>{styles}</style>
            <Container fluid>
                <Row className="flex-nowrap">
                    <Col as="aside" className={`sidebar d-flex flex-column p-3 ${sidebarColClass}`}>
                        <div className="sidebar-header d-flex align-items-center justify-content-center pb-3 mb-3">
                            <Warehouse className="text-info" size={32} />
                            {isSidebarOpen && <span className="ms-3 fs-5 fw-bold text-white">Inventory</span>}
                        </div>
                        <Nav className="flex-column flex-grow-1">
                            <NavItem to="/manage" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/point-of-sale" icon={<ShoppingCart size={20} />} label="Point of Sale" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/sales-reports" icon={<BarChart2 size={20} />} label="Sales Reports" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/add-product" icon={<PlusCircle size={20} />} label="Add Product" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/add-sku" icon={<PackagePlus size={20} />} label="Add SKU" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/add-brand" icon={<Library size={20} />} label="Add Brand" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/add-category" icon={<FolderPlus size={20} />} label="Add Category" isOpen={isSidebarOpen} />
                            <NavItem to="/manage/add-uom" icon={<Beaker size={20} />} label="Add UoM" isOpen={isSidebarOpen} />
                        </Nav>
                        <div className="mt-auto">
                            <NavItem to="/login" icon={<LogOut size={20} />} label="Logout" isOpen={isSidebarOpen} />
                        </div>
                    </Col>
                    <Col className="p-0 d-flex flex-column">
                        <Navbar bg="white" className="border-bottom px-3" style={{ height: '65px' }}>
                            <Navbar.Brand>
                                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-light">
                                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                                </button>
                            </Navbar.Brand>
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text className="d-flex align-items-center">
                                    <span className="me-2">Admin User</span>
                                    <Image src="https://placehold.co/100x100/E2E8F0/4A5568?text=A" roundedCircle style={{ width: '40px', height: '40px' }} />
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Navbar>
                        <main className="content-wrapper p-4">
                            <Outlet />
                        </main>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

const NavItem = ({ to, icon, label, isOpen }) => (
    <Nav.Link as={NavLink} to={to} end={to === "/manage"} className="d-flex align-items-center" title={!isOpen ? label : ''}>
        {icon}
        {isOpen && <span className="ms-3">{label}</span>}
    </Nav.Link>
);

export default NavAdmin;