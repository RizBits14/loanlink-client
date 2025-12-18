import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <img src={logo} alt="LoanLink Logo" className="w-12 h-12" />
                        <h2 className="text-3xl font-bold text-primary tracking-wide">
                            LoanLink
                        </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
                        LoanLink is a secure and transparent microloan management platform enabling borrowers, managers, and administrators to collaborate efficiently.
                    </p>
                </div>

                <div>
                    <h6 className="text-lg font-semibold text-primary mb-3">Quick Links</h6>
                    <ul className="space-y-2">
                        <li><a href="/" className="text-sm text-gray-600 hover:text-primary transition duration-300">Home</a></li>
                        <li><a href="/loans" className="text-sm text-gray-600 hover:text-primary transition duration-300">All Loans</a></li>
                        <li><a href="/about" className="text-sm text-gray-600 hover:text-primary transition duration-300">About</a></li>
                        <li><a href="/contact" className="text-sm text-gray-600 hover:text-primary transition duration-300">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h6 className="text-lg font-semibold text-primary mb-3">Legal</h6>
                    <ul className="space-y-2">
                        <li><a href="/termsandservices" className="text-sm text-gray-600 hover:text-primary transition duration-300">Terms of Service</a></li>
                        <li><a href="/privacypolicy" className="text-sm text-gray-600 hover:text-primary transition duration-300">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-base-300 text-center py-6 text-sm text-gray-500">
                <p>© {new Date().getFullYear()} LoanLink. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
