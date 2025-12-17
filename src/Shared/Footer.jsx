import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <img src={logo} alt="LoanLink Logo" className="w-10 h-10" />
                        <h2 className="text-2xl font-bold text-primary">LoanLink</h2>
                    </div>
                    <p className="text-sm leading-relaxed max-w-xs">
                        LoanLink is a secure and transparent microloan management platform
                        enabling borrowers, managers, and administrators to collaborate
                        efficiently.
                    </p>
                </div>

                <div>
                    <h6 className="footer-title">Quick Links</h6>
                    <ul className="space-y-2">
                        <li><a className="link link-hover">Home</a></li>
                        <li><a className="link link-hover">All Loans</a></li>
                        <li><a className="link link-hover">About</a></li>
                        <li><a className="link link-hover">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h6 className="footer-title">Legal</h6>
                    <ul className="space-y-2">
                        <li><a className="link link-hover">Terms of Service</a></li>
                        <li><a className="link link-hover">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-base-300 text-center py-4 text-sm">
                © {new Date().getFullYear()} LoanLink. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
